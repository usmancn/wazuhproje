# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:17:47  
**LLM:** OLLAMA  
**Toplam Bulgu:** 384 (357 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

### 📤 auth.log Analizi

#### 🔴 [CRITICAL] SSH_BRUTE_FORCE: 192.168.64.1 adresinden 355 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Ne Oldu:** 192.168.64.1 adresinden 355 kez başarısız SSH giriş denemesi yapılıyor, bu IP sistemi hakkında kuvvetli bir saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Ubuntu Firewall Manager (UFW) ile SSH girişlerini engeller)

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json

- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkini aldı ve sistemin bir portionunu görseldiği komuttur.
- **Çözüm Komutu:** `sudo su - osman -c "rm /var/ossec/logs/alerts/alerts.json"` (root yetkisine reverted olunduktan sonra dosyanın silinmesi)

#### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json

- **Ne Oldu:** 'osman' kullanıcısı sudo komutyla aynı zamanda root (yönetici) yetkini aldı ve sistemin bir portionunu görseldiği komuttur.
- **Çözüm Komutu:** `sudo su - osman -c "rm /var/ossec/logs/alerts/alerts.json"` (root yetkisine reverted olunduktan sonra dosyanın silinmesi)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Ne Oldu:** 1.1.1.1 adresinden bir kez başarısız SSH giriş denemesi yapılıyor, bu IP sistemi hakkında kuvvetli bir saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Ubuntu Firewall Manager (UFW) ile SSH girişlerini engeller)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Ne Oldu:** 1.1.1.2 адресinden bir kez başarısız SSH giriş denemesi yapılıyor, bu IP sistemi hakkında kuvvetli bir saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Ubuntu Firewall Manager (UFW) ile SSH girişlerini engeller)

#### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Ne Oldu:** 1.1.1.2 адресinden bir kez başarısız SSH giriş denemesi yapılıyor, bu IP sistemi hakkında kuvvetli bir saldırıya maruz kalıyor.
- **Çözüm Komutu:** `sudo ufw deny ssh` (Ubuntu Firewall Manager (UFW) ile SSH girişlerini engeller)

### 📜 syslog Analizi

#### Bu dosyanın içerisinde هیچ tehdit bulunmuyor.

### 🖥️ kern.log Analizi

#### 🔴 [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.

- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi, bu program sistemin ömrünü uzatabiliyor.
- **Çözüm Komutu:** `sudo apparmor restore` (AppArmor güvenlik duvarı reinstatede)