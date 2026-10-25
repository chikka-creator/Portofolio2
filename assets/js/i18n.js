/* i18n Dictionary and Handler */

const TRANSLATIONS = {
  id: {
    navMain: "Main",
    navWork: "Karya",
    navGallery: "Galeri",
    navAbout: "Tentang",
    navContact: "Kontak",
    statusHome: "Terbuka untuk proyek",
    statusWork: "Karya pilihan",
    statusGallery: "Arsip",
    statusAbout: "Surabaya · GMT+7",
    statusContact: "Terbuka untuk proyek",
    langId: "ID",
    langEn: "EN",

    heroTitle: "FAKHRI",
    heroDesc: "Saya adalah seorang Front-End Developer dan UI/UX Designer. Berfokus pada penyederhanaan antarmuka yang kompleks menjadi solusi elegan yang berpusat pada pengguna.",
    orbScrollHint: "Gulir untuk memutar",
    workBadge: "Karya Unggulan & Prestasi",
    workHeadline: "KARYA YANG<br/>DIBANGUN DENGAN<br/><span>STRATEGI.</span>",
    workSubtitle: "Jelajahi karya pilihan dan sertifikasi keahlian dalam rotasi interaktif 3D yang mengelilingi pusat gravitasi digital.",

    workTitle: "Karya & Sertifikasi",
    workDesc: "Jelajahi karya pilihan dan sertifikasi keahlian dalam rotasi interaktif 3D yang mengelilingi pusat gravitasi digital.",
    workLinkCode: "Lihat Repositori",
    workLinkFigma: "Lihat Figma",
    workOverlayClose: "Tutup",
    closeBtn: "Tutup",
    openProject: "Buka Repositori",
    workTableNo: "No.",
    workTableTitle: "Judul",
    workTableSeries: "Seri",
    workTablePlace: "Tempat",
    workTableYear: "Tahun",

    galleryTitle: "Galeri",
    galleryDesc: "Karya sampingan dan bingkai di antaranya, tersusun di atas meja. Geser untuk menjelajah, hover untuk mengangkat, klik untuk melihat lebih dekat.",
    galleryFrames: "{n} bingkai",
    galleryDragHint: "Geser untuk menjelajah",
    galleryZoomIn: "Perbesar",
    galleryZoomOut: "Perkecil",
    galleryFilterAll: "Semua {n}",

    aboutTitle: "Tentang",
    aboutBio: "Saya adalah seorang Front-End Developer dan UI/UX Designer. Berfokus pada penyederhanaan antarmuka yang kompleks menjadi solusi elegan yang berpusat pada pengguna.",
    aboutCue: "Surabaya · GMT+7",
    aboutFocus: "Fokus",
    aboutTools: "Perangkat",
    aboutRecognition: "Penghargaan",
    aboutExperience: "Pengalaman",
    aboutMagang: "Magang & Industri",
    aboutMagangDesc: "Pengalaman praktis mengimplementasikan arsitektur kode frontend, integrasi antarmuka, dan optimalisasi alur pengguna pada proyek nyata.",
    aboutLeadership: "Kepemimpinan & Organisasi",
    aboutLeadershipDesc: "Mengkoordinasikan tim dan mengelola timeline eksekusi acara teknis maupun kreatif secara sistematis.",
    aboutWorkshop: "Partisipasi & Workshop",
    aboutWorkshopDesc: "Aktif mengikuti workshop teknologi, hackathon, dan seminar bersertifikasi.",
    aboutCaption: "Mara Halden — Alentejo, 2025 → Fakhri — Surabaya, 2026",

    contactTitle: "Kontak",
    contactBadge: "Mari Terhubung",
    contactHeadline: "LET'S BUILD SOMETHING.",
    contactDesc: "Mencari developer yang memahami bagaimana menghubungkan design logic dengan kode yang bersih dan terstruktur? Mari terhubung untuk proyek Anda selanjutnya.",
    contactCue: "Surabaya · Indonesia",
    contactEmail: "ditofakhri3@gmail.com",
    contactBased: "Berbasis di",
    contactBasedVal: "Surabaya, Indonesia",
    contactElsewhere: "Di tempat lain",
    contactResponse: "Respon",
    contactResponseVal: "dalam 2 hari",
    formNew: "Pertanyaan baru",
    formStep: "01 / 02",
    formName: "Nama",
    formNamePh: "Nama Anda",
    formEmail: "Email",
    formEmailPh: "anda@studio.com",
    formProject: "Proyek",
    formMessage: "Pesan",
    formMessagePh: "Ceritakan tentang pekerjaan — tempat, tanggal, cara penggunaan.",
    formSend: "Kirim pertanyaan →",
    formBook: "Jadwalkan panggilan",
    chipFrontend: "Front-End",
    chipUiux: "UI/UX",
    chipCollab: "Kolaborasi",
    chipOther: "Lainnya",
    errRequired: "Wajib diisi.",
    errEmail: "Email tidak valid."
  },
  en: {
    navMain: "Main",
    navWork: "Work",
    navGallery: "Gallery",
    navAbout: "About",
    navContact: "Contact",
    statusHome: "Open to work",
    statusWork: "Selected works",
    statusGallery: "Archive",
    statusAbout: "Surabaya · GMT+7",
    statusContact: "Open for work",
    langId: "ID",
    langEn: "EN",

    heroTitle: "FAKHRI",
    heroDesc: "I am a Front-End Developer and UI/UX Designer. Focused on simplifying complex interfaces into elegant, user-centric solutions.",
    orbScrollHint: "Scroll to rotate",
    workBadge: "Featured Works & Achievements",
    workHeadline: "WORK THAT<br/>BEGINS WITH<br/><span>STRATEGY.</span>",
    workSubtitle: "Explore interactive projects and featured certificates in a 3D orbit circling digital gravity.",

    workTitle: "Works & Certifications",
    workDesc: "Explore interactive projects and featured certificates in a 3D orbit circling digital gravity.",
    workLinkCode: "View Repository",
    workLinkFigma: "View in Figma",
    workOverlayClose: "Close",
    closeBtn: "Close",
    openProject: "Open Repository",
    workTableNo: "No.",
    workTableTitle: "Title",
    workTableSeries: "Series",
    workTablePlace: "Place",
    workTableYear: "Year",

    galleryTitle: "Gallery",
    galleryDesc: "Out-takes and the frames in between, laid out on the table. Drag to move it, hover to lift a print, click to look closer.",
    galleryFrames: "{n} frames",
    galleryDragHint: "Drag to explore",
    galleryZoomIn: "Zoom in",
    galleryZoomOut: "Zoom out",
    galleryFilterAll: "All {n}",

    aboutTitle: "About",
    aboutBio: "I am a Front-End Developer and UI/UX Designer. Focused on simplifying complex interfaces into elegant, user-centric solutions.",
    aboutCue: "Surabaya · GMT+7",
    aboutFocus: "Focus",
    aboutTools: "Tools",
    aboutRecognition: "Recognition",
    aboutExperience: "Experience",
    aboutMagang: "Internship & Industry",
    aboutMagangDesc: "Hands-on experience implementing frontend code architecture, UI integration, and user workflow optimization in real projects.",
    aboutLeadership: "Leadership & Organization",
    aboutLeadershipDesc: "Coordinating teams and systematically managing execution timelines for technical and creative events.",
    aboutWorkshop: "Active Workshops & Participation",
    aboutWorkshopDesc: "Actively attending tech workshops, hackathons, and certified programs.",
    aboutCaption: "Mara Halden — Alentejo, 2025 → Fakhri — Surabaya, 2026",

    contactTitle: "Contact",
    contactBadge: "Get In Touch",
    contactHeadline: "LET'S BUILD SOMETHING.",
    contactDesc: "Looking for a developer who understands how to connect design logic with clean, structured code? Let's connect for your next project.",
    contactCue: "Surabaya · Indonesia",
    contactEmail: "ditofakhri3@gmail.com",
    contactBased: "Based in",
    contactBasedVal: "Surabaya, Indonesia",
    contactElsewhere: "Elsewhere",
    contactResponse: "Response",
    contactResponseVal: "within 2 days",
    formNew: "New enquiry",
    formStep: "01 / 02",
    formName: "Name",
    formNamePh: "Your name",
    formEmail: "Email",
    formEmailPh: "you@studio.com",
    formProject: "Project",
    formMessage: "Message",
    formMessagePh: "Tell me about the work — place, dates, how it will be used.",
    formSend: "Send enquiry →",
    formBook: "Book a call",
    chipFrontend: "Front-End",
    chipUiux: "UI/UX",
    chipCollab: "Collaboration",
    chipOther: "Other",
    errRequired: "Required.",
    errEmail: "Invalid email."
  }
};

let currentLang = "id";

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "id" || saved === "en") {
      return saved;
    }
  } catch (e) {
    // Local storage unavailable
  }
  return "id";
}

function applyLanguage(lang) {
  if (lang !== "id" && lang !== "en") lang = "id";
  currentLang = lang;
  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}

  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);

  const dict = TRANSLATIONS[lang] || TRANSLATIONS.id;

  const textNodes = document.querySelectorAll("[data-i18n]");
  textNodes.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      node.textContent = dict[key];
    }
  });

  const htmlNodes = document.querySelectorAll("[data-i18n-html]");
  htmlNodes.forEach((node) => {
    const key = node.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) {
      node.innerHTML = dict[key];
    }
  });

  const phNodes = document.querySelectorAll("[data-i18n-ph]");
  phNodes.forEach((node) => {
    const key = node.getAttribute("data-i18n-ph");
    if (dict[key] !== undefined) {
      node.setAttribute("placeholder", dict[key]);
    }
  });

  const langButtons = document.querySelectorAll(".chrome-lang button");
  langButtons.forEach((btn) => {
    const target = btn.getAttribute("data-lang");
    const active = target === lang;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  if (typeof updateHUDLanguage === "function") {
    updateHUDLanguage(lang);
  }
}

currentLang = getInitialLanguage();
