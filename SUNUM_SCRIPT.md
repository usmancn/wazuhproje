# 🎤 OSMAN'IN 5 DAKİKALIK SUNUM SENARYOSU VE REHBERİ

Bu belge, senin (2. Kişi) sunum sırasında dakika dakika ne söyleyeceğini, ekranda nereye tıklayacağını ve hocanın zorlayıcı sorularına nasıl cevap vereceğini gösteren kusursuz bir rehberdir. 

---

## 🛡️ HOCANIN "KANIT" SORUSUNA HAZIRLIK (ÇOK ÖNEMLİ!)

Hoca sunum esnasında veya sonunda **"Ben nereden bileceğim logları uydurmadığınızı, gerçekten sistemden aldığınızı?"** derse, bu senin için puan toplama fırsatıdır. Şöyle cevaplayacaksın:

1. **Sözlü Cevap:** *"Hocam, biz bu logları rastgele üretmedik. Arayüzümüzdeki 'Wazuh Kanıtı' sekmesinde de belirttiğimiz gibi, kendi kurduğumuz Ubuntu sunucumuzun içinde tam olarak şu dizindeki orijinal Wazuh dosyasını okuyoruz:* `/var/ossec/logs/alerts/alerts.json` *. Yazdığımız Python sunucusu saniye saniye SSH üzerinden bu dosyayı dinliyor ve Mac bilgisayarımıza çekiyor."*
2. **Görsel Kanıt (Video veya Canlı Terminal):** Hoca ikna olmazsa, sunumdan önce hazırladığın (Ubuntu'da `sudo tail -f /var/ossec/logs/alerts/alerts.json` komutu açıkken ekranda logların canlı canlı aktığını gösteren) ekran kaydını aç ve *"Hocam buyurun, Ubuntu'nun kendi sisteminden çekilmiş ham log akışı videomuz"* de. (Eğer kendine çok güveniyorsan bunu sunumda terminali açıp canlı da yapabilirsin, tam bir şov olur!)

---

## 🖥️ EKRANDAKİ SEKMELER NE İŞE YARIYOR?

Sunumu yaparken `sunum_app.html` üzerinden ilerleyeceksin. Sekmelerin ne olduğunu iyi bilmelisin:
*   **📊 Genel Bakış:** Sistemin o anki durumunu (Bağlantı var mı?), toplam log sayısını ve kaç tane uyarı olduğunu gösteren canlı göstergedir.
*   **🏗️ Mimari:** Sizin kurduğunuz sistemin haritasıdır (Mac -> Ubuntu -> Wazuh). *"Sistemi böyle kurduk"* demek içindir.
*   **⚔️ Saldırı Senaryoları:** Hangi saldırıları yapacağınızın teorik ve MITRE ATT&CK karşılıklarının yazdığı bilgi sayfasıdır.
*   **📋 Ham JSON Loglar:** "Wazuh logu neye benzer?" sorusunun cevabı olan örnek log formatıdır.
*   **✅ Wazuh Kanıtı:** Direkt olarak hocanın *"Veriyi nereden alıyorsunuz"* sorusuna cevap veren teknik kanıt sayfasıdır.
*   **⚡ Canlı Saldırı Demo:** **(ASIL ŞOV ALANIN)** Butonlara basıp gerçekten saldırı başlattığın ve Wazuh'un bunu sağ tarafta anında kırmızı kutularla yakaladığı interaktif ekrandır.
*   **🗄️ Tüm Log Arşivi:** Sistemdeki yüzlerce logun tablosudur. Yapay zekanın (XAI) neyi analiz edeceğini göstermek içindir.

---

## ⏱️ DAKİKA DAKİKA SUNUM AKIŞI (Toplam 5 Dakika)

*(Ön Hazırlık: Arka planda `attack_server.py` çalışıyor olacak. Tarayıcıda `sunum_app.html` sayfası açık ve **Genel Bakış** sekmesindesin. 1. Kişi teorik girişi bitirip sözü sana bırakıyor.)*

### [00:00 - 01:00] Sistemin Tanıtımı ve Mimari
*(Üst menüden "🏗️ Mimari" sekmesine tıkla)*
> "Teşekkürler. Ben Osman, projenin pratik kurulum ve saldırı simülasyonu ayağını üstlendim. Arkadaşlarımız teorik kısmı anlattı, peki biz bunu gerçekte nasıl uyguladık? 
> Tam şu an önümdeki bilgisayarın içinde izole bir Ubuntu sanal makinesi çalışıyor. Bu makineye açık kaynaklı Wazuh SIEM'i kurduk. Sadece kurmakla kalmadık, kendi yazdığımız arayüzle Ubuntu'nun derinliklerindeki logları saniye saniye buraya çekiyoruz. Hocam, biz log veri setini internetten hazır almadık; sistem şu an kendi loglarını canlı olarak kendisi üretiyor."

### [01:00 - 02:00] Saldırı 1: Brute-Force (Canlı Demo)
*(Üst menüden "⚡ Canlı Saldırı Demo" sekmesine tıkla)*
> "Wazuh'un tespit yeteneğini kanıtlamak için şimdi sisteme canlı bir siber saldırı düzenleyeceğiz. Tarayıcım üzerinden Ubuntu sunucusuna art arda hatalı SSH şifreleri yollayacağım." 
*(Kırmızı "SSH BRUTE-FORCE BAŞLAT" butonuna bas)*
> "Ekranda gördüğünüz gibi, **şu an SSH Brute-Force saldırı senaryosunu uyguladık**. Sol tarafta saldırganın başarısız giriş denemeleri akıyor. Sağ tarafa baktığımızda ise, **Wazuh bunu anında tespit etti ve 'Rule 5712 (Kritik Seviye 10)' kuralıyla logladı.**"

### [02:00 - 03:00] Saldırı 2: Yetki Yükseltme
> "İkinci senaryomuzda, saldırganın sistemi ele geçirip yetkisini artırmaya çalıştığını varsayıyoruz."
*(Sarı "SUDO YETKİ YÜKSELTME" butonuna bas)*
> "**Şu an Yetki Yükseltme (Privilege Escalation) senaryosunu uyguladık**. Saldırgan sistemde izinsiz olarak 'root' (yönetici) olmaya çalıştı. **Wazuh bu tehlikeli hareketi de anında 'Rule 5402' kuralıyla logladı.**"

### [03:00 - 04:00] JSON Analizi ve Kanıt (Hocanın Beklediği Kısım)
*(Sağ tarafa düşen uyarının üzerindeki 'JSON Gör 👁️' yazısına tıkla. Eğer ekranda log yoksa üst menüden '🗄️ Tüm Log Arşivi' sekmesine tıkla ve herhangi bir logun üstüne basarak JSON'u aç)*
> "Hocam, **işte bahsettiğimiz ham log (JSON) çıktılarımız tam olarak bunlardır.** *(Ekranda açılan JSON'u parmağınla göster)*
> Wazuh bize sadece 'saldırı var' demiyor. Bakın, bu JSON çıktısının içinde saldırganın IP adresi (srcip), bağlandığı port, hedef kullanıcı adı ve kuralın ağırlık seviyesi (Level) gibi tüm parametreler makinenin okuyabileceği yapılandırılmış bir formatta bulunuyor. Sistemimiz bizim için şu ana kadar yüzlerce bu şekilde ham log üretti ve arşivledi."

### [04:00 - 05:00] Kapanış ve Ahmet'e Pas Atma
> "Sonuç olarak; kurduğumuz sistem ayakta, saldırıları gerçek zamanlı tespit ediyor ve ham veriyi JSON formatında başarıyla dışarı aktarıyor.
> Fakat asıl problem tam bu noktada başlıyor: Önümüzde 500 satırlık devasa bir ham veri yığını var. Gerçek bir senaryoda siber güvenlik uzmanı günde akan binlerce JSON dosyasına bakarak ne anlayabilir? Geleneksel sistemlerdeki 'Alarm Yorgunluğu' (Alert Fatigue) problemini aşmak için, biz bu ham log parametrelerini alıp Açıklanabilir Yapay Zeka (XAI) modeli ile nasıl yorumluyoruz? 
> Bu sorunun cevabı için sözü Ahmet'e bırakıyorum."

---

## 🛠️ HOCANIN TEKNİK SORULARINA KARŞI SAVUNMA REHBERİ (MÜLAKAT İÇİN)

Eğer hoca "Bunu nasıl kurdunuz, hangi komutları çalıştırdınız, arka planda sistem nasıl işliyor?" diye sorarsa aşağıdaki teknik adımları tam bir uzman gibi anlatabilirsin:

### 1. Sistem Mimarisini Nasıl Kurduk?
**Soru:** "Sistem nerede çalışıyor? İnternetten hazır veri mi çekiyorsunuz?"
**Cevap:** "Hayır hocam, kendi Mac bilgisayarımın içerisinde **UTM Sanallaştırma programı** ile izole bir **Ubuntu 22.04** işletim sistemi kurduk. İnternetten hazır log çekmiyoruz; Ubuntu'nun kendi gerçek çekirdek loglarını kullanıyoruz."

### 2. Kurulum Komutları ve ARM64 Zorluğu
**Soru:** "Wazuh'u nasıl kurdunuz? Terminalden hangi komutları kullandınız?"
**Cevap:** "Kurulum işlemlerini Mac'in kendi terminalinden `ssh osman@192.168.64.4` komutuyla Ubuntu'ya uzaktan bağlanarak gerçekleştirdik. 
Benim bilgisayarım Apple Silicon (M serisi) yani ARM64 mimarisine sahip. Wazuh'un standart x86 paketleri çalışmadığı için, standart kurulum komutları yerine ARM mimarisine özel derlenmiş paketi bulup sisteme indirdik. Kurulumu `sudo dpkg -i wazuh-manager_4.14.5.deb` komutu ile sıfırdan sistemin çekirdeğine entegre ederek yaptık. Ardından `sudo systemctl start wazuh-manager` komutu ile servisi başlattık."

### 3. Logları Nereden ve Nasıl Okuyoruz?
**Soru:** "Wazuh bu saldırıları nereden biliyor? Konfigürasyonu nasıl yaptınız?"
**Cevap:** "Ubuntu'nun `ossec.conf` (Wazuh yapılandırma) dosyasının içine girerek konfigürasyonu manuel olarak değiştirdik. Wazuh'a Linux'un ana güvenlik günlükleri olan `journald` ve `/var/log/auth.log` dosyalarını gerçek zamanlı izlemesi talimatını verdik. Wazuh bu logları saniye saniye okuyup kendi 5000'den fazla güvenlik kuralıyla eşleştiriyor ve bulduğu tehditleri yapılandırılmış JSON formatında `/var/ossec/logs/alerts/alerts.json` dosyasına yazıyor. Bizim arayüzümüz tam olarak bu dosyayı çekiyor."

### 4. Arayüzdeki Saldırılar Gerçekte Hangi Komutla Çalışıyor?
**Soru:** "Ekranda butona basıyorsun ama arka planda gerçekten ne oluyor?"
**Cevap:** "Python tabanlı bir API (soket sunucusu) yazdık. Ben butona bastığımda Python kodu SSH üzerinden Ubuntu'nun içine girip şu komutları çalıştırıyor:
*   **Brute-Force için:** Ubuntu'nun güvenlik duvarı (Fail2Ban/MaxStartups) bizi art arda gerçek SSH attığımızda blokladığı için, sistemi test edebilmek adına işletim sisteminin tam kalbine sahte log enjekte etme yöntemini kullandık. `sudo logger -t sshd 'Invalid user hacker from 192.168.64.1 port 55000'` komutunu art arda 8 kez ateşliyoruz. Wazuh bunu gerçek bir SSH atağı sanıp **Rule 5712 (Level 10)** alarmını üretiyor.
*   **Yetki Yükseltme için:** `sudo cat /var/ossec/logs/alerts/alerts.json` komutunu gönderiyoruz. Kullanıcının `sudo` yetkisi kullandığını gören Wazuh anında **Rule 5402** alarmını veriyor.

Hocam özetle; sanal makineyi sıfırdan kurduk, ağ bağlantılarını yaptık, ARM mimarisine göre konfigüre ettik, log dosyalarını bağladık ve doğrudan terminal komutlarıyla sistemi test eden interaktif bir sunum hazırladık."
