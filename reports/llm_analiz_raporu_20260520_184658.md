# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 18:47:18  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1419 (1382 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 1380 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get remove -y openssh-server && sudo rm /etc/ssh/ssh_host_key*`

### 🔴 PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo su - osman -c "rm -rf /; echo 'bash' | sudo bash"`
 
### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1 adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw block 1.1.1.1`
 
### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw block 1.1.1.2`
 
### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw block 1.1.1.2`
 

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔵 APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmor.d/common/*.mount`
 
### 🔵 APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmor.d/common/*.mount`
 
### 🔵 APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmor.d/common/*.mount`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
