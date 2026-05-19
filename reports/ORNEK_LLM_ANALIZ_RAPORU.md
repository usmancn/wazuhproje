# 🤖 Yapay Zeka (LLM) Güvenlik Analiz Raporu

**Tarih:** 2026-05-18
**Analiz Edilen Loglar:** auth.log, syslog, kern.log
**Analiz Motoru:** Gemini 1.5 Pro / SIEM AI Agent

---

## 1. Genel Durum Özeti
İncelenen sistem loglarında toplam **7 adet potansiyel güvenlik tehdidi** tespit edilmiştir. Sistemde dışarıdan içeriye doğru sistematik bir parola kırma (Brute-Force) saldırısı yürütüldüğü, başarılı bir şekilde sisteme sızılamasa da ağ trafiğinde şüpheli yoğunluk (DDoS/Flood izleri) ve yetki yükseltme (Privilege Escalation) denemeleri olduğu gözlemlenmiştir. Olayların genel risk skoru **YÜKSEK (CRITICAL)** olarak değerlendirilmiştir.

## 2. Tehdit Analizi (Bulgular)

### 🔴 [CRITICAL] SSH Brute-Force (Kaba Kuvvet) Saldırısı
- **Tespit:** `192.168.64.1` IP adresi üzerinden `hacker` ve `root` kullanıcı adları denenerek 10'dan fazla başarısız SSH giriş denemesi yapılmıştır (`auth.log`).
- **Risk Boyutu:** Saldırganın otomatize edilmiş bir araç (örn. Hydra, Medusa) kullanarak sistemdeki zayıf parolaları taradığı tespit edilmiştir. Eğer sistemde zayıf bir parola bulunuyorsa sunucu tamamen ele geçirilebilir.

### 🔴 [CRITICAL] Ağ Tablosu Taşkını (Network Overload)
- **Tespit:** `nf_conntrack: table full, dropping packet` hatası (`syslog`).
- **Risk Boyutu:** Sistemin ağ bağlantı takip tablosu kapasitesini doldurmuştur. Bu durum, sisteme yönelik aktif bir **DDoS (SYN Flood)** saldırısının işareti olabilir veya Brute-Force aracının çok fazla eşzamanlı bağlantı (thread) açtığını gösterir. Sistem bu yüzden dışarıdan gelen meşru trafikleri düşürmektedir.

### 🟡 [HIGH] Şüpheli Zamanlanmış Görev (Cron Job)
- **Tespit:** `wget` komutu barındıran şüpheli bir Cron görevi tetiklenmiştir (`syslog`).
- **Risk Boyutu:** Eğer saldırgan sisteme sızmayı başardıysa, kalıcılık (persistence) sağlamak için dışarıdan zararlı yazılım (malware/backdoor) indiren bir görev zamanlamış olabilir.

### 🟡 [HIGH] Bellek Taşması (OOM Killer)
- **Tespit:** `Out of memory: Killed process` hatası (`kern.log`).
- **Risk Boyutu:** Sunucunun belleği tükenmiş ve çekirdek (kernel), sistemi ayakta tutabilmek için bazı süreçleri zorla kapatmıştır. Bu, bir güvenlik zafiyetinden (memory leak) veya ağ trafiğindeki aşırı yüklenmeden kaynaklanabilir.

## 3. Acil Müdahale Önerileri

1. **IP Engelleme:** `192.168.64.1` IP adresi derhal güvenlik duvarından (iptables / UFW) bloklanmalıdır.
   ```bash
   sudo ufw deny from 192.168.64.1
   ```
2. **SSH Güvenliği Sıkılaştırması:** 
   - `sshd_config` dosyasından `PermitRootLogin no` yapılmalıdır.
   - Parola ile giriş tamamen kapatılmalı ve sadece Public Key (RSA/Ed25519) tabanlı girişe izin verilmelidir.
   - Şüpheli IP'leri otomatik banlamak için sisteme **Fail2Ban** kurulmalıdır.
3. **Conntrack Kapasitesinin Artırılması:** Ağ tablosunun dolmasını engellemek için kernel parametresi artırılmalıdır:
   ```bash
   sudo sysctl -w net.netfilter.nf_conntrack_max=131072
   ```
4. **Kalıcılık Kontrolü:** Sunucudaki zamanlanmış görevleri (crontab) kontrol edin ve bilmediğiniz/şüpheli script indiren (`wget`, `curl`) komutları derhal temizleyin.
   ```bash
   sudo crontab -l -u root
   ```
