# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 02:46:35  
**LLM:** OLLAMA  
**Toplam Bulgu:** 632 (597 KRİTİK, 0 YÜKSEK, 35 ORTA)  

---

## 📤 auth.log Analizi
### 🔴 [CRITICAL] SSH_BRUTE_FORCE
- **Ne Oldu:** Hacker bir kaba kuvvet saldırısı yapmaktadır. 192.168.64.1 adresinden toplam 595 defa başarısız SSH giriş denemesi yapıldı.
- **Çözüm Komutu:** Hacker saldırılarını engellemek için gereken en basit şey, IP adresinden SSH erişim kesilmesidir. Ayrıca, kullanıcılara ağ güvenliğine dair hizmetlerin ve önlemlerin anlamasına çalışmak de önemlidir.
    ```
    sudo ufw deny from 192.168.64.1
    ```
### 🔴 [CRITICAL] PRIVILEGE_ESCALATION_SUCCESS
- **Ne Oldu:** Osman kullanıcısı sudo komutuyla yönetici (root) yetkisini aldı ve bir kritik işlemi gerçekleştirdi.
- **Çözüm Komutu:** Yöneticiler, kullanıcıların sudo komutunu sadece önemli isteklerde kullanmasına olanak sağlamak ve bu gibi hataları önlemek için ağ güvenliğini arz eden yönetim yazılımı kullanmalıdır. Yönetici yetkisini alma sürecinde oluşan tüm logları inceleyip, kullanıcının ne yaptığı ve neden yaptığı anlamak için gereken ayrıntılı bir çözüm olmalıdır.
    ```
    sudo visudo # Yöneticilerle etkileşim sağlarak bu sorunu giderilmelidir.
    ```
### 🔴 [MEDIUM] SSH_BRUTE_FORCE (3 tekrar)
- **Ne Oldu:** Hacker bir kaba kuvvet saldırısı yapmaktadır. Farklı IP adreslerinden toplam 3 defa başarısız SSH giriş denemesi yapıldı.
- **Çözüm Komutu:** Kaba kuvvet saldırılarını engellemek için ağ güvenliğine dair uygun önlemler alınmalıdır. Örneğin, SSH'de güvenlik duvarı ve yeni bir parola sistemi kurulmalıdır.
    ```
    sudo apt-get install fail2ban # SSH giriş saldırılarını engellemek için kullanılacak uygulamayı yükler
    sudo systemctl start fail2ban # Gereksiz bir şekilde hata mesajları vermeden başlatma
    ```

## 📜 syslog Analizi (Tehdit tespit edilmedi)
### 🔴 [MEDIUM] APPARMOR_BLOCK (3 tekrar)
- **Ne Oldu:** AppArmor güvenlik duvarı, 'sys_nice', '/proc/pressure/memory' ve 'net_admin' programlarının çalışmasını engeldi.
- **Çözüm Komutu:** Bu sorunu gidererek, AppArmor güvenlik duvarının kullanıcı tarafından zamanlandığı ve yeni programları çalıştırdığında tehlikeyi engellemek için ağ güvenliğine dair uygun aylık kontrol ve ayarlar yapmalıdır.
    ```
    sudo apt-get install apparmor-utils # AppArmor'u kontrol etmek için kullanılacak araçları yükler
    sudo aa-status # AppArmor'un durumunu kontrol eder
    ```

## 🖥️ kern.log Analizi (3 benzersiz bulgu türü)
### 🔴 [MEDIUM] APPARMOR_BLOCK (3 tekrar)
- **Ne Oldu:** AppArmor güvenlik duvarı, 'sys_nice', '/proc/pressure/memory' ve 'net_admin' programlarının çalışmasını engeldi.
- **Çözüm Komutu:** Bu sorunu gidererek, AppArmor güvenlik duvarının kullanıcı tarafından zamanlandığı ve yeni programları çalıştırdığında tehlikeyi engellemek için ağ güvenliğine dair uygun aylık kontrol ve ayarlar yapmalıdır.
    ```
    sudo apt-get install apparmor-utils # AppArmor'u kontrol etmek için kullanılacak araçları yükler
    sudo aa-status # AppArmor'un durumunu kontrol eder
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
