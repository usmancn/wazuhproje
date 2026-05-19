# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:46:10  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

## 📤 auth.log Analizi (Kimlik ve SSH)
- **Ne Oldu:** Dışarıdan gelen IP adreslerinden (192.168.64.1, 1.1.1.1, 1.1.1.2) SSH kaba kuvvet saldırısı denemeleri tespit edildi. Ayrıca, 'osman' kullanıcısı sudo ile yetki yükseltme yaparak root erişimi sağladı.
- **Çözüm Komutu:**
    ```bash
    sudo ufw deny from 192.168.64.1 to any port 22 comment 'SSH Brute Force Blocker' && \
    sudo ufw deny from 1.1.1.1 to any port 22 comment 'SSH Brute Force Blocker' && \
    sudo ufw deny from 1.1.1.2 to any port 22 comment 'SSH Brute Force Blocker' && \
    sudo gpasswd -d osman sudo && \
    sudo passwd osman
    ```

## 📜 syslog Analizi (Sistem ve Ağ)
- **Ne Oldu:** ✅ Bu dosyada güvenlik tehdidi tespit edilmedi.

## 🖥️ kern.log Analizi (Kernel ve AppArmor)
- **Ne Oldu:** AppArmor güvenlik duvarı, `sys_nice`, `/proc/pressure/memory` ve `net_admin` gibi potansiyel olarak yetkisiz veya zararlı sistem çağrılarının ve dosya erişimlerinin çalışmasını başarıyla engelledi.
- **Çözüm Komutu:**
    ```bash
    sudo aa-status
    ```