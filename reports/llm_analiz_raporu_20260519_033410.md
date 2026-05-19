# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:34:42  
**LLM:** OLLAMA  
**Toplam Bulgu:** 416 (389 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

### 🔴 auth.log Analizi

- **Ne Oldu:** Sisteme kaba kuvvet saldırısı happening, 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. working command: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo authcleaner` 
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. working command: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo authcleaner` 
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı happening, 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. working command: 
- **Çözüm Komutu:** `ssh -o StrictHostKeyChecking=no`
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı happening, 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. working command: 
- **Çözüm Komutu:** `ssh -o StrictHostKeyChecking=no`
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı happening, 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. working command: 
- **Çözüm Komutu:** `ssh -o StrictHostKeyChecking=no`

### 📜 syslog Analizi

✅ Bu dosyada güvenlik tehditi tespit edilmedi.

### 🖥️ kern.log Analizi

- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/sys/vm/overcommitteds`
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmesini engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/pressure/memory`
- **Ne Oldu:** AppArmor güvenlik_WRAPPERı 'sys_nice' programının çalışmasını engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/sys/vm/overcommitteds`
- **Ne Oldu:** AppArmor güvenlik_wrapperı '/proc/pressure/memory' programının çalışmesini engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/pressure/memory`
- **Ne Oldu:** AppArmor güvenlik_wrapperı 'sys_nice' programının çalışmasını engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/sys/vm/overcommitteds`
- **Ne Oldu:** AppArmor güvenlik_wrapperı '/proc/pressure/memory' programının çalışmesini engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/pressure/memory`
- **Ne Oldu:** AppArmor güvenlik_wrapperı 'sys_nice' programının çalışmasını engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/sys/vm/overcommitteds`
- **Ne Oldu:** AppArmor güvenlik_wrapperı '/proc/pressure/memory' programının çalışmasını engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/pressure/memory`
- **Ne Oldu:** AppArmor güvenlik_wrapperı 'net_admin' programının çalışmesini engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive net_admin`
- **Ne Oldu:** AppArmor güvenlik_wrapperı '/proc/pressure/memory' programının çalışmasını engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/pressure/memory`
- **Ne Oldu:** AppArmor sécurité_wrapperı 'sys_nice' programının çalışmesini engelledi. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=noninteractive /proc/sys/vm/overcommitteds`
- **Ne Oldu:** AppArmor sécurité_wrapperı '/proc/pressure/memory' programını çalıştırmaz. working command: 
- **Çözüm Komutu:** `sudo setcap --apparmor=dual apparmor `/usr/sbin/apparmor_parser`