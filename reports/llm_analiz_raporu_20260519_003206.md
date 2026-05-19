# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:32:40  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

Siber Güvenlik Analisti ve SIEM Uzmanı olarak, Ubuntu 22.04 sunucunuzdan alınan Linux log dosyalarının analizini tamamladım. Bu rapor, bulguları özetlemekte, her bir dosya için ayrı ayrı açıklama yapmakta, risk düzeylerini belirtmekte ve acil durum müdahale adımlarını detaylandırmaktadır. Bu raporu teknik jargon kullanmadan, sisteminizi anlayıp koruyabilmeniz amacıyla hazırladım.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

**Bu dosyada neler oldu?**
Sisteminizde dışarıdan gelen bağlantılarla ilgili önemli ve ciddi olaylar tespit edilmiştir. En önemlisi, **`192.168.64.1`** IP adresinden sisteminize SSH (güvenli uzaktan erişim) üzerinden tam **129 kez art arda yanlış şifre denemesi** yapıldığı görülmüştür. Bu durum, bu IP adresinin sisteminize "kaba kuvvet" saldırısı yaparak şifrenizi tahmin etmeye çalıştığını açıkça göstermektedir. Ayrıca, **`1.1.1.1`** ve **`1.1.1.2`** gibi başka IP adreslerinden de tek seferlik başarısız giriş denemeleri olmuştur, bu da benzer denemelerin devam ettiğini işaret etmektedir.

Daha da kritik bir bulgu ise, **`osman`** adlı bir kullanıcının, **`sudo` komutunu kullanarak "yönetici" (root) yetkilerine başarılı bir şekilde eriştiğidir**. Bu durum iki kez yaşanmıştır. Çalıştırılan komut her ne kadar tehlikesiz görünen `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` olsa da, `osman` kullanıcısının yönetici yetkilerine sahip olması, eğer `osman` hesabının şifresi ele geçirilirse saldırganın tüm sistemi kontrol edebileceği anlamına gelir.

**Ne kadar ciddi?**
Durum oldukça **ciddidir**.
*   **Kaba kuvvet saldırısı:** Sisteminize dışarıdan aktif bir saldırı var ve eğer şifreniz yeterince güçlü değilse veya tahmin edilebilir bir şifre kullanılıyorsa, saldırganın sisteme sızma riski çok yüksektir. 129 deneme sayısı, bu saldırının hedefe yönelik olduğunu gösteriyor.
*   **Yönetici yetkisi yükseltme:** `osman` kullanıcısının yönetici yetkilerine sahip olması, içeriden bir tehdit veya `osman` hesabının ele geçirilmesi durumunda sistemin tamamen ele geçirilmesine yol açabilir. Bu, bir güvenlik ihlalinin en kritik aşamalarından biridir.

**Hemen ne yapılmalı?**
1.  **Saldırgan IP'leri engelleyin:** Özellikle **`192.168.64.1`** olmak üzere, tüm saldırı yapan IP adreslerinin sisteme erişimini derhal engelleyin.
2.  **`osman` kullanıcısını inceleyin:** `osman` kullanıcısının bu yetkileri neden kullandığını, bu komutların kimin tarafından ve ne amaçla çalıştırıldığını hemen araştırın. `osman` kullanıcısının şifresi derhal değiştirilmeli ve güçlü bir şifre belirlenmelidir.
3.  **SSH güvenliğini artırın:** SSH üzerinden şifre ile girişleri tamamen devre dışı bırakarak sadece anahtar (key) tabanlı kimlik doğrulamaya geçin. Ayrıca, `root` kullanıcısının doğrudan SSH ile girişini engelleyin. `fail2ban` gibi araçlarla otomatik engelleme sistemlerini kurun veya mevcutsa doğru çalıştığından emin olun.

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

**Bu dosyada neler oldu?**
Bu log dosyası analiz edildiğinde, sistemin genel işleyişi, ağ aktiviteleri veya zamanlanmış görevlerle (cron) ilgili herhangi bir **tehdit veya anormal durum tespit edilmemiştir**.

**Ne kadar ciddi?**
Bu dosya açısından durum **ciddi değildir**. Herhangi bir güvenlik açığına veya saldırı belirtisine rastlanmaması olumlu bir bulgudur.

**Hemen ne yapılmalı?**
Bu dosya özelinde acil bir eyleme gerek yoktur. Ancak, genel sistem güvenliği göz önünde bulundurularak bu dosyanın da düzenli olarak izlenmeye devam edilmesi önemlidir.

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

**Bu dosyada neler oldu?**
Sistemin çekirdek (kernel) seviyesindeki güvenlik mekanizması olan **AppArmor'ın, bazı programların veya işlemlerin şüpheli kabul edilebilecek veya politika dışı faaliyetlerini başarıyla engellediği** görülmüştür. Özellikle `sys_nice`, `/proc/pressure/memory` ve `net_admin` gibi kaynaklara veya yetkilere erişim denemeleri AppArmor tarafından durdurulmuştur.
*   `sys_nice`: Bir programın önceliğini değiştirmeye çalışması.
*   `/proc/pressure/memory`: Sistemin bellek kullanımıyla ilgili özel bilgilere erişmeye çalışması.
*   `net_admin`: Ağ ayarlarını (örneğin firewall kurallarını) değiştirmeye çalışması.

AppArmor'ın bu engellemeleri, sistemin yetkisiz veya şüpheli davranışlara karşı korunduğunu göstermektedir. Yani bir güvenlik duvarı gibi görevini yapmıştır.

**Ne kadar ciddi?**
Durum **orta ciddiyettedir**. AppArmor'ın engelleme yapması olumlu bir durumdur, çünkü sistemin güvenliğini sağlamıştır. Ancak, bu denemelerin neyin veya kimin tarafından yapıldığı belirsizliğini korumaktadır. Bu denemeler:
*   Yüklü bir uygulamanın hatalı davranışı veya yanlış yapılandırılması olabilir.
*   Sisteme sızmış kötü niyetli bir yazılımın yetkisini genişletmeye çalışması olabilir.

Bu denemelerin kaynağı anlaşılmadan, potansiyel bir zafiyet veya kötü amaçlı yazılım aktivitesi göz ardı edilemez.

**Hemen ne yapılmalı?**
1.  **Engellenen eylemlerin kaynağını araştırın:** AppArmor tarafından engellenen bu eylemleri hangi programın veya sürecin yapmaya çalıştığını belirlemek için daha detaylı log incelemesi yapılmalıdır. Bu, bir uygulamanın hatası mı yoksa kötü amaçlı bir yazılımın aktivitesi mi olduğunu ortaya çıkaracaktır.
2.  **AppArmor profillerini gözden geçirin:** AppArmor güvenlik politikalarının güncel ve doğru yapılandırıldığından emin olun. Gerekirse bu politikalar daha da sıkılaştırılabilir.

## ⚠️ Genel Risk Değerlendirmesi

Sisteminizin genel güvenlik durumu şu anda **YÜKSEK RİSK** altındadır.

**Açıklama:**
Bir yandan dışarıdan gelen **yoğun SSH kaba kuvvet saldırısı** (129 deneme) ile sisteminize aktif bir sızma girişimi bulunmaktadır. Bu, potansiyel bir tehlike olup, zayıf şifreler veya yetersiz güvenlik önlemleri durumunda sisteme tam erişim sağlanmasına neden olabilir.

Daha da önemlisi, **`osman` adlı kullanıcının başarılı bir şekilde yönetici (root) yetkilerine erişebilmesi kritik bir güvenlik zafiyetidir.** Bu durum, ya `osman` kullanıcısının hesabının ele geçirildiğini ya da `osman`'ın kendisinin yetkilerini kötüye kullanma potansiyeli taşıdığını gösterir. Yönetici yetkileri, bir saldırganın sistemi tamamen kontrol etmesi, veri çalması, sistemi bozması veya başka saldırılar için kullanması anlamına gelir.

AppArmor'ın engellemeleri olumlu olsa da, bu engellemelerin altında yatan nedeni (hatalı uygulama mı, kötü amaçlı yazılım mı?) belirlemek ve bu denemeleri yapan kaynağı ortadan kaldırmak gerekmektedir. `syslog` dosyasında bir tehdit tespit edilmemesi ise nispeten iyi bir haberdir.

Bu bulgular bir bütün olarak değerlendirildiğinde, sistemin acil ve kararlı bir güvenlik müdahalesine ihtiyacı olduğu açıktır.

## 🛡️ Acil Müdahale Adımları

Aşağıdaki adımlar, öncelik sırasına göre ve komut örnekleriyle birlikte uygulanmalıdır:

1.  **Saldırgan IP Adreslerini Engelleme:**
    *   Sisteme kaba kuvvet saldırısı yapan IP adreslerini firewall üzerinden engelleyin.
    *   **Komut Örneği:**
        ```bash
        sudo iptables -A INPUT -s 192.168.64.1 -j DROP
        sudo iptables -A INPUT -s 1.1.1.1 -j DROP
        sudo iptables -A INPUT -s 1.1.1.2 -j DROP
        # Kuralların kalıcı olması için kaydedin (Ubuntu/Debian için)
        sudo apt-get install iptables-persistent
        sudo netfilter-persistent save
        ```
    *   *Açıklama:* Bu komutlar, belirtilen IP adreslerinden gelen tüm bağlantıları sisteminize ulaşmadan engeller.

2.  **`osman` Kullanıcısını İnceleme ve Güvenliğini Sağlama:**
    *   `osman` kullanıcısının en son ne zaman ve hangi komutlarla `sudo` kullandığını kontrol edin.
    *   **Komut Örneği:**
        ```bash
        grep 'sudo' /var/log/auth.log | grep 'osman'
        ```
    *   `osman` kullanıcısının şifresini hemen güçlü ve benzersiz bir şifreyle değiştirin.
    *   **Komut Örneği:**
        ```bash
        sudo passwd osman
        ```
    *   `osman` kullanıcısının `sudo` yetkilerini geçici olarak kısıtlamayı düşünün veya sadece belirli, kritik olmayan komutları çalıştırmasına izin verin. (Bu adım dikkatli yapılmalı, sistemin işleyişini bozabilir.)
    *   `osman` kullanıcısının etkinliğini yakından izleyin.

3.  **SSH Servis Güvenliğini Artırma:**
    *   SSH üzerinden şifre ile girişi tamamen devre dışı bırakın ve sadece SSH anahtarı (key) ile girişlere izin verin.
    *   **Komut Örnekleri (SSH yapılandırma dosyasını düzenleyin):**
        ```bash
        sudo nano /etc/ssh/sshd_config
        # Aşağıdaki satırları bulun ve değerlerini güncelleyin:
        PasswordAuthentication no
        PermitRootLogin no
        ChallengeResponseAuthentication no
        UsePAM no
        # Dosyayı kaydedin ve kapatın (Ctrl+X, Y, Enter)
        sudo systemctl restart ssh
        ```
    *   `fail2ban` gibi otomatik saldırı engelleme araçlarını kurun ve etkinleştirin.
    *   **Komut Örneği:**
        ```bash
        sudo apt-get install fail2ban
        sudo systemctl enable fail2ban
        sudo systemctl start fail2ban
        ```
    *   *Açıklama:* Bu adımlar, SSH hizmetinizin saldırılara karşı direncini büyük ölçüde artıracaktır.

4.  **AppArmor Engellemelerinin Kaynağını Araştırma:**
    *   AppArmor tarafından engellenen eylemlerin hangi süreçler veya uygulamalar tarafından yapıldığını belirleyin.
    *   **Komut Örneği:**
        ```bash
        grep "AppArmor" /var/log/kern.log | less
        # İlgili satırlarda "comm=" veya "pid=" değerlerini arayarak süreci tespit edin.
        ```
    *   Tespit edilen sürecin veya uygulamanın meşru bir uygulama olup olmadığını veya kötü amaçlı bir yazılım olup olmadığını araştırın. Eğer kötü amaçlı ise, derhal kaldırılmalıdır.

5.  **Genel Log Analizi ve Sistem Sağlık Kontrolü:**
    *   Sistem üzerindeki tüm log dosyalarını (özellikle `auth.log`, `syslog`, `kern.log`, `daemon.log`) son 24-48 saat için daha detaylı manuel olarak gözden geçirin.
    *   Sisteminizde çalışan tüm kullanıcıları ve açık portları kontrol edin.
    *   **Komut Örnekleri:**
        ```bash
        cat /etc/passwd # Sistemdeki kullanıcılar
        netstat -tulnp # Açık portlar ve ilgili programlar
        ps auxf # Çalışan süreçler
        ```
    *   Yüklü paketleri kontrol edin, tanımadığınız veya şüpheli paketler varsa kaldırın.

Bu acil adımlar, mevcut tehditleri hafifletmek ve gelecekteki saldırılara karşı sisteminizi güçlendirmek için kritik öneme sahiptir. Tüm adımların titizlikle ve doğru bir şekilde uygulandığından emin olun.