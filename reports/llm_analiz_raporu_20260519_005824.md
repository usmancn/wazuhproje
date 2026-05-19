# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:58:53  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** Sunucuya birden fazla IP adresinden (192.168.64.1 başta olmak üzere) yoğun SSH kaba kuvvet (brute-force) saldırıları yapılıyor. Ayrıca, 'osman' kullanıcısı sudo yetkisiyle root yetkisinde `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` komutunu çalıştırarak yetki yükseltme gerçekleştirdi.
- **Çözüm Komutu:** `sudo ufw deny from 192.168.64.1; sudo ufw deny from 1.1.1.1; sudo ufw deny from 1.1.1.2; sudo gpasswd -d osman sudo`

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** AppArmor güvenlik duvarı, çeşitli sistem çağrılarının (sys_nice, net_admin) ve bellek durumuyla ilgili dosya erişimlerinin (/proc/pressure/memory) yetkisiz programlar tarafından yapılmasını engelledi. Bu, AppArmor'ın beklenen şekilde çalıştığını ve potansiyel güvenlik ihlallerini önlediğini gösteriyor.
- **Çözüm Komutu:** `sudo aa-logprof`