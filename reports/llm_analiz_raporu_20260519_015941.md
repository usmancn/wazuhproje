# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 01:59:55  
**LLM:** GEMINI  
**Toplam Bulgu:** 260 (235 KRİTİK, 0 YÜKSEK, 25 ORTA)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** 192.168.64.1 IP adresinden sisteme yoğun kaba kuvvet (brute-force) SSH saldırısı yapıldı. Ayrıca, 1.1.1.1 ve 1.1.1.2 IP'lerinden de denemeler tespit edildi. Önemli olarak, 'osman' kullanıcısı sudo kullanarak root (yönetici) yetkisi aldı.
- **Çözüm Komutu:** `sudo ufw deny from 192.168.64.1 && sudo ufw deny from 1.1.1.1 && sudo ufw deny from 1.1.1.2 && sudo gpasswd -d osman sudo && sudo passwd osman`

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi. (AppArmor güvenlik duvarı, politikalarına aykırı hareketleri başarıyla engelledi ve sistemin güvenliğini sağladı.)