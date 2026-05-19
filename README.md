# 🛡️ Wazuh SIEM - Log Analizi ve Siber Saldırı Simülasyonu

Bu proje, geleneksel SIEM sistemlerindeki **"Alarm Yorgunluğu" (Alert Fatigue)** problemini göstermek, siber saldırıları (Brute-Force, Privilege Escalation) simüle etmek ve bu saldırıların ham JSON loglarını Açıklanabilir Yapay Zeka (XAI) modelleri için hazırlamak amacıyla geliştirilmiş akademik bir güvenlik projesidir.

## ✨ Özellikler

*   **Canlı Saldırı Simülasyonu:** Arka planda çalışan Ubuntu 22.04 sanal makinesi üzerindeki Wazuh SIEM'e anlık SSH Brute-Force ve Sudo yetki yükseltme saldırıları düzenler.
*   **Gerçek Zamanlı Log Akışı:** Wazuh'un ürettiği güvenlik kurallarını (Rule 5712, Rule 5402 vb.) anında arayüze yansıtır.
*   **Çevrimdışı (Offline) Destek:** Eğer sanal makine (Ubuntu) kapalıysa veya projeyi başka bir bilgisayarda çalıştırıyorsanız, sistem otomatik olarak "Çevrimdışı Mod"a geçer ve önceden toplanmış yüzlerce saldırı logunu (XAI analizi için) `all_alerts.json` dosyasından arayüze aktarır.
*   **İnteraktif Dashboard:** Toplam log sayısını, kritik alarmları ve JSON çıktılarını tek bir ekranda gösteren modern arayüz.
*   **Yapay Zeka Destekli Offline Log Analizi:** `log_analyzer.py` aracı ile internet bağlantısı gerektirmeden, kural tabanlı bir yapay zeka simülasyonu çalıştırarak loglardaki tehditleri analiz eder, risk seviyelerini belirler ve Türkçe müdahale önerileri (AI tavsiyeleri) üretir.

## 🚀 Nasıl Çalıştırılır? (Tüm Sistemler İçin)

Projeyi kendi bilgisayarınızda (Windows, Mac veya Linux) incelemek veya hocaya sunmak için aşağıdaki adımları izlemeniz yeterlidir:

### Gereksinimler
Sadece **Python 3**'ün sisteminizde kurulu olması yeterlidir. Ekstra bir kütüphane (pip install vb.) gerektirmez.

### Adım Adım Kurulum

1.  Bu projeyi (klasörü) bilgisayarınıza indirin ve klasörün içine girin.
2.  Terminal veya Komut İstemcisi'ni (cmd) açarak bulunduğunuz dizine gidin:
    ```bash
    cd /klasor/yolu/guvenlik
    ```
3.  Python API sunucusunu başlatın:
    ```bash
    python3 attack_server.py
    ```
    *(Windows kullanıyorsanız sadece `python attack_server.py` yazmanız gerekebilir.)*
4.  Sunucu çalışmaya başladıktan sonra tarayıcınızı açın ve aşağıdaki adrese gidin:
    ```text
    http://localhost:8877
    ```
    Veya alternatif olarak klasör içindeki `sunum_app.html` dosyasına çift tıklayarak tarayıcıda açabilirsiniz.

### 🤖 Gerçek Yapay Zeka Log Analiz Aracını Çalıştırmak

Projenin kalbi olan Python aracı, tespit edilen siber güvenlik bulgularını doğrudan Google Gemini veya OpenAI'a göndererek profesyonel bir XAI raporu üretir.

**Ön Hazırlık (Kütüphanelerin Kurulumu):**
```bash
pip install -r requirements.txt
```

**Aracı Çalıştırmak:**
```bash
# 🟢 Ollama ile (Ücretsiz, Çevrimdışı — Önerilen):
#   Önce: ollama pull llama3
python3 log_analyzer.py \
  --auth sample_logs/auth.log \
  --syslog sample_logs/syslog \
  --kern sample_logs/kern.log \
  --llm ollama --model llama3

# 🔵 Google Gemini ile:
python3 log_analyzer.py \
  --auth sample_logs/auth.log \
  --syslog sample_logs/syslog \
  --kern sample_logs/kern.log \
  --llm gemini --api-key BURAYA_API_KEY_YAZIN

# 🟡 OpenAI (ChatGPT) ile:
python3 log_analyzer.py \
  --auth sample_logs/auth.log \
  --syslog sample_logs/syslog \
  --kern sample_logs/kern.log \
  --llm openai --api-key BURAYA_API_KEY_YAZIN

# ⚪ API key olmadan (kural tabanlı, internet gerektirmez):
python3 log_analyzer.py \
  --auth sample_logs/auth.log \
  --syslog sample_logs/syslog \
  --kern sample_logs/kern.log
```

Bu komut:
1. `sample_logs/` klasöründeki gerçekçi Linux loglarını okur ve Regex parser ile ayrıştırır.
2. Brute-Force, Sudo yetki aşımı, DDoS izleri, şüpheli Cron gibi tehditleri tespit eder (CRITICAL / HIGH / MEDIUM).
3. Bulguları seçilen LLM'e (Ollama / Gemini / OpenAI) gönderir.
4. Türkçe olarak MITRE ATT&CK eşleştirmesi içeren profesyonel bir güvenlik raporu üretir.
5. Sonuçları `reports/` klasörüne Markdown ve JSON formatında arşivler.

*(API anahtarı yoksa veya internet yoksa araç otomatik olarak kural tabanlı offline rapora geçer.)*

## 📌 Modlar Arası Farklar

*   **Canlı Mod:** Projeyi asıl cihazda açarsanız sol üstte "Canlı" yazar. "Canlı Saldırı Demo" butonları gerçek saldırı üretir.
*   **Çevrimdışı (Offline) Mod:** Github'dan indirip başka cihazda açarsanız "Bağlantı Yok" yazar. Saldırı butonları çalışmaz fakat **Tüm Log Arşivi**, JSON çıktıları ve istatistikler önceki saldırılardan kaydedildiği haliyle çalışır.

## ⚙️ Teknik Altyapı
*   **SIEM:** Wazuh 4.14.5 (Ubuntu 22.04 ARM64)
*   **Backend:** Python 3 (HTTP Sunucusu & SSH Tünelleme)
*   **LLM:** Ollama (llama3) / Google Gemini / OpenAI GPT
*   **Frontend:** HTML5, Vanilla CSS, Vanilla JS
*   **Log Kaynakları:** `journald`, `/var/log/auth.log`, `syslog`, `kern.log`

## 📁 Proje Yapısı

```
guvenlik/
├── log_analyzer.py          # CLI: Yapay Zeka Destekli Log Analiz Aracı
├── attack_server.py         # Web sunum sunucusu & saldırı simülatörü
├── sunum_app.html           # İnteraktif sunum arayüzü
├── sample_logs/
│   ├── auth.log             # Örnek kimlik doğrulama logları
│   ├── syslog               # Örnek sistem logları
│   └── kern.log             # Örnek çekirdek logları
├── reports/                 # LLM rapor çıktıları (JSON + Markdown)
├── all_alerts.json          # Wazuh'tan toplanan gerçek saldırı logları
└── requirements.txt         # Python bağımlılıkları
```

## 📚 Akademik Çıktılar

Yapay zeka aracının oluşturduğu örnek analiz raporları `reports/` klasöründe mevcuttur. Bu raporlar; SIEM sistemlerinin çalışma prensipleri, Linux log dosyalarının yapısı ve AI destekli analizin geleneksel yöntemlere göre avantajlarını somut bulgularla göstermektedir.


Bu komut:
1. `sample_logs` klasöründeki gerçekçi Linux loglarını okur ve Regex parser ile ayrıştırır.
2. Brute-Force, Sudo yetki aşımları, DDoS izleri (conntrack table full) gibi tehditleri tespit eder ve seviyelendirir (CRITICAL/HIGH/MEDIUM).
3. Bulguları API aracılığıyla Google Gemini veya ChatGPT'ye gönderir.
4. Ekrana Türkçe olarak bir "Gerçek Yapay Zeka Analiz Raporu" basar.
5. Sonuçları `/reports` klasörüne Markdown formatında arşivler.

*(Eğer API anahtarınız yoksa veya internet bağlantınız koparsa araç otomatik olarak Offline-AI Moduna geçer ve kural tabanlı rapor üretir.)*

## 📌 Modlar Arası Farklar

*   **Canlı Mod:** Eğer projeyi asıl kurulduğu cihazda açarsanız, sol üstte "Canlı" yazar. "Canlı Saldırı Demo" sekmesindeki butonlar gerçekten saldırı üretir.
*   **Çevrimdışı (Offline) Mod:** Projeyi Github'dan indirip başka bir cihazda açarsanız sol üstte kırmızı renkli "Bağlantı Yok" yazar. "Saldırı Demo" butonları çalışmaz fakat **Tüm Log Arşivi**, JSON çıktıları ve istatistikler önceki saldırılardan kaydedildiği haliyle %100 sorunsuz çalışır.

## ⚙️ Teknik Altyapı
*   **SIEM:** Wazuh 4.14.5 (Ubuntu 22.04 ARM64 üzerinde yapılandırıldı)
*   **Backend:** Python 3 (Soket Sunucusu & SSH Tünelleme)
*   **Frontend:** HTML5, Vanilla CSS, Vanilla JS
*   **Log Kaynakları:** `journald` ve `/var/log/auth.log`

## 📚 Akademik Çıktılar

Proje kapsamında hazırlanan ve SIEM, Linux log yapıları, AI destekli analizin avantajlarını anlatan detaylı araştırma makalesine [ARASTIRMA_MAKALESI.md](ARASTIRMA_MAKALESI.md) dosyasından ulaşabilirsiniz. Ayrıca yapay zeka aracının oluşturduğu örnek bir analiz raporu `reports/` klasöründe yer almaktadır.
