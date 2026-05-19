# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-18 23:14:17  
**LLM:** GEMINI  
**Toplam Bulgu:** 25 (3 KRİTİK, 0 YÜKSEK)  

---

Sayın Yönetici,

Sistemlerinizde tespit edilen güvenlik olaylarına ilişkin detaylı analiz raporunu aşağıda bilgilerinize sunarım. Bulgular, sistemlerinizde ciddi güvenlik ihlallerinin meydana gelmiş olabileceğini göstermektedir. Acil müdahale gereklidir.

## 1. Genel Durum Özeti

Sistemimizde, dışarıdan kaynaklı bir kaba kuvvet (brute force) saldırı girişimi ile beraber, sistem içerisinden kritik düzeyde başarılı bir yetki yükseltme (Privilege Escalation) olayı yaşanmıştır. 'osman' adlı kullanıcı tarafından `sudo` aracılığıyla root yetkisi alınması, sistemin güvenliğinin ciddi şekilde ihlal edildiğini ve potansiyel olarak tamamen ele geçirilmiş olabileceğini işaret etmektedir. Bu sırada, AppArmor güvenlik modülünün çok sayıda şüpheli kernel ve sistem çağrısını engellemiş olması, saldırganın (veya zararlı yazılımın) sistemde kalıcılık sağlamaya veya ek zararlı faaliyetler yürütmeye çalıştığını ancak güvenlik kontrolleri sayesinde bir miktar engellendiğini göstermektedir. Genel değerlendirme, sistemin kritik derecede tehlike altında olduğunu ve derhal kapsamlı bir müdahale planının uygulanması gerektiğini ortaya koymaktadır.

## 2. Tehdit Analizi

Aşağıda tespit edilen bulguların risk boyutu, potansiyel saldırı vektörleri ve etkileri detaylandırılmıştır:

*   **Bulgu:** SSH_BRUTE_FORCE: 192.168.64.1 IP adresinden 81 başarısız SSH giriş denemesi tespit edildi.
    *   **Risk Boyutu:** **KRİTİK**. Bu, bir saldırganın sisteminize ilk erişimi sağlamak için dışarıdan gerçekleştirdiği aktif bir denemedir. Başarısız olsa dahi, sürekli ve yüksek sayıda deneme, hedefli bir saldırının işareti olabilir. Başarılı olması durumunda, ilk erişim (Initial Access) elde edilmiş olacaktır.
    *   **Saldırı Vektörü:** Ağ üzerinden, hedef sistemin SSH servisine yönelik otomatik veya manuel parola deneme saldırısı.
    *   **Etki:** Başarılı olması durumunda, yetkisiz bir kullanıcının sisteme ilk erişimi elde etmesine ve sonraki saldırı aşamalarına geçmesine neden olabilir.

*   **Bulgu:** PRIVILEGE_ESCALATION_SUCCESS: 'osman' kullanıcısı sudo ile ROOT yetkisi aldı. Komut: `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` (x2 adet)
    *   **Risk Boyutu:** **KRİTİK**. Bu, listedeki en tehlikeli bulgudur. Bir kullanıcının (bu durumda 'osman') başarılı bir şekilde sistemde kök (root) yetkisi alması, saldırganın sistem üzerinde tam kontrol sağlaması anlamına gelir. `tail -f` komutunun bu amaçla kullanılması normal bir durum değildir ve yetki yükseltme için spesifik bir zafiyetin veya yanlış yapılandırmanın (örneğin sudoers dosyasındaki hatalı bir NOPASSWD girdisi) kullanıldığını düşündürmektedir.
    *   **Saldırı Vektörü:** Sisteme halihazırda erişimi olan bir kullanıcının, `sudo` mekanizmasını kötüye kullanarak veya bir zafiyetten faydalanarak yetkilerini artırması.
    *   **Etki:** Saldırganın sistemi tamamen ele geçirmesi, veri sızdırma, zararlı yazılım çalıştırma, kalıcılık sağlama, sisteme arka kapılar yerleştirme, başka sistemlere sıçrama (lateral movement) ve tüm güvenlik mekanizmalarını devre dışı bırakma yeteneği.

*   **Bulgu:** APPARMOR_BLOCK: AppArmor 'sys_nice', '/proc/pressure/memory', 'net_admin' işlemlerini engelledi. (Çok sayıda tekrar)
    *   **Risk Boyutu:** **ORTA**. AppArmor'ın bu işlemleri engellemesi olumlu bir durumdur ve saldırının belirli aşamalarının başarılı olmasını önlemiştir. Ancak engellenen işlemler (kernel kaynaklarına erişim, ağ yönetimi yetenekleri, işlem önceliği değiştirme) genellikle yetki yükseltme girişimleri, zararlı yazılım faaliyetleri veya sistemde kalıcılık sağlama çabaları ile ilişkilidir. Bu durum, sistemde zaten kötü niyetli bir sürecin veya aktörün varlığını gösterir.
    *   **Saldırı Vektörü:** Sisteme sızmış bir süreç veya zararlı yazılım tarafından gerçekleştirilmeye çalışılan yetkisiz sistem çağrıları veya kaynak erişim denemeleri.
    *   **Etki:** AppArmor'ın engellemesi sayesinde anlık zarar önlenmiştir, ancak bu tür işlemlerin denenmesi altta yatan bir tehdidin varlığını ve sistemde daha ileri bir aşamaya geçme niyetini gösterir.

## 3. MITRE ATT&CK Eşleştirmesi

Tespit edilen bulgular, MITRE ATT&CK bilgi tabanı ile aşağıdaki şekilde eşleştirilmiştir:

*   **T1110.001 — Brute Force: Password Guessing (Brute Force: Parola Tahmini):**
    *   **Taktik:** Initial Access (İlk Erişim)
    *   **Açıklama:** 192.168.64.1 IP adresinden gelen 81 başarısız SSH giriş denemesi, bir dış aktörün geçerli kimlik bilgilerini tahmin etmeye çalıştığını göstermektedir.

*   **T1548.003 — Sudo and Sudo Caching (Sudo ve Sudo Önbelleğe Alma):**
    *   **Taktik:** Privilege Escalation (Yetki Yükseltme)
    *   **Açıklama:** 'osman' kullanıcısının `sudo` ile root yetkisi alması, sistemdeki bir zafiyetin veya yanlış yapılandırmanın kullanılarak yetkilerin artırıldığını teyit etmektedir.

*   **T1068 — Exploitation for Privilege Escalation (Yetki Yükseltme Amaçlı İstismar):**
    *   **Taktik:** Privilege Escalation (Yetki Yükseltme)
    *   **Açıklama:** AppArmor tarafından engellenen 'sys_nice', '/proc/pressure/memory', 'net_admin' gibi işlemler, bir yetki yükseltme veya sistem kontrolünü ele geçirme girişiminin AppArmor tarafından durdurulduğunu göstermektedir. Bu, saldırganın bir zafiyetten yararlanmaya çalıştığının kanıtıdır.

## 4. Acil Müdahale Önerileri

Olayın ciddiyeti göz önüne alındığında, aşağıdaki acil müdahale adımlarının derhal uygulanması gerekmektedir:

**A. Anlık Kapsama ve Engelleme:**

1.  **Saldırgan IP Adresini Engelle:** SSH kaba kuvvet denemelerinin geldiği 192.168.64.1 IP adresini güvenlik duvarı kuralları ile kalıcı olarak engelleyin.
    ```bash
    # Geçici engelleme
    sudo iptables -A INPUT -s 192.168.64.1 -j DROP
    # Daha kalıcı çözüm için (örn. UFW kullanılıyorsa)
    sudo ufw deny from 192.168.64.1 to any port 22
    # firewalld kullanılıyorsa
    sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.64.1" reject'
    sudo firewall-cmd --reload
    ```
2.  **'osman' Kullanıcısını Askıya Al/Kilitle:** Root yetkisi alan 'osman' kullanıcısının sisteme erişimini derhal engelleyin.
    ```bash
    sudo passwd -l osman # Kullanıcının parolasını kilitler
    sudo usermod -L osman # Kullanıcının hesabını kilitler
    # Eğer bu bir hizmet hesabı ise, hizmeti durdurup tekrar etkinleştirmeden önce ayrıntılı inceleme yapın.
    ```
3.  **Sistemi Ağdan İzole Et:** Eğer mümkünse ve kritik operasyonları etkilemeyecekse, sistemi ağdan mantıksal veya fiziksel olarak izole ederek daha fazla yayılmayı önleyin. Bu, adli analiz sırasında sistemin değişmeden kalmasını sağlar.

**B. Detaylı Araştırma ve Adli Analiz:**

1.  **'osman' Kullanıcı Hesap İncelemesi:**
    *   'osman' kullanıcısının ne zaman oluşturulduğunu, hangi gruplara üye olduğunu ve son giriş zamanlarını kontrol edin:
        ```bash
        cat /etc/passwd | grep osman
        id osman
        last osman
        ```
    *   'osman' kullanıcısının `.bash_history` veya diğer shell geçmişi dosyalarını kontrol ederek hangi komutları çalıştırdığını inceleyin:
        ```bash
        sudo cat /home/osman/.bash_history
        ```
    *   'osman' kullanıcısının ev dizininde ( `/home/osman` ) şüpheli dosyalar veya dizinler olup olmadığını kontrol edin.
2.  **Sudo Loglarını İncele:** 'osman' kullanıcısının root yetkisi aldığı komut hakkında daha fazla bilgi edinmek için `/var/log/auth.log`, `/var/log/secure` veya `auditd` loglarını inceleyin.
    ```bash
    sudo grep "sudo" /var/log/auth.log | grep "osman"
    sudo ausearch -c 'sudo' --raw | aureport -i -ts recent
    ```
3.  **Sistem Loglarını Detaylı İncele:** `auth.log`, `syslog`, `kern.log`, `dmesg` gibi tüm log dosyalarında 'osman', 192.168.64.1 veya yetki yükseltme ile ilgili anahtar kelimeleri arayın.
    ```bash
    sudo grep -E "osman|192.168.64.1|escalation|root" /var/log/*
    ```
4.  **AppArmor Loglarını İncele:** AppArmor'ın engellediği işlemlerin hangi süreç veya PID tarafından yapıldığını tespit edin.
    ```bash
    sudo grep -i "apparmor" /var/log/syslog
    sudo dmesg | grep "apparmor"
    ```
5.  **Çalışan Süreçleri ve Ağ Bağlantılarını Kontrol Et:** Sistemde çalışan şüpheli süreçler veya dışarıyla kurulan aktif ağ bağlantıları olup olmadığını kontrol edin.
    ```bash
    ps aux | grep -v root
    sudo netstat -tulnp
    ```
6.  **Dosya Bütünlüğü Kontrolü:** Tripwire veya AIDE gibi dosya bütünlüğü izleme araçları kullanılıyorsa, değişiklikleri kontrol edin. Kullanılmıyorsa, kritik sistem dizinlerinde ( `/bin`, `/sbin`, `/usr/bin`, `/etc` ) şüpheli dosya değişikliklerini veya yeni dosyaları araştırın.

**C. Eradikasyon ve Kurtarma:**

1.  **Sistemi Temiz Bir İmajdan Geri Yükle:** Eğer saldırgan sisteme tam erişim sağlamışsa, zararlı yazılım veya arka kapıları tamamen temizlemek zor olabilir. En güvenli yöntem, sistemin bilinen temiz bir yedekten geri yüklenmesi veya yeniden kurulmasıdır.
2.  **Etkilenen Hesapların Şifrelerini Değiştir:** Eğer 'osman' dışındaki başka kullanıcı hesapları da risk altındaysa, tüm ilgili hesapların şifrelerini derhal değiştirin.
3.  **Tespit Edilen Arka Kapıları Kaldır:** Adli analiz sonucunda tespit edilen tüm kalıcılık mekanizmalarını ve arka kapıları kaldırın.

**D. Önleyici Tedbirler:**

1.  **SSH Güvenliğini Sıkılaştır:**
    *   Parola ile giriş yerine SSH anahtar tabanlı kimlik doğrulamayı zorunlu kılın.
    *   `PermitRootLogin no` ayarını `/etc/ssh/sshd_config` dosyasında etkinleştirin.
    *   Fail2Ban gibi araçları SSH kaba kuvvet denemelerine karşı etkinleştirin.
    *   Varsayılan SSH portunu değiştirin.
2.  **Minimum Yetki Prensibini Uygula:** Kullanıcılara yalnızca işlerini yapmaları için gerekli olan en az yetkiyi verin. 'osman' gibi kullanıcıların `sudo` ile root yetkisi almasını sağlayan hatalı `sudoers` yapılandırmalarını düzeltin. `sudo` komutunun `NOPASSWD` ayarları çok dikkatli kullanılmalı ve yalnızca kesinlikle gerekli olan komutlar için izin verilmelidir.
3.  **AppArmor/SELinux Politikalarını Güçlendir:** AppArmor'ın olay anında gösterdiği performansı takdir ederek, daha fazla hizmet ve uygulamanın AppArmor/SELinux profilleri ile korunmasını sağlayın.
4.  **Düzenli Güvenlik Yamaları ve Güncellemeler:** Tüm sistemlerin ve uygulamaların en son güvenlik yamaları ile güncel olduğundan emin olun.
5.  **SIEM Korelasyon Kurallarını İyileştir:** Benzer olayların daha hızlı tespit edilmesi için SIEM'inizdeki korelasyon kurallarını gözden geçirin ve güçlendirin.

Bu rapor ışığında, belirtilen adımların acilen atılması ve sistem güvenliğinin kapsamlı bir şekilde gözden geçirilmesi elzemdir.

Saygılarımla,

[Siber Güvenlik Analisti ve SIEM Uzmanı Adınız/Unvanınız]