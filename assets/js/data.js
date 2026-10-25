/* Data Model for Farline Rebuild */

const ORBIT_PLATES = [
  {
    kind: "project",
    title: "TechInventory System",
    tag: "Full-Stack",
    place: "Surabaya",
    year: "2025",
    series: "Web Application",
    specs: "REACT · NODE.JS · POSTGRESQL · TAILWIND",
    descId: "Sistem manajemen inventaris laboratorium terintegrasi dengan pelacakan alat fisik, otomatisasi stok real-time, dan sistem penalti poin.",
    descEn: "Integrated laboratory inventory management system featuring physical tool tracking, real-time stock automation, and penalty points.",
    img: "assets/img/projects/techinventory.webp",
    url: "https://github.com/chikka-creator/TechInventory.git",
    btnLabelId: "Buka Repositori",
    btnLabelEn: "View Repository",
    hintId: "Klik kartu untuk membuka repositori GitHub",
    hintEn: "Click card to open GitHub repository"
  },
  {
    kind: "cert",
    title: "SIMETRI 2025",
    tag: "UI/UX Design",
    place: "Surabaya",
    year: "2025",
    series: "UI/UX Design",
    specs: "COMPETITION · DEPARTEMEN SI ITS",
    descId: "Penghargaan kompetisi desain antarmuka dan pengalaman pengguna tingkat nasional oleh Departemen Sistem Informasi Institut Teknologi Sepuluh Nopember (ITS).",
    descEn: "National UI/UX design competition credential awarded by the Department of Information Systems, Sepuluh Nopember Institute of Technology (ITS).",
    img: "assets/img/certs/simetri-2025.webp",
    url: "assets/img/certs/simetri-2025.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • Departemen SI ITS",
    hintEn: "Verified Certificate • Information Systems ITS"
  },
  {
    kind: "project",
    title: "Streaming App UI",
    tag: "Mobile-First",
    place: "Surabaya",
    year: "2025",
    series: "Mobile UI",
    specs: "FIGMA · DARK THEME · DESIGN SYSTEM",
    descId: "Eksplorasi antarmuka aplikasi streaming berorientasi mobile dengan tipografi tajam, palet gelap kontras tinggi, dan tata letak modular adaptif.",
    descEn: "Mobile streaming platform interface redesign study case featuring high-contrast dark theme, bold typography, and adaptive modular layout.",
    img: "assets/img/projects/streaming-app-ui.webp",
    url: "https://www.figma.com/design/rnLD3kSvpWiQDQYp0hYRto/Study-Case-Kel-8",
    btnLabelId: "Buka di Figma",
    btnLabelEn: "View in Figma",
    hintId: "Klik kartu untuk membuka desain di Figma",
    hintEn: "Click card to view design in Figma"
  },
  {
    kind: "cert",
    title: "Dasar Frontend & Backend",
    tag: "Web Dev",
    place: "Bali",
    year: "2025",
    series: "Web Development",
    specs: "CLIENT-SERVER · REST API · MODERN DOM",
    descId: "Sertifikasi kompetensi rekayasa web mendalam mencakup arsitektur klien-server, manipulasi DOM modern, dan integrasi API RESTful.",
    descEn: "Full-stack web engineering competency covering client-server architecture, modern DOM manipulation, and REST API integration.",
    img: "assets/img/certs/dasar-frontend-backend.webp",
    url: "assets/img/certs/dasar-frontend-backend.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • Bali Project Indonesia",
    hintEn: "Verified Certificate • Bali Project Indonesia"
  },
  {
    kind: "cert",
    title: "AI untuk Software Developer",
    tag: "Artificial Intelligence",
    place: "Bali",
    year: "2025",
    series: "Artificial Intelligence",
    specs: "LLM INTEGRATION · PROMPT DEV · AGENTS",
    descId: "Sertifikasi implementasi kecerdasan buatan, rekayasa prompt tingkat lanjut, dan integrasi agen LLM dalam siklus pengembangan perangkat lunak modern.",
    descEn: "AI software development certification covering agentic workflows, advanced prompt engineering, and LLM tool integration.",
    img: "assets/img/certs/ai-untuk-software-developer.webp",
    url: "assets/img/certs/ai-untuk-software-developer.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • Bali Project Indonesia",
    hintEn: "Verified Certificate • Bali Project Indonesia"
  },
  {
    kind: "cert",
    title: "Global Game Jam 2025",
    tag: "Game Dev",
    place: "Surabaya",
    year: "2025",
    series: "Game Development",
    specs: "48-HOUR HACKATHON · GADAS & CIPUTRA",
    descId: "Sertifikasi partisipasi pengembangan game intensif 48 jam yang diadakan oleh komunitas GADAS berkolaborasi dengan Universitas Ciputra.",
    descEn: "48-hour intensive game development hackathon certification hosted by GADAS in collaboration with Ciputra University.",
    img: "assets/img/certs/global-game-jam-2025.webp",
    url: "assets/img/certs/global-game-jam-2025.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • GADAS & Ciputra Univ.",
    hintEn: "Verified Certificate • GADAS & Ciputra Univ."
  },
  {
    kind: "cert",
    title: "English Discoveries",
    tag: "Language",
    place: "Global",
    year: "2026",
    series: "Professional Language",
    specs: "STANDARDIZED CEFR · EDUSOFT LTD.",
    descId: "Sertifikasi kemahiran bahasa Inggris profesional terstandarisasi untuk komunikasi teknis dan kolaborasi internasional oleh Edusoft Ltd.",
    descEn: "Standardized professional English proficiency credential for international technical collaboration by Edusoft Ltd.",
    img: "assets/img/certs/english-discoveries.webp",
    url: "assets/img/certs/english-discoveries.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • Edusoft Ltd.",
    hintEn: "Verified Certificate • Edusoft Ltd."
  },
  {
    kind: "cert",
    title: "Data Science Expo",
    tag: "Data Science",
    place: "Surabaya",
    year: "2026",
    series: "Data Science",
    specs: "EXHIBITION · PENS SURABAYA",
    descId: "Sertifikasi partisipasi eksibisi sains data tingkat perguruan tinggi oleh Politeknik Elektronika Negeri Surabaya (PENS).",
    descEn: "Data science exhibition and showcase credential awarded by Electronic Engineering Polytechnic Institute of Surabaya (PENS).",
    img: "assets/img/certs/data-science-expo.webp",
    url: "assets/img/certs/data-science-expo.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • PENS",
    hintEn: "Verified Certificate • PENS"
  },
  {
    kind: "cert",
    title: "Seminar Sekolah Kedinasan",
    tag: "Career Prep",
    place: "Indonesia",
    year: "2026",
    series: "Career Preparation",
    specs: "APTITUDE PREP · LKP SCIENCE SOCIETY",
    descId: "Sertifikat pembinaan persiapan karir dan penguasaan tes potensi akademik oleh LKP Science Society.",
    descEn: "Academic aptitude and career preparation certificate by LKP Science Society.",
    img: "assets/img/certs/seminar-sekolah-kedinasan.webp",
    url: "assets/img/certs/seminar-sekolah-kedinasan.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • LKP Science Society",
    hintEn: "Verified Certificate • LKP Science Society"
  },
  {
    kind: "cert",
    title: "Entrepreneur Fest 2026",
    tag: "Entrepreneurship",
    place: "Surabaya",
    year: "2026",
    series: "Entrepreneurship",
    specs: "BUSINESS MODEL · DIGITAL STRATEGY",
    descId: "Sertifikasi validasi model bisnis, inovasi produk digital, dan pitching strategi kewirausahaan pada Entrepreneur Fest 2026.",
    descEn: "Business model validation, digital product innovation, and strategy pitching certificate from Entrepreneur Fest 2026.",
    img: "assets/img/certs/entrepreneur-fest-2026.webp",
    url: "assets/img/certs/entrepreneur-fest-2026.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • Entrepreneur Fest",
    hintEn: "Verified Certificate • Entrepreneur Fest"
  }
];

const WORK_PROJECTS = [
  {
    id: "techinventory",
    title: "TechInventory System",
    series: "Web App",
    place: "Surabaya",
    year: "2025",
    img: "assets/img/projects/techinventory.webp",
    url: "https://github.com/chikka-creator/TechInventory.git",
    descId: "Sistem manajemen inventaris tingkat lanjut. Fitur peminjaman alat, stok otomatis, penalti poin.",
    descEn: "Advanced inventory management. Tool borrowing, automated stock, point penalty."
  },
  {
    id: "streaming-app-ui",
    title: "Streaming App UI",
    series: "Mobile UI",
    place: "Surabaya",
    year: "2025",
    img: "assets/img/projects/streaming-app-ui.webp",
    url: "https://www.figma.com/design/rnLD3kSvpWiQDQYp0hYRto/Study-Case-Kel-8",
    descId: "Redesign antarmuka mobile platform streaming. Dark theme pekat, grid dinamis.",
    descEn: "Mobile UI redesign for streaming platform. Deep dark theme, dynamic grid."
  },
  {
    id: "portfolio-v2",
    title: "Portfolio v2",
    series: "Web",
    place: "Surabaya",
    year: "2026",
    img: "assets/img/projects/portfolio-v2.webp",
    url: "index.html",
    descId: "Rebuild portofolio gaya Farline: 3D hang hero, light-table gallery.",
    descEn: "Portfolio rebuilt in Farline style: 3D hang hero, light-table gallery."
  }
];

const GALLERY_CERTS = [
  {
    id: "simetri-2025",
    title: "SIMETRI 2025",
    issuer: "Departemen SI ITS",
    year: "2025",
    category: "uiux",
    img: "assets/img/certs/simetri-2025.webp"
  },
  {
    id: "dasar-frontend-backend",
    title: "Dasar Frontend & Backend",
    issuer: "Bali Project Indonesia",
    year: "2025",
    category: "web",
    img: "assets/img/certs/dasar-frontend-backend.webp"
  },
  {
    id: "computational-thinking-smp",
    title: "Computational Thinking (SMP)",
    issuer: "KOMDIGI",
    year: "2025",
    category: "web",
    img: "assets/img/certs/computational-thinking-smp.webp"
  },
  {
    id: "computational-thinking-sma",
    title: "Computational Thinking (SMA)",
    issuer: "KOMDIGI",
    year: "2025",
    category: "web",
    img: "assets/img/certs/computational-thinking-sma.webp"
  },
  {
    id: "chat-apps-for-business",
    title: "Chat Apps for Business",
    issuer: "KOMDIGI",
    year: "2025",
    category: "web",
    img: "assets/img/certs/chat-apps-for-business.webp"
  },
  {
    id: "ai-untuk-software-developer",
    title: "AI untuk Software Developer",
    issuer: "Bali Project Indonesia",
    year: "2025",
    category: "aidata",
    img: "assets/img/certs/ai-untuk-software-developer.webp"
  },
  {
    id: "data-science-expo",
    title: "Data Science Expo",
    issuer: "PENS",
    year: "2026",
    category: "aidata",
    img: "assets/img/certs/data-science-expo.webp"
  },
  {
    id: "global-game-jam-2025",
    title: "Global Game Jam 2025",
    issuer: "GADAS & Ciputra Univ.",
    year: "2025",
    category: "events",
    img: "assets/img/certs/global-game-jam-2025.webp"
  },
  {
    id: "seminar-sekolah-kedinasan",
    title: "Seminar Sekolah Kedinasan",
    issuer: "LKP Science Society",
    year: "2026",
    category: "events",
    img: "assets/img/certs/seminar-sekolah-kedinasan.webp"
  },
  {
    id: "entrepreneur-fest-2026",
    title: "Entrepreneur Fest 2026",
    issuer: "—",
    year: "2026",
    category: "events",
    img: "assets/img/certs/entrepreneur-fest-2026.webp"
  },
  {
    id: "english-discoveries",
    title: "English Discoveries",
    issuer: "Edusoft Ltd.",
    year: "2026",
    category: "lang",
    img: "assets/img/certs/english-discoveries.webp"
  }
];

const EXPERIENCE = [
  {
    id: "exp-1",
    titleId: "Magang & Industri",
    titleEn: "Internship & Industry",
    descId: "Pengalaman praktis mengimplementasikan arsitektur kode frontend, integrasi antarmuka, dan optimalisasi alur pengguna pada proyek nyata.",
    descEn: "Hands-on experience implementing frontend code architecture, UI integration, and user workflow optimization in real projects."
  },
  {
    id: "exp-2",
    titleId: "Kepemimpinan & Organisasi",
    titleEn: "Leadership & Organization",
    descId: "Mengkoordinasikan tim dan mengelola timeline eksekusi acara teknis maupun kreatif secara sistematis.",
    descEn: "Coordinating teams and systematically managing execution timelines for technical and creative events."
  },
  {
    id: "exp-3",
    titleId: "Partisipasi & Workshop",
    titleEn: "Active Workshops & Participation",
    descId: "Aktif mengikuti workshop teknologi, hackathon, dan seminar bersertifikasi.",
    descEn: "Actively attending tech workshops, hackathons, and certified programs."
  }
];

const CREDITS_SKILLS = {
  focusId: ["Pengembangan Front-End", "Desain UI/UX", "Design Systems", "Performa Web"],
  focusEn: ["Front-End Development", "UI/UX Design", "Design Systems", "Web Performance"],
  tools: ["VS Code", "Figma", "Canva", "Git", "Tailwind"],
  recognition: ["SIMETRI 2025", "Global Game Jam 2025", "Data Science Expo", "Seminar Sekolah Kedinasan", "Entrepreneur Fest 2026"]
};
