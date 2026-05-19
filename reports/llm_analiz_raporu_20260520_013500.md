# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 01:35:19  
**LLM:** OLLAMA  
**Toplam Bulgu:** 580 (549 KRİTİK, 0 YÜKSEK, 31 ORTA)  

---

### 📤 auth.log Analizi

#### 🔴 [CRITICAL/HIGH/MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 547 başarısız SSH giriş denemesi, sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo iptables -P INPUT DROP` (Bu komut ile sistemi kaba kuvvet saldırılarından korumaya yardımcı olur. Lakin bu komuttan önce sistemde bir rule olmalıdır.)

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo su - osman` veya `sudo adduser osman -s /bin/bash` (Bu komut ile sisteme eklenmek istenen kullanıcının adminyetkileri verilir. Lakin bu komuttan önce sistemde bir rule olmalıdır.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi, sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo iptables -P INPUT DROP` (Bu komut ile sistemi kaba kuvvet saldırılarından korumaya yardımcı olur.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi, sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo iptables -P INPUT DROP` (Bu komut ile sistemi kaba kuvvet saldırılarından korumaya yardımcı olur.)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi, sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo iptables -P INPUT DROP` (Bu komut ile sistemi kaba kuvvet saldırılarından korumaya yardımcı olur.)

### 📜 syslog Analizi

✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

### 🖥️ kern.log Analizi

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_status` (Bu komut ile sistemde AppArmor'nin durumunu kontrol edilebilir. Lakin bu komuttan önce sistemde bir rule olmalıdır.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_status` (Bu komut ile sistemde AppArmor'nin durumunu kontrol edilebilir. Lakin bu komuttan önce sistemde bir rule olmalıdır.)

#### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmesini engelledi.
- **Çözüm Komutu:** `sudo apparmor_status` (Bu komut ile sistemde AppArmor'nin durumunu kontrol edilebilir. Lakin bu komuttan önce sistemde bir rule olmalıdır.)

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
