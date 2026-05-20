# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 03:24:09  
**LLM:** OLLAMA  
**Toplam Bulgu:** 658 (621 KRİTİK, 0 YÜKSEK, 37 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL] SSH_BRUTE_FORCE:
- **Ne Oldu:** 192.168.64.1 adresinden 619 başarısız SSH giriş denemesi yapıldı. Bu IP sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** Öncelikle bu tehditte çok fazla başarısız giriş denemesi bulunuyor ve önemli bir güvenlik tehdidi oluşturuyor. Güvenlik yönetiminde, IP filtresi kullanılabilir olanağa gelir. Aşağıdaki komutu kullanarak 192.168.64.1 adresinden giriş gecikmesi eklenebilir:
```bash
sudo iptables -A INPUT -s 192.168.64.1 -p tcp --dport ssh -w 5 -y
```
Bu komutta, girişten gelen paketlerden ssh portundan gelen 5 snar içindeki tekrarların IP tabanına kaydedilmesi sağlanır. Sonra yöneticinin bu IP adresini bloke etmelerine izin verir.

### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS:
- **Ne Oldu:** 'osman' kullanıcısı sudo komutuyla root (yönetici) yetkisi aldı. Yönetici yetkilerine sahip bir kullanıcı olmalı, bu tehdit önemli güvenlik açıklamasına neden olabilir.
- **Çözüm Komutu:** Öncelikle, yönetici yetkilerine sahip olan kullanıcılar için sadece gerekli komutları ilemse değil, bu tehdit iyi hale getirmenin en iyi yolu sistemde AppArmor'u ve SELinux'i aktif ederek olabilir. Ayrıca, 'osman' kullanıcısına gereksiz root yetkisini vermeden önemli olacaktır.
```bash
sudo systemctl enable apparmor
sudo systemctl start apparmor
sudo systemctl status apparmor
sudo ausearch -c 'osman' --raw | audit2allow -a
sudo reboot
```
Bu komutlar şu sırayla AppArmor'u etkinleştirir, başlatır, durumunu kontrol eder ve kullanıcıya yeni yetkiler verir. Son olarak, sistemi yeniden başlatmaktadır.

### 🔴 [MEDIUM] SSH_BRUTE_FORCE:
- **Ne Oldu:** 1.1.1.1, 1.1.1.2 ve 192.168.64.1'den başarısız SSH giriş denemesi yapıldı. Bu IP adresleri sisteme kaba kuvvet saldırısı yapıyor.
- **Çözüm Komutu:** Güvenlikte karşı sert tehditlere teskil edilen iki öncelikli seçenek bulunmaktadır. Bunlar; deneme sayısına göre kullanıcıların IP adreslerini bloke etme ve SSH'yi güvenlik düzeyi artırarak tehditlere karşı dayanıklı hale getirme olmalıdır.
```bash
# Bloke edilmesi gereken IP adreslerini buraya ekleyin ve ',' ile ayrıntılı liste oluşturun:
sudo iptables -A INPUT -s <IP_adresleri> -p tcp --dport ssh -w 5 -y
```
Bu komutta, girişten gelen paketlerden ssh portundan gelen 5 snar içindeki tekrarların IP tabanına kaydedilmesi sağlanır. Sonra yöneticinin bu IP adreslerini bloke etmelerine izin verir.
```bash
# SSH'yi güvenlik düzeyi artırarak tehditlere karşı dayanıklı hale getiren komutlar:
sudo apt-get update && sudo apt-get upgrade openssh-server
sudo systemctl restart ssh
```
Bu komutlar, sistemi güncellemeyi ve SSH'yi yeniden başlatır. Ayrıca, önerilir olanağa gelmektedir, SSH'yi 2 factor authentication (2FA) ile koruyarak tehditlere karşı dayanıklı hale getirme.

---

## 📜 syslog: Tehdit tespit edilmedi ---

--- kern.log (3 benzersiz bulgu türü) ---
### 🔴 [MEDIUM] APPARMOR_BLOCK:
- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi. Bu tehdit, AppArmor'un yönetim sistemi komutlarını koruyan rolündeki yönüyle bir güvenlik açıklamasıdır.
- **Çözüm Komutu:** AppArmor kullanıcısına uygun olarak, bu tehdit iyi hale getirmenin en iyi yolu sistemde AppArmor'u ve SELinux'i aktif ederek olabilir. Ayrıca, bu seçenekte görüldüğü programların yetkisini kontrol etmelerine dikkat edilmelidir.
```bash
sudo systemctl enable apparmor
sudo systemctl start apparmor
sudo systemctl status apparmor
sudo ausearch -c '<program_name>' --raw | audit2allow -a
sudo reboot
```
Bu komutlar şu sırayla AppArmor'u etkinleştirir, başlatır, durumunu kontrol eder ve görüldüğü programlara yetkiler verir. Son olarak, sistemi yeniden başlatmaktadır.

### 🔴 [MEDIUM] APPARMOR_BLOCK:
- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi. Bu tehdit, verilerin erişilebilir olmasına olanak tanıyan bir güvenlik açıklamasıdır.
- **Çözüm Komutu:** AppArmor kullanıcısına uygun olarak, bu tehdit iyi hale getirmenin en iyi yolu sistemde AppArmor'u ve SELinux'i aktif ederek olabilir. Ayrıca, bu seçenekte görüldüğü programların yetkisini kontrol etmelerine dikkat edilmelidir.
```bash
sudo systemctl enable apparmor
sudo systemctl start apparmor
sudo systemctl status apparmor
sudo ausearch -c '<program_name>' --raw | audit2allow -a
sudo reboot
```
Bu komutlar şu sırayla AppArmor'u etkinleştirir, başlatır, durumunu kontrol eder ve görüldüğü programlara yetkiler verir. Son olarak, sistemi yeniden başlatmaktadır.

### 🔴 [MEDIUM] APPARMOR_BLOCK:
- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi. Bu tehdit, verilerin erişilebilir olmasına olanak tanıyan bir güvenlik açıklamasıdır.
- **Çözüm Komutu:** AppArmor kullanıcısına uygun olarak, bu tehdit iyi hale getirmenin en iyi yolu sistemde AppArmorteklif ederek olabilir. Ayrıca, bu seçenekte görüldüğü programların yetkisini kontrol etmelerine dikkat edilmelidir.
```bash
sudo systemctl enable apparmor
sudo systemctl start apparmor
sudo systemctl status apparmor
sudo ausearch -c '<program_name>' --raw | audit2allow -a
sudo reboot
```
Bu komutlar şu sırayla AppArmor'u etkinleştirir, başlatır, durumunu kontrol eder ve görüldüğü programlara yetkiler verir. Son olarak, sistemi yeniden başlatmaktadır.

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
