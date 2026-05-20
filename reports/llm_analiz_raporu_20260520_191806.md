# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 19:18:06  
**LLM:** GEMINI  
**Toplam Bulgu:** 1466 (1416 KRİTİK, 11 YÜKSEK, 39 ORTA)  

---

# 🤖 Yapay Zeka (Kural Tabanlı) Güvenlik Analiz Raporu

**Tarih:** 2026-05-20 19:18
**Dağılım:** 1416 KRİTİK · 11 YÜKSEK · 39 ORTA

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne oldu:** 192.168.64.1 adresinden 1414 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Risk:** Biri root (yönetici) yetkisi almaya çalıştı veya aldı.
- **Yapılacak:** /etc/sudoers dosyasını kontrol et, şüpheli hesabı kilitle.

### 🟡 [HIGH] SSH_BRUTE_FORCE
- **Ne oldu:** 10.0.0.99 adresinden 2 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🟡 [HIGH] SSH_BRUTE_FORCE
- **Ne oldu:** 10.0.0.88 adresinden 2 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🟡 [HIGH] SSH_BRUTE_FORCE
- **Ne oldu:** 10.0.0.53 adresinden 2 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🟡 [HIGH] SSH_BRUTE_FORCE
- **Ne oldu:** 10.0.0.172 adresinden 5 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔵 [MEDIUM] SSH_BRUTE_FORCE
- **Ne oldu:** 10.0.0.122 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔵 [MEDIUM] SSH_BRUTE_FORCE
- **Ne oldu:** 10.0.0.91 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔵 [MEDIUM] SSH_BRUTE_FORCE
- **Ne oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔵 [MEDIUM] SSH_BRUTE_FORCE
- **Ne oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔵 [MEDIUM] SSH_BRUTE_FORCE
- **Ne oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

## 📜 syslog Analizi

Bu dosyada önemli bir tehdit tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.
