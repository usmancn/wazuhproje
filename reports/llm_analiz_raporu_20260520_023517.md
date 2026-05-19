# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 02:36:47  
**LLM:** OLLAMA  
**Toplam Bulgu:** 632 (597 KRİTİK, 0 YÜKSEK, 35 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** 192.168.64.1 adresinden bir kaba kuvvet saldırısı gerçekleşti. Toplam 595 defa başarısız SSH giriş denemesi yapıldı.
- **Çözüm Komutu:** Güvenlik sorununu ortadan kaldırmak için aşağıdaki iki adımı uygulayabilirsiniz:
  1. SSH'yi güvenlikli bir şekilde yapılandırma. Bu, `/etc/ssh/sshd_config` dosyasını açarak aşağıdaki değişiklikleri uygulamaktadır:
    ```
    # Change to password authentication
    PasswordAuthentication no

    # Use key-based authentication instead
    PubkeyAuthentication yes

    # Disable SSH Brute Force
    MaxAuthTries 6
    ```
  2. Gerekli değişiklikleri yapmadan önce, SSH'yi yeniden başlatmalısınız: `sudo systemctl restart ssh`
### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root yetkisi aldı. Çalıştırılan komut, `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` oldu. Bu tehdit, sistem yöneticisinin hesabına sahip bir kullanıcının root yetkisine ulaşmasıdır ve bu, çok yönlü olarak güvenlik risksini artırır.
- **Çözüm Komutu:** Öncelikle, `osman` kullanıcısına root yetkisini vermemelisiniz. Yeni bir kullanıcı oluşturun ve gereksiz hakları sınırlayın. Ayrıca, kendi sisteminizi güvenli bir şekilde yönetmek için `sudo` kullanımı için doğrulama zorlayarak güvenlik sorununu azaltabilirsiniz:
  1. `/etc/sudoers` dosyasına açın ve yeni bir kullanıcı ekleyerek kendi sisteminizi yönetmeyi izin verin:
    ```
    # User privilege specification
    root ALL=(ALL) ALL
    osman ALL=NOPASSWD: /usr/bin/tail
    ```
  2. Bu değişiklikleri gerçekleştirdikten sonra, sudo kullanımınızda doğrulama yapmak için aşağıdaki adımı uygulayabilirsiniz:
    ```
    # Change password for the user "osman"
    passwd osman

    # Set up sudo password for the user "osman"
    sudo visudo
    ```
### 🔴 [MEDIUM] SSH_BRUTE_FORCE (3 tekrar)
- **Ne Oldu:** Bir kaba kuvvet saldırısı gerçekleşti. Toplam 1 kez başarısız ve 2 kez başarılı SSH giriş denemesi yapıldı. Bu tehdit, çok sayıda farklı IP adresinden sadece birkaç kez başarılı olması nedeniyle daha az risk sağlar ama yine de güvenlik sorununu artırabilir.
- **Çözüm Komutu:** Aynı şekilde, `/etc/ssh/sshd_config` dosyasını açarak aşağıdaki değişiklikleri uygulamaktadır:
  1. SSH'yi güvenlikli bir şekilde yapılandırma:
    ```
    # Change to password authentication
    PasswordAuthentication no

    # Use key-based authentication instead
    PubkeyAuthentication yes

    # Disable SSH Brute Force
    MaxAuthTries 6
    ```
  2. Gerekli değişiklikleri yapmadan önce, SSH'yi yeniden başlatmalısınız: `sudo systemctl restart ssh`
## 📜 syslog Analizi (Tehdit tespit edilmedi)
syslog dosyasında tehdit tespit edilmedi.
## 🖥️ kern.log Analizi (3 benzersiz bulgu türü)
### 🔴 [MEDIUM] APPARMOR_BLOCK
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice', '/proc/pressure/memory' ve 'net_admin' programlarının çalışmasını engelledi. Bu tehdit, sisteminizde yerleştirilen AppArmor güvenlik duvarının doğru çalışmasını engelleyebilir ve bu, kod düzeyinde güvenlik sorununu artırabilir.
- **Çözüm Komutu:** AppArmor'un yerleştirilen profilleri incelemek için aşağıdaki komutu kullanabilirsiniz: `sudo apparmor_profile --list` Bu şekilde, güvenlik duvarınızın profillerini kontrol ederek ve eksiksiz yapılandırma düzeltmeleri yaparak AppArmor'un doğru çalışması sağlayabilirsiniz. Ayrıca, AppArmor'un yerleştirilmesini yeniden deneyebileceksiniz: `sudo apparmor_parser /etc/apparmor.d/*`

Not: Bu soruya cevap verme sürecinde, gerekli değişikliklerin AppArmor'unuzun yerleştirilmesini ve profillerini denetlemekle ilgili önemli bilgilerimiz yok. Bu nedenle AppArmor kullanımınızda karşılaştığınız sorunu ayrıntılı olarak gidermenizi öneririz veya bilgi sahibi bir sistem yöneticisinin yardımını istediğimiz zaman şirketten size yardımcı olabiliriz.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
