# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 18:39:58  
**LLM:** OLLAMA  
**Toplam Bulgu:** 1419 (1382 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden 1380 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw delete 22 && sudo ufw allow ssh` (yinegui, bu komutlar sistemin koruma duvarını güncellemeli ve ssh girişlerini açmalısınız)

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json
- **Çözüm Komutu:** `sudo su - osman -c "rm -rf /" && sudo su - osman -c "ls -l /"` (Bu komutlar sistemin root yetkilisini kaldıracaktır. Bu komutları çalıştırmak istendiğinde, root yetkisi ile çalıştırılmayan bir komuttan önce "su" komutu ile login should yapın.)

### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw delete 22 && sudo ufw allow ssh` (yinegui, bu komutlar sistemin koruma duvarını güncellemeli ve ssh girişlerini açmalısınız)
 
### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw delete 22 && sudo ufw allow ssh` (yinegui, bu komutlar sistemin koruma duvarını güncellemeli ve ssh girişlerini açmalısınız)
 
### 🔴 [MEDIUM] SSH_BRUTE_FORCE
- **Ne Oldu:** 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** `sudo ufw delete 22 && sudo ufw allow ssh` (yinegui, bu komutlar sistemin koruma duvarını güncellemeli ve ssh girişlerini açmalısınız)

## 📜 syslog Analizi

✅ Bu dosyada güvenlik tehditi tespit edilmedi.

## 🖥️ kern.log Analizi

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status && sudo apparmorctl enforce all` (Bu komutlar AppArmor security firewallını active hale getirecektir)

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status && sudo apparmorctl enforce all` (Bu komutlar AppArmor security firewallını active hale getirecektir)

### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:** `sudo apparmorctl status && sudo apparmorctl enforce all` (Bu komutlar AppArmor security firewallını active hale getirecektir)

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
