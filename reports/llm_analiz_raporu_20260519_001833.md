# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:19:01  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

Siber Güvenlik Analisti ve SIEM Uzmanı olarak Ubuntu 22.04 sunucunuzdan alınan log kayıtlarını inceledim. Aşağıda her dosya için ayrı ayrı tespitlerimi, ciddiyet derecesini ve yapılması gerekenleri basit bir dille anlatan raporu bulacaksınız.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

**Bu dosyada neler oldu:**

Bu dosya, sisteme kimlerin ne zaman girmeye çalıştığını, hangi kullanıcıların yetki aldığını gösterir. Kayıtlara göre sisteminizde **çok ciddi** güvenlik olayları yaşanmıştır:

1.  **Yönetici Yetkisi Başarılı Bir Şekilde Alınmış:** "osman" adında bir kullanıcı, sistemin en yüksek yetkisi olan yönetici (root) yetkisini kullanarak `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` komutunu çalıştırmıştır. Bu durum iki farklı olay olarak iki kez kaydedilmiş. Bu komut, bir güvenlik izleme aracı olan OSSEC'in uyarı kayıtlarını canlı olarak takip etmeye yarıyor. Bir kullanıcının bu şekilde yönetici yetkisiyle güvenlik uyarılarını izlemesi, sistemde şüpheli bir eylem gerçekleştirdikten sonra iz bırakmamak veya güvenlik ekibinin tepkisini anlamak istemesi anlamına gelebilir.
2.  **Yoğun Kaba Kuvvet Saldırısı:** 192.168.64.1 IP adresinden sisteminize SSH (uzaktan güvenli bağlantı) üzerinden 97 kez başarısız giriş denemesi yapılmış. Bu, saldırganın doğru şifreyi tahmin etmeye çalıştığı ciddi bir "kaba kuvvet" saldırısıdır.
3.  **Diğer Kaba Kuvvet Denemeleri:** 1.1.1.1 ve 1.1.1.2 IP adreslerinden de benzer şekilde başarısız SSH giriş denemeleri olmuş, ancak bunlar daha az sayıda olduğu için ciddiyetleri biraz daha düşüktür.

**Ne kadar ciddi:**

**Çok Yüksek Ciddiyette!** 'osman' kullanıcısının yönetici yetkisi alması, bir saldırganın (veya tehlikeli bir iç kullanıcının) sisteminiz üzerinde tam kontrol sağlayabileceği anlamına gelir. Bu, veri çalmaktan, sistemi tamamen bozmaya kadar her şeyi yapabilir. Kaba kuvvet saldırıları ise dışarıdan aktif bir tehlike olduğunu ve sisteminizin hedef alındığını gösterir.

**Hemen ne yapılmalı:**

1.  **Sistemi Karantinaya Alın:** Mümkünse sunucunun dış ağ ile bağlantısını kesin veya en azından kritik ağlardan izole edin. Bu, olası bir saldırganın daha fazla zarar vermesini veya başka sistemlere yayılmasını engeller.
2.  **'osman' Kullanıcısını İnceleyin:**
    *   'osman' kullanıcısının şifresini **HEMEN** değiştirin.
    *   'osman' kullanıcısının `sudo` yetkilerini geçici olarak askıya alın veya hesabını kilitleyin.
    *   Bu kullanıcının sistemdeki diğer tüm aktivitelerini (çalıştırdığı komutlar, eriştiği dosyalar vb.) detaylıca inceleyin.
3.  **Saldıran IP Adreslerini Engelleyin:** 192.168.64.1, 1.1.1.1 ve 1.1.1.2 IP adreslerinden gelen SSH bağlantılarını güvenlik duvarınızda (firewall) **acil olarak** engelleyin.
4.  **SSH Güvenliğini Artırın:**
    *   SSH bağlantısı için sadece şifre yerine, daha güvenli olan anahtar tabanlı kimlik doğrulamasına geçin ve şifre ile girişi kapatın.
    *   SSH varsayılan portu olan 22'yi başka, standart olmayan bir porta taşıyın.
    *   `fail2ban` gibi araçları kurarak ve yapılandırarak bu tür kaba kuvvet saldırılarını otomatik olarak engelleyin.

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

**Bu dosyada neler oldu:**

Bu dosya, genel sistem mesajlarını, ağ olaylarını ve zamanlanmış görevlerin (cron) kayıtlarını içerir. Kayıtlarda herhangi bir şüpheli veya tehlikeli bir durum **tespit edilmedi**. Genellikle sistemin normal işleyişine dair bilgiler yer alıyor.

**Ne kadar ciddi:**

**Düşük Ciddiyette.** Bu dosya özelinde acil bir tehdit bulunmamaktadır. Ancak bu, sistemin tamamen güvenli olduğu anlamına gelmez, diğer dosyalardaki ciddi bulguları göz ardı etmemek gerekir.

**Hemen ne yapılmalı:**

Bu dosya özelinde acil bir müdahale gerekmemektedir. Ancak genel güvenlik kontrolleri kapsamında izlenmeye devam etmelidir.

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

**Bu dosyada neler oldu:**

Bu dosya, sistemin kalbi olan çekirdek (kernel) ile ilgili bilgileri ve güvenlik mekanizmalarının raporlarını kaydeder. Kayıtlara göre sisteminizde **orta ciddiyette** bazı olaylar yaşanmıştır:

1.  **AppArmor Engellemeleri:** AppArmor, Linux sistemlerinde çalışan bir güvenlik duvarı gibi düşünebilirsiniz. Belirli programların veya işlemlerin sistemde yapabileceklerini sınırlar. Loglarda, AppArmor'ın "sys_nice" (işlem önceliği ayarlama), "/proc/pressure/memory" (bellek durumu izleme) ve "net_admin" (ağ yönetimi) gibi fonksiyonlara erişmeye çalışan bazı programları **başarılı bir şekilde engellediği** görülmektedir. Bu engellemeler birçok kez gerçekleşmiştir.

**Ne kadar ciddi:**

**Orta Ciddiyette.** AppArmor'ın bu girişimleri engellemiş olması iyi bir haberdir, bu güvenlik mekanizmasının çalıştığını gösterir. Ancak, bu engellemelerin neden kaynaklandığı önemlidir. Ya bir program yanlış yapılandırılmış bir şekilde yetki istiyor ya da sistemde kötü niyetli bir yazılım veya kullanıcı, AppArmor'ı aşmaya çalışıyor olabilir. Engellenen bu girişimlerin sayısı fazladır, bu da altında yatan bir sorunun olabileceğini düşündürüyor.

**Hemen ne yapılmalı:**

1.  **AppArmor Engellemelerinin Kaynağını Araştırın:** Bu engellemelerin hangi program veya işlem tarafından tetiklendiğini bulmaya çalışın. Bu, sisteminizde kurulu meşru bir uygulamanın hatalı davranışından mı, yoksa bir saldırganın veya zararlı yazılımın hareketi mi olduğunu anlamanıza yardımcı olacaktır.
2.  **AppArmor Profillerini Gözden Geçirin:** Eğer bu engellemeler meşru bir uygulama tarafından yapılıyorsa, AppArmor profilini gözden geçirip gerekli izinleri eklemeniz gerekebilir. Ancak dikkatli olun, bu güvenlik duvarını zayıflatmamaya özen gösterin. Eğer kötü niyetli bir girişimse, AppArmor'ın koruma sağladığından emin olun.

---

## ⚠️ Genel Risk Değerlendirmesi

**Risk Skoru: Çok Yüksek**

Sisteminiz şu anda **ciddi bir güvenlik ihlali** yaşamış veya yaşamakta. 'osman' kullanıcısı aracılığıyla yönetici yetkisinin başarıyla alınması, sistemin kontrolünün ele geçirilmiş olabileceği anlamına gelir. Bu durum, veri kaybı, veri sızması veya sistemin tamamen devre dışı kalması gibi çok büyük riskler taşır. Dışarıdan gelen kaba kuvvet saldırıları ise sisteminizin aktif olarak hedef alındığını gösterir. AppArmor'ın engellemeleri bir savunma mekanizmasının çalıştığını gösterse de, bu girişimlerin kaynağı netleşmeden rahatlamamak gerekir.

## 🛡️ Acil Müdahale Adımları

Bu adımlar **sıralı olarak ve mümkün olan en kısa sürede** uygulanmalıdır:

1.  **Sistemi Ağından Ayırın (Karantina):**
    *   Sunucunun internet ve diğer ağlarla olan tüm bağlantısını geçici olarak kesin. Fiziksel bir sunucuysa ağ kablosunu çekin, sanal sunucuysa ağ arayüzünü devre dışı bırakın.
    *   *Komut Örneği (SSH ile bağlantı kesilmeden önce yapın!):* `sudo systemctl stop networking` (veya `sudo ip link set ens33 down` gibi ağ arayüzünüzün adına göre).

2.  **Saldıran IP Adreslerini Engelleyin:**
    *   192.168.64.1, 1.1.1.1 ve 1.1.1.2 IP adreslerinden gelen tüm bağlantıları güvenlik duvarı üzerinden engelleyin.
    *   *Komut Örnekleri (UFW kuruluysa):*
        ```bash
        sudo ufw deny from 192.168.64.1 to any
        sudo ufw deny from 1.1.1.1 to any
        sudo ufw deny from 1.1.1.2 to any
        sudo ufw enable
        ```
    *   *Komut Örnekleri (iptables kullanılıyorsa):*
        ```bash
        sudo iptables -A INPUT -s 192.168.64.1 -j DROP
        sudo iptables -A INPUT -s 1.1.1.1 -j DROP
        sudo iptables -A INPUT -s 1.1.1.2 -j DROP
        sudo iptables-save | sudo tee /etc/iptables/rules.v4 # Değişiklikleri kalıcı yapmak için
        ```

3.  **'osman' Kullanıcısının Şifresini Değiştirin ve Yetkilerini İnceleyin:**
    *   'osman' kullanıcısının şifresini karmaşık ve benzersiz bir şifre ile hemen değiştirin.
    *   *Komut Örneği:* `sudo passwd osman`
    *   'osman' kullanıcısının `sudo` yetkilerini geçici olarak kaldırın veya hesabını kilitleyin.
    *   *Komut Örneği (Hesabı kilitlemek için):* `sudo usermod -L osman`
    *   'osman' kullanıcısının son oturumlarını ve komut geçmişini inceleyin (ancak saldırgan komut geçmişini silmiş olabilir).
    *   *Komut Örneği (auth.log'u filtrelemek için):* `sudo grep "osman" /var/log/auth.log`

4.  **SSH Servis Güvenliğini Artırın:**
    *   `sshd_config` dosyasını düzenleyerek şifre tabanlı kimlik doğrulamayı kapatın ve sadece anahtar tabanlı kimlik doğrulamayı zorunlu kılın.
    *   Varsayılan SSH portu 22'yi değiştirin.
    *   *Komut Örneği (Değişiklikleri uygulamak için):* `sudo systemctl restart ssh`
    *   `fail2ban` kurun ve yapılandırın.

5.  **Kapsamlı Sistem İncelemesi (Adli Bilişim):**
    *   Sistemde başka şüpheli kullanıcı hesapları olup olmadığını kontrol edin.
    *   Yüklenmiş veya değiştirilmiş şüpheli dosyalar, programlar (rootkitler, arka kapılar) arayın.
    *   `netstat -tulnp` komutuyla açıkta dinleyen (listening) şüpheli ağ servisleri olup olmadığını kontrol edin.
    *   Tüm log dosyalarını (auth.log, syslog, kern.log, apt/history.log vb.) detaylıca, geriye dönük olarak inceleyin.
    *   Sisteminizdeki tüm yazılımların güncel olduğundan emin olun.

6.  **Yedekten Geri Dönüş veya Yeniden Kurulum:**
    *   Sistemin ne zaman güvenli durumda olduğundan emin olamıyorsanız, en son bilinen temiz bir yedekten geri dönmeyi veya sistemi baştan temiz bir şekilde kurmayı ciddi olarak düşünün. Güvenlik ihlalinden sonra sistemi tamamen temizlemek genellikle en güvenli yöntemdir.

Bu adımları uygularken dikkatli olun ve emin olmadığınız durumlarda uzman desteği alın. Güvenliğiniz için bu süreç kritik öneme sahiptir.