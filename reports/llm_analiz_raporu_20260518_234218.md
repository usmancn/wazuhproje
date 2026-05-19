# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-18 23:42:47  
**LLM:** GEMINI  
**Toplam Bulgu:** 25 (3 KRİTİK, 0 YÜKSEK)  

---

Sayın Yetkililer,

Ubuntu 22.04 sunucunuzdan alınan log dosyalarını (kayıt günlüklerini) detaylı bir şekilde inceledim. Bu incelemeler sonucunda sisteminizdeki mevcut durum ve alınması gereken önlemler aşağıda raporlanmıştır.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

Bu dosya, sisteme giriş denemeleri, kullanıcıların yetki alıp almadığı gibi kimlik doğrulama ile ilgili önemli bilgileri içerir.

**Bu dosyada neler oldu:**
1.  **Sisteme Kaba Kuvvet Saldırısı:** `192.168.64.1` adlı bir dış IP adresi, sisteminize SSH üzerinden tam 81 kez başarısız giriş denemesi yapmıştır. Bu durum, "kaba kuvvet saldırısı" olarak adlandırılır. Saldırgan, doğru şifreyi tahmin edene kadar farklı şifre kombinasyonlarını denemektedir.
2.  **Yönetici Yetkisi Alınması:** `osman` adlı bir kullanıcı, `sudo` komutunu kullanarak iki kez yönetici (root) yetkisi almıştır. Yönetici yetkisi, sistemde her türlü değişikliği yapabilme, dosya silme, program kurma gibi en üst düzey izinlere sahip olmak demektir. `osman` kullanıcısının çalıştırdığı komut `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` olsa da (bu komut genellikle güvenlik uyarılarını anlık izlemek için kullanılır), önemli olan bu yetkiyi almış olmasıdır.

**Ne kadar ciddi:**
*   **Kaba Kuvvet Saldırısı:** Çok ciddi. Bu, sisteminizin sürekli olarak dışarıdan bir saldırı altında olduğunu gösterir. Başarılı bir şifre tahmini, saldırganın sisteminize tam erişim sağlamasına neden olabilir.
*   **Yönetici Yetkisi Alınması:** **Çok çok kritik!** Bir kullanıcının yönetici yetkisi almış olması, sistemin bütünlüğünü ve güvenliğini doğrudan tehlikeye atmaktadır. Ya `osman` kullanıcısının şifresi ele geçirilmiş ya da `osman` yetkisini kötüye kullanmaktadır. Bu, sisteme tam erişim demektir ve saldırgan (veya kötü niyetli kullanıcı) istediği her şeyi yapabilir.

**Hemen ne yapılmalı:**
*   Saldırgan IP adresi `192.168.64.1` derhal sisteminizin güvenlik duvarından (firewall) engellenmelidir.
*   `osman` kullanıcısının şifresi hemen değiştirilmeli ve hesabı geçici olarak kilitlenmelidir. Bu kullanıcının son zamanlardaki tüm hareketleri detaylıca incelenmelidir.
*   Sistemdeki tüm kullanıcıların şifreleri çok güçlü (karmaşık ve uzun) olmalı ve düzenli olarak değiştirilmelidir.
*   SSH bağlantıları için şifre yerine sadece anahtar tabanlı (SSH Key) doğrulama kullanılmalı ve şifre ile giriş devre dışı bırakılmalıdır.
*   SSH bağlantısı için kullanılan standart port (22) farklı, daha az bilinen bir port numarasına taşınmalıdır.

---

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

Bu dosya, genel sistem mesajlarını, ağ faaliyetlerini ve zamanlanmış görevlerin (cron) bilgilerini içerir.

**Bu dosyada neler oldu:**
Bu log dosyasında herhangi bir olağanüstü durum veya güvenlik tehdidi tespit edilmemiştir. Sistem rutin işlemlerini sorunsuz bir şekilde sürdürmüş gibi görünüyor.

**Ne kadar ciddi:**
Bu dosyada herhangi bir kritik veya ciddi durum bulunmadığı için acil bir endişe kaynağı yoktur.

**Hemen ne yapılmalı:**
Bu dosyada acil bir eylem gerekmiyor. Ancak, diğer loglardaki bulgular ışığında genel sistem sağlığı göz önünde bulundurulmalıdır.

---

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

Bu dosya, sistemin temel işletim sistemi çekirdeği (kernel), bellek kullanımı ve AppArmor gibi güvenlik mekanizmalarıyla ilgili bilgileri içerir.

**Bu dosyada neler oldu:**
Sisteminizdeki "AppArmor" adlı güvenlik duvarı (bir nevi koruyucu kalkan), 22 farklı olayda belirli programların veya eylemlerin gerçekleşmesini engellemiştir. Engellenen programlar arasında 'sys_nice', '/proc/pressure/memory' ve 'net_admin' gibi sistem kaynaklarına erişmeye çalışan öğeler bulunmaktadır. AppArmor, bu eylemleri potansiyel güvenlik riski veya yetkisiz işlem olarak algılamıştır.

**Ne kadar ciddi:**
Bu durum orta derecede ciddi. AppArmor'ın bu engellemeleri yapması, aslında güvenlik mekanizmanızın görevini başarıyla yerine getirdiğini gösterir. Bu iyi bir şeydir, çünkü potansiyel olarak zararlı veya yetkisiz bir eylemi durdurmuştur. Ancak, bu kadar çok engelleme olayı, çalışan bir programın doğru yapılandırılmadığını veya kötü niyetli bir yazılımın sistemde bir şeyler yapmaya çalıştığını da gösterebilir.

**Hemen ne yapılmalı:**
Engellenen programların ne amaçla bu eylemleri yapmaya çalıştığı araştırılmalıdır.
*   Eğer bu programlar sisteminizin bilinen ve güvenilir parçaları ise, AppArmor politikaları dikkatlice incelenmeli ve gerekli izinler verilmelidir.
*   Eğer bu programlar bilinmeyen veya şüpheli ise, bunlar sistemden kaldırılmalı veya daha derinlemesine incelenmelidir. Bu engellemelerin ardında kötü amaçlı bir yazılım girişimi olabilir.

---

## ⚠️ Genel Risk Değerlendirmesi

**Özet Risk Skoru:** Yüksek / Kritik (Critical)

**Açıklama:**
Sisteminizin genel güvenlik durumu, özellikle 'auth.log' dosyasındaki bulgular nedeniyle **oldukça kritik** seviyededir.

*   **En Büyük Risk:** `osman` adlı kullanıcının yönetici (root) yetkisi almış olması, sistemin tamamen tehlike altında olduğunu göstermektedir. Bu, bir saldırganın veya yetkili bir kullanıcının sistemi kontrol ettiği anlamına gelebilir ve sistemin bütünlüğünü, gizliliğini ve erişilebilirliğini ciddi şekilde tehlikeye atmaktadır.
*   **Sürekli Tehdit:** Dışarıdan gelen kaba kuvvet (şifre deneme) saldırıları, sisteme sürekli bir giriş denemesi olduğunu ve zayıf bir anın kollanmaya devam ettiğini göstermektedir.
*   **İzlenmesi Gereken Durum:** AppArmor güvenlik duvarının engellemeleri olumlu olsa da, bu engellemelerin altında yatan nedeni anlamak ve potansiyel güvenlik açıklarını kapatmak önemlidir.

Bu sistemin **acil müdahaleye** ihtiyacı vardır. Gecikme, daha büyük güvenlik ihlallerine veya veri kaybına yol açabilir.

---

## 🛡️ Acil Müdahale Adımları

Bu adımlar, kritik bulgular göz önünde bulundurularak öncelik sırasına göre belirlenmiştir ve sisteminizin güvenliğini hızla artırmayı amaçlamaktadır:

1.  **'osman' Kullanıcısını İnceleyin ve Etkisiz Hale Getirin (Çok Acil ve Birinci Öncelik):**
    *   **Şifreyi Değiştirin veya Hesabı Kapatın:** `osman` kullanıcısının şifresini derhal çok güçlü ve tahmin edilemez bir şifreyle değiştirin. Şüpheli bir durum devam ederse, hesabı geçici olarak kilitleyin veya tamamen devre dışı bırakın.
        ```bash
        sudo passwd osman             # Yeni güçlü bir şifre belirleyin
        sudo usermod -L osman         # Kullanıcının sisteme girişini engellemek için hesabı kilitler
        ```
    *   **Aktiviteyi İnceleyin:** `osman` kullanıcısının yönetici yetkisini aldığı zaman dilimindeki ve sonrasındaki tüm aktivitelerini (çalıştırdığı komutlar, eriştiği dosyalar) detaylıca inceleyin. Sudo logları bu konuda size yardımcı olacaktır:
        ```bash
        grep "sudo" /var/log/auth.log
        ```
    *   **Yetkiyi Sorgulayın:** `osman` kullanıcısının neden yönetici yetkisi aldığı ve bu yetkiyi alırken kullanılan yöntemin normal bir işlem mi yoksa bir açık mı olduğu araştırılmalıdır.

2.  **Saldıran IP Adresini Engelleyin (Acil):**
    *   Kaba kuvvet saldırısı yapan `192.168.64.1` IP adresini sisteminizin güvenlik duvarında (Ubuntu'da genellikle `ufw`) derhal kalıcı olarak engelleyin.
        ```bash
        sudo ufw deny from 192.168.64.1 comment 'SSH Bruteforce Attack' # UFW kullanıyorsanız
        sudo ufw reload # Güvenlik duvarı kurallarını yeniden yükleyin
        ```
    *   **Otomatik Engelleme Aracı Kurun:** `fail2ban` gibi otomatik saldırı engelleme araçlarını kurarak, benzer kaba kuvvet saldırılarının önüne otomatik olarak geçebilirsiniz.

3.  **SSH Güvenliğini Artırın (Acil):**
    *   **Port Değişikliği:** SSH servisini standart `22` numaralı port yerine, `2222` gibi daha az bilinen, yüksek numaralı başka bir porta taşıyın.
        ```bash
        sudo nano /etc/ssh/sshd_config # Dosyayı düzenleyici ile açın
        # "Port 22" yazan satırı bulun, başına '#' koyarak yoruma alın veya "Port 2222" olarak değiştirin (örneğin)
        sudo systemctl restart ssh    # SSH servisini yeniden başlatın
        ```
    *   **Şifresiz Giriş Zorunluluğu:** Şifre ile giriş yerine sadece anahtar tabanlı (SSH Key) kimlik doğrulamasını zorunlu kılın ve şifre ile girişi tamamen devre dışı bırakın. Bu, güvenlik seviyesini önemli ölçüde artıracaktır.
        ```bash
        sudo nano /etc/ssh/sshd_config
        # PasswordAuthentication yes  --> PasswordAuthentication no
        # ChallengeResponseAuthentication yes --> ChallengeResponseAuthentication no
        # UsePAM yes --> UsePAM no (Bu ayar için dikkatli olunmalı, bazı sistemlerde farklı etkileri olabilir.)
        sudo systemctl restart ssh
        ```
    *   **Root Girişini Engelle:** `PermitRootLogin no` ayarının SSH yapılandırma dosyasında etkin olduğundan emin olun. Bu, `root` kullanıcısının doğrudan SSH ile giriş yapmasını engeller.

4.  **AppArmor Engellemelerini İnceleyin (Orta Öncelik):**
    *   AppArmor'ın engellediği 'sys_nice', '/proc/pressure/memory', 'net_admin' gibi sistem eylemlerinin hangi uygulamalar tarafından tetiklendiğini ve neden bu eylemleri yapmaya çalıştığını araştırın.
    *   Eğer bilinen ve güvenilir bir uygulama ise, AppArmor politikalarını gerektiği gibi güncelleyin (ancak her değişikliği dikkatle yapın!). Eğer bilinmeyen veya şüpheli bir uygulama ise, derhal kaldırılmalıdır.

5.  **Genel Sistem Kontrolü ve Temizliği:**
    *   Tüm sistemde `osman` kullanıcısı veya root yetkisiyle çalışan başka şüpheli dosya veya süreç olup olmadığını kontrol edin.
    *   Sistemde kurulu olan tüm paketlerin güncel olduğundan emin olun:
        ```bash
        sudo apt update && sudo apt upgrade
        ```
    *   Güvenlik duvarınızın (ufw veya iptables) doğru yapılandırıldığından ve sadece gerekli portlara izin verdiğinden emin olun.
    *   Sisteminizi düzenli olarak yedeklemeyi unutmayın ve bu yedekleri güvenli, ayrı bir yerde saklayın.

Bu adımların hızlı ve dikkatli bir şekilde uygulanması, sisteminizin mevcut güvenlik risklerini azaltacak ve gelecekteki olası saldırılara karşı daha dirençli hale getirecektir.