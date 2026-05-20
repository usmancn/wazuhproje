# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 18:13:23  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1419 (1382 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

### 📤 auth.log Analizi

#### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 1380 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo pam authreq --disable` (Bu komut, pam_authreq service'in brute force saldırılarını engeller.)

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo usermod -aG sudo Osman` (Bu komut, 'osman' kullanıcısının sudo grupına eklendiğini ve root yetkisine erişemediğini sağlar.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Bu komut, SSH'a karşı firewall kurulumunu sağlar.)
- **Çözüm Komutu:** `sudo ufw deny ssh` 1.1.1.2' adresinden da same şekilde yapın.

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Bu komut, SSH'a karşı firewall kurulumunu sağlar.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Bu komut, SSH'a karşı firewall kurulumunu sağlar.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

### 🖥️ kern.log Analizi

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

### 📜 syslog Analizi

(Aynı şekilde her bulgu için ### ile başlayan blok oluştur. Kısaltma yapma!)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

### 📤 auth.log Analizi

#### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 1380 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo pam authreq --disable` (Bu komut, pam_authreq service'in brute force saldırılarını engeller.)

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo usermod -aG sudo Osman` (Bu komut, 'osman' kullanıcısının sudo grupına eklendiğini ve root yetkisine erişemediğini sağlar.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Bu komut, SSH'a karşı firewall kurulumunu sağlar.)
- **Çözüm Komutu:** `sudo ufw deny ssh` 1.1.1.2' adresinden da same şekilde yapın.

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Bu komut, SSH'a karşı firewall kurulumunu sağlar.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Bu komut, SSH'a karşı firewall kurulumunu sağlar.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

### 🖥️ kern.log Analizi

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor seguridad firewallının 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmour.d/*` (Bu komut, AppArmor security firewallını yenilemektedir.)

#### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
