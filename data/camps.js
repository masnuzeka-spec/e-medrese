// ============================================================================
// data/camps.js
// Aktif ("active") ve Biten ("completed") kampların bilgileri burada tutulur.
// ============================================================================

window.EMEDRESE_CAMPS = [
  {
    id: "imam-gazali",
    title: "Büyüklerin Ayak İzleri: İmâm Gazâlî Kampı",
    shortTitle: "İmâm Gazâlî Kampı",
    arabicTitle: "الإمام الغزالي",
    status: "active", // "active" = Devam Ediyor | "completed" = Tamamlandı
    statusBadge: "Devam Ediyor",
    image: "assets/img/imam-gazali-kampi.svg",
    dateRange: "28.10.2026 — 12.11.2026",
    instructorCount: "5 Hoca",
    totalLessons: 10,
    completedLessons: 5,
    progressPercent: 50,
    hasOpenAttendance: true,
    openLessonTitle: "6. Ders: Eyyühe'l-Veled Okumaları - 3",
    certificateEarned: false,
    certificateCode: "SYR-1448-GZL-4102",
    certificateImage: "",
    certificateNote: "Sertifika almaya hak kazanmak için kalan 5 dersin en az 3 yoklamasını tamamlamalısınız.",
    description: "Hüccetü'l-İslâm İmâm Gazâlî'nin ilim, amel ve ihlas eksenli hayat yolculuğunu, İhyâü Ulûmi'd-Dîn mirasını ve Eyyühe'l-Veled risalesini 10 derste tahlil ettiğimiz aktif online eğitim kampı."
  },
  {
    id: "imam-nevevi",
    title: "İmâm Nevevî Kampı",
    shortTitle: "İmâm Nevevî Kampı",
    arabicTitle: "الإمام النووي",
    status: "completed",
    statusBadge: "Tamamlandı",
    image: "assets/img/imam-nevevi-kampi.jpg",
    dateRange: "21.09.2026 — 06.10.2026",
    instructorCount: "7 Hoca",
    totalLessons: 13,
    completedLessons: 13,
    progressPercent: 100,
    hasOpenAttendance: false,
    openLessonTitle: "",
    certificateEarned: true,
    certificateCode: "SYR-1448-NVV-8942",
    certificateImage: "assets/img/sertifika-emrullah-demir.jpg",
    certificateNote: "21 Eylül – 6 Ekim 2026 tarihleri arasında düzenlenen İmâm Nevevî Kampı'nı istikrarlı bir şekilde tamamlayarak bu katılım sertifikasını almaya hak kazandınız.",
    description: "Siyer Vakfımızın yeni dönemi olan Hicrî 1448 Hz. Peygamber (sas) ve Hidâyet Yılı'nı daha bereketli bir başlangıçla karşılamak gayesiyle 'Büyüklerin Ayak İzleri' projesi kapsamında düzenlediği 2 haftalık online kamp."
  },
  {
    id: "omer-bin-abdulaziz",
    title: "Ömer bin Abdülazîz ve Adalet Kampı",
    shortTitle: "Ömer bin Abdülazîz Kampı",
    arabicTitle: "عمر بن عبد العزيز",
    status: "completed",
    statusBadge: "Tamamlandı",
    image: "assets/img/omer-bin-abdulaziz-kampi.svg",
    dateRange: "01.08.2026 — 15.08.2026",
    instructorCount: "4 Hoca",
    totalLessons: 10,
    completedLessons: 10,
    progressPercent: 100,
    hasOpenAttendance: false,
    openLessonTitle: "",
    certificateEarned: true,
    certificateCode: "SYR-1448-OBA-5519",
    certificateImage: "assets/img/sertifika-emrullah-demir.jpg",
    certificateNote: "1 Ağustos – 15 Ağustos 2026 tarihleri arasında düzenlenen Ömer bin Abdülazîz Kampı'nı istikrarlı bir şekilde tamamlayarak bu katılım sertifikasını almaya hak kazandınız.",
    description: "İkinci Râşid Halife kabul edilen Ömer bin Abdülazîz'in zühd hayatını, yönetim ahlakını, hadislerin tedvinindeki öncü rolünü ve ıslahat hamlelerini ele aldığımız tamamlanmış online eğitim kampı."
  }
];
