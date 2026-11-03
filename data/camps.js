// ============================================================================
// data/camps.js
// Yeni bir kamp ekleneceğinde veya mevcut kampın durumu "active" / "completed"
// olarak değiştirileceğinde yalnızca bu dosyayı güncellemeniz yeterlidir.
// ============================================================================

window.EMEDRESE_CAMPS = [
  {
    id: "imam-gazali",
    title: "Büyüklerin Ayak İzleri: İmâm Gazâlî Kampı",
    subtitle: "İhyâ ve Hakikat Arayışı",
    status: "active", // "active" = Devam Eden Kamp (Yeşil/Canlı Tema) | "completed" = Süresi Biten Kamp (Bronz/Arşiv Tema)
    statusLabel: "Devam Ediyor • Yoklama Açık",
    joined: true,
    image: "assets/img/imam-gazali-kampi.svg",
    dateRange: "28.10.2026 — 12.11.2026",
    deadline: "Son Kayıt: 30.10.2026 19:00",
    liveNotice: "6. Ders Canlı Yoklaması Şu An Açık!",
    totalLessons: 10,
    completedLessons: 5,
    progressPercent: 50,
    certificateEarned: false,
    certificateNote: "Sertifika hakkı için kalan 5 dersin en az 3'üne katılım sağlamalısınız.",
    description: "Hüccetü'l-İslâm İmâm Gazâlî'nin ilim, amel ve ihlas eksenli hayat yolculuğunu, İhyâü Ulûmi'd-Dîn mirasını ve Eyyühe'l-Veled risalesini 10 derste tahlil ettiğimiz aktif online eğitim kampı."
  },
  {
    id: "imam-nevevi",
    title: "İmâm Nevevî Kampı",
    subtitle: "Büyüklerin Ayak İzleri • Hicrî 1448 Açılış Kampı",
    status: "completed", // Süresi Biten / Tamamlanan Kamp
    statusLabel: "Süresi Bitti • Tamamlandı",
    joined: true,
    image: "assets/img/imam-nevevi-kampi.jpg",
    dateRange: "21.09.2026 — 06.10.2026",
    deadline: "Kayıtlar Tamamlandı (22.09.2026)",
    liveNotice: "Kamp Tamamlandı • Sertifikanız Hazır",
    totalLessons: 13,
    completedLessons: 13,
    progressPercent: 100,
    certificateEarned: true,
    certificateCode: "SYR-1448-NVV-8942",
    certificateImage: "assets/img/sertifika-emrullah-demir.jpg",
    certificateNote: "21 Eylül – 6 Ekim 2026 tarihleri arasında düzenlenen İmâm Nevevî Kampı'nı istikrarlı bir şekilde (13/13 ders) tamamlayarak katılım sertifikasını almaya hak kazandınız.",
    description: "Siyer Vakfımızın yeni dönemi olan Hicrî 1448 Hz. Peygamber (sas) ve Hidâyet Yılı'nı daha bereketli bir başlangıçla karşılamak gayesiyle 'Büyüklerin Ayak İzleri' projesi kapsamında düzenlediği 2 haftalık online kamp."
  }
];
