# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 01:34:15  
**LLM:** OLLAMA  
**Toplam Bulgu:** 564 (533 KRİTİK, 0 YÜKSEK, 31 ORTA)  

---

### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]

#### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo fail2ban client restart`

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo usermod -aG sudo Osman` ve ardından `sudo newgrp sudo`

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapıyor. 192.168.64.1, 1.1.1.1 ve 1.1.1.2 adreslerinin tümünde fail2ban reset komutu uygulaması ile resetlenmelidir.
- **Çözüm Komutu:** `sudo fail2ban client stop` ve ardından `sudo fail2ban client start`

### 🖥️ [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser --add-profile -f /etc/apparmor.d/100-mysqld`

### 🖥️ [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser --add-profile -f /etc/apparmor.d/100-mysqld`

### 🖥️ [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_parser --add-profile -f /etc/apparmor.d/100-mysqld`

### 📜 [SYLOG] Tehdit tespit edilmedi
- Bu dosyada güvenlik tehditi tespit edilmadi.

### 🖥️ [KERN LOG] Tehdit tespit edildi
- **Ne Oldu:** Sisteminin bir parçası ile alakalı bir sorunun olduğu görüldü.
- **Çözüm Komutu:** `sudo kernel log -1` (Bunu kontrol etmek için)

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
