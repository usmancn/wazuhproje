# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 01:48:32  
**LLM:** OLLAMA  
**Toplam Bulgu:** 582 (549 KRİTİK, 0 YÜKSEK, 33 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 547 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean -y`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo su - user` veya `sudo -i`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw reset && sudo ufw allow ssh` (Ubuntu Firewall Manager)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw reset && sudo ufw allow ssh` (Ubuntu Firewall Manager)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw reset && sudo ufw allow ssh` (Ubuntu Firewall Manager)

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi. (Toplam 9 kez görüldü)
- **Çözüm Komutu:** `sudo apparmor-status && sudo update-rc.d apparmor defaults` veya `sudo update-rc.d apparmor start`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi. (Toplam 13 kez görüldü)
- **Çözüm Komutu:** `sudo apparmor-status && sudo update-rc.d apparmor defaults` veya `sudo update-rc.d apparmor start`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi. (Toplam 8 kez görüldü)
- **Çözüm Komutu:** `sudo apparmor-status && sudo update-rc.d apparmor defaults` veya `sudo update-rc.d apparmor start`

## ❗️ Not: Her bir komutun başlangıcında `sudo` ifadesi gerekebilir. Bu, root yetkisi olmadan komutu çalıştırmayı içerir.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
