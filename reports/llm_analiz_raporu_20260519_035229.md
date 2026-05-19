# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:52:50  
**LLM:** OLLAMA  
**Toplam Bulgu:** 480 (453 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

### 📤 auth.log Analizi
#### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]
- **Ne Oldu:** 192.168.64.1 adresinden 451 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo sed -i 's/MaxLoginAttempts=100/MaxLoginAttempts=200/' /etc/ssh/sshd_config`

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo usermod -aG sudo Osman`

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh`

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh`

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı gerekiyor.
- **Ne Oldu:** 1.1.1.2 adresinden 1 başariais SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh`

### 📜 syslog Analizi
✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

### 🖥️ kern.log Analizi
#### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_status`

#### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_status`

#### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programinin çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_status`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
