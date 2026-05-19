# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-18 23:07:05  
**LLM:** GEMINI  
**Toplam Bulgu:** 25 (3 KRİTİK, 0 YÜKSEK)  

---

# 🤖 Yapay Zeka (Kural Tabanlı) Güvenlik Analiz Raporu

**Tarih:** 2026-05-18 23:07
**Toplam Bulgu:** 25

**Dağılım:** 3 KRİTİK · 0 YÜKSEK · 22 ORTA

---

## 1. Genel Durum Özeti
İncelenen log dosyalarında ciddi güvenlik tehditleri tespit edilmiştir. Sistemde dışarıdan koordineli bir SSH kaba-kuvvet saldırısı, yetki yükseltme girişimi ve ağ katmanında aşırı yük belirtileri gözlemlenmiştir. Genel risk skoru **KRİTİK** seviyesindedir.

## 2. Tehdit Analizi

### 🔴 Bulgu 1: [CRITICAL] SSH_BRUTE_FORCE
- **Açıklama:** 192.168.64.1 IP adresinden 81 başarısız SSH giriş denemesi tespit edildi.
- **MITRE ATT&CK:** `T1110.001 — Brute Force: Password Guessing`
- **Risk:** Saldırgan, otomatik araç (Hydra/Medusa) ile parola deniyor. Zayıf parola varsa sistem ele geçirilir.
- **Öneri:** `sudo ufw deny from <IP>` ile IP'yi engelleyin, Fail2Ban kurun.

### 🔴 Bulgu 2: [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Açıklama:** 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🔴 Bulgu 3: [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Açıklama:** 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **MITRE ATT&CK:** `T1548.003 — Sudo and Sudo Caching`
- **Risk:** İçeride bir tehdit aktörü mevcut. Root yetki alındıysa sistem tamamen ele geçirilmiştir.
- **Öneri:** `/etc/sudoers` dosyasını denetleyin, şüpheli hesapları kilitleyin.

### 🔵 Bulgu 4: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'sys_nice' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 5: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 6: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 7: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 8: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 9: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 10: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 11: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 12: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 13: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 14: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 15: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 16: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 17: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor '/proc/pressure/memory' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 18: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'sys_nice' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 19: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'net_admin' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 20: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'sys_nice' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 21: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'net_admin' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 22: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'sys_nice' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 23: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'net_admin' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 24: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'net_admin' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

### 🔵 Bulgu 25: [MEDIUM] APPARMOR_BLOCK
- **Açıklama:** AppArmor 'sys_nice' işlemini engelledi.
- **MITRE ATT&CK:** `T1068 — Exploitation for Privilege Escalation`
- **Öneri:** Kaynağı araştırın ve gerekirse ilgili servisi yeniden başlatın.

## 3. MITRE ATT&CK Eşleştirmesi

| Taktik | Teknik | Açıklama |
|---|---|---|
| İlk Erişim | `T1110.001 — Brute Force: Password Guessing` | SSH_BRUTE_FORCE |
| Yetki Yükseltme | `T1548.003 — Sudo and Sudo Caching` | PRIVILEGE_ESCALATION_SUCCESS |
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