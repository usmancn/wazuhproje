# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 02:34:38  
**LLM:** OLLAMA  
**Toplam Bulgu:** 632 (597 KRİTİK, 0 YÜKSEK, 35 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 [CRITICAL] SSH_BRUTE_FORCE:
- **Ne Oldu:** 192.168.64.1 adresinden bir kaba kuvvet saldırısı yapılıyor, 595 kez başarısız SSH giriş denemesi gerçekleştirildi.
- **Çözüm Komutu:** SSH'ye özel bir güvenlik politikası oluşturma veya IP adresinden giriş deneme sayısını sınırlamak için `/etc/security/limits.conf` dosyasına ait ayarları yapabilirsiniz. Örneğin, sınır ayarlanması için aşağıdaki satır eklenebilir:
  ```
  192.168.64.1 - pts/0 - pts/- - (denyall) maxlogin 5
  ```
### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS:
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root yetkisi aldı ve /usr/bin/tail -f /var/ossec/logs/alerts/alerts.json ile bir dosyaya erişti.
- **Çözüm Komutu:** Sistemdeki tüm kullanıcılar için gereksiz root yetkiselerini kontrol ederek veya 'osman' kullanıcısının root yetkisine erişmesine izin vermeden `/etc/sudoers` dosyasına ait ayarları inceleyebilirsiniz.
### 🔴 [MEDIUM] SSH_BRUTE_FORCE:
- **Ne Oldu:** Kaba kuvvet saldırısı gerçekleştirdiğinden, 1.1.1.1, 1.1.1.2 ve 192.168.64.1 adreslerinden başarısız SSH giriş denemesi yapıldı.
- **Çözüm Komutu:** Giriş kontrol sayısını sınırlamak için `/etc/security/limits.conf` dosyasına ait ayarları inceleyebilirsiniz veya SSH'de güvenlik politikası oluşturmanız gerekebilir.

## 📜 syslog Analizi (Tehdit tespit edilmedi)
### ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi
### 🔴 [MEDIUM] APPARMOR_BLOCK:
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice', '/proc/pressure/memory' ve 'net_admin' programlarının çalışmasını engelledi.
- **Çözüm Komutu:** `/etc/apparmor.d/*` dizini içinde bu programların AppArmor profillerine bakarak ve eksiksiz profiller oluşturmaya devam edebilirsiniz. Ayrıca, `/etc/apparmor.d/*.d/local` dizininde değişiklikler yapabilirsiniz.

Bu analiz sadece tehditlerin ana bilgilerini vermiştir ve gerçek zamanlı sistemde kullanılan ayrıntılar hariç tutulmuştur. Sistem sağlayıcısınızı iletişim kurarak tehditlerin yönetimi ve çözümleme için lisanssız destek alabilirsiniz.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
