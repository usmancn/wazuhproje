# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 03:49:15  
**LLM:** OLLAMA  
**Toplam Bulgu:** 448 (421 KRİTİK, 0 YÜKSEK, 27 ORTA)  

---

### 📤 auth.log Analizi

- **Ne Oldu:** Sistemin SSH Bruteforce saldırısına maruz kaldığından emin estamos. Saldırıya maruz kalan IP adresler 192.168.64.1, 1.1.1.1 ve 1.1.1.2'dir.

- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean -y`

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS

- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Bu durum sistemin güvenlik için risk oluşturuyor.

- **Çözüm Komutu:** `sudo usermod -aG sudo Osman`

### 🔴 [CRITICAL] SSH_BRUTE_FORCE

- **Ne Oldu:** 192.168.64.1 adresinden 419 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE

- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean -y`

### 🔴 [MEDIUM] SSH_BRUTE_FORCE

- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.

- **Çözüm Komutu:** `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean -y`

### 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK

- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.

- **Çözüm Komutu:** `sudo systemctl status apparmor`
- **Alternatif Çözüm:** `sudo apparmorctl status`

### 🔴 [MEDIUM] APPARMOR_BLOCK

- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.

- **Çözüm Komutu:** `sudo systemctl status apparmor`
- **Alternatif Çözüm:** `sudo apparmorctl status`

### 🔴 [MEDIUM] APPARMOR_BLOCK

- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.

- **Çözüm Komutu:** `sudo systemctl status apparmor`
- **Alternatif Çözüm:** `sudo apparmorctl status`

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
