# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 17:42:53  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1419 (1382 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 1380 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalışırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo apt update && sudo apt upgrade -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw reject ssh`
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw reject ssh`
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw reject ssh`

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apt install apparmor-profiles`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apt install apparmor-profiles`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apt install apparmor-profiles`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
