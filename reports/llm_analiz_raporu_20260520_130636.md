# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 13:07:55  
**LLM:** OLLAMA  
**Toplam Bulgu:** 906 (869 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 [CRITICAL] SSH_BRUTE_FORCE:
- **Ne Oldu:** 192.168.64.1 adresinden 867 kez başarısız SSH giriş denemesi yapıldı, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** Syslog nasıl değiştirilebilir ve günlüklerin ayrıntılarını izlemeniz için kullanılabilir, ancak bu durumda önce IP adresinden saldırı denemelerini engellemek için bloklayabilirsiniz. Aşağıdaki gibi ufw kullanarak yapılabilir:
```
sudo ufw deny 192.168.64.1
```
Ayrıca, SSH'yi güvenlik açıklamalarına ayarlamanız da yararlı olabilir:
```
sudo nano /etc/ssh/sshd_config
```
Ardından, `PermitRootLogin no`, `PubkeyAuthentication yes`, ve `PasswordAuthentication no` satırlarını değiştirin. Sonra ssh daemonu yeniden başlatın:
```
sudo systemctl restart sshd
```
### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS:
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** Kullanıcıların root kullanımına izin vermedeniz gerekir, bu durumda AppArmor kullanarak çalıştırılan komutun engellişmesi ve yetkisini sınırlayarak sorunu çözebilirsiniz.
```
sudo systemctl start apparmor-profile-usernet-sshtunnel
sudo nano /etc/apparmor.d/usr.sbin.sshd
```
Ardından, gereksiz izinleri engelleyerek profile dosyasını düzenleyebilirsiniz:
```
profile usr.sbin.sshd {
  ...
  # deneysel
  /usr/bin/tail deny { name } /var/ossec/logs/alerts/alerts.json,
  ...
}
```
Sonra AppArmor profilleri yeniden başlatın:
```
sudo systemctl reload apparmor
```
### 🔴 [MEDIUM] SSH_BRUTE_FORCE:
- **Ne Oldu:** Başarısız SSH giriş denemeleri yapıldı, bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** Gerekli olursa, ufw ile IP adresinden saldırı denemelerini engelleyebilirsiniz (önceki gibi). Ayrıca, SSH'yi güvenlik açıklamalarına ayarlamanız da yararlı olabilir:
```
sudo nano /etc/ssh/sshd_config
```
Ardından, `MaxAuthTries` satırını değiştirerek maksimum giriş deneme sayısını sınırlayabilirsiniz. Örneğin:
```
MaxAuthTries 3
```
### Diğer SSH_BRUTE_FORCE bulguları için aynı çözüm yöntemini uygulayabilirsiniz.

## 📜 syslog Analizi (Tehdit tespit edilmedi)
- **Ne Oldu:** Tehdit tespit edilmedi.
- **Çözüm Komutu:** Bu durumda, gerekli değildir. Syslog şu anda kullanılmadığından ciddi bir tehdit yok.

## 🖥️ kern.log Analizi
### 🔴 [MEDIUM] APPARMOR_BLOCK:
- **Ne Oldu:** AppArmor güvenlik duvarı programların çalışmasını engelliyor, ancak ayrıntılı bilgi almak için gereken log dosyaları kontrol edebilirsiniz. Örneğin:
```
sudo journalctl --unit=apparmor-profiles
```
- **Çözüm Komutu:** Bu durumda, profile dosyasını düzenleyerek engellişmiş programların gereksiz izinlerini kaldırarak sorunu çözebilirsiniz. (Örneğin: `/etc/apparmor.d/usr.sbin.sshd` dosyası).
```
sudo nano /etc/apparmor.d/usr.sbin.sshd
```
Ardından, gereksiz izinleri engelleyerek profile dosyasını düzenleyebilirsiniz:
```
profile usr.sbin.sshd {
  ...
  # deneysel
  /usr/bin/tail deny { name } /var/ossec/logs/alerts/alerts.json,
  ...
}
```
Sonra AppArmor profilleri yeniden başlatın:
```
sudo systemctl reload apparmor
```

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
