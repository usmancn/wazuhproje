# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 20:06:48  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1484 (1434 KRİTİK, 11 YÜKSEK, 39 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 1422 kez başarısız SSH giriş denemesi. Ayrıca 10 kez ve 5 kez.repeat eden IP'ler sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo apt-get remove fail2ban` (fail2ban ile brute force saldırıları önlemek için)

### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 2 kez başarısız SSH giriş denemesi. Bu IP'ler sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw ban 10.0.0.99` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 2 kez başarısız SSH giriş denemesi. Bu IP'ler sisteme kaba kuvvet saldırı yapıyor.
- **Çözüm Komutu:** `sudo ufw ban 10.0.0.88` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 2 kez başarısız SSH giriş denemesi. Bu IP'ler sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 10.0.0.53` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🟡 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 5 kez başarısız SSH giriş denemesi. Bu IP'ler sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 10.0.0.172` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🔵 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 1 kez başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 10.0.0.122` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🔵 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 1 kez başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 10.0.0.91` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🔵 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 1 kez başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 1.1.1.1` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🔵 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 1 kez başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 1.1.1.2` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

### 🔵 SSH_BRUTE_FORCE
- **Ne Oldu:** Sisteme kaba kuvvet saldırısı haciendo 1 kez başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırıyor.
- **Çözüm Komutu:** `sudo ufw ban 1.1.1.2` (sistemin şifreli SSH bağlantısına karşı koruma önlemleri alın)

## 🖥️ syslog Analizi
### 🔵 APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorprof -e` (AppArmor profilini açıklamak için)

### 🔵 APPARMOR_BLOCK
- **Ne Oldu:** AppArmor sécurité duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorprof -e` (AppArmor profilini açıklamak için)

### 🔵 APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorprof -e` (AppArmor profilini açıklamak için)

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
