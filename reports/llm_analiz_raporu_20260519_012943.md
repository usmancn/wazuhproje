# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 01:29:58  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** Sistemde 192.168.64.1, 1.1.1.1 ve 1.1.1.2 IP adreslerinden yoğun SSH kaba kuvvet saldırıları tespit edildi. Ayrıca 'osman' kullanıcısı sudo yetkisini kötüye kullanarak root ayrıcalıklarına başarılı bir şekilde yükseltti.
- **Çözüm Komutu:** `sudo ufw deny from 192.168.64.1; sudo ufw deny from 1.1.1.1; sudo ufw deny from 1.1.1.2; sudo usermod -L osman; sudo passwd -e osman`

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** AppArmor güvenlik duvarı, çeşitli yetkisiz sistem çağrısı (sys_nice, net_admin) ve kaynak erişim (/proc/pressure/memory) denemelerini başarıyla engelleyerek sistem bütünlüğünü korudu.
- **Çözüm Komutu:** `sudo aa-status; sudo grep -ri "apparmor=" /var/log/kern.log | tail -n 20`