# 🛡️ Wazuh SIEM - Log Analizi ve Siber Saldırı Simülasyonu

Bu proje, geleneksel SIEM sistemlerindeki **"Alarm Yorgunluğu" (Alert Fatigue)** problemini göstermek, siber saldırıları (Brute-Force, Privilege Escalation) simüle etmek ve bu saldırıların ham JSON loglarını Açıklanabilir Yapay Zeka (XAI) modelleri için hazırlamak amacıyla geliştirilmiş akademik bir güvenlik projesidir.

## ✨ Özellikler

*   **Canlı Saldırı Simülasyonu:** Arka planda çalışan Ubuntu 22.04 sanal makinesi üzerindeki Wazuh SIEM'e anlık SSH Brute-Force ve Sudo yetki yükseltme saldırıları düzenler.
*   **Gerçek Zamanlı Log Akışı:** Wazuh'un ürettiği güvenlik kurallarını (Rule 5712, Rule 5402 vb.) anında arayüze yansıtır.
*   **Çevrimdışı (Offline) Destek:** Eğer sanal makine (Ubuntu) kapalıysa veya projeyi başka bir bilgisayarda çalıştırıyorsanız, sistem otomatik olarak "Çevrimdışı Mod"a geçer ve önceden toplanmış yüzlerce saldırı logunu (XAI analizi için) `all_alerts.json` dosyasından arayüze aktarır.
*   **İnteraktif Dashboard:** Toplam log sayısını, kritik alarmları ve JSON çıktılarını tek bir ekranda gösteren modern arayüz.

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

## 📌 Modlar Arası Farklar

*   **Canlı Mod:** Eğer projeyi asıl kurulduğu cihazda açarsanız, sol üstte "Canlı" yazar. "Canlı Saldırı Demo" sekmesindeki butonlar gerçekten saldırı üretir.
*   **Çevrimdışı (Offline) Mod:** Projeyi Github'dan indirip başka bir cihazda açarsanız sol üstte kırmızı renkli "Bağlantı Yok" yazar. "Saldırı Demo" butonları çalışmaz fakat **Tüm Log Arşivi**, JSON çıktıları ve istatistikler önceki saldırılardan kaydedildiği haliyle %100 sorunsuz çalışır.

## ⚙️ Teknik Altyapı
*   **SIEM:** Wazuh 4.14.5 (Ubuntu 22.04 ARM64 üzerinde yapılandırıldı)
*   **Backend:** Python 3 (Soket Sunucusu & SSH Tünelleme)
*   **Frontend:** HTML5, Vanilla CSS, Vanilla JS
*   **Log Kaynakları:** `journald` ve `/var/log/auth.log`
