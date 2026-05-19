# 🛡️ Güvenlik Log Analiz Raporu

**Tarih:** 2026-05-18 23:58:57  
**LLM:** GEMINI  
**Toplam Bulgu:** 25 (3 KRİTİK, 0 YÜKSEK)  

---

Siber Güvenlik Analisti ve SIEM Uzmanı olarak Ubuntu 22.04 sunucunuzdan alınan log dosyalarını inceledim. Aşağıda bulgularımı ve tavsiyelerimi içeren raporu bulabilirsiniz. Rapor, sistemin genel güvenlik durumunu ve acil müdahale adımlarını net bir şekilde ortaya koymaktadır.

---

## 📤 auth.log Analizi (Kimlik Doğrulama / SSH Logları)

*   **Bu dosyada neler oldu?** Sisteminizde çok ciddi güvenlik olayları yaşanmıştır. İlk olarak, 192.168.64.1 IP adresinden gelen bir saldırgan, SSH bağlantı noktası üzerinden sisteminize girmek için kullanıcı adları ve şifreleri tahmin etmeye çalışmıştır. Bu tür saldırılara "kaba kuvvet" (brute-force) denir ve saldırgan 97 kez başarısız giriş denemesi yapmıştır. Şu an için başarılı olamamış görünmektedir. İkinci olarak, "osman" adlı bir kullanıcı, normalde sadece sistem yöneticilerine ait olan "root" (yönetici) yetkilerini başarıyla almıştır. Bu, "sudo" komutu kullanılarak yapılmıştır. Her ne kadar bu yetkiyle sadece bir log dosyasını izlemiş olsa da ( `/usr/bin/tail -f /var/ossec/logs/alerts/alerts.json` ), bir kullanıcının yönetici yetkisi alabilmesi çok büyük bir güvenlik sorunudur. Bu durum iki ayrı olay olarak kaydedilmiştir.

*   **Ne kadar ciddi?** **SON DERECE CİDDİ.** Hem dışarıdan gelen aktif bir kaba kuvvet saldırısı hem de içeriden bir kullanıcının yönetici yetkisi alması, sisteminizin şu anda ciddi tehlike altında olduğunu göstermektedir. Kaba kuvvet saldırısı başarılı olmasa bile sürekli bir tehdittir. "osman" kullanıcısının yetki yükseltmesi ise, ya bu kullanıcının hesabının ele geçirildiği ya da sisteminizdeki yetkilendirme ayarlarında çok tehlikeli bir hata olduğu anlamına gelir. Yönetici yetkisi ele geçirilmiş bir hesap, saldırganın sistemi tamamen kontrol altına almasına olanak tanır.

*   **Hemen ne yapılmalı?**
    1.  192.168.64.1 IP adresinden gelen tüm bağlantıları güvenlik duvarınızda (firewall) derhal engelleyin.
    2.  "osman" kullanıcısının faaliyetlerini hemen ve detaylı bir şekilde araştırın. Bu yetki yükseltme işlemi olağan bir durum muydu? Eğer değilse, "osman" hesabının şifresini hemen değiştirin ve önceki tüm aktivitelerini kontrol edin.
    3.  Sisteminizdeki "sudo" yetkilendirme ayarlarını gözden geçirin; sadece gerçekten ihtiyaç duyan kişilerin yönetici yetkisi alabildiğinden emin olun ve güçlü şifre politikaları uygulayın.
    4.  SSH bağlantıları için şifre ile giriş yerine daha güvenli olan anahtar tabanlı kimlik doğrulamayı zorunlu hale getirmeyi ve SSH portunu değiştirmeyi düşünün.

## 📜 syslog Analizi (Sistem / Ağ / Cron Logları)

*   **Bu dosyada neler oldu?** Bu log dosyasında genel sistem, ağ veya zamanlanmış görevlerle ilgili herhangi bir tehdit veya önemli güvenlik sorunu tespit edilmemiştir. Olağandışı veya şüpheli bir aktivite kaydedilmemiştir.

*   **Ne kadar ciddi?** Bu dosya özelinde ciddiyet derecesi **yoktur**. Herhangi bir olumsuzluk veya güvenlik açığı kaydedilmemiştir.

*   **Hemen ne yapılmalı?** Bu log dosyası özelinde acil bir müdahale gerekmemektedir. Ancak genel sistem güvenliği denetimlerine ve izlemesine devam edilmelidir.

## 🖥️ kern.log Analizi (Kernel / Bellek / AppArmor Logları)

*   **Bu dosyada neler oldu?** Sisteminizin önemli bir güvenlik bileşeni olan AppArmor güvenlik duvarı, toplamda 22 defa şüpheli veya yetkisiz olduğunu düşündüğü program ve eylemleri engellemiştir. Bu engellenen eylemler arasında sistemdeki işlemlerin önceliklerini değiştirmeye çalışan 'sys_nice', bellek kullanımıyla ilgili bilgilere erişmeye çalışan '/proc/pressure/memory' ve ağ yönetimiyle ilgili 'net_admin' gibi işlemler bulunmaktadır. AppArmor bu eylemlerin sistem üzerindeki potansiyel kötüye kullanımını başarıyla durdurmuştur.

*   **Ne kadar ciddi?** **ORTA Düzeyde.** AppArmor'ın bu eylemleri başarılı bir şekilde engellemiş olması iyi bir durumdur; bu, sisteminizin savunma mekanizmalarının çalıştığını gösterir. Ancak, bu kadar çok engelleme girişiminin olması, sistemde çalışan bazı uygulamaların olması gerekenden daha fazla yetki talep ettiğini veya kötü niyetli bir yazılımın sistemde hareket etmeye çalıştığını gösterebilir. AppArmor bir saldırıyı veya hatayı engellemiş olsa da, neden bu engellemelere ihtiyaç duyulduğu anlaşılmalıdır.

*   **Hemen ne yapılmalı?**
    1.  Bu engellemeleri tetikleyen uygulamaları veya süreçleri tespit edin. Hangi uygulamalar 'sys_nice', '/proc/pressure/memory' veya 'net_admin' gibi işlemleri yapmaya çalıştı?
    2.  Bu uygulamaların normalde bu tür yetkilere ihtiyacı olup olmadığını doğrulayın. Eğer bu uygulamaların bu yetkilere ihtiyacı yoksa, sistemde kötü amaçlı bir yazılım olma ihtimalini araştırın.
    3.  Gerekiyorsa, AppArmor profillerini bu uygulamaların yalnızca ihtiyaç duyduğu eylemlere izin verecek şekilde güncelleyin. Ancak bu adımı dikkatli yapın, yanlış yapılandırma güvenlik açıklarına yol açabilir.

## ⚠️ Genel Risk Değerlendirmesi

**Risk Skoru: 9/10 (Çok Yüksek / Kritik)**

Sisteminiz şu anda çok ciddi bir güvenlik riski altındadır. Hem dışarıdan gelen aktif bir kaba kuvvet saldırısı hem de dahili olarak bir kullanıcının yönetici yetkilerini ele geçirmesi gibi kritik olaylar tespit edilmiştir. AppArmor'ın başarılı engellemeleri, sistemin bir savunma mekanizmasının çalıştığını gösterse de, bu engellemelerin sıkça meydana gelmesi sistemde şüpheli aktivitelerin olduğunu kanıtlamaktadır. "osman" kullanıcısının yetki yükseltmesi ve kaba kuvvet saldırısı, sistemin ele geçirilme veya içeriden bir saldırgan tarafından kontrol edilme potansiyelini son derece artırmaktadır. Sisteminizin güvenliğini sağlamak için acil ve kapsamlı müdahale adımları gereklidir.

## 🛡️ Acil Müdahale Adımları

Aşağıdaki adımlar, belirtilen riskleri azaltmak ve sisteminizi güvence altına almak için sıralı bir şekilde uygulanmalıdır:

1.  **Saldırgan IP Adresini Engelle:**
    *   192.168.64.1 IP adresinden gelen tüm bağlantıları güvenlik duvarınızda (firewall) derhal engelleyin.
    ```bash
    # UFW kullanıyorsanız:
    sudo ufw deny from 192.168.64.1
    sudo ufw reload
    # IPTables kullanıyorsanız:
    # sudo iptables -A INPUT -s 192.168.64.1 -j DROP
    # sudo iptables-save # Kalıcı hale getirmek için
    ```

2.  **'osman' Kullanıcısını İncele ve Güvene Al:**
    *   'osman' kullanıcısının en son ne zaman ve hangi komutları çalıştırdığını kontrol edin.
    ```bash
    grep "osman" /var/log/auth.log | less
    # osman kullanıcısının kendi komut geçmişini (eğer saklanıyorsa) kontrol edin:
    # sudo -u osman bash -c "history"
    ```
    *   Eğer yetki yükseltme (sudo) işlemi şüpheli ise veya beklendik bir durum değilse, 'osman' kullanıcısının şifresini derhal çok güçlü bir şifreyle değiştirin. Şüpheli durumlarda hesabı geçici olarak kilitleyebilirsiniz.
    ```bash
    sudo passwd osman # Yeni, güçlü bir şifre belirleyin
    # sudo usermod -L osman # Hesabı geçici olarak kilitlemek için
    ```
    *   'osman' kullanıcısının sudo yetkilerini kontrol edin ve gerekirse kısıtlayın.
    ```bash
    sudo visudo # Bu komut ile /etc/sudoers dosyasını düzenleyin
    # veya /etc/sudoers.d/ dizinindeki dosyaları kontrol edin
    # Sudoers dosyasında 'osman'a verilen yetkileri gözden geçirin ve sadece gerçekten ihtiyacı olanları bırakın.
    ```

3.  **SSH Güvenliğini Güçlendir:**
    *   SSH servisini sadece anahtar tabanlı kimlik doğrulamasına izin verecek şekilde yapılandırın ve şifre ile girişi devre dışı bırakın. Bu en güvenli yöntemdir.
    ```bash
    sudo nano /etc/ssh/sshd_config
    # Aşağıdaki satırları bulun ve değerlerini güncelleyin (yoksa ekleyin):
    # PasswordAuthentication no
    # PubkeyAuthentication yes
    # ChallengeResponseAuthentication no
    # UsePAM no (eğer aktifse ve gerekmiyorsa)
    sudo systemctl restart sshd
    ```
    *   SSH servisini varsayılan 22 portundan farklı ve daha az tahmin edilebilir bir porta taşıyın (örneğin 2222 veya 54321).
    ```bash
    sudo nano /etc/ssh/sshd_config
    # Port 22 -> Port 2222 (veya belirlediğiniz başka bir port)
    sudo systemctl restart sshd
    # Yeni portu güvenlik duvarınızda açmayı unutmayın! (Örn: sudo ufw allow 2222/tcp)
    ```
    *   Başarısız SSH denemelerini otomatik olarak engelleyen Fail2ban gibi bir araç kurun ve yapılandırın.
    ```bash
    sudo apt update
    sudo apt install fail2ban
    # /etc/fail2ban/jail.local dosyasını kendi ihtiyaçlarınıza göre yapılandırın (SSH için varsayılanlar genelde iyidir)
    sudo systemctl enable fail2ban
    sudo systemctl start fail2ban
    ```

4.  **AppArmor Engellemelerinin Kaynağını Araştır:**
    *   Kern.log dosyasında AppArmor tarafından engellenen eylemlerin detaylarını daha yakından inceleyin. Hangi süreçlerin bu engellemeleri tetiklediğini belirleyin.
    ```bash
    sudo journalctl -k | grep "AppArmor" | less
    ```
    *   Şüpheli görünen uygulamaların kurulum ve çalışma zamanı bilgilerini araştırın. Gerekirse bu uygulamaları kaldırın veya izolasyon altına alın. Bu adım, potansiyel kötü amaçlı yazılımları veya hatalı yapılandırılmış uygulamaları bulmak için önemlidir.

5.  **Kapsamlı Güvenlik Denetimi ve Kötü Amaçlı Yazılım Taraması:**
    *   Sistemde bilinen güvenlik açıklarını ve kötü amaçlı yazılımları taramak için güvenlik araçlarını (örneğin ClamAV, rkhunter, chkrootkit) çalıştırın.
    ```bash
    sudo apt update
    sudo apt install clamav rkhunter chkrootkit
    sudo freshclam # ClamAV virüs veritabanını güncelle
    sudo clamscan -r / --exclude-dir="/sys|/proc|/dev|/run" # Tüm sistemi tara
    sudo rkhunter --checkall # Kök kullanıcı kiti (rootkit) ve güvenlik açığı kontrolü
    sudo chkrootkit # Diğer bir kök kullanıcı kiti kontrolü
    ```

6.  **Sistem Güncellemeleri ve Güvenlik Yamaları:**
    *   Sisteminizin ve tüm yüklü yazılımların en güncel güvenlik yamalarına sahip olduğundan emin olun. Bu, bilinen güvenlik açıklarının kapatılmasına yardımcı olur.
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt autoremove --purge -y
    ```

Bu adımlar kritik öneme sahiptir ve derhal uygulanmalıdır. Sisteminizin güvenliğini kalıcı hale getirmek için düzenli güvenlik denetimleri, log izleme rutinleri ve güçlü güvenlik politikaları oluşturulması tavsiye edilir.