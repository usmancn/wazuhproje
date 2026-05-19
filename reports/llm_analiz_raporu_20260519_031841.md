# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:19:09  
**LLM:** OLLAMA  
**Toplam Bulgu:** 384 (357 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 CRITICAL SSH_BRUTE_FORCE: 192.168.64.1 adresinden 355 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 192.168.64.1 addressinden 355'ten fazla başarısız SSH giriş denemesi gerçekleşti, bu IP sistemi için kaba kuvvet saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config` ve `sudo service ssh restart`

### 🔴 CRITICAL PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisini aldığında sistemin güvenlik riski arttı.
- **Çözüm Komutu:** `sudo whoami` ve `sudo id -u`

### 🔴 CRITICAL PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisini aldığında sistemin güvenlik riski arttı.
- **Çözüm Komutu:** `sudo whoami` ve `sudo id -u`

### 🔴 MEDIUM SSH_BRUTE_FORCE: 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.1' addressinden tek bir başarısız SSH giriş denemesi gerçekleşti, bu IP sistemi için kaba kuvvet saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config` ve `sudo service ssh restart`

### 🔴 MEDIUM SSH_BRUTE_FORCE: 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.2' addressinden tek bir başarısız SSH giriş denemesi gerçekleşti, bu IP sistemi için kaba kuvvet saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config` ve `sudo service ssh restart`

### 🔴 MEDIUM SSH_BRUTE_FORCE: 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Ne Oldu:** 1.1.1.2 addressinden tek bir başarısız SSH giriş denemesi gerçekleşti, bu IP sistemi için kaba kuvvet saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config` ve `sudo service ssh restart`

## 📜 syslog Analizi

### 🔴 APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Bu dosyada güvenlik tehditi tespit edilmedi.**

### 🔴 APPARMOR_BLOCK: AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmesini engelledi.
- **Bu dosyada seguridad tehditi tespit edilmedi.**

...ve devam edebilirsiniz.

## 🖥️ kern.log Analizi

### 🔴 APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Bu dosyada güvenlik tehditi tespit edi.**
- **Çözüm Komutu:** `sudo apparmor_parser -f /etc/apparmor.d/docker`

...ve devam edebilirsiniz.