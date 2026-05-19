# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:51:01  
**LLM:** OLLAMA  
**Toplam Bulgu:** 464 (437 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE: 192.168.64.1 adresinden 435 başarısız SSH giriş denemesi.
- **Ne Oldu:** 192.168.64.1 adresinden kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install nmap`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Ne Oldu:** 'osman' kullanıcısı root yetkisine ulaştı ve /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json gibi bir komuttan çalıştırılırken bu situación gerçekleşti.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install ossec`
 
### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi.
- **Ne Oldu:** 1.1.1.1 adresinden kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install nmap`
 
### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi.
- **Ne Oldu:** 1.1.1.2 adresinden kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install nmap`
 
### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi.
- **Ne Oldu:** 1.1.1.2 adresinden kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install nmap`

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programını working olarak bloke etti.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install apparmor-utils`

### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmesini engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programını working olarak bloke etti.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install apparmor-utils`

### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programını working olarak bloke etti.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get install apparmor-utils`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
