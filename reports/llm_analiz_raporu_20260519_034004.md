# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:40:24  
**LLM:** OLLAMA  
**Toplam Bulgu:** 416 (389 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 387 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get upgrade -y`

### 🔴 [CRITICAL/HIGH/MEDIUM] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo fuser -km /bin/sudo` (Bu komut root kullanıcısının sudo komutunu kaldırarak yetkisini restore eder.)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get upgrade -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get upgrade -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get update; sudo apt-get upgrade -y`

## 📜 syslog Analizi

✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status` (Bu komut AppArmor.status komutunu kullanır ve sistemde active olan AppArmorprofiles'u gösterir.)

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status` (Bu komut AppArmor.status komutunu kullanır ve sistemde active olan AppArmorprofiles'u gösterir.)

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status` (Bu komut AppArmor.status komutunu kullanır ve sistemde active olan AppArmorprofiles'u gösterir.)