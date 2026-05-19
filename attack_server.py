#!/usr/bin/env python3
"""Wazuh Sunum - Saldiri Simülasyonu Sunucusu"""

import json, subprocess, threading, time, os
from http.server import HTTPServer, BaseHTTPRequestHandler

UBUNTU_IP = "192.168.64.4"
SSH_KEY   = os.path.expanduser("~/.ssh/ubuntu_wazuh")
SSH_USER  = "osman"
ALERTS_FILE = os.path.join(os.path.dirname(__file__), "all_alerts.json")
SAMPLE_DIR  = os.path.join(os.path.dirname(__file__), "sample_logs")
PORT = 8877

HTML_FILE = os.path.join(os.path.dirname(__file__), "sunum_app.html")

# Canlı analiz durum takibi
analyze_state = {"running": False, "step": "", "done": False, "error": ""}

def ssh(cmd, timeout=15):
    try:
        r = subprocess.run(
            ["ssh", "-i", SSH_KEY, "-o", "StrictHostKeyChecking=no",
             "-o", f"ConnectTimeout={timeout}", f"{SSH_USER}@{UBUNTU_IP}", cmd],
            capture_output=True, text=True, timeout=timeout+5)
        return r.stdout.strip(), r.returncode == 0
    except Exception as e:
        return str(e), False

def get_status():
    out, ok = ssh("dpkg -l wazuh-manager 2>/dev/null | grep '^ii' | awk '{print $3}'")
    version = out.strip() if ok and out.strip() else "?"
    count_out, _ = ssh("sudo wc -l /var/ossec/logs/alerts/alerts.json 2>/dev/null")
    count = count_out.split()[0] if count_out else "?"
    return {"ok": ok and version != "?", "version": version, "count": count}

def load_alerts():
    alerts = []
    try:
        with open(ALERTS_FILE) as f:
            for line in f:
                line = line.strip()
                if line:
                    try: alerts.append(json.loads(line))
                    except: pass
    except: pass
    return alerts

def run_ssh_attack(username, attempts=8):
    results = []
    for i in range(attempts):
        try:
            port = 55000 + i
            log_msg = f"Invalid user {username} from 192.168.64.1 port {port}"
            subprocess.run(
                ["ssh", "-i", SSH_KEY, "-o", "StrictHostKeyChecking=no",
                 "-o", "ConnectTimeout=3", "-o", "BatchMode=yes",
                 f"osman@{UBUNTU_IP}",
                 f"sudo logger -p auth.info -t sshd '{log_msg}'"],
                capture_output=True, timeout=5)
            results.append({"attempt": i+1, "target": f"{username}@{UBUNTU_IP}", "result": "REJECTED (Simulated)"})
        except Exception as e:
            results.append({"attempt": i+1, "result": str(e)})
        time.sleep(0.2)
    return results

def run_live_analysis(api_key="", llm_provider="gemini"):
    """Ubuntu'dan gerçek logları çek → log_analyzer.py çalıştır → sonuçları kaydet"""
    global analyze_state
    analyze_state = {"running": True, "step": "Ubuntu'dan loglar çekiliyor...", "done": False, "error": ""}
    base = os.path.dirname(__file__)
    logs = {
        "auth": os.path.join(base, "sample_logs", "auth.log"),
        "syslog": os.path.join(base, "sample_logs", "syslog"),
        "kern": os.path.join(base, "sample_logs", "kern.log"),
    }
    log_cmds = {
        "auth":   "sudo cat /var/log/auth.log",
        "syslog": "sudo cat /var/log/syslog",
        "kern":   "sudo cat /var/log/kern.log",
    }
    try:
        # Adım 1: Logları Ubuntu'dan çek
        os.makedirs(os.path.join(base, "sample_logs"), exist_ok=True)
        for key, cmd in log_cmds.items():
            analyze_state["step"] = f"{key} logu Ubuntu'dan çekiliyor..."
            out, ok = ssh(cmd, timeout=30)
            if ok and out:
                with open(logs[key], "w", encoding="utf-8") as f:
                    f.write(out)
        analyze_state["step"] = f"Loglar çekildi. {llm_provider.upper()} AI analiz yapıyor..."

        # Adım 2: log_analyzer.py çalıştır
        cmd = [
            "python3", os.path.join(base, "log_analyzer.py"),
            "--auth",   logs["auth"],
            "--syslog", logs["syslog"],
            "--kern",   logs["kern"],
            "--llm",    llm_provider,
            "--model",  "gemini-2.5-flash" if llm_provider == "gemini" else ("gpt-4o-mini" if llm_provider == "openai" else "llama3.2"),
            "--output", os.path.join(base, "reports"),
        ]
        if api_key:
            cmd += ["--api-key", api_key]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            analyze_state["error"] = result.stderr[-500:] if result.stderr else "Bilinmeyen hata"
        analyze_state["step"] = "Tamamlandı ✅"
        analyze_state["done"] = True
    except Exception as e:
        analyze_state["step"] = "Hata oluştu"
        analyze_state["error"] = str(e)
        analyze_state["done"] = True
    finally:
        analyze_state["running"] = False



class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def send_json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, path):
        try:
            with open(path, "rb") as f: body = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except:
            self.send_response(404); self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        p = self.path.split("?")[0]
        if p == "/" or p == "/index.html":
            self.send_html(HTML_FILE)
        elif p == "/api/status":
            self.send_json(get_status())
        elif p == "/api/alerts":
            alerts = load_alerts()
            self.send_json({"alerts": alerts, "total": len(alerts)})
        elif p == "/api/sync":
            # Ubuntu'dan alertleri çek
            out, ok = ssh("sudo cat /var/ossec/logs/alerts/alerts.json 2>/dev/null")
            if ok and out:
                with open(ALERTS_FILE, "w") as f:
                    f.write(out)
                alerts = load_alerts()
                self.send_json({"synced": True, "count": len(alerts)})
            else:
                self.send_json({"synced": False, "count": len(load_alerts())})
        elif p == "/api/latest_findings":
            # En son bulgular JSON'unu döndür
            import glob
            files = sorted(glob.glob(os.path.join(os.path.dirname(__file__), "reports", "bulgular_*.json")))
            if files:
                try:
                    with open(files[-1], encoding="utf-8") as f:
                        findings = json.load(f)
                    self.send_json({"ok": True, "findings": findings, "file": os.path.basename(files[-1])})
                except Exception as e:
                    self.send_json({"ok": False, "error": str(e)})
            else:
                self.send_json({"ok": False, "error": "Henüz analiz yapılmadı"})
        elif p == "/api/latest_report":
            # En son LLM rapor markdown'ını döndür
            import glob
            files = sorted(glob.glob(os.path.join(os.path.dirname(__file__), "reports", "llm_analiz_raporu_*.md")))
            if files:
                try:
                    with open(files[-1], encoding="utf-8") as f:
                        content = f.read()
                    self.send_json({"ok": True, "report": content, "file": os.path.basename(files[-1])})
                except Exception as e:
                    self.send_json({"ok": False, "error": str(e)})
            else:
                self.send_json({"ok": False, "error": "Henüz rapor oluşturulmadı"})
        elif p == "/api/per_source":
            per_src = os.path.join(os.path.dirname(__file__), "reports", "per_source_latest.json")
            if os.path.exists(per_src):
                try:
                    with open(per_src, encoding="utf-8") as f:
                        data = json.load(f)
                    self.send_json({"ok": True, "data": data})
                except Exception as e:
                    self.send_json({"ok": False, "error": str(e)})
            else:
                self.send_json({"ok": False, "error": "Henüz per-source analiz yok"})
        elif p == "/api/analyze_status":
            self.send_json(dict(analyze_state))
        else:
            self.send_response(404); self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try: data = json.loads(body)
        except: data = {}

        if self.path == "/api/attack":
            username = data.get("username", "hacker")
            attempts = int(data.get("attempts", 8))
            threading.Thread(target=run_ssh_attack, args=(username, attempts), daemon=True).start()
            self.send_json({"started": True, "msg": f"{attempts} SSH denemesi başlatıldı → {username}@{UBUNTU_IP}"})
        elif self.path == "/api/sudo_attack":
            out, _ = ssh("sudo id 2>/dev/null && sudo bash -c 'echo SUDO_OK' 2>/dev/null")
            self.send_json({"executed": True, "output": out or "Simüle edildi"})
        elif self.path == "/api/run_live_analysis":
            api_key = data.get("api_key", "")
            llm_provider = data.get("llm_provider", "gemini")
            if analyze_state["running"]:
                self.send_json({"started": False, "msg": "Analiz zaten çalışıyor..."})
                return
            threading.Thread(target=run_live_analysis, args=(api_key, llm_provider), daemon=True).start()
            self.send_json({"started": True, "msg": "Loglar çekiliyor ve AI analiz başlıyor (~30-60 sn)"})
        elif self.path == "/api/analyze_single_alert":
            try:
                alert_data = data
                api_key = data.get("api_key", os.environ.get("GEMINI_API_KEY", ""))
                llm_provider = data.get("llm_provider", "gemini")
                from log_analyzer import LLMAnalyzer
                analyzer = LLMAnalyzer(provider=llm_provider, api_key=api_key)
                prompt = (
                    "Sen bir Siber Güvenlik Uzmanısın. Sana Wazuh tarafından üretilmiş ham bir JSON Alert veriyorum.\n"
                    "Lütfen bu uyarıyı teknik olmayan birine ÇOK KISA (maksimum 2 cümle) açıkla.\n\n"
                    "KOMUT KURALLARI (Uydurma komut yazma!):\n"
                    "- Kural 'Brute Force' (5712/5710) ise bash komutu olarak: `sudo ufw deny from [JSON_ICINDEKI_IP_ADRESI]` ver.\n"
                    "- Kural 'Sudo' (5402) ise bash komutu olarak: `sudo passwd -l root` veya log incelemesi için `tail -n 50 /var/log/auth.log` ver.\n"
                    "- Başka bir kural ise veya emin değilsen ASLA uydurma komut yazma! Sadece şu komutu ver: `cat /var/ossec/logs/alerts/alerts.log | grep [ID]`\n\n"
                    "Cevabını KESİNLİKLE şu formatta ver:\n"
                    "**🚨 Tehdit Nedir?** [1-2 cümlelik kısa özet]\n"
                    "**🛠️ Ne Yapılmalı?** [Sadece en önemli eylemi kısaca yaz]\n"
                    "```bash\n[Tam bash komutu]\n```\n\n"
                    f"İşte Alert JSON verisi:\n```json\n{json.dumps(alert_data, indent=2)}\n```\n"
                )
                if llm_provider == "ollama":
                    explanation = analyzer._call_ollama(prompt)
                    if explanation.startswith("[OLLAMA HATASI]"):
                        rule_desc = alert_data.get("rule", {}).get("description", "Bilinmeyen Tehdit")
                        explanation = f"**🚨 Tehdit Nedir?** {rule_desc} (Ollama kapalı, kural tabanlı motor kullanılıyor)\n**🛠️ Ne Yapılmalı?** Lütfen bu kaynağı engelleyin veya sistemi kontrol edin."
                else:
                    if not analyzer.api_key:
                        explanation = "⚠️ API Anahtarı bulunamadı."
                    elif llm_provider == "openai":
                        explanation = analyzer._call_openai(prompt)
                        if explanation.startswith("[OPENAI HATASI]"):
                            rule_desc = alert_data.get("rule", {}).get("description", "Bilinmeyen Tehdit")
                            explanation = f"**🚨 Tehdit Nedir?** {rule_desc} (OpenAI API Hatası, yerel motor kullanılıyor)\n**🛠️ Ne Yapılmalı?** Lütfen bu kaynağı engelleyin veya sistemi kontrol edin."
                    else:
                        explanation = analyzer._call_gemini(prompt)
                        if explanation.startswith("[GEMINI HATASI]"):
                            rule_desc = alert_data.get("rule", {}).get("description", "Bilinmeyen Tehdit")
                            explanation = f"**🚨 Tehdit Nedir?** {rule_desc} (Gemini API kotası doldu, yerel motor kullanılıyor)\n**🛠️ Ne Yapılmalı?** Lütfen bu kaynağı engelleyin veya sistemi kontrol edin."
                self.send_json({"ok": True, "explanation": explanation})
            except Exception as e:
                self.send_json({"ok": False, "error": str(e)})
        else:
            self.send_response(404); self.end_headers()

if __name__ == "__main__":
    print(f"\n{'='*50}")
    print(f"  Wazuh Sunum Sunucusu — Port {PORT}")
    print(f"  http://localhost:{PORT}")
    print(f"  Ubuntu: {UBUNTU_IP}")
    print(f"{'='*50}\n")
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu durduruldu.")
