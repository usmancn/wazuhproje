# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 01:25:12  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** Sunucuya birden fazla IP adresinden (192.168.64.1, 1.1.1.1, 1.1.1.2) SSH kaba kuvvet saldırıları yapıldı. Özellikle 192.168.64.1 adresinden 217 başarısız deneme tespit edildi. Kritik olarak, 'osman' kullanıcısı sudo komutuyla root yetkisi alarak şüpheli bir komut çalıştırdı.
- **Çözüm Komutu:** `sudo usermod -L osman`

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.