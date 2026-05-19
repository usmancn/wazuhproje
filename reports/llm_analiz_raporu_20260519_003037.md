# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:31:07  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

Merhaba,

Elinizdeki Ubuntu 22.04 sunucusundan alınan log dosyalarını detaylı olarak inceledim. Aşağıda her bir dosya için ayrı ayrı tespitlerimi, risk seviyelerini ve yapılması gereken acil müdahale adımlarını bulabilirsiniz.

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

Bu dosya, sisteme kimlerin, ne zaman ve nasıl giriş yapmaya çalıştığını gösteren kayıtları içerir. Kullanıcı girişleri, yönetici yetkisi kullanımları gibi kritik bilgilerin tutulduğu yerdir.

**Bu dosyada neler oldu?**
*   **İç Ağdan Kaba Kuvvet Saldırısı:** 192.168.64.1 IP adresinden, sisteme uzaktan erişim (SSH) için tam 113 kez başarısız şifre denemesi yapılmış. Bu, saldırganın deneme yanılma yöntemiyle şifrenizi bulmaya çalıştığı anlamına gelir. **Daha da önemlisi, bu IP adresi içeriden bir kaynak, yani ağınızın içinden bir cihaz ya bu saldırıyı yapıyor ya da ele geçirilmiş durumda.**
*   **Yönetici Yetkisini Kullanma (osman kullanıcısı):** 'osman' adında bir kullanıcı, iki farklı zamanda `sudo` komutunu kullanarak root (sistemin en yetkili kullanıcısı, yani yönetici) yetkisi almış. Çalıştırılan komutlar `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` gibi bir güvenlik log dosyasını izlemeye yönelik olsa da, bir kullanıcının yönetici yetkisi alması her zaman dikkatle incelenmelidir. Bu işlem kasıtlı ve yetkili mi yapıldı, yoksa 'osman' kullanıcısı ele mi geçirildi?
*   **Harici Kaba Kuvvet Saldırıları:** 1.1.1.1 ve 1.1.1.2 gibi harici IP adreslerinden de SSH üzerinden sisteme giriş denemeleri olmuş. Bunlar şimdilik birer deneme ile sınırlı kalmış olsa da, bu tür denemeler internete açık her sunucuda sürekli karşılaşılan bir durumdur.

**Ne kadar ciddi?**
**ÇOK CİDDİ (CRITICAL).** Özellikle iç ağdan gelen kaba kuvvet saldırısı ve 'osman' kullanıcısının yönetici yetkisini kullanması, sistem güvenliğinde yüksek alarm verilmesi gereken durumlardır. İç ağdan gelen saldırı, ağınızdaki başka bir cihazın tehlike altında olabileceğini veya sisteminize içeriden sızılmış olabileceğini gösterir. 'osman' kullanıcısının yönetici yetkisi alması ise ya yetki suistimali ya da kullanıcı hesabının ele geçirilmesi anlamına gelebilir.

**Hemen ne yapılmalı?**
1.  **192.168.64.1 IP'sini acilen engelleyin.** Bu IP adresinin hangi cihaza ait olduğunu tespit edin ve o cihazı ağdan ayırarak detaylı incelemeye alın.
2.  **'osman' kullanıcısının hesabını inceleyin.** Bu yetki yükseltme işlemini 'osman' kendisi mi yaptı, yoksa hesabı ele mi geçirildi? Eğer yetkisiz bir durumsa, 'osman' kullanıcısının şifresini hemen değiştirin veya hesabını geçici olarak kilitleyin. Bu kullanıcının `sudo` yetkisi olup olmadığını ve neden böyle bir komutu çalıştırdığını araştırın.
3.  Diğer harici IP adreslerini (1.1.1.1, 1.1.1.2) de SSH bağlantısı için engelleyin.
4.  SSH bağlantı güvenliğini artırıcı önlemler alın (örneğin, şifre ile giriş yerine sadece anahtar dosyası ile giriş, varsayılan SSH portunu değiştirme, sürekli başarısız giriş denemelerini otomatik engelleyen yazılımlar kullanma).

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

Bu dosya, genel sistem mesajlarını, ağ faaliyetlerini, planlanmış görevlerin (cron) çalışmalarını ve çeşitli sistem uygulamalarından gelen bilgileri içerir.

**Bu dosyada neler oldu?**
İncelemeler sonucunda, bu dosyada herhangi bir tehdit veya anormal aktiviteye dair bir bulgu tespit edilmemiştir. Sistem, rutin işlemlerini normal şekilde kaydetmiş görünmektedir.

**Ne kadar ciddi?**
**CİDDİYET YOK (Tehdit Algılanmadı).** Bu, bu log dosyasının gözlemlendiği süre boyunca genel sistem işleyişinde, ağ veya planlanmış görevlerde belirgin bir problem yaşanmadığını gösterir.

**Hemen ne yapılmalı?**
Bu dosya özelinde acil bir müdahale gerekmemektedir. Ancak genel güvenlik kontrolleri kapsamında, diğer log dosyalarından gelen bilgiler ışığında genel sistem sağlığı gözden geçirilmelidir.

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

Bu dosya, sistemin çekirdeği (kernel) ile ilgili bilgileri, bellek yönetimini ve güvenlik duvarı AppArmor'ın aktivitelerini kaydeder. Sistem çekirdeği, işletim sisteminin beyni gibidir.

**Bu dosyada neler oldu?**
AppArmor güvenlik duvarı tarafından tam 22 kez çeşitli programların veya işlemlerin çalışması engellenmiş. Engellenenler arasında 'sys_nice' (işlem önceliği ayarlama), '/proc/pressure/memory' (bellek durumu bilgisine erişim) ve 'net_admin' (ağ yönetimi) gibi sistem kaynaklarına veya yetkilerine yönelik denemeler bulunuyor.

**Ne kadar ciddi?**
**ORTA DÜZEYDE CİDDİYET (MEDIUM).** İyi haber şu ki, AppArmor güvenlik duvarı görevini başarıyla yerine getirmiş ve potansiyel olarak zararlı olabilecek bu işlemleri engellemiş. Bu, ek bir güvenlik katmanının çalıştığını ve sistemi koruduğunu gösterir. Ancak kötü haber ise, bu kadar çok engellemenin neden kaynaklandığının bilinmemesi. Bu, ya hatalı çalışan bir uygulamanın yan etkisi ya da bir saldırganın veya kötü niyetli bir yazılımın sistemin hassas bölgelerine erişmeye çalıştığının bir göstergesi olabilir.

**Hemen ne yapılmalı?**
1.  **Engellenen işlemlerin kaynağını araştırın.** Bu bloklamalara hangi program veya süreçler neden oldu? Bu programlar sisteminizde normalde çalışan uygulamalar mı, yoksa şüpheli bir kaynaktan mı geliyor? Bu bloklamaların ardında yatan amacı anlamak kritik öneme sahiptir.
2.  AppArmor profillerinizi gözden geçirin. Eğer bu engellemeler meşru bir uygulamadan kaynaklanıyorsa, uygulamanın çalışabilmesi için AppArmor kuralını güncellemeniz gerekebilir. Ancak önce kaynağın güvenli olduğundan emin olun.

## ⚠️ Genel Risk Değerlendirmesi

Tüm bulgular ışığında, sisteminizin şu anki genel risk skoru **YÜKSEK** olarak belirlenmiştir.

**Açıklama:**
Sisteminiz ciddi bir güvenlik tehdidi altındadır.
*   **İç ağdan gelen kaba kuvvet saldırısı**, ağınız içinde bir zayıf nokta veya ele geçirilmiş bir sistem olabileceğine dair güçlü bir işaret. Bu, en acil ele alınması gereken konudur.
*   **'osman' kullanıcısının yönetici yetkisi alması**, eğer bu yetkisiz veya habersiz olduysa, sisteminize zaten bir sızma gerçekleştiğini veya içeriden bir tehdit olduğunu düşündürüyor.
*   **AppArmor'ın sıkça bloklama yapması**, aktif bir güvenlik katmanınızın çalıştığını gösterse de, bu kadar çok engellenen işlemin varlığı, sisteminizde kötü niyetli veya hatalı bir aktivitenin devam ettiğini belirtir.

Bu bulgular, sisteminizin aktif olarak saldırı altında olduğunu ve acil müdahale gerektiren zafiyetlere sahip olduğunu göstermektedir.

## 🛡️ Acil Müdahale Adımları

Aşağıdaki adımları sıralı bir şekilde uygulamanız, sisteminizin güvenliğini artırmak için kritik öneme sahiptir:

1.  **Saldıran IP Adreslerini Engelle:**
    *   İç ağdan gelen 192.168.64.1 ve harici 1.1.1.1, 1.1.1.2 IP adreslerini güvenlik duvarınız (Ubuntu'da `ufw` veya `iptables`) üzerinden SSH portuna (varsayılan 22) erişimini engelleyin.
    *   **Örnek Komutlar (ufw kullanıyorsanız):**
        ```bash
        sudo ufw deny from 192.168.64.1 to any port 22
        sudo ufw deny from 1.1.1.1 to any port 22
        sudo ufw deny from 1.1.1.2 to any port 22
        sudo ufw reload
        ```
    *   `192.168.64.1` IP'sinin hangi iç ağ cihazına ait olduğunu tespit edin ve o cihazı ağdan ayırarak detaylı incelemeye alın.

2.  **'osman' Kullanıcısını İncele ve Gerekirse Kilitle:**
    *   'osman' kullanıcısının yönetici yetkisi almasının meşru bir işlem olup olmadığını derhal teyit edin.
    *   Eğer şüpheli bir durum varsa veya teyit edemiyorsanız, 'osman' kullanıcısının hesabını geçici olarak kilitleyin:
        ```bash
        sudo passwd -l osman
        # veya hesabı askıya almak için:
        # sudo usermod --expiredate 1 osman
        ```
    *   'osman' kullanıcısının şifresini derhal değiştirin.
    *   `sudo` yetkilerini hangi kullanıcılara verdiğinizi kontrol edin (`sudo visudo` komutu ile `sudoers` dosyasını inceleyebilirsiniz).

3.  **SSH Güvenliğini Artırın:**
    *   SSH üzerinden şifre ile giriş yapmayı tamamen kapatın ve yalnızca anahtar (key-based) doğrulama kullanın.
        *   `/etc/ssh/sshd_config` dosyasını düzenleyin: `PasswordAuthentication no` satırını bulun veya ekleyin.
    *   Varsayılan SSH portu olan 22'yi, daha az bilinen, yüksek numaralı bir port ile değiştirin.
    *   `fail2ban` gibi başarısız giriş denemelerini otomatik olarak engelleyen bir araç kurup yapılandırın.

4.  **AppArmor Engellemelerini İncele:**
    *   `kern.log` dosyasındaki AppArmor bloklarının öncesindeki ve sonrasındaki log kayıtlarını detaylıca inceleyerek, bu engellemeleri tetikleyen uygulamanın veya sürecin ne olduğunu belirleyin.
    *   Bu, genellikle AppArmor loglarında belirtilen PID (Process ID) veya ilgili uygulama adı ile yapılabilir.
    *   Eğer bu engellemeler kötü niyetli bir yazılımdan kaynaklanıyorsa, o yazılımı sistemden temizleyin.

5.  **Kapsamlı Güvenlik Taraması Yapın:**
    *   Sisteminizde potansiyel kötü amaçlı yazılımları (malware) tespit etmek için antivirüs ve antimalware taramaları gerçekleştirin (örneğin ClamAV gibi bir araçla).

6.  **Sistem ve Uygulama Güncellemelerini Kontrol Edin:**
    *   Sisteminizin ve tüm kurulu uygulamaların en son güvenlik yamaları ile güncel olduğundan emin olun.
        ```bash
        sudo apt update && sudo apt upgrade -y
        ```

7.  **Yedekleme ve Kurtarma Planı:**
    *   Mevcut sisteminizin ve verilerinizin güncel bir yedeğini bulunduğundan emin olun. Bir felaket durumunda bu yedekler, sisteminizi eski güvenli haline döndürmeniz için hayati olacaktır.

Bu adımları mümkün olan en kısa sürede uygulamanız, sisteminizin güvenliğini artıracak ve olası saldırıların önüne geçmenize yardımcı olacaktır.