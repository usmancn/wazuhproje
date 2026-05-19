# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:54:29  
**LLM:** OLLAMA  
**Toplam Bulgu:** 480 (453 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 451 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install fail2ban` (fail2ban kurulumu ve yapılandırılması)

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo apt-get install fail2ban` (fail2ban kurulumu ve yapılandırılması)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw ban ssh-brute` (Ubuntu Firewall kuruluşu (UFW) ile SSH brute force saldırıları engellenmesi)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw ban ssh-brute` (Ubuntu Firewall kuruluşu (UFW) ile SSH brute force saldırıları engellenmesi)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw ban ssh-brute` (Ubuntu Firewall kuruluşu (UFW) ile SSH brute force saldırıları engellenmesi)

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apt-get install apparmor-utils` (AppArmor utilities kurulumu)

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor seguridad duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apt-get install apparmor-utils` (AppArmor utilities kurulumu)

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apt-get install apparmor-utils` (AppArmor utilities kurulumu)

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
