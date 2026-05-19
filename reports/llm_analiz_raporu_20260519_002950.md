# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-19 00:30:17  
**LLM:** GEMINI  
**Toplam Bulgu:** 28 (3 KRİTİK, 0 YÜKSEK)  

---

Merhaba,

Sunucunuzdan alınan log dosyalarını detaylı bir şekilde inceledim ve bulgulara göre bir rapor hazırladım. Bu rapor, teknik terimlerden arındırılmış olup, herkesin anlayabileceği şekilde tasarlanmıştır.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

**Bu dosyada neler oldu:**
Bu dosya, sunucuya kimlerin ne zaman ve nasıl giriş yapmaya çalıştığını gösterir. Analizimize göre, bu dosyada ciddi güvenlik açıkları ve aktif saldırılar tespit edilmiştir:

1.  **Yönetici Yetkisi Elde Edilmesi (ÇOK KRİTİK):** 'osman' adında bir kullanıcının, `sudo` komutunu kullanarak sunucuda "root" yani en yüksek yönetici yetkilerine iki kez başarıyla ulaştığı görülmüştür. Bu durum, bir saldırganın veya yetkisiz bir kişinin sunucu üzerinde tam kontrol sahibi olabileceği anlamına gelir. Bu, tüm sistemin güvenliğini doğrudan tehdit eden en ciddi bulgudur. Çalıştırılan komut her ne kadar "logları izle" gibi masum görünse de, bu yetkiyi ele geçirme eylemi çok tehlikelidir.

2.  **İç Ağdan Kaba Kuvvet Saldırısı (ÇOK KRİTİK):** 192.168.64.1 IP adresinden, SSH (uzaktan güvenli bağlantı) üzerinden sunucuya tam 97 kez başarısız giriş denemesi yapıldığı tespit edilmiştir. Bu IP adresi sizin iç ağınızda olduğu için, bu durum ya ağınızdaki başka bir bilgisayarın kötü amaçlı yazılım bulaşmış olması ya da içeriden birinin sunucuya izinsiz erişmeye çalışması anlamına gelir. Bu durum, iç ağınızda bir güvenlik zafiyeti olduğunu gösterir.

3.  **Dış Ağdan Kaba Kuvvet Saldırıları (ORTA):** 1.1.1.1 ve 1.1.1.2 IP adreslerinden de SSH üzerinden sunucuya birkaç kez başarısız giriş denemesi yapılmıştır. Bu dış kaynaklı denemeler de sisteminize karşı yapılan saldırı girişimleridir, ancak içeriden gelen saldırıya göre aciliyeti bir miktar düşüktür.

**Ne kadar ciddi:**
**ÇOK YÜKSEK.** Sunucuda yönetici yetkisi elde edilmiş olması ve içeriden gelen kaba kuvvet saldırısı, sistemin savunmasının aşıldığını veya çok ciddi şekilde zorlandığını göstermektedir. Bu, verilerinizin çalınması, sistemin bozulması veya kötü amaçlı yazılımların yüklenmesi gibi çok ciddi sonuçlar doğurabilir.

**Hemen ne yapılmalı:**
Bu bölümdeki **Acil Müdahale Adımları** kısmına bakarak derhal harekete geçilmesi gerekmektedir. Özellikle sunucunun ağdan izole edilmesi ve 'osman' kullanıcısı ile ilgili acil müdahale adımları önceliklidir.

---

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

**Bu dosyada neler oldu:**
Bu dosya, sistemin genel çalışma durumunu, ağ aktivitelerini ve planlanmış görevlerini (cron) kaydeder. Yapılan analizde, bu log dosyasında herhangi bir şüpheli aktivite veya güvenlik tehdidi tespit edilmemiştir. Sunucunun genel sistem ve ağ fonksiyonları açısından herhangi bir anormal durum raporlanmamıştır.

**Ne kadar ciddi:**
**DÜŞÜK.** Bu log dosyasında bir sorun bulunmadığı için doğrudan bir güvenlik riski oluşturmamaktadır.

**Hemen ne yapılmalı:**
Şu an için bu dosya özelinde acil bir müdahaleye gerek yoktur. Ancak diğer loglardaki sorunlar giderildikten sonra bu logların da düzenli olarak izlenmesi önemlidir.

---

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

**Bu dosyada neler oldu:**
Bu dosya, sunucunun çekirdeği (kernel) ve AppArmor gibi sistemin derinliklerindeki güvenlik mekanizmalarının aktivitelerini kaydeder. Analizimize göre:

1.  **AppArmor Korumasının Başarısı (ORTA):** AppArmor adlı güvenlik duvarınızın, birden fazla kez şüpheli veya yetkisiz işlemleri başarıyla engellediği görülmüştür. Örneğin, bazı programlar kritik sistem kaynaklarına (`/proc/pressure/memory`) veya ağ ayarlarına (`net_admin`) izinsiz erişmeye veya sistem kaynaklarını farklı şekillerde manipüle etmeye (`sys_nice`) çalışmışlardır. AppArmor bu denemeleri engellemiş ve sisteminizi korumuştur.

**Ne kadar ciddi:**
**ORTA.** Bu bulgular, sisteminizde yetkisiz veya şüpheli işlemler yapmaya çalışan bir şeylerin olduğunu göstermekle birlikte, AppArmor'un bu girişimleri başarılı bir şekilde engellediğini ve sisteminize zarar gelmesini önlediğini belirtir. Bu iyi bir haber olsa da, neden bu tür denemelerin yapıldığı araştırılmalıdır.

**Hemen ne yapılmalı:**
AppArmor'un bu engellemeleri yapmasının altında yatan nedeni anlamak önemlidir. Sistemde çalışan hangi uygulamanın bu davranışları sergilediği araştırılmalı, gereksiz veya şüpheli uygulamalar kaldırılmalıdır. Ancak, AppArmor şu an için görevini yaptığı için, diğer kritik sorunlar kadar acil değildir.

---

## ⚠️ Genel Risk Değerlendirmesi

Tüm sistem için genel risk durumu **ÇOK YÜKSEK** seviyesindedir.

Bu yüksek riskin temel nedeni, **'osman' kullanıcısının yönetici (root) yetkilerine başarılı bir şekilde ulaşmış olmasıdır.** Bu durum, bir saldırganın veya kötü niyetli bir kişinin sunucu üzerinde tam kontrol sahibi olabileceği anlamına gelir. Ayrıca, iç ağdan gelen kaba kuvvet saldırısı da ciddi bir endişe kaynağıdır ve içeride bir güvenlik zafiyeti olduğuna işaret eder. Dışarıdan gelen saldırılar ve AppArmor'un engellediği girişimler de sistemin sürekli bir tehdit altında olduğunu göstermektedir. AppArmor'un engellemeleri olumlu olsa da, bu tür girişimlerin varlığı göz ardı edilemez.

**Bu sistem acil müdahale gerektiren kritik bir güvenlik ihlali yaşamış olabilir.**

---

## 🛡️ Acil Müdahale Adımları

Aşağıdaki adımlar, öncelik sırasına göre ve mümkün olduğunca hızlı bir şekilde uygulanmalıdır.

1.  **Sunucuyu Ağdan İZOLE EDİN:**
    *   **Nedeni:** Saldırganın sunucu üzerindeki kontrolünü kesmek ve daha fazla zarar vermesini önlemektir. Bu, sunucunun internetle veya diğer iç ağ cihazlarıyla bağlantısını kesmek anlamına gelir.
    *   **Nasıl Yapılır:**
        *   Fiziksel olarak ağ kablosunu çıkarın.
        *   Eğer sanal bir sunucu ise, sanallaştırma platformu üzerinden ağ bağdaştırıcısını devre dışı bırakın.
        *   Veya, sunucu üzerinde kalıcı ağ bağlantılarını kesmek için şu komutu kullanabilirsiniz (bu komut, sunucuya yeniden başlatana kadar uzaktan erişimi de engelleyecektir, dikkatli olun):
            ```bash
            sudo ip link set eth0 down
            ```
            (eth0 yerine sunucunuzun ağ kartı adı farklı olabilir, örneğin ens33, enp0s3 vb. `ip a` komutu ile kontrol edebilirsiniz.)

2.  **'osman' Kullanıcısını İnceleyin ve Güvenliğini Sağlayın:**
    *   **Nedeni:** Yönetici yetkisi elde eden bu hesabın ele geçirilmiş olup olmadığını anlamak ve daha fazla yetkisiz işlemi engellemektir.
    *   **Nasıl Yapılır:**
        *   **Parolasını Değiştirin:** Hemen 'osman' kullanıcısının parolasını karmaşık ve güçlü bir parola ile değiştirin.
            ```bash
            sudo passwd osman
            ```
        *   **Hesabı Geçici Olarak Kilitleyin:** İnceleme bitene kadar 'osman' hesabının sisteme giriş yapmasını engelleyin.
            ```bash
            sudo usermod -L osman
            ```
            (İnceleme bittikten ve güvenliği sağlandıktan sonra `sudo usermod -U osman` komutu ile kilidi açabilirsiniz.)
        *   **Aktivitesini İnceleyin:** 'osman' kullanıcısının sudo geçmişini ve diğer aktivitelerini detaylı olarak kontrol edin.
            ```bash
            sudo grep "sudo" /var/log/auth.log | grep "osman"
            history -a; history | grep "osman" # osman kullanıcısının shell geçmişi (eğer kaydedilmişse)
            ```
        *   **Hesabın Yasal Olup Olmadığını Belirleyin:** 'osman' adlı kullanıcının sistemde yasal bir kullanıcı olup olmadığını, eğer yasal ise son zamanlarda olağandışı bir aktivite yapıp yapmadığını teyit edin.

3.  **Saldırgan IP Adreslerini Güvenlik Duvarında Engelleyin:**
    *   **Nedeni:** İç ve dış ağdan gelen kaba kuvvet saldırılarının devam etmesini önlemektir.
    *   **Nasıl Yapılır:**
        *   **Ubuntu'da UFW (Uncomplicated Firewall) Kullanarak:**
            ```bash
            sudo ufw enable                     # Eğer UFW etkin değilse etkinleştirin
            sudo ufw deny from 192.168.64.1 to any port 22 comment 'Auth.log: Ic ag kaba kuvvet saldirisi'
            sudo ufw deny from 1.1.1.1 to any port 22 comment 'Auth.log: Dis ag kaba kuvvet saldirisi'
            sudo ufw deny from 1.1.1.2 to any port 22 comment 'Auth.log: Dis ag kaba kuvvet saldirisi'
            sudo ufw reload                     # Kuralları etkinleştirin
            sudo ufw status verbose             # Kuralların aktif olduğunu kontrol edin
            ```
        *   **Diğer Güvenlik Duvarı Çözümleriniz Varsa:** Kullandığınız diğer güvenlik duvarı veya IPS/IDS (Saldırı Tespit/Engelleme Sistemi) üzerinden bu IP adreslerini kalıcı olarak engelleyin.

4.  **SSH Bağlantılarını Güvenli Hale Getirin:**
    *   **Nedeni:** Uzaktan bağlantıların daha güvenli olmasını sağlamak ve kaba kuvvet saldırılarını zorlaştırmak.
    *   **Nasıl Yapılır:**
        *   **Parola ile Girişi Devre Dışı Bırakın:** Sadece anahtar (key) tabanlı kimlik doğrulamaya geçin.
        *   **Root Kullanıcısı ile Doğrudan Girişi Engelleyin:** Sadece normal kullanıcıların giriş yapmasına izin verin, root yetkileri için `sudo` kullanılsın.
        *   **Varsayılan SSH Portunu Değiştirin:** SSH'in çalıştığı varsayılan 22 numaralı portu başka bir porta taşıyın (örneğin 2222).
        *   **Fail2ban Kurun ve Yapılandırın:** Başarısız giriş denemelerini otomatik olarak engelleyen bir araçtır.
            ```bash
            sudo apt update
            sudo apt install fail2ban
            sudo systemctl enable fail2ban
            sudo systemctl start fail2ban
            ```
            Fail2ban ayarlarını SSH için etkinleştirdiğinizden emin olun (genellikle varsayılan olarak gelir).

5.  **AppArmor Engellemelerinin Kaynağını Araştırın:**
    *   **Nedeni:** AppArmor'un engellediği şüpheli işlemlerin hangi program veya süreçten kaynaklandığını anlamak ve potansiyel kötü amaçlı yazılımları tespit etmek.
    *   **Nasıl Yapılır:**
        *   Kernel loglarını tekrar inceleyerek AppArmor tarafından engellenen eylemlerin zaman damgalarına bakın.
        *   Bu zaman diliminde sistemde hangi programların çalıştığını ve hangi kullanıcılar tarafından çalıştırıldığını tespit etmeye çalışın.
        *   `dmesg | grep "AppArmor"` komutu ile AppArmor loglarını detaylıca inceleyebilirsiniz.

6.  **Kapsamlı Sistem Kontrolü Yapın:**
    *   **Nedeni:** Sistemde kötü amaçlı yazılım olup olmadığını, dosyaların değiştirilip değiştirilmediğini veya yeni kullanıcıların eklenip eklenmediğini kontrol etmek.
    *   **Nasıl Yapılır:**
        *   **Antivirüs / Kötü Amaçlı Yazılım Taraması:** Sunucu üzerinde ClamAV gibi bir araçla kapsamlı bir tarama yapın.
        *   **Dosya Bütünlüğü Kontrolü:** Tripwire veya AIDE gibi araçlarla sistem dosyalarında herhangi bir değişiklik olup olmadığını kontrol edin (eğer daha önce kurulu ise).
        *   **Yüklü Paketleri Kontrol Edin:** Yakın zamanda yüklenen veya şüpheli görünen paketleri tespit edin.
        *   **Açık Portları Kontrol Edin:** `netstat -tulnp` veya `ss -tulnp` komutları ile sistemde beklenmedik şekilde açık olan portları kontrol edin.

Bu adımlar, sisteminizin mevcut güvenlik açığını gidermek ve gelecekte benzer saldırıları önlemek için kritik öneme sahiptir. Durumu ciddiye alıp hızla harekete geçmenizi öneririm.