# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 14:50:28  
**LLM:** OLLAMA  
**Toplam Bulgu:** 922 (885 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE: 192.168.64.1 adresinden 883 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor. (Toplam 883 kez görüldü)
- **Ne Oldu:** Kaba kuvvet saldırı (SSH_BRUTE_FORCE) tespit edildi. 192.168.64.1 adresinden bir IP, sisteminizde yinelemez şekilde SSH giriş denemesi yapılıyor ve toplamda 883 kez görüldü.
- **Çözüm Komutu:** Bu durum için saldırı engellemek için, sisteminizde yerleştirdiğiniz SSH servisinin güvenlik açıklama değerlerini geliştirmenizi öneririm. Daha sonra deneme saldırılarını engellemek için [fail2ban](https://www.fail2ban.org/) veya [denyhosts](https://www.denyhosts.org/) gibi araçları kullanabilirsiniz.

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Çalıştırılan komut: /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json (Toplam 2 kez görüldü)
- **Ne Oldu:** Kullanıcı 'osman' root yetkisine yükseldi ve /var/ossec/logs/alerts/alerts.json dosyasını okumak için kullandığı komutu görmüşüz.
- **Çözüm Komutu:** Öncelikle, korunan kullanıcıların root yetkisine yükselmeyi engellemek için /etc/sudoers dosyasında gereksiz komutlara izin vermeme olanağı sağlamayı öneririm. Sonra, sisteminizde kullanıcı hesaplarının parolasını yenilemek ve korunan kullanıcıların yetkilerini kontrol ederek bu durumu çözülebilir hale getirmenizi tavsiye ederim.

### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.1' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor. (Toplam 1 kez görüldü)
- **Ne Oldu:** Kaba kuvvet saldırı tespit edildi. 1.1.1.1 adresinden bir IP sisteminizde SSH giriş denedik ve başarısız olup tekrardan yinelemeye devam etti.
- **Çözüm Komutu:** Gelecekte bu durumu önlemek için, saldırı engellemek için [fail2ban](https://www.fail2ban.org/) veya [denyhosts](https://www.denyhosts.org/) gibi araçları kullanabilirsiniz.

### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2' adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor. (Toplam 1 kez görüldü)
- **Ne Oldu:** Kaba kuvvet saldırı tespit edildi. 1.1.1.2 adresinden bir IP sisteminizde SSH giriş denedik ve başarısız olup tekrardan yinelemeye devam etti.
- **Çözüm Komutu:** Gelecekte bu durumu önlemek için, saldırı engellemek için [fail2ban](https://www.fail2ban.org/) veya [denyhosts](https://www.denyhosts.org/) gibi araçları kullanabilirsiniz.

### 🔴 [MEDIUM] SSH_BRUTE_FORCE: 1.1.1.2 adresinden 1 başarısız SSH giriş denemesi. Bu IP sisteme kaba kuvvet saldırısı yapıyor. (Toplam 1 kez görüldü)
- **Ne Oldu:** Kaba kuvvet saldırı tespit edildi. 1.1.1.2 adresinden bir IP sisteminizde SSH giriş denedik ve başarısız olup tekrardan yinelemeye devam etti.
- **Çözüm Komutu:** Gelecekte bu durumu önlemek için, saldırı engellemek için [fail2ban](https://www.fail2ban.org/) veya [denyhosts](https://www.denyhosts.org/) gibi araçları kullanabilirsiniz.

--- syslog: Tehdit tespit edilmedi ---

--- kern.log (3 benzersiz bulgu türü) ---
  [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi. (Toplam 11 kez görüldü)
- **Ne Oldu:** Kernel sisteminde, AppArmor güvenlik duvarı 'sys_nice' komutunu bloke etti.
- **Çözüm Komutu:** Bu durumun sebebi bilinmeyen bir uygulama olabilir ve saldırı tutulmadığı için yeni bir araç çalıştırmayı öneririm.

  [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi. (Toplam 13 kez görüldü)
- **Ne Oldu:** Kernel sisteminde, AppArmor güvenlik duvarı '/proc/pressure/memory' komutunu bloke etti.
- **Çözüm Komutu:** Bu durumun sebebi bilinmeyen bir uygulama olabilir ve saldırı tutulmadığı için yeni bir araç çalıştırmayı öneririm.

  [MEDIUM] APPARMOR_BLOCK: AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi. (Toplam 10 kez görüldü)
- **Ne Oldu:** Kernel sisteminde, AppArmor güvenlik duvarı 'net_admin' komutunu bloke etti.
- **Çözüm Komutu:** Bu durumun sebebi bilinmeyen bir uygulama olabilir ve saldırı tutulmadığı için yeni bir araç çalıştırmayı öneririm.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
