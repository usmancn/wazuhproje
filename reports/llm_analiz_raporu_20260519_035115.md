# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:51:36  
**LLM:** OLLAMA  
**Toplam Bulgu:** 480 (453 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]

- **Ne Oldu:** 192.168.64.1 adresinden 451 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get upgrade -y`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo usermod -aG sudo osman`
 
### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.1
- **Ne Oldu:** '1.1.1.1' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw default deny incoming; sudo ufw allow ssh`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2
- **Ne Oldu:** '1.1.1.2' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw default deny incoming; sudo ufw allow ssh`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2
- **Ne Oldu:** '1.1.1.2' adresinden 1 başarısız SSH giriş denemesi, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw default deny incoming; sudo ufw allow ssh`

## 📜 syslog Analizi
### 🔴 [Tehdit tespit Edilmedi]
- **Ne Oldu:** Sicherlik tehdidi tespit edilmedi.
- **Çözüm Komutu:** ( none )

## 🖥️ kern.log Analizi
### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser /etc/apparmor.d/*.mount`

### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser /etc/apparmor.d/*.mount`

### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'net_admin' programının çalışmesini engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser /etc/apparmor.d/*.mount`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
