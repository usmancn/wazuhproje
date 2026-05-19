# 🛡️ Wazuh AI SIEM Dashboard
**Yapay Zeka Destekli Sistem Log Analiz ve Tehdit Algılama Aracı**

Bu proje, açık kaynaklı Wazuh SIEM altyapısını kullanarak sistem güvenlik loglarını (auth.log, syslog, kern.log) toplayan, gerçek zamanlı saldırı simülasyonları gerçekleştiren ve elde edilen verileri **Yerel (Ollama Llama 3.2)** ve **Bulut (Google Gemini 2.5 Flash)** Büyük Dil Modelleri (LLM) ile analiz edip otonom güvenlik raporları üreten profesyonel bir siber güvenlik projesidir.

---

## 🏗️ Sistem Mimarisi ve Altyapı
Sistem, sanallaştırma mimarisi üzerinde birbirine bağlı iki farklı bileşenden oluşmaktadır:

- **Host Makine:** MacBook Air (Apple Silicon M4)
- **Sanallaştırma Platformu:** UTM
- **Guest İşletim Sistemi:** Ubuntu 22.04 LTS ARM64 (IP: 192.168.64.4)
- **SIEM Çözümü:** Wazuh Manager v4.8.0 (Kaynaktan Derleme)

Wazuh, arka planda `/var/log/auth.log` ve `journald` üzerinden gerçek zamanlı log toplamaktadır. Tespit edilen şüpheli olaylar `alerts.json` olarak dışa aktarılmış ve Python tabanlı AI entegrasyonuna bağlanmıştır.

---

## 🚀 Proje Özellikleri

### 1. ⚡ Canlı Saldırı Simülasyonu
Dashboard üzerinden tek tıkla sanal makineye **SSH Brute-Force (Kaba Kuvvet)** ve **Sudo (Yetki Yükseltme)** saldırıları simüle edilebilir.
- **Rule 5712 (Level 10):** Brute-Force saldırıları saniyeler içinde tespit edilir ve Kritik tehdit olarak loglanır.
- **Rule 5402 (Level 3):** Başarılı `sudo` kullanımları, MITRE ATT&CK T1548.003 (Sudo and Sudo Caching) kapsamında izlenir.

### 2. 🧠 Hibrit Yapay Zeka Analizi
Güvenlik logları, iki farklı LLM stratejisi kullanılarak otonom bir şekilde analiz edilir:
- **Bulut (Gemini 2.5 Flash):** Hızlı ve yüksek kapasiteli küresel analizler.
- **Yerel (Ollama / Llama 3.2):** Veri gizliliğinin (Data Privacy) kritik olduğu durumlar için internet bağlantısına ihtiyaç duymayan "Zero-Trust" (Sıfır Güven) analizi.
- **Deduplication Algoritması:** Aynı tipteki yüzlerce saldırı logu, AI modelinin bağlam limitini (Context Window) aşmamak adına `event_count` bazlı akıllı bir algoritma ile tekilleştirilir.

### 3. 🛡️ Halüsinasyon Önleyici (Anti-Hallucination) Prompt Mimarisi
Küçük yerel modellerin yanlış bash komutları üretmesini (halüsinasyon) engellemek amacıyla **"Cheat Sheet" (Kopya Kağıdı)** bazlı özel bir prompt mühendisliği uygulanmıştır. 
Sistem; IP engelleme (`ufw deny`), hesap kilitleme (`passwd -l`) gibi **Kesin Çözüm Komutlarını (Acil Müdahale Adımları)** doğrudan tespit edilen Kural ID'lerine göre otonom olarak tavsiye eder.

### 4. 📊 Dinamik ve Responsive Dashboard
Tamamen Vanilla JS/CSS kullanılarak geliştirilen sunum arayüzü; Markdown analizleri, kod blokları ve tabloları anlık renderlayabilen yüksek performanslı bir izleme ekranı sunar.

---

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- Python 3.8+
- Ollama (Yerel LLM için)
- UTM üzerinde çalışan yapılandırılmış Ubuntu 22.04 LTS (Wazuh Yüklü)

### 1. Bağımlılıkların Kurulması
Projeyi klonladıktan sonra gerekli Python kütüphanelerini kurun:
```bash
pip3 install -r requirements.txt
```

### 2. API Anahtarının Tanımlanması
Gizlilik ve güvenlik ilkeleri gereği API anahtarları kaynak koda gömülmemiştir. Sunucuyu başlatmadan önce terminalinizde çevre değişkenini (Environment Variable) ayarlayın:
```bash
export GEMINI_API_KEY="AIzaSyC...Sizin_Google_Gemini_Anahtariniz"
```

### 3. Backend Sunucusunun Başlatılması
```bash
python3 attack_server.py
```
> **Not:** Arka planda sürekli çalışması için `nohup python3 attack_server.py > server.log 2>&1 &` komutunu kullanabilirsiniz.

### 4. Arayüzün Açılması
Web tarayıcınızda `sunum_app.html` dosyasını çalıştırarak projeyi kullanmaya başlayabilirsiniz.

---

## 📂 Proje Dizin Yapısı
- `attack_server.py`: REST API ve canlı saldırı otomasyonlarını sağlayan Flask/HTTP sunucusu.
- `log_analyzer.py`: Log tekilleştirme ve LLM entegrasyon motoru.
- `sunum_app.html`: Son kullanıcı arayüzü (UI) ve Dashboard frontend.
- `sample_logs/`: Analiz için kullanılan statik log dosyaları arşivi.
- `reports/`: AI tarafından oluşturulmuş geçmiş analiz (Markdown/JSON) çıktıları.

---

**Akademik Final Projesi Kapsamında Geliştirilmiştir.** 🎓
