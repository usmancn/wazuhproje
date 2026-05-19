# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:16:46  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

Merhaba,

Elinizdeki Ubuntu 22.04 sunucusundan alınan log dosyalarını detaylı bir şekilde inceledim. Aşağıda her bir dosya için ayrı ayrı tespitlerimi, ciddiyet değerlendirmemi ve acil yapılması gerekenleri bulabilirsiniz.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

### Bu dosyada neler oldu?
Bu log dosyası, sunucunuza kimlerin girmeye çalıştığını, başarılı veya başarısız giriş denemelerini ve yetki değişikliklerini gösterir. Buradaki bulgular oldukça kritik:

1.  **Kaba Kuvvet Saldırıları (SSH Brute Force):**
    *   `192.168.64.1` adresinden sunucunuza girmeye çalışan birisi, tam **97 kez** yanlış parola denemesi yapmış. Bu, sürekli ve yoğun bir saldırı girişimi anlamına geliyor.
    *   `1.1.1.1` ve `1.1.1.2` gibi başka adreslerden de başarısız parola denemeleri var, ancak bunlar daha az sayıda (birkaç kez).

2.  **Yönetici Yetkisi Yükseltme (Privilege Escalation Success):**
    *   "osman" adındaki bir kullanıcı, **yönetici (root) yetkilerini** başarıyla elde etmiş. Yani, normal bir kullanıcı yetkisindeyken, sistem üzerinde tam kontrol sağlayan yönetici yetkilerine geçmiş. Bu olay iki kez tekrar etmiş ve bu yetkilerle `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` komutu çalıştırılmış. Bu komut, bir dosyanın içeriğini canlı olarak izlemek için kullanılır. Komutun kendisi masum görünse de, bu komutu yönetici yetkisiyle çalıştırmış olması, "osman" kullanıcısının sisteme tam yetkili erişim sağlayabildiğini gösteriyor.

### Ne kadar ciddi?
**Çok ciddi.** Sunucunuz doğrudan bir saldırı altında.

*   Kaba kuvvet saldırıları sürekli bir tehdittir ve eninde sonunda doğru parolayı bulma ihtimali vardır.
*   **En kritik sorun**, "osman" kullanıcısının yönetici yetkisi alabilmiş olmasıdır. Bu, saldırganın (veya yetkisiz bir kullanıcının) sunucu üzerinde istediği her şeyi yapabileceği, dosya silebileceği, yeni kullanıcılar oluşturabileceği veya kötü amaçlı yazılım yükleyebileceği anlamına gelir. Yönetici yetkisi ele geçirilmiş bir sistem tamamen tehlike altındadır.

### Hemen ne yapılmalı?
1.  `192.168.64.1`, `1.1.1.1` ve `1.1.1.2` gibi saldırgan IP adreslerinin sunucuya erişimi derhal engellenmelidir.
2.  "osman" kullanıcısının neden ve nasıl yönetici yetkisi alabildiği acilen araştırılmalıdır. Bu bir güvenlik açığı mıydı, yoksa bir kullanıcının hesabı ele mi geçirildi?
3.  "osman" kullanıcısının şifresi hemen değiştirilmeli ve bu kullanıcının son zamanlarda ne gibi işlemler yaptığı detaylıca incelenmelidir.
4.  Sunucuya SSH üzerinden (uzaktan erişim) bağlantı kurma yöntemleri daha güvenli hale getirilmelidir. Parola ile girişler yerine daha güvenli olan anahtar tabanlı (key-based) kimlik doğrulama kullanılmalı ve zayıf parolalar derhal değiştirilmelidir.

---

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

### Bu dosyada neler oldu?
Bu log dosyası, genel sistem mesajlarını, ağ bağlantı bilgilerini ve zamanlanmış görevlerin (cron) çalışmalarını kaydeder. Yapılan incelemede, bu dosyada herhangi **bir tehdit veya şüpheli aktiviteye rastlanmadı.**

### Ne kadar ciddi?
**Ciddi değil.** Bu log dosyasında herhangi bir acil güvenlik endişesi bulunmuyor.

### Hemen ne yapılmalı?
Bu log dosyasındaki mevcut bulgulara dayanarak acil bir müdahaleye gerek yoktur. Ancak, diğer loglarda bulunan kritik sorunlar nedeniyle genel bir güvenlik gözden geçirmesi her zaman faydalıdır.

---

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

### Bu dosyada neler oldu?
Bu log dosyası, sunucunun çekirdeği (kernel) ile ilgili bilgileri, bellek kullanımlarını ve AppArmor gibi güvenlik duvarı kararlarını içerir. Buradaki bulgular:

*   **AppArmor Engellemeleri (AppArmor BLOCK):** Sunucunuzdaki "AppArmor" adındaki güvenlik duvarı, çeşitli programların veya işlemlerin (örneğin `sys_nice`, `/proc/pressure/memory`, `net_admin` ile ilgili işlemler) çalışmasını **engellemiş**. Bu engellemeler toplamda 22 kez gerçekleşmiş.

### Ne kadar ciddi?
**Orta ciddiyette.** Bu AppArmor engellemeleri aslında iyi bir şeydir. AppArmor, sunucunuzu kötü niyetli veya kural dışı davranışlardan korumak için tasarlanmış bir güvenlik mekanizmasıdır. Bu engellemeler, AppArmor'ın görevini yaparak potansiyel olarak zararlı olabilecek veya tanımlanmış güvenlik politikalarına uymayan işlemleri durdurduğunu gösterir.

Ancak, bu engellemelerin neden kaynaklandığını anlamak önemlidir:

*   **Olumlu senaryo:** Bir saldırgan veya kötü amaçlı yazılım bir şeyler yapmaya çalıştı ve AppArmor bunu başarıyla engelledi.
*   **İnceleme gerektiren senaryo:** Sunucunuzda çalışan yasal bir uygulama veya işlem, yanlış yapılandırma nedeniyle AppArmor tarafından engelleniyor olabilir. Bu durumda uygulama düzgün çalışmayabilir.

### Hemen ne yapılmalı?
1.  Engellenen bu programların veya işlemlerin (özellikle `/proc/pressure/memory`, `sys_nice`, `net_admin` ile ilgili olanların) normalde sunucunuzda çalışıp çalışmaması gerektiğini araştırın.
2.  Eğer engellenenler bilinen ve güvenli uygulamalarınıza aitse, AppArmor kurallarını gözden geçirerek bu uygulamaların düzgün çalışabilmesi için gerekli izinleri vermeniz gerekebilir. Aksi takdirde, AppArmor'ın görevinin başındadır ve ekstra bir müdahaleye gerek yoktur. Ancak diğer kritik bulgular nedeniyle, bu engellemelerin potansiyel bir saldırının yan ürünü olup olmadığını da düşünmek gerekir.

---

## ⚠️ Genel Risk Değerlendirmesi

**Genel Risk Skoru: YÜKSEK**

Sunucunuz şu anda **yüksek risk** altındadır. `auth.log` dosyasındaki "osman" kullanıcısının yönetici yetkisi alması, sistemin güvenliğinde çok ciddi bir zafiyet olduğunu gösteriyor. Bu durum, saldırganın sistemi tamamen ele geçirme potansiyeline sahip olduğu anlamına gelir. Kaba kuvvet saldırıları da sürekli bir tehdit oluşturmaktadır. AppArmor'ın çalışması ve potansiyel tehditleri engellemesi olumlu olsa da, temel kimlik doğrulama ve yetkilendirme katmanındaki bu zafiyet tüm sistemin güvenliğini gölgelemektedir.

---

## 🛡️ Acil Müdahale Adımları

Bu durumun ciddiyeti nedeniyle, aşağıdaki adımların mümkün olan en kısa sürede ve sıralı bir şekilde uygulanması büyük önem taşımaktadır:

1.  **Saldırgan IP Adreslerini Engelle:**
    *   Sunucunuzun güvenlik duvarını (UFW - Uncomplicated Firewall) kullanarak kaba kuvvet saldırısı yapan IP adreslerini tamamen engelleyin.
    *   **Komut örneği:**
        ```bash
        sudo ufw deny from 192.168.64.1
        sudo ufw deny from 1.1.1.1
        sudo ufw deny from 1.1.1.2
        sudo ufw enable # Eğer güvenlik duvarı aktif değilse, bu komutla aktifleştirin
        ```
    *   **Ek Bilgi:** Bu IP'lerin arkasında kim veya ne olduğunu araştırmanız ilerideki analizler için faydalı olacaktır.

2.  **"osman" Kullanıcısının Parolasını Değiştir ve Yetkilerini İncele:**
    *   "osman" kullanıcısının parolasını hemen güçlü ve benzersiz bir parolayla değiştirin.
    *   **Komut örneği:**
        ```bash
        sudo passwd osman
        ```
    *   "osman" kullanıcısının yetkilerini ve `sudo` (yönetici yetkisi veren) grubundaki üyeliğini kontrol edin. Eğer bu kullanıcının yönetici yetkilerine ihtiyacı yoksa, derhal bu yetkilerini kaldırın.
    *   "osman" kullanıcısının yakın zamanda çalıştığı komutları ve değiştirdiği dosyaları inceleyin.
    *   **Komut örnekleri:**
        ```bash
        history -u osman # osman kullanıcısının komut geçmişi (eğer tutuluyorsa)
        sudo grep "osman" /var/log/auth.log # osman ile ilgili tüm auth.log kayıtlarını kontrol
        find / -user osman -mtime -1 -ls # osman kullanıcısının son 1 gün içinde değiştirdiği/oluşturduğu dosyalar
        ```

3.  **SSH Güvenliğini Artır:**
    *   **Parola ile girişi kapatın** ve sadece anahtar tabanlı (SSH Key) kimlik doğrulama kullanın. Bu, kaba kuvvet saldırılarına karşı en etkili önlemlerden biridir.
    *   Root kullanıcısının SSH üzerinden doğrudan giriş yapmasını engelleyin.
    *   **Komut örneği:** `/etc/ssh/sshd_config` dosyasını düzenleyin:
        ```bash
        sudo nano /etc/ssh/sshd_config
        ```
        Aşağıdaki satırları bulun ve değerlerini değiştirin (veya ekleyin):
        ```
        PasswordAuthentication no
        PermitRootLogin no
        ```
        Değişiklikleri kaydedin ve SSH servisini yeniden başlatın:
        ```bash
        sudo systemctl restart sshd
        ```
    *   Tüm mevcut SSH anahtarlarını gözden geçirin ve tanımadığınız veya kullanmadığınız anahtarları kaldırın.

4.  **Sistem Güncellemelerini Kontrol Et ve Uygula:**
    *   Olası güvenlik açıklarını kapatmak için sunucunuzdaki tüm yazılımların ve işletim sisteminin güncel olduğundan emin olun.
    *   **Komut örneği:**
        ```bash
        sudo apt update && sudo apt upgrade -y
        ```

5.  **AppArmor Engellemelerini İncele:**
    *   `kern.log` dosyasındaki AppArmor engellemelerinin arkasındaki nedenleri araştırın. Eğer engellenen işlemler meşru ve gerekli uygulamalarınıza aitse, AppArmor kurallarını güvenli bir şekilde güncelleyin. Eğer şüpheli bir kaynaktan geliyorsa, ek bir araştırma yapın.
    *   **Komut örneği:** AppArmor ile ilgili logları detaylı incelemek için:
        ```bash
        sudo journalctl -k -p err | grep -i apparmor
        ```

Bu adımlar sunucunuzun güvenliğini artırmak için hayati öneme sahiptir. Herhangi bir adımda yardıma ihtiyacınız olursa veya ek sorularınız olursa lütfen çekinmeyin.