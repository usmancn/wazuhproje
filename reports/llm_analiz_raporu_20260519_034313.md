# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:43:31  
**LLM:** OLLAMA  
**Toplam Bulgu:** 416 (389 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 387 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ssh-keygen -f /root/.ssh/known_hosts -R 192.168.64.1`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo fuser -c -m /bin/sudo` (Bu komut ilesudo komutunun chạy durumunu kontrol edebilirsiniz. Eğer comando çalışıyorsa, bu bir güvenlik riski oluşturmuyor ama değişiklikler yapmanızı önerir.)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ssh-keygen -f /root/.ssh/known_hosts -R 1.1.1.1`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ssh-keygen -f /root/.ssh/known_hosts -R 1.1.1.2`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ssh-keygen -f /root/.ssh/known_hosts -R 1.1.1.2`

## 📜 syslog Analizi

### ✅ Bu dosyada güvenlik tehditi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_ptrace -e /etc/apparmor.d/app-armored`
 
### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_ptrace -e /etc/apparmor.d/app-armored`

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor seguridad duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmor_ptrace -e /etc/apparmor.d/app-armored`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
