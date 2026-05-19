# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:38:03  
**LLM:** OLLAMA  
**Toplam Bulgu:** 416 (389 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## auth.log Analizi
### [CRITICAL] SSH_BRUTE_FORCE
- **Olay:** 192.168.64.1 adresinden 387 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 192.168.64.1 adresinden yapılan kaba kuvvet saldırısını önlemek için SSH brute force önlemleri alındı.
- **Çözüm Komutu:** `/usr/sbin/iptables -A INPUT -p tcp --dport ssh -j DROP`

### [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Olay:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Ne Oldu:** Sudo komutanı ile root yetkisi alımı debido bir hata olarak gerçekleşti.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade`

### [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Olay:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Ne Oldu:** Sudo komutanı ile root yetkisi alımı debido bir hata olarak gerçekleşti.
- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade`

### [MEDIUM] SSH_BRUTE_FORCE
- **Olay:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.1 adresinden yapılan kaba kuvvet saldırısını önlemek için SSH brute force önlemleri alındı.
- **Çözüm Komutu:** `/usr/sbin/iptables -A INPUT -p tcp --dport ssh -j DROP`

### [MEDIUM] SSH_BRUTE_FORCE
- **Olay:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.2 adresinden yapılan kaba kuvvet saldırısını önlemek için SSH brute force önlemleri alındı.
- **Çözüm Komutu:** `/usr/sbin/iptables -A INPUT -p tcp --dport ssh -j DROP`

### [MEDIUM] SSH_BRUTE_FORCE
- **Olay:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.2 adresinden yapılan kaba kuvvet saldırısını önlemek için SSH brute force önlemleri alındı.
- **Çözüm Komutu:** `/usr/sbin/iptables -A INPUT -p tcp --dport ssh -j DROP`

## syslog Analizi
✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## kern.log Analizi
### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programının çalışmasını engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor seguridad duvarı ile 'net_admin' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor seguridad duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programının çalışmasını engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor seguridad duvarı 'sys_nice' programının çalışesini engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programının çalışmasını engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'net_admin' programının çalışesini engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor seguridad duvarı ile 'sys_nice' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programinin çalışmasını engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programinin çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programinin çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor sécurité duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programının çalışmasını engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor seguridad duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programinin çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor seguridad duvarı 'sys_nice' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'sys_nice' programının çalışmesini engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

### [MEDIUM] APPARMOR_BLOCK
- **Olay:** AppArmor seguridad duvarı 'net_admin' programının çalışmasını engelledi.
- **Ne Oldu:** AppArmor güvenlik duvarı ile 'net_admin' programının çalışmasını engellendi.
- **Çözüm Komutu:** `apparmoradm policy remove apparmor`

Lütfen yukarıdaki şablonu eksiksiz doldurarak yanıt ver.