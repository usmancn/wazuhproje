# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 02:14:25  
**LLM:** OLLAMA  
**Toplam Bulgu:** 632 (597 KRİTİK, 0 YÜKSEK, 35 ORTA)  

---

### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]

#### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 595 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw delete 22` (Kabuk güvenceleri kaldırın)

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo su - osman -c "rm /"` (Sudo komutuna erişim kaldırın)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi.
- **Çözüm Komutu:** `sudo ufw delete 22` (Kabuk güvenceleri kaldırın)
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi.
- **Çözüm Komutu:** `sudo ufw delete 22` (Kabuk güvenceleri kaldırın)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status | grep nice` (AppArmor'daki 'nice' komutuna erişim verin)
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status | grep memory` (AppArmor'daki 'memory' komutuna erişim verin)
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status | grep net_admin` (AppArmor'daki 'net_admin' komutuna erişim verin)

### 📜 syslog: Tehdit tespit edilmedi ---

### 🖥️ kern.log Analizi
#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status | grep nice` (AppArmor'daki 'nice' komutuna erişim verin)
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status | grep memory` (AppArmor'daki 'memory' komutuna erişim verin)
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status | grep net_admin` (AppArmor'daki 'net_admin' komutuna erişim verin)

### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
