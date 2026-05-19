# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 01:21:13  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** Birden çok IP adresinden (192.168.64.1, 1.1.1.1, 1.1.1.2) SSH kaba kuvvet saldırısı denemeleri yapıldı. 'osman' kullanıcısı sudo komutu ile root yetkisi aldı, bu kritik bir ayrıcalık yükseltme olayıdır ve yetkisiz erişim veya hesap güvenliğinin ihlal edildiğini gösterebilir.
- **Çözüm Komutu:** `sudo ufw deny from 192.168.64.1; sudo ufw deny from 1.1.1.1; sudo ufw deny from 1.1.1.2; sudo deluser osman sudo; sudo passwd osman; sudo apt install -y fail2ban && sudo systemctl enable fail2ban --now`

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.
- **Çözüm Komutu:** `✅ Bu dosyada güvenlik tehdidi tespit edilmedi.`

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** AppArmor güvenlik duvarı, sistemdeki bir sürecin 'sys_nice', '/proc/pressure/memory' ve 'net_admin' gibi yetkisiz kernel eylemlerini gerçekleştirmesini engelledi. Bu durum, güvenlik mekanizmasının başarıyla çalıştığını ancak altta yatan bir tehdit veya yanlış yapılandırılmış bir uygulamanın yetkisiz eylemler yapmaya çalıştığını gösterir.
- **Çözüm Komutu:** `sudo journalctl -k --no-pager | grep -E "apparmor.*DENIED"`