# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-18 23:02:59  
**LLM:** GEMINI  
**Toplam Bulgu:** 14 (9 KRİTİK, 4 YÜKSEK)  

---

# 🤖 Yapay Zeka (Kural Tabanlı) Güvenlik Analiz Raporu

**Tarih:** 2026-05-18 23:02
**Toplam Bulgu:** 14

**Dağılım:** 9 KRİTİK · 4 YÜKSEK · 1 ORTA

---

## 1. Genel Durum Özeti
İncelenen log dosyalarında ciddi güvenlik tehditleri tespit edilmiştir. Sistemde dışarıdan koordineli bir SSH kaba-kuvvet saldırısı, yetki yükseltme girişimi ve ağ katmanında aşırı yük belirtileri gözlemlenmiştir. Genel risk skoru **KRİTİK** seviyesindedir.

## 2. Tehdit Analizi

### 🔴 Bulgu 1: [CRITICAL] SSH_BRUTE_FORCE
- **Açıklama:** 185.220.101.47 IP adresinden 20 başarısız SSH giriş denemesi tespit edildi.
- **MITRE ATT&CK:** `T1110.001 — Brute Force: Password Guessing`
- **Risk:** Saldırgan, otomatik araç (Hydra/Medusa) ile parola deniyor. Zayıf parola varsa sistem ele geçirilir.
- **Öneri:** `sudo ufw deny from <IP>` ile IP'yi engelleyin, Fail2Ban kurun.

### 🔴 Bulgu 2: [CRITICAL] SSH_BRUTE_FORCE
- **Açıklama:** 198.51.100.22 IP adresinden 10 başarısız SSH giriş denemesi tespit edildi.
- **MITRE ATT&CK:** `T1110.001 — Brute Force: Password Guessing`
- **Risk:** Saldırgan, otomatik araç (Hydra/Medusa) ile parola deniyor. Zayıf parola varsa sistem ele geçirilir.
- **Öneri:** `sudo ufw deny from <IP>` ile IP'yi engelleyin, Fail2Ban kurun.

### 🔴 Bulgu 3: [CRITICAL] SSH_BRUTE_FORCE
- **Açıklama:** 192.168.64.1 IP adresinden 16 başarısız SSH giriş denemesi tespit edildi.
- **MITRE ATT&CK:** `T1110.001 — Brute Force: Password Guessing`
- **Risk:** Saldırgan, otomatik araç (Hydra/Medusa) ile parola deniyor. Zayıf parola varsa sistem ele geçirilir.
- **Öneri:** `sudo ufw deny from <IP>` ile IP'yi engelleyin, Fail2Ban kurun.

### 🔴 Bulgu 4: [CRITICAL] SSH_BRUTE_FORCE
- **Açıklama:** 91.92.252.18 IP adresinden 12 başarısız SSH giriş denemesi tespit edildi.
- **MITRE ATT&CK:** `T1110.001 — Brute Force: Password Guessing`
- **Risk:** Saldırgan, otomatik araç (Hydra/Medusa) ile parola deniyor. Zayıf parola varsa sistem ele geçirilir.
- **Öneri:** `sudo ufw deny from <IP>` ile IP'yi engelleyin, Fail2Ban kurun.

### 🔴 Bulgu 5: [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Açıklama:** 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: /bin/cat /var/log/auth.log
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🔴 Bulgu 6: [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Açıklama:** 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: /usr/bin/apt update
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🔴 Bulgu 7: [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Açıklama:** 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: /bin/systemctl status wazuh-manager
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🔴 Bulgu 8: [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Açıklama:** 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: /usr/bin/wc -l /var/ossec/logs/alerts/alerts.json
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🔴 Bulgu 9: [CRITICAL] NETWORK_OVERLOAD
- **Açıklama:** Ağ bağlantı tablosu (nf_conntrack) dolu. Olası DDoS/SYN-Flood saldırısı. Tespit: 3 kez.
- **MITRE ATT&CK:** `T1498 — Network Denial of Service`
- **Risk:** Ağ tablosu dolduğunda yasal bağlantılar düşer. Servis kesintisi yaşanır.
- **Öneri:** `sysctl -w net.netfilter.nf_conntrack_max=131072` ile kapasite artırın.

### 🟡 Bulgu 10: [HIGH] SSH_BRUTE_FORCE
- **Açıklama:** 203.0.113.99 IP adresinden 5 başarısız SSH giriş denemesi tespit edildi.
- **MITRE ATT&CK:** `T1110.001 — Brute Force: Password Guessing`
- **Risk:** Saldırgan, otomatik araç (Hydra/Medusa) ile parola deniyor. Zayıf parola varsa sistem ele geçirilir.
- **Öneri:** `sudo ufw deny from <IP>` ile IP'yi engelleyin, Fail2Ban kurun.

### 🟡 Bulgu 11: [HIGH] PRIVILEGE_ESCALATION_ATTEMPT
- **Açıklama:** 'attacker' kullanıcısı yetkisiz sudo ile '/bin/bash' çalıştırmayı denedi.
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🟡 Bulgu 12: [HIGH] SUSPICIOUS_CRON
- **Açıklama:** Şüpheli cron görevi: `/tmp/.hidden_script.sh 2>/dev/null`
- **MITRE ATT&CK:** `T1053.003 — Scheduled Task/Job: Cron`
- **Risk:** Saldırgan kalıcılık (persistence) için backdoor zamanlamış olabilir.
- **Öneri:** `sudo crontab -l -u root` çalıştırın, bilinmeyen görevleri silin.

### 🟡 Bulgu 13: [HIGH] OUT_OF_MEMORY
- **Açıklama:** OOM Killer 'java' işlemini sonlandırdı. Sistem belleği tükendi.
- **MITRE ATT&CK:** `T1499 — Endpoint Denial of Service`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 14: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/tmp/.hidden_script.sh' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

## 3. MITRE ATT&CK Eşleştirmesi

| Taktik | Teknik | Açıklama |
|---|---|---|
| İlk Erişim | `T1110.001 — Brute Force: Password Guessing` | SSH_BRUTE_FORCE |
| Yetki Yükseltme | `T1548.003 — Sudo and Sudo Caching` | PRIVILEGE_ESCALATION_SUCCESS |
| Etki | `T1498 — Network Denial of Service` | NETWORK_OVERLOAD |
| Etki | `T1053.003 — Scheduled Task/Job: Cron` | SUSPICIOUS_CRON |
| Etki | `T1499 — Endpoint Denial of Service` | OUT_OF_MEMORY |
| Etki | `T1068 — Exploitation for Privilege Escalation` | APPARMOR_BLOCK |

## 4. Acil Müdahale Önerileri

```bash
# 1. Saldıran IP'leri engelle
sudo ufw deny from 185.220.101.47
sudo ufw deny from 192.168.64.1

# 2. SSH root girişini kapat
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# 3. Fail2Ban kur
sudo apt install fail2ban -y
sudo systemctl enable --now fail2ban

# 4. Şüpheli cron görevlerini kontrol et
sudo crontab -l -u root
```