# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:01:48  
**LLM:** GEMINI  
**Toplam Bulgu:** 25 (3 KRİTİK, 0 YÜKSEK)  

---

Siber Güvenlik Raporu

Bu rapor, Ubuntu 22.04 sunucusundan alınan Linux günlük (log) dosyalarının analizi sonucunda elde edilen bulguları ve bu bulgulara dayalı risk değerlendirmesi ile acil müdahale adımlarını içermektedir.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

**Bu dosyada neler oldu:**
Bu dosya, sisteme kimlerin giriş yapmaya çalıştığını, başarılı veya başarısız denemeleri gösterir. Analiz sonuçlarına göre iki önemli ve çok ciddi olay tespit edilmiştir:
1.  **Yoğun SSH Saldırısı (Kaba Kuvvet):** `192.168.64.1` IP adresinden sisteme uzaktan erişmek için tam 97 kez başarısız şifre denemesi yapılmıştır. Bu durum, bilinmeyen birinin sisteminize zorla girmeye çalıştığını açıkça göstermektedir.
2.  **Yönetici Yetkisi Yükseltme Başarısı:** 'osman' isimli kullanıcı, `sudo` komutunu kullanarak root (sistem yöneticisi) yetkisi almayı başarmıştır. Bu yetkiyle `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` komutunu çalıştırmıştır. Bu olay iki kez tekrarlanmıştır. 'osman' kullanıcısının normal bir kullanıcı olmasına rağmen yönetici yetkisi alması, sistemin kontrolünün ele geçirilme riskini taşımaktadır.

**Ne kadar ciddi:**
Bu bulgular **ÇOK CİDDİ** dir. Kaba kuvvet saldırısı sisteminize yönelik aktif bir tehdidin varlığını gösterirken, 'osman' kullanıcısının yönetici yetkisi alması, sistemin içinden veya dışından bir saldırganın veya yetkisiz bir kullanıcının artık sunucunuzu tamamen kontrol edebileceği anlamına gelir. Bu, veri sızıntısı, sistemin devre dışı bırakılması veya kötü amaçlı yazılım bulaşması gibi felaket senaryolarına yol açabilir.

**Hemen ne yapılmalı:**
*   Saldırgan IP adresi `192.168.64.1` derhal engellenmelidir.
*   'osman' kullanıcısının aktiviteleri detaylıca incelenmeli, bu yetki yükseltmenin meşru olup olmadığı kontrol edilmelidir. Eğer meşru değilse, kullanıcının şifresi değiştirilmeli veya hesap askıya alınmalıdır.
*   Tüm yönetici (root) yetkisine sahip kullanıcıların şifreleri hemen değiştirilmeli ve güçlü şifre politikaları uygulanmalıdır.
*   Sistemde yetkisiz olarak yüklenmiş program veya arka kapı (backdoor) olup olmadığı araştırılmalıdır.

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

**Bu dosyada neler oldu:**
`syslog` dosyası, sistemdeki genel mesajları, ağ aktivitelerini ve planlanmış görevleri (cron) kaydeder. Yapılan analiz sonucunda bu dosyada herhangi bir tehdit edici bulguya rastlanmamıştır. Sistem genelinde belirgin bir anormal durum veya hata kaydı bulunmamaktadır.

**Ne kadar ciddi:**
Bu durum **DÜŞÜK** ciddiyettedir. `syslog` içinde tespit edilmiş bir sorun olmaması olumlu bir bulgudur. Ancak, diğer log dosyalarında tespit edilen ciddi problemler, genel sistem sağlığının bozuk olduğunu göstermektedir. Bu dosyanın temiz olması, diğer loglardaki sorunların ciddiyetini azaltmaz.

**Hemen ne yapılmalı:**
Bu dosyaya özel acil bir müdahaleye gerek yoktur. Ancak, genel sistem güvenliği iyileştirme çalışmaları kapsamında bu dosyanın sürekli izlenmesi ve gelecekteki anormalliklere karşı tetikte olunması önemlidir.

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

**Bu dosyada neler oldu:**
`kern.log` dosyası, Linux çekirdeği (kernel) ile ilgili mesajları, donanım etkileşimlerini ve AppArmor gibi güvenlik modüllerinin aktivitelerini kaydeder. Analiz sonucunda, AppArmor güvenlik duvarının birçok kez devreye girerek bazı programların kritik sistem çağrılarını yapmasını engellediği tespit edilmiştir. Engellenen aktiviteler arasında 'sys_nice' ve 'net_admin' gibi sistem yetkileri ile '/proc/pressure/memory' gibi sistem kaynaklarına erişim girişimleri bulunmaktadır. Bu tür engellemeler 22 kez gerçekleşmiştir.

**Ne kadar ciddi:**
Bu durum **ORTA** ciddiyettedir. AppArmor'ın bu engellemeleri yapması aslında iyi bir haberdir, çünkü güvenlik duvarı çalışmış ve potansiyel olarak kötü niyetli veya yanlış yapılandırılmış bir programın sistemi manipüle etmesini önlemiştir. AppArmor, bir nevi kalkan görevi görmüş ve olası hasarı engellemiştir. Ancak, bu kadar çok engelleme girişiminin olması, arka planda bir programın anormal davrandığını veya bir saldırganın AppArmor'ı aşmaya çalıştığını düşündürebilir.

**Hemen ne yapılmalı:**
*   AppArmor tarafından engellenen aktiviteleri tetikleyen program veya süreçler belirlenmelidir. Bu programların neden bu tür sistem çağrılarını yapmaya çalıştığı araştırılmalıdır.
*   Bu programlar, meşru bir uygulamaysa yapılandırması kontrol edilmeli veya güncellenmelidir. Eğer şüpheli bir programsa, sistemden kaldırılmalı ve daha fazla araştırma yapılmalıdır.
*   AppArmor profilleri gözden geçirilmeli, sisteminizin ihtiyaçlarına uygun ve en iyi korumayı sağlayacak şekilde ayarlandığından emin olunmalıdır.

---

## ⚠️ Genel Risk Değerlendirmesi

**Risk Skoru: YÜKSEK (KIRMIZI ALARM)**

**Açıklama:**
Sistem genelinde risk değerlendirmesi **YÜKSEK** seviyededir. `auth.log` dosyasındaki bulgular (kaba kuvvet saldırısı ve başarılı yönetici yetkisi yükseltmesi) sistemin ciddi şekilde tehlike altında olduğunu göstermektedir. Bir saldırganın sisteme sızmış olma veya 'osman' kullanıcısı üzerinden kontrolü ele geçirmiş olma ihtimali çok yüksektir. AppArmor'ın bazı engellemeler yapması olumlu olsa da, bu durum `auth.log`'daki kritik zafiyetleri dengelememektedir. `syslog`'da doğrudan bir tehdit bulunmaması da bu genel risk seviyesini düşürmemektedir. Sisteminiz acil müdahale gerektiren ciddi bir güvenlik olayı yaşamaktadır.

---

## 🛡️ Acil Müdahale Adımları

Aşağıdaki adımlar, aciliyet sırasına göre listelenmiştir ve sistemin daha fazla zarar görmesini engellemek, olası bir saldırıyı durdurmak ve sistemi güvene almak için kritik öneme sahiptir:

1.  **Sistemi İzole Edin (Gerekiyorsa):** Eğer bir saldırının aktif olarak devam ettiğinden veya sistemin tamamen ele geçirildiğinden şüpheleniyorsanız, sistemi ağdan ayırmak (fiziksel veya sanal olarak) yayılmayı önlemek için ilk adım olabilir. Bu karar, iş kesintisi riskleri göz önünde bulundurularak dikkatlice verilmelidir.

2.  **Saldırgan IP Adresini Engelleyin:**
    `192.168.64.1` adresinden gelen tüm bağlantı isteklerini güvenlik duvarınız üzerinden hemen engelleyin.
    ```bash
    sudo ufw deny from 192.168.64.1
    sudo ufw enable # Eğer ufw aktif değilse
    ```
    veya `iptables` kullanıyorsanız:
    ```bash
    sudo iptables -A INPUT -s 192.168.64.1 -j DROP
    sudo iptables-save # Ayarları kaydetmek için
    ```

3.  **'osman' Kullanıcısının Şifresini Değiştirin ve Aktivitesini Kısıtlayın:**
    Hemen 'osman' kullanıcısının şifresini değiştirin. Güçlü ve karmaşık bir şifre kullanın.
    ```bash
    sudo passwd osman
    ```
    Eğer 'osman' kullanıcısının yetki yükseltmesi yetkisiz ise, `sudo` grubundan çıkararak yönetici yetkilerini geçici olarak iptal edin veya hesabını tamamen askıya alın (gerekliyse silin).
    `sudo` grubundan çıkarmak için:
    ```bash
    sudo deluser osman sudo
    ```
    Hesabı askıya almak için:
    ```bash
    sudo usermod -L osman
    ```

4.  **Tüm Yönetici (Root) Hesap Şifrelerini Değiştirin:**
    Sistemdeki tüm yönetici yetkilerine sahip kullanıcıların (root dahil) şifrelerini acilen değiştirin. Yeni şifreler, büyük/küçük harf, rakam ve özel karakter içeren, tahmin edilmesi zor, en az 12-16 karakterden oluşmalıdır.
    ```bash
    sudo passwd root
    sudo passwd baska_admin_kullanicisi # Varsa diğer yönetici kullanıcılar için
    ```

5.  **Yetkisiz Dosya ve Süreçleri Kontrol Edin:**
    Sistemde arka kapı veya kötü amaçlı yazılım olup olmadığını kontrol etmek için aşağıdaki adımları uygulayın:
    *   **Çalışan Süreçleri Kontrol Edin:** Bilmediğiniz veya şüpheli gördüğünüz süreçleri arayın.
        ```bash
        ps aux | less
        ```
    *   **Ağ Bağlantılarını Kontrol Edin:** Bilinmeyen dış bağlantıları veya dinlenen portları tespit edin.
        ```bash
        sudo netstat -tulnp
        ```
    *   **Son Değiştirilen Dosyaları Kontrol Edin:** Son zamanlarda değiştirilen kritik sistem dosyalarını arayın.
        ```bash
        sudo find / -mtime -1 -type f -print 2>/dev/null # Son 24 saatte değiştirilen dosyalar
        ```

6.  **SSH Yapılandırmasını Güçlendirin:**
    SSH sunucu yapılandırmasını (`/etc/ssh/sshd_config`) gözden geçirin ve güvenliği artırın:
    *   **Şifre ile giriş yerine anahtar tabanlı kimlik doğrulamayı zorunlu kılın:** `PasswordAuthentication no`
    *   **Root ile doğrudan girişi yasaklayın:** `PermitRootLogin no`
    *   **Sadece belirli kullanıcılara veya gruplara izin verin:** `AllowUsers [kullanıcı adı]` veya `AllowGroups [grup adı]`
    *   **Varsayılan SSH portunu değiştirin** (isteğe bağlı, ama tavsiye edilir).
    Yapılandırma değişikliğinden sonra SSH hizmetini yeniden başlatın:
    ```bash
    sudo systemctl restart sshd
    ```

7.  **AppArmor Loglarını ve Profillerini İnceleyin:**
    AppArmor tarafından engellenen eylemlerin kaynağını anlamak için AppArmor loglarını daha detaylı inceleyin:
    ```bash
    sudo grep "AppArmor" /var/log/kern.log | less
    ```
    Engellenen programların (örn. `sys_nice`, `net_admin`, `/proc/pressure/memory` erişimi isteyen süreçler) hangi uygulamaya ait olduğunu ve bu uygulamaların neden bu eylemleri yapmaya çalıştığını araştırın.

8.  **Çok Faktörlü Kimlik Doğrulama (MFA) Uygulayın:**
    Tüm yönetici hesapları ve SSH erişimi için mümkünse çok faktörlü kimlik doğrulamayı etkinleştirin. Bu, şifre çalınsa bile sisteme erişimi büyük ölçüde zorlaştıracaktır.

9.  **Sistemin Yedeğini Alın ve Kurtarma Planı Yapın:**
    Mevcut durumun bir yedeğini alın. Ancak bu yedeğin potansiyel olarak tehlikeli olabileceğini unutmayın. Temiz bir sistem yedeğiniz olduğundan ve bir kurtarma planınız bulunduğundan emin olun.

Bu adımlar, sisteminizi mevcut tehditlerden korumak ve gelecekteki saldırılara karşı daha dirençli hale getirmek için kritik öneme sahiptir.