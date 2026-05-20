# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 14:59:14  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1082 (1045 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** Bir kaba kuvvet saldırısı SSH girişi yapılıyor. Adres `192.168.64.1` dan 1043 kez başarısız SSH giriş denemesi gerçekleştirildi.
- **Çözüm Komutu:** `sshd_config` dosyasında yapılandırma değişiklikleri yaparak veya `fail2ban` veya `denyhosts` gibi saldırı engelleyici araçlarını aktive ederek tehditli IP adreslerden SSH erişimi bloke edebiliriz.

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla yönetici (root) yetkisine erişti ve `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` çalıştırma komutu ile çalışmaya başladı.
- **Çözüm Komutu:** Öncelikle kullanıcı hesaplarını ve parolasını kontrol ederek parola sertifikalarını yenileyin, sonra AppArmor güvenlik duvarını ve `sudo` komutunu etkinleştirebiliriz.

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** Diğer tehditli IP adreslerden de başarısız SSH giriş denemeleri gerçekleştirildi.
- **Çözüm Komutu:** `fail2ban` veya `denyhosts` gibi saldırı engelleyici araçlarını aktive ederek tehditli IP adreslerden SSH erişimi bloke edebiliriz.

## 📜 syslog Analizi (Tehdit tespit edilmedi)
### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice', '/proc/pressure/memory' ve 'net_admin' programlarının çalışmasını engelledi.
- **Çözüm Komutu:** AppArmor yapılandırmasını kontrol ederek engellenen programlara erişim izni verebiliriz.

## 🖥️ kern.log Analizi
### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice', '/proc/pressure/memory' ve 'net_admin' programlarının çalışmasını engelledi.
- **Çözüm Komutu:** AppArmor yapılandırmasını kontrol ederek engellenen programlara erişim izni verebiliriz.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
