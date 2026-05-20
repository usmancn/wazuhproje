# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 18:15:31  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1419 (1382 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapıyor. SSH giriş denemesi başarısız oluyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo systemctl stop systemd-logind.service`
`sudo usermod -aG disallow osman`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapıyor. SSH giriş denemesi başarısız oluyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config`
`sudo service sshd restart`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapıyor. SSH giriş denemesi başarısız oluyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config`
`sudo service sshd restart`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapıyor. SSH giriş denemesi başarısız oluyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config`
`sudo service sshd restart`

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_status`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_status`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmesini engelledi.
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
