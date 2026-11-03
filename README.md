# e-Medrese - Siyer TV (Kamp Merkezli Yeni Nesil Arayüz)

Bu klasör, **e-Medrese (Siyer TV)** platformunun hem mobil hem de masaüstü cihazlarda tam uyumlu (responsive) çalışması için **modüler klasör yapısıyla** hazırlanmıştır. Doğrudan **GitHub**'a veya `siyertv.org` sunucusuna yüklenebilir.

## 📁 Klasör Yapısı

```text
e-medrese-github/
├── index.html                 # Ana sayfa iskeleti (Veriler burada tutulmaz, temiz yapıdadır)
├── css/
│   └── style.css              # Tema renkleri, Aktif/Biten kamp ayrımları ve mobil sabit bar stilleri
├── data/
│   ├── camps.js               # 🟢 Aktif ve 🏁 Biten kampların listesi (Yeni kamp buradan eklenir)
│   ├── lessons.js             # Kamplara ait dersler, videolar ve yoklama durumları
│   ├── announcements.js       # Kamp duyuruları ve genel sistem duyuruları
│   └── user.js                # Öğrenci profil ve sertifika bilgileri
├── js/
│   └── app.js                 # Kamp odası geçişleri, Seçenek A akıllı alt bar ve filtreleme kodları
└── assets/
    └── img/
        ├── logo.svg                        # Özel e-Medrese • Siyer TV vektörel logosu
        ├── imam-nevevi-kampi.jpg           # İmâm Nevevî Kampı afiş görseli (Biten Kamp)
        ├── imam-gazali-kampi.svg           # İmâm Gazâlî Kampı afiş görseli (Örnek Aktif Kamp)
        └── sertifika-emrullah-demir.jpg    # Katılım sertifikası görseli
```

## 🛠️ Yeni Kamp, Ders veya Duyuru Nasıl Eklenir?

1. **Yeni Kamp Eklemek veya Kampı "Biten" Duruma Almak:**
   - `data/camps.js` dosyasını açın.
   - `status: "active"` olan kamplar **Yeşil (Devam Eden Kamp)** temasıyla, `status: "completed"` olan kamplar ise **Arşiv/Taş (Süresi Biten Kamp)** temasıyla otomatik listelenir.
2. **Yeni Ders veya Yoklama Açmak:**
   - `data/lessons.js` dosyasında ilgili kampın ders listesine yeni satır ekleyin.
   - Yoklaması açık olan dersin `isLiveOpen: true` ve `status: "Yoklama Açık"` değerini güncelleyin.
3. **Yeni Duyuru Eklemek:**
   - `data/announcements.js` dosyasına yeni duyuru objesini ekleyin (`campId` alanına kampın kodunu veya `"general"` yazın).
