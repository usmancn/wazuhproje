# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:43:44  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** Sunucuya 192.168.64.1, 1.1.1.1 ve 1.1.1.2 adreslerinden yoğun SSH kaba kuvvet saldırıları düzenlendi. Ayrıca 'osman' kullanıcısı, `/usr/bin/tail` komutunu kullanarak başarılı bir şekilde root yetkisi aldı.
- **Çözüm Komutu:** `sudo gpasswd -d osman sudo && sudo passwd osman && sudo ufw deny from 192.168.64.1 && sudo ufw deny from 1.1.1.1 && sudo ufw deny from 1.1.1.2 && sudo apt update && sudo apt install fail2ban -y && sudo systemctl enable fail2ban --now`

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** AppArmor güvenlik duvarı, çekirdek ve sistem kaynaklarına (sys_nice, net_admin, /proc/pressure/memory gibi) yönelik birden fazla yetkisiz erişim denemesini başarıyla engelledi. Bu durum, AppArmor'ın sistemi koruduğunu gösterir ancak engellenen işlemlerin kaynağının incelenmesi gerekebilir.
- **Çözüm Komutu:** `sudo aa-logprof`