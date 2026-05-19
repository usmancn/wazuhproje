# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-20 01:13:42  
**LLM:** OLLAMA  
**Toplam Bulgu:** 562 (533 KRİTİK, 0 YÜKSEK, 29 ORTA)  

---

## 📤 auth.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]

- **Ne Oldu:** Sisteme kaba kuvvet saldırısı yapma girişimleri ve 'osman' kullanıcısının sudo komutuyla root (yönetici) yetkisi alınmış.
- **Çözüm Komutu:**

  ```bash
sudo apt-get update && sudo apt-get install -y nmap && sudo apt-get install -y nmap-script
sudo nmap --script=vuln 192.168.64.1
sudo nmap --script=exploit --script-vuln 192.168.64.1
sudo usermod -aG sudo osman
```

## 📜 syslog Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]

- **Ne Oldu:** Bu log dosyasında güvenlik tehditi tespit edilmedi.
- **Çözüm Komutu:**

  Bu log dosyasında herhangi bir tehdit yoksa, bu log dosyasına bakılmaz ve next'e geçilir.

## 🖥️ kern.log Analizi

### 🔴 [CRITICAL/HIGH/MEDIUM] [Bulgu Türü]

- **Ne Oldu:** AppArmor güvenlik duvarı 'sys_nice' programının çalışmasını engelledi.
- **Çözüm Komutu:**

  ```bash
sudo apt-get update && sudo apt-get install -y nmap && sudo apt-get install -y nmap-script
sudo nmap --script=vuln /proc/pressure/memory
sudo nmap --script=exploit --script-vuln /proc/pressure/memory
```

- **Ne Oldu:** AppArmor güvenlik duvarı '/proc/pressure/memory' programının çalışmasını engelledi.
- **Çözüm Komutu:**

  ```bash
sudo apt-get update && sudo apt-get install -y nmap && sudo apt-get install -y nmap-script
sudo nmap --script=vuln /proc/pressure/memory
sudo nmap --script=exploit --script-vuln /proc/pressure/memory
```

- **Ne Oldu:** AppArmor güvenlik duvarı 'net_admin' programının çalışmasını engelledi.
- **Çözüm Komutu:**

  ```bash
sudo apt-get update && sudo apt-get install -y nmap && sudo apt-get install -y nmap-script
sudo nmap --script=vuln net_admin
sudo nmap --script=exploit --script-vuln net_admin
```

### 📌

## 🛡️ Acil Müdahale Adımları
```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGAN_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```
