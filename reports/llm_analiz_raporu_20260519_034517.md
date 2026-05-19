# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:45:33  
**LLM:** OLLAMA  
**Toplam Bulgu:** 416 (389 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 387 başarısız SSH giriş denemesi.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y`

### 🔴 [CRITICAL/HIGH/MEDIUM] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo usermod -aG sudo Osman`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y`

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_parse -f /etc/apparmour.d/* 2>&1 | grep -v "ERROR" && sudo update-apparmour`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parse -f /etc/apparmour.d/* 2>&1 | grep -v "ERROR" && sudo update-apparmour`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_parse -f /etc/apparmour.d/* 2>&1 | grep -v "ERROR" && sudo update-apparmour`

## 📌

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
