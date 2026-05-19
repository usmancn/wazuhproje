# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:12:36  
**LLM:** GEMINI  
**Toplam Bulgu:** 368 (341 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

# 🤖 Yapay Zeka (Kural Tabanlı) Güvenlik Analiz Raporu

**Tarih:** 2026-05-19 03:12
**Dağılım:** 341 KRİTİK · 0 YÜKSEK · 27 ORTA

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne oldu:** 192.168.64.1 adresinden 339 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Risk:** Saldırgan parolaları deneyerek sisteme girmeye çalışıyor.
- **Yapılacak:** Saldıran IP'yi UFW ile engelle, Fail2Ban kur.

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Risk:** Biri root (yönetici) yetkisi almaya çalıştı veya aldı.
- **Yapılacak:** /etc/sudoers dosyasını kontrol et, şüpheli hesabı kilitle.

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Risk:** Biri root (yönetici) yetkisi almaya çalıştı veya aldı.
- **Yapılacak:** /etc/sudoers dosyasını kontrol et, şüpheli hesabı kilitle.

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
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

### 🔵 [MEDIUM] APPARMOR_BLOCK
- **Ne oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Yapılacak:** Kaynağı araştır, gerekirse servisi yeniden başlat.

## 🛡️ Acil Müdahale Adımları

```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGANI_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```