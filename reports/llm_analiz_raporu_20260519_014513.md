# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 01:45:13  
**LLM:** OLLAMA  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

# 🤖 Yapay Zeka (Kural Tabanlı) Güvenlik Analiz Raporu

**Tarih:** 2026-05-19 01:45
**Dağılım:** 0 KRİTİK · 0 YÜKSEK · 0 ORTA

---

## 🛡️ Acil Müdahale Adımları

```bash
# Saldıran IP'leri engelle
sudo ufw deny from <SALDIRGANI_IP>
# SSH güvenliğini artır
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
# Fail2Ban kur (otomatik engelleme)
sudo apt install fail2ban -y && sudo systemctl enable --now fail2ban
```