# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:15:58  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

Merhaba,

Ubuntu 22.04 sunucunuzdan alınan log kayıtlarını dikkatlice inceledim ve aşağıda bulgularımı, bunların ne anlama geldiğini, ne kadar ciddi olduğunu ve acil olarak neler yapılması gerektiğini açıklayan bir rapor hazırladım. Amacım, teknik olmayan bir dille durumu anlamanızı ve sisteminizi daha güvenli hale getirmeniz için size yol göstermektir.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

Bu dosya, sunucunuza kimlerin ne zaman ve nasıl erişmeye çalıştığını, başarılı veya başarısız giriş denemelerini ve yetki yükseltme gibi önemli olayları kaydeder.

**Bu dosyada neler oldu?**
*   **Çok Ciddi Tehdit: Yönetici Yetkisi Alındı!** "osman" adında bir kullanıcınız, `sudo` komutunu kullanarak sunucuda "root" yani tam yönetici yetkisi almış. Bu, kullanıcının sunucu üzerinde her şeyi yapabileceği anlamına gelir. Bu olay iki kez gerçekleşmiş. Her ne kadar çalıştırdığı komut (`/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json`) doğrudan zararlı görünmese de, önemli olan "osman" kullanıcısının bu yetkiye sahip olması ve bunu kullanmış olmasıdır. Bu durum, bir saldırganın "osman" hesabını ele geçirmesi veya "osman" kullanıcısının kasıtlı olarak bu yetkiyi kullanması olasılığını akla getirmektedir.
*   **Kaba Kuvvet Saldırısı (SSH):**
    *   `192.168.64.1` IP adresinden sunucunuzdaki SSH servisine tam 97 kez başarısız giriş denemesi yapılmış. Bu, birinin parolanızı tahmin etmeye çalıştığı çok yoğun bir saldırıdır.
    *   `1.1.1.1` ve `1.1.1.2` IP adreslerinden de daha az sayıda (birer kez) başarısız SSH giriş denemeleri olmuş. Bunlar da benzer şekilde parola tahmin etme veya sisteme sızma girişimleridir, ancak ilk belirtilen IP'deki saldırı kadar yoğun değil.

**Ne kadar ciddi?**
**SON DERECE CİDDİ!** "osman" kullanıcısının yönetici yetkisi alması, sistemin güvenliğinin büyük ölçüde aşıldığı anlamına gelir. Bu, bir saldırganın anahtar kodları ele geçirmesi gibidir. Kaba kuvvet saldırıları da ciddi olsa da, yönetici yetkisi alınması durumu çok daha kritik ve acil müdahale gerektirir.

**Hemen ne yapılmalı?**
1.  **"osman" kullanıcısı acilen incelenmeli.** Bu kullanıcının kim olduğu, neden yönetici yetkisi kullandığı, bu yetkiyi kullanmasının beklendik bir durum olup olmadığı belirlenmelidir. Eğer beklenmedik bir durumsa, parolasının değiştirilmesi ve gerekirse geçici olarak hesabının askıya alınması ilk adım olmalıdır.
2.  `192.168.64.1`, `1.1.1.1` ve `1.1.1.2` IP adresleri sunucunuza dışarıdan erişimi engellemek için güvenlik duvarınızda (firewall) **acil olarak yasaklanmalı**dır.
3.  SSH güvenliği güçlendirilmelidir (aşağıdaki "Acil Müdahale Adımları" bölümüne bakın).

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

Bu dosya, genel sistem mesajlarını, ağ bağlantılarını ve zamanlanmış görevlerin (cron) kayıtlarını içerir.

**Bu dosyada neler oldu?**
Sağlanan log özetinde bu dosya içerisinde **herhangi bir tehdit tespit edilmediği belirtilmiştir.** Bu olumlu bir durumdur.

**Ne kadar ciddi?**
**Düşük.** Bu log dosyasında şu an için endişelenecek bir durum görünmüyor.

**Hemen ne yapılmalı?**
Bu dosya özelinde acil bir eyleme gerek yok. Ancak, sistemin diğer kısımlarındaki ciddi sorunlar göz önüne alındığında, genel güvenlik incelemesinin bir parçası olarak bu dosya da daha detaylı incelenebilir.

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

Bu dosya, Linux çekirdeği (kernel) tarafından üretilen mesajları, donanım veya çekirdek modülleriyle ilgili olayları ve AppArmor gibi güvenlik mekanizmalarının kayıtlarını içerir.

**Bu dosyada neler oldu?**
*   **AppArmor Güvenlik Duvarı Engelleme Yaptı:** AppArmor adında bir güvenlik aracı, sunucunuzda bazı programların veya işlemlerin yetkisiz eylemler yapmasını engellemiş. Tam 22 farklı olayda AppArmor'un koruma kalkanını devreye soktuğunu görüyoruz. Engellenen işlemler arasında `sys_nice` (işlem önceliği ayarlama), `/proc/pressure/memory` (bellek kullanımını takip etme) ve `net_admin` (ağ yönetimi) gibi sistem fonksiyonlarına erişim denemeleri bulunuyor.

**Ne kadar ciddi?**
**Orta Ciddi.** AppArmor'un bu eylemleri engellemesi, sisteminizi olası bir zarardan koruduğu için aslında iyi bir haberdir. Güvenlik mekanizmanız çalışıyor. Ancak, bu kadar çok engellemenin olması, ya bir uygulamanın hatalı yapılandırıldığını ve yapmaması gereken şeyleri denediğini ya da bir saldırganın veya zararlı bir yazılımın sistem üzerinde yetkisiz eylemler yapmaya çalıştığını ve AppArmor tarafından durdurulduğunu gösterir.

**Hemen ne yapılmalı?**
1.  **Engellenen eylemlerin kaynağı araştırılmalı.** Bu eylemleri tetikleyen program veya kullanıcı kimliği tespit edilmelidir. Bu, AppArmor kurallarının yanlış yapılandırılmış bir uygulama tarafından mı tetiklendiğini, yoksa gerçekten kötü niyetli bir aktivitenin mi durdurulduğunu anlamak için önemlidir.
2.  Eğer engellenen eylemler yasal bir uygulamanın parçasıysa, AppArmor kuralları uygulamanın düzgün çalışması için güncellenmelidir. Eğer kötü niyetli bir aktivite ise, bu kaynağın daha detaylı incelenmesi ve temizlenmesi gerekmektedir.

## ⚠️ Genel Risk Değerlendirmesi

**Risk Skoru: ÇOK YÜKSEK (KRİTİK)**

Sisteminizde çok ciddi bir güvenlik zafiyeti tespit edilmiştir. "osman" kullanıcısının yönetici (root) yetkisi alması, sistemin kontrolünün tamamen ele geçirilme potansiyeline sahip olduğu anlamına gelir. Bu, bir evin kapısının açık bırakılıp hırsızın içeri girmesi gibidir. Kaba kuvvet saldırıları devam etse de, bu yetki yükseltme başlı başına en büyük tehlikedir. AppArmor'un engellemeleri olumlu bir güvenlik göstergesi olsa da, genel tablonun ciddiyetini değiştirmez. Acil müdahale olmadan sisteminiz büyük bir risk altındadır.

## 🛡️ Acil Müdahale Adımları

Bu adımlar, sisteminizi acilen koruma altına almak ve daha fazla hasarı önlemek için tasarlanmıştır. Lütfen sırasıyla uygulayın:

1.  **Sunucuyu İzole Edin (Mümkünse):** Eğer sunucu kritik hizmetler sunmuyorsa ve kısa süreli kesintiyi kaldırabiliyorsa, ağ bağlantısını keserek veya güvenlik duvarından tüm dış erişimi engelleyerek daha fazla dışarıdan saldırıyı durdurun. Bu, içerideki sorunları çözerken yeni saldırıları engeller.

2.  **"osman" Kullanıcısının Parolasını Değiştirin ve Sudo Yetkilerini Gözden Geçirin:**
    *   Hemen "osman" kullanıcısının parolasını karmaşık ve tahmin edilemez bir parola ile değiştirin.
        ```bash
        sudo passwd osman
        ```
    *   "osman" kullanıcısının neden `sudo` yetkisine sahip olduğunu ve bu yetkinin gerekli olup olmadığını inceleyin. Eğer bu yetkiye ihtiyacı yoksa veya şüpheli bir durum varsa, `sudo` yetkilerini geçici olarak kaldırın veya kısıtlayın.
        `visudo` komutu ile sudoers dosyasını düzenleyebilirsiniz.

3.  **Kaba Kuvvet Saldırısı Yapan IP Adreslerini Engelleyin:**
    *   Güvenlik duvarınızda (ufw veya iptables) `192.168.64.1`, `1.1.1.1` ve `1.1.1.2` IP adreslerinden gelen tüm bağlantıları engelleyin.
    *   **UFW (Ubuntu Güvenlik Duvarı) kullanıyorsanız:**
        ```bash
        sudo ufw deny from 192.168.64.1
        sudo ufw deny from 1.1.1.1
        sudo ufw deny from 1.1.1.2
        sudo ufw reload
        ```
    *   **IPTABLES kullanıyorsanız:**
        ```bash
        sudo iptables -A INPUT -s 192.168.64.1 -j DROP
        sudo iptables -A INPUT -s 1.1.1.1 -j DROP
        sudo iptables -A INPUT -s 1.1.1.2 -j DROP
        # Kuralları kalıcı hale getirmek için uygun komutu kullanın (örneğin iptables-persistent)
        ```

4.  **"osman" Kullanıcısının Yönetici Yetkisi Aldıktan Sonraki Aktivitelerini Araştırın:**
    *   `auth.log` ve `history` dosyalarını kontrol ederek "osman" kullanıcısının yönetici yetkisi aldıktan sonra başka hangi komutları çalıştırdığını araştırmanız çok önemlidir.
    *   `grep` komutunu kullanarak `auth.log` dosyasında `sudo` kullanan "osman" kullanıcısının tüm satırlarını kontrol edin:
        ```bash
        grep "osman.*sudo" /var/log/auth.log
        ```
    *   Eğer "osman" kullanıcısının shell geçmişi erişilebilirse, `~osman/.bash_history` (veya kullandığı shell'in geçmiş dosyası) dosyasını kontrol edin.

5.  **SSH Güvenliğini Güçlendirin:**
    *   **Parola ile girişi devre dışı bırakıp, sadece SSH anahtarları ile girişe izin verin.** Bu, kaba kuvvet saldırılarını büyük ölçüde engeller.
    *   **Root kullanıcısının doğrudan SSH ile giriş yapmasını engelleyin.**
    *   Varsayılan SSH portunu (22) değiştirin.
    *   `fail2ban` gibi araçlar kurarak kaba kuvvet saldırılarını otomatik olarak engelleyin.

6.  **AppArmor Engellemelerinin Kaynağını Araştırın:**
    *   `kern.log` dosyasındaki AppArmor engellemelerinin hangi uygulama veya süreç tarafından tetiklendiğini anlamaya çalışın. Daha fazla detaya ulaşmak için ilgili log satırlarında PID (Process ID) veya UID (User ID) gibi bilgilere bakın.
    *   `sudo grep -i apparmor /var/log/kern.log | less` komutu ile tüm AppArmor kayıtlarını inceleyin.
    *   Eğer bilinen ve güvenilir bir uygulama bu engellemeleri tetikliyorsa, AppArmor profilini o uygulama için özelleştirmeyi düşünün. Aksi takdirde, bu aktivitenin kötü amaçlı olup olmadığını belirlemek için daha derinlemesine bir analiz gerekebilir.

7.  **Sistem Bütünlüğü Kontrolü Yapın:**
    *   Sisteminizde herhangi bir zararlı yazılımın veya arka kapının olup olmadığını kontrol etmek için güvenilir bir antivirüs veya güvenlik aracı (örneğin, `rkhunter`, `chkrootkit`) kullanarak tam bir sistem taraması yapın.

Bu adımlar kritik öneme sahiptir. Lütfen bu durumu ciddiye alın ve belirtilen adımları en kısa sürede uygulayın. Gerekirse profesyonel bir siber güvenlik uzmanından destek almaktan çekinmeyin.