#!/usr/bin/env python3
"""
Sistem Log Analiz Aracı — LLM Destekli (Gemini / OpenAI / Ollama)
Her log dosyasını ayrı ayrı analiz eder ve Türkçe rapor üretir.
"""

import os, re, json, argparse, urllib.request, urllib.error
from collections import defaultdict
from datetime import datetime

try:
    from google import genai as genai_new
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

class Colors:
    HEADER  = '\033[95m'
    OKBLUE  = '\033[94m'
    OKCYAN  = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL    = '\033[91m'
    ENDC    = '\033[0m'
    BOLD    = '\033[1m'

# ── 1. LOG PARSER ───────────────────────────────────────────────────────────
class LogParser:
    def __init__(self):
        self.patterns = {
            'auth': {
                'failed_login':  re.compile(r'Failed password for (invalid user )?(?P<user>\S+) from (?P<ip>\S+) port \d+'),
                'invalid_user':  re.compile(r'Invalid user (?P<user>\S+) from (?P<ip>\S+)'),
                'sudo_fail':     re.compile(r'sudo:.*?(?P<user>\S+) : \d+ incorrect password.*?USER=(?P<target>\S+) ; COMMAND=(?P<cmd>.+)'),
                'sudo_success':  re.compile(r'sudo:.*?(?P<user>\S+) : TTY=.*?USER=(?P<target>\S+) ; COMMAND=(?P<cmd>.+)'),
                'accepted_key':  re.compile(r'Accepted publickey for (?P<user>\S+) from (?P<ip>\S+)'),
            },
            'syslog': {
                'cron_job':       re.compile(r'CRON\[\d+\]: \((?P<user>\S+)\) CMD \((?P<cmd>.*)\)'),
                'conntrack_full': re.compile(r'nf_conntrack: table full'),
                'segfault':       re.compile(r'segfault at.*in (?P<proc>\S+)'),
            },
            'kern': {
                'oom_killer':  re.compile(r'Out of memory: Killed process \d+ \((?P<process>\S+)\)'),
                'apparmor':    re.compile(r'apparmor="DENIED".*name="(?P<process>[^"]+)"'),
                'kernel_panic':re.compile(r'Kernel panic'),
            }
        }

    def parse_file(self, filepath, log_type='auth'):
        results = defaultdict(list)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                for line_num, line in enumerate(f, 1):
                    for key, pattern in self.patterns.get(log_type, {}).items():
                        m = pattern.search(line)
                        if m:
                            results[key].append({
                                'line_num': line_num,
                                'raw': line.strip(),
                                'data': m.groupdict()
                            })
        except FileNotFoundError:
            print(f"{Colors.FAIL}[HATA] Dosya bulunamadı: {filepath}{Colors.ENDC}")
        return dict(results)

# ── 2. TEHDİT TESPİT ────────────────────────────────────────────────────────
class ThreatDetector:
    def __init__(self):
        self.findings = []

    def analyze_auth(self, parsed):
        ip_fail = defaultdict(int)
        ip_sample = {}
        for a in parsed.get('failed_login', []):
            ip = a['data'].get('ip')
            ip_fail[ip] += 1
            ip_sample[ip] = a.get('raw', '')
        for a in parsed.get('invalid_user', []):
            ip = a['data'].get('ip')
            ip_fail[ip] += 1
            ip_sample[ip] = a.get('raw', '')

        for ip, cnt in ip_fail.items():
            sev = 'CRITICAL' if cnt >= 10 else 'HIGH' if cnt >= 2 else 'MEDIUM'
            self.findings.append({
                'type': 'SSH_BRUTE_FORCE',
                'severity': sev,
                'description': f"{ip} adresinden {cnt} başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.",
                'mitre': 'T1110.001 — Brute Force: Password Guessing',
                'source': 'auth.log',
                'event_count': cnt,
                'sample_log': ip_sample.get(ip, '')
            })

        for f in parsed.get('sudo_fail', []):
            self.findings.append({
                'type': 'PRIVILEGE_ESCALATION_ATTEMPT',
                'severity': 'HIGH',
                'description': f"'{f['data'].get('user')}' kullanıcısı yetkisiz şekilde '{f['data'].get('cmd')}' komutunu root olarak çalıştırmaya çalıştı ama başarısız oldu.",
                'mitre': 'T1548.003 — Sudo and Sudo Caching',
                'source': 'auth.log',
                'event_count': 1,
                'sample_log': f.get('raw', '')
            })

        for f in parsed.get('sudo_success', []):
            if f['data'].get('target') == 'root':
                self.findings.append({
                    'type': 'PRIVILEGE_ESCALATION_SUCCESS',
                    'severity': 'CRITICAL',
                    'description': f"'{f['data'].get('user')}' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: {f['data'].get('cmd')}",
                    'mitre': 'T1548.003 — Sudo and Sudo Caching',
                    'source': 'auth.log',
                    'event_count': 1,
                    'sample_log': f.get('raw', '')
                })

    def analyze_syslog(self, parsed):
        ct = parsed.get('conntrack_full', [])
        if ct:
            self.findings.append({
                'type': 'NETWORK_OVERLOAD',
                'severity': 'CRITICAL',
                'description': f"Ağ bağlantı tablosu (nf_conntrack) doldu — {len(ct)} kez tekrarlandı. Bu durum DDoS saldırısına veya aşırı bağlantı yüküne işaret eder.",
                'mitre': 'T1498 — Network Denial of Service',
                'source': 'syslog',
                'event_count': len(ct),
                'sample_log': ct[-1].get('raw', '')
            })
        for cron in parsed.get('cron_job', []):
            cmd = cron['data'].get('cmd', '')
            if any(k in cmd for k in ['wget', 'curl', '.hidden', '/tmp/', 'bash -i']):
                self.findings.append({
                    'type': 'SUSPICIOUS_CRON',
                    'severity': 'HIGH',
                    'description': f"Şüpheli zamanlanmış görev (cron job) tespit edildi: `{cmd}` — Bu komut arka kapı (backdoor) kurma girişimi olabilir.",
                    'mitre': 'T1053.003 — Scheduled Task/Job: Cron',
                    'source': 'syslog',
                    'event_count': 1,
                    'sample_log': cron.get('raw', '')
                })

    def analyze_kern(self, parsed):
        for oom in parsed.get('oom_killer', []):
            self.findings.append({
                'type': 'OUT_OF_MEMORY',
                'severity': 'HIGH',
                'description': f"Sistem belleği doldu ve Linux çekirdeği '{oom['data'].get('process')}' programını zorla kapattı. Sistem kararsızlığa girebilir.",
                'mitre': 'T1499 — Endpoint Denial of Service',
                'source': 'kern.log',
                'event_count': 1,
                'sample_log': oom.get('raw', '')
            })
        for aa in parsed.get('apparmor', []):
            proc = aa['data'].get('process', '')
            if '/tmp/' in proc or '.hidden' in proc:
                sev = 'HIGH'
            else:
                sev = 'MEDIUM'
            self.findings.append({
                'type': 'APPARMOR_BLOCK',
                'severity': sev,
                'description': f"AppArmor güvenlik duvarı '{proc}' programının çalışmasını engelledi.",
                'mitre': 'T1068 — Exploitation for Privilege Escalation',
                'source': 'kern.log',
                'event_count': 1,
                'sample_log': aa.get('raw', '')
            })

    def get_findings(self):
        order = {'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4}
        unique = {}
        for f in self.findings:
            key = f['description']
            if key in unique:
                unique[key]['event_count'] += f.get('event_count', 1)
            else:
                unique[key] = f.copy()
                if 'event_count' not in unique[key]:
                    unique[key]['event_count'] = 1
        return sorted(list(unique.values()), key=lambda x: order.get(x['severity'], 9))

# ── 3. LLM ENTEGRASYONU ──────────────────────────────────────────────────────
class LLMAnalyzer:
    def __init__(self, provider="gemini", api_key=None, model=None):
        self.provider = provider
        self.model = model
        if provider == "gemini":
            self.api_key = api_key or os.environ.get("GEMINI_API_KEY", "")
        elif provider == "openai":
            self.api_key = api_key or os.environ.get("OPENAI_API_KEY", "")
        else:
            self.api_key = None

    def _build_prompt(self, findings_by_source):
        prompt = (
            "Sen bir Siber Güvenlik Uzmanısın. Aşağıdaki sistem log bulgularını inceleyerek teknik bir analiz raporu oluştur.\n"
            "Aşağıdaki örnek formata KESİNLİKLE uy ve listedeki HER BİR olayı AYRI AYRI değerlendir. Bulguları aynı paragrafta birleştirme!\n\n"
            "ÖRNEK FORMAT:\n"
            "## 📤 auth.log Analizi\n"
            "### [CRITICAL] SSH_BRUTE_FORCE\n"
            "- **Tehdit Özeti:** 192.168.1.5 IP adresinden 500 kez başarısız giriş denemesi yapıldı. Bu bir kaba kuvvet saldırısıdır.\n"
            "- **Müdahale Önerisi:** Saldırganın IP adresini güvenlik duvarından engellemek gerekir.\n"
            "- **Çözüm Komutu:** `sudo ufw deny from 192.168.1.5`\n\n"
            "Lütfen aşağıdaki bulgular için yukarıdaki örnek formata uygun şekilde TEK TEK ayrı başlıklar oluştur. Çözüm komutları (Brute force için: ufw deny. Sudo için: tail -n 50 /var/log/auth.log) haricinde uydurma komut yazma.\n\n"
            "== BULGULAR ==\n"
        )
        for source, findings in findings_by_source.items():
            if not findings:
                prompt += f"\n--- {source}: Tehdit tespit edilmedi ---\n"
                continue
            prompt += f"\n--- {source} ({len(findings)} benzersiz bulgu türü) ---\n"
            for f in findings:
                prompt += f"  [{f['severity']}] {f['type']}: {f['description']} (Toplam {f['event_count']} kez görüldü)\n"
        return prompt

    def _offline_report(self, findings_by_source):
        all_findings = [f for lst in findings_by_source.values() for f in lst]
        lines = []
        lines.append("# 🤖 Yapay Zeka (Kural Tabanlı) Güvenlik Analiz Raporu")
        lines.append(f"\n**Tarih:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        total_events = sum(f.get('event_count', 1) for f in all_findings)
        crit = sum(f.get('event_count', 1) for f in all_findings if f['severity'] == 'CRITICAL')
        high = sum(f.get('event_count', 1) for f in all_findings if f['severity'] == 'HIGH')
        med  = sum(f.get('event_count', 1) for f in all_findings if f['severity'] == 'MEDIUM')
        lines.append(f"**Dağılım:** {crit} KRİTİK · {high} YÜKSEK · {med} ORTA\n")
        lines.append("---\n")

        for source, findings in findings_by_source.items():
            icon = "📤" if source == "auth.log" else "📜" if source == "syslog" else "🖥️"
            lines.append(f"## {icon} {source} Analizi\n")
            if not findings:
                lines.append("Bu dosyada önemli bir tehdit tespit edilmedi.\n")
                continue
            for i, f in enumerate(findings, 1):
                emoji = "🔴" if f['severity'] == 'CRITICAL' else "🟡" if f['severity'] == 'HIGH' else "🔵"
                lines.append(f"### {emoji} [{f['severity']}] {f['type']}")
                lines.append(f"- **Ne oldu:** {f['description']}")
                if 'BRUTE' in f['type']:
                    lines.append("- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.")
                    lines.append("- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.\n")
                elif 'PRIVILEGE' in f['type']:
                    lines.append("- **Risk:** Biri root (yönetici) yetkisi almaya çalıştı veya aldı.")
                    lines.append("- **Yapılacak:** /etc/sudoers dosyasını kontrol et, şüpheli hesabı kilitle.\n")
                elif 'NETWORK' in f['type']:
                    lines.append("- **Risk:** Ağ kapasitesi doldu, meşru bağlantılar düşüyor olabilir.")
                    lines.append("- **Yapılacak:** Firewall rate-limit kuralları ekle.\n")
                elif 'CRON' in f['type']:
                    lines.append("- **Risk:** Arka kapı (backdoor) yerleştirilmiş olabilir.")
                    lines.append("- **Yapılacak:** `sudo crontab -l -u root` ile kontrol et.\n")
                else:
                    lines.append("- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.\n")

        return "\n".join(lines)

    def generate(self, findings_by_source):
        all_findings = [f for lst in findings_by_source.values() for f in lst]
        if not all_findings:
            return "Sistemde analiz edilecek riskli olay bulunamadı."

        prompt = self._build_prompt(findings_by_source)
        res = ""

        if self.provider == "ollama":
            res = self._call_ollama(prompt)
            if res.startswith("[OLLAMA HATASI]"):
                print(f"{Colors.WARNING}[!] Ollama'ya bağlanılamadı. Yerel AI moduna geçiliyor...{Colors.ENDC}")
                return self._offline_report(findings_by_source)
        elif self.provider == "gemini" and self.api_key and HAS_GEMINI:
            res = self._call_gemini(prompt)
            if res.startswith("[GEMINI HATASI]"):
                print(f"{Colors.WARNING}[!] Gemini API hatası: Kota aşımı veya bağlantı sorunu. Yerel AI moduna geçiliyor...{Colors.ENDC}")
                return self._offline_report(findings_by_source)
        elif self.provider == "openai" and self.api_key and HAS_OPENAI:
            res = self._call_openai(prompt)
        else:
            print(f"{Colors.WARNING}[!] API key bulunamadı → Kural tabanlı rapor üretiliyor.{Colors.ENDC}")
            return self._offline_report(findings_by_source)
            
        acil_mudahale = (
            "\n\n## 🛡️ Acil Müdahale Adımları\n"
            "```bash\n"
            "# Saldıran IP'leri engelle\n"
            "sudo ufw deny from <SALDIRGAN_IP>\n"
            "# SSH güvenliğini artır\n"
            "sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config\n"
            "# Fail2Ban kur (otomatik engelleme)\n"
            "sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban\n"
            "```\n"
        )
        return res.strip() + acil_mudahale

    def _call_ollama(self, prompt):
        model = self.model or "mistral:7b"
        print(f"{Colors.OKCYAN}[*] Ollama ({model}) ile analiz yapılıyor...{Colors.ENDC}")
        try:
            data = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode()
            req  = urllib.request.Request(
                "http://127.0.0.1:11434/api/generate",
                data=data, headers={"Content-Type": "application/json"}, method="POST"
            )
            with urllib.request.urlopen(req, timeout=300) as resp:
                return json.loads(resp.read().decode()).get("response", "[Yanıt alınamadı]")
        except urllib.error.URLError as e:
            print(f"{Colors.FAIL}[!] Ollama çalışmıyor. `ollama serve` çalıştırın. Hata: {e}{Colors.ENDC}")
            return "[OLLAMA HATASI] Bağlantı reddedildi"
        except Exception as e:
            return f"[OLLAMA HATASI]: {e}"

    def _call_gemini(self, prompt):
        model_name = self.model or 'gemini-2.5-flash'
        print(f"{Colors.OKCYAN}[*] Google Gemini ({model_name}) ile analiz yapılıyor...{Colors.ENDC}")
        try:
            client = genai_new.Client(api_key=self.api_key)
            response = client.models.generate_content(model=model_name, contents=prompt)
            return response.text
        except Exception as e:
            return f"[GEMINI HATASI]: {e}"

    def _call_openai(self, prompt):
        print(f"{Colors.OKCYAN}[*] OpenAI ile analiz yapılıyor...{Colors.ENDC}")
        try:
            client = OpenAI(api_key=self.api_key)
            resp = client.chat.completions.create(
                model=self.model or "gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Sen bir Siber Güvenlik ve SIEM uzmanı yapay zeka asistanısın."},
                    {"role": "user", "content": prompt}
                ]
            )
            return resp.choices[0].message.content
        except Exception as e:
            return f"[OPENAI HATASI]: {e}"

# ── 4. ANA YÜRÜTME ───────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(
        description="🛡️  Yapay Zeka Destekli Linux Log Analiz Aracı",
        formatter_class=argparse.RawTextHelpFormatter,
        epilog=(
            "Örnekler:\n"
            "  Gemini (ücretsiz):\n"
            "    python3 log_analyzer.py --auth sample_logs/auth.log --syslog sample_logs/syslog --kern sample_logs/kern.log --llm gemini --model gemini-2.5-flash --api-key YOUR_KEY\n\n"
            "  Ollama (çevrimdışı):\n"
            "    ollama pull llama3\n"
            "    python3 log_analyzer.py --auth sample_logs/auth.log --syslog sample_logs/syslog --llm ollama --model llama3\n\n"
            "  API key olmadan:\n"
            "    python3 log_analyzer.py --auth sample_logs/auth.log --syslog sample_logs/syslog --kern sample_logs/kern.log\n"
        )
    )
    ap.add_argument("--auth",    help="auth.log dosya yolu")
    ap.add_argument("--syslog",  help="syslog dosya yolu")
    ap.add_argument("--kern",    help="kern.log dosya yolu")
    ap.add_argument("--output",  default="reports", help="Rapor dizini (varsayılan: reports)")
    ap.add_argument("--llm",     choices=["gemini", "openai", "ollama"], default="gemini",
                    help="Kullanılacak LLM")
    ap.add_argument("--model",   help="Model adı (gemini-2.5-flash, llama3, gpt-4o-mini...)")
    ap.add_argument("--api-key", dest="api_key", help="Gemini veya OpenAI API anahtarı")

    args = ap.parse_args()

    if not (args.auth or args.syslog or args.kern):
        print(f"{Colors.FAIL}[!] En az bir log dosyası belirtin: --auth, --syslog, --kern{Colors.ENDC}")
        ap.print_help()
        return

    print(f"\n{Colors.HEADER}{'='*55}{Colors.ENDC}")
    print(f"{Colors.HEADER}  🛡️  YAPAY ZEKA DESTEKLİ LOG ANALİZ ARACI{Colors.ENDC}")
    print(f"{Colors.HEADER}{'='*55}{Colors.ENDC}\n")

    lp = LogParser()
    td_auth   = ThreatDetector()
    td_syslog = ThreatDetector()
    td_kern   = ThreatDetector()

    if args.auth:
        print(f"{Colors.OKBLUE}[*] auth.log okunuyor  → {args.auth}{Colors.ENDC}")
        td_auth.analyze_auth(lp.parse_file(args.auth, 'auth'))
    if args.syslog:
        print(f"{Colors.OKBLUE}[*] syslog okunuyor   → {args.syslog}{Colors.ENDC}")
        td_syslog.analyze_syslog(lp.parse_file(args.syslog, 'syslog'))
    if args.kern:
        print(f"{Colors.OKBLUE}[*] kern.log okunuyor → {args.kern}{Colors.ENDC}")
        td_kern.analyze_kern(lp.parse_file(args.kern, 'kern'))

    findings_by_source = {}
    if args.auth:   findings_by_source['auth.log'] = td_auth.get_findings()
    if args.syslog: findings_by_source['syslog']   = td_syslog.get_findings()
    if args.kern:   findings_by_source['kern.log']  = td_kern.get_findings()

    all_findings = [f for lst in findings_by_source.values() for f in lst]
    total_events = sum(f.get('event_count', 1) for f in all_findings)
    crit = sum(f.get('event_count', 1) for f in all_findings if f['severity'] == 'CRITICAL')
    high = sum(f.get('event_count', 1) for f in all_findings if f['severity'] == 'HIGH')
    med  = sum(f.get('event_count', 1) for f in all_findings if f['severity'] == 'MEDIUM')
    print(f"\n{Colors.OKGREEN}[+] Toplam {total_events} tehdit ({crit} KRİTİK, {high} YÜKSEK, {med} ORTA){Colors.ENDC}")
    for src, lst in findings_by_source.items():
        print(f"    └ {src}: {len(lst)} bulgu")

    os.makedirs(args.output, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    json_path = os.path.join(args.output, f"bulgular_{ts}.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(all_findings, f, ensure_ascii=False, indent=2)

    per_source_path = os.path.join(args.output, "per_source_latest.json")
    with open(per_source_path, 'w', encoding='utf-8') as f:
        json.dump(findings_by_source, f, ensure_ascii=False, indent=2)
    print(f"{Colors.OKCYAN}[+] Bulgular kaydedildi: {json_path}{Colors.ENDC}")

    analyzer = LLMAnalyzer(provider=args.llm, api_key=args.api_key, model=args.model)
    report   = analyzer.generate(findings_by_source)

    print(f"\n{Colors.OKGREEN}{'='*55}{Colors.ENDC}")
    print(f"{Colors.BOLD}  📋 LLM ANALİZ RAPORU{Colors.ENDC}")
    print(f"{Colors.OKGREEN}{'='*55}{Colors.ENDC}\n")
    print(report)
    print(f"\n{Colors.OKGREEN}{'='*55}{Colors.ENDC}\n")

    report_path = os.path.join(args.output, f"llm_analiz_raporu_{ts}.md")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(f"# 🛡️ Güvenlik Log Analiz Raporu\n\n")
        f.write(f"**Tarih:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n")
        f.write(f"**LLM:** {args.llm.upper()}  \n")
        f.write(f"**Toplam Bulgu:** {total_events} ({crit} KRİTİK, {high} YÜKSEK, {med} ORTA)  \n\n---\n\n")
        f.write(report)
    print(f"{Colors.OKCYAN}[+] Rapor kaydedildi: {report_path}{Colors.ENDC}\n")

if __name__ == "__main__":
    main()
