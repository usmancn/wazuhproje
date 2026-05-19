# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:55:47  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
-   **Ne Oldu:** Çeşitli dış IP adreslerinden (192.168.64.1, 1.1.1.1, 1.1.1.2) SSH kaba kuvvet (brute-force) saldırıları tespit edildi. Ayrıca, 'osman' kullanıcısı sudo kullanarak şüpheli bir şekilde root yetkisi aldı.
-   **Çözüm Komutu:** `sudo ufw deny from 192.168.64.1; sudo ufw deny from 1.1.1.1; sudo ufw deny from 1.1.1.2; sudo gpasswd -d osman sudo; sudo passwd -l osman`

## 📜 syslog Analizi (Sistem ve Ağ)
-   **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
-   **Ne Oldu:** AppArmor güvenlik duvarı, sistem kaynaklarına (sys_nice, /proc/pressure/memory, net_admin) yetkisiz erişim veya zararlı olabilecek işlemlerin kernel işlevlerini kullanma denemelerini başarıyla engelledi. Bu, aktif bir savunma mekanizmasının çalıştığını gösterir.
-   **Çözüm Komutu:** `sudo dmesg -T | grep -i apparmor | grep "DENIED"`