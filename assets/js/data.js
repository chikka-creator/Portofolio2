/* Data Model for Portfolio Fakhri */
/* Comprehensive Showcase: International Clients, Engineering Projects & Verified Credentials */

const WORK_PROJECTS = [
  {
    id: "naar",
    title: "NAAR Luxury Jewelry",
    series: "Haute Joaillerie",
    place: "Paris · Dubai",
    year: "2025",
    specs: "NEXT.JS · THREE.JS · LUXURY ECOMMERCE · GSAP",
    img: "assets/img/projects/naar-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Digital flagship interface untuk rumah perhiasan mewah NAAR. Menghadirkan navigasi editorial bernuansa haute-joaillerie, tipografi serif anggun, presentasi visual produk beresolusi tinggi, dan alur belanja seamless yang mempertahankan eksklusivitas brand.",
    descEn: "Digital flagship interface engineering for luxury jewelry house NAAR. Designed with haute-joaillerie editorial aesthetics, bespoke typography, high-definition visual showcases, and a seamless shopping journey preserving luxury brand exclusivity."
  },
  {
    id: "celui",
    title: "CELUI Leather Cases",
    series: "Luxury Accessories",
    place: "Los Angeles · Milan",
    year: "2025",
    specs: "SHOPIFY LIQUID · GSAP · BESPOKE INTERACTION · MOBILE-FIRST",
    img: "assets/img/projects/celui-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Pengalaman web interaktif dan product showcase untuk CELUI, brand case iPhone mewah berbasis kulit premium. Dilengkapi micro-interactions taktil, visualisasi material presisi, konfigurator produk real-time, dan arsitektur checkout mobile yang optimal.",
    descEn: "Interactive web experience and product showcase for CELUI luxury leather iPhone cases. Crafted with tactile micro-interactions, tactile material visualizer, real-time product customizer, and seamless mobile-first checkout architecture."
  },
  {
    id: "hubengage",
    title: "HubEngage AI Platform",
    series: "Enterprise AI SaaS",
    place: "Boston, USA",
    year: "2025",
    specs: "REACT · TYPESCRIPT · AI WORKFLOW DESIGN · DESIGN SYSTEM",
    img: "assets/img/projects/hubengage-section.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Pengembangan antarmuka aplikasi web dan section visual storytelling untuk platform enterprise AI HubEngage. Merancang komponen visualisasi integrasi multichannel, konsolidasi data karyawan cerdas, dan sistem antarmuka berbasis analitik prediktif.",
    descEn: "Web application interface and interactive section development for enterprise AI employee platform HubEngage. Architected intelligent multichannel data consolidation components, predictive analytics visualizations, and modular enterprise design system."
  },
  {
    id: "fmcr",
    title: "FMCR Specialty Coffee",
    series: "Artisanal Roastery",
    place: "Melbourne · Bali",
    year: "2025",
    specs: "HEADLESS COMMERCE · NEXT.JS · TASTING NOTES VISUALIZER",
    img: "assets/img/projects/fmcr-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Platform direct-to-consumer dan pengalaman digital roastery kopi spesialti FMCR. Menampilkan diagram interaktif profil rasa (tasting notes wheel), storytelling asal biji kopi single-origin dari perkebunan terpilih, dan alur langganan biji kopi segar yang intuitif.",
    descEn: "Direct-to-consumer platform and digital brand experience for specialty coffee roastery FMCR. Features interactive tasting notes flavor profile wheels, single-origin bean traceability storytelling, and an effortless fresh roast subscription flow."
  },
  {
    id: "ratio",
    title: "Ratio Athletic Nutrition",
    series: "Performance D2C",
    place: "Sydney, Australia",
    year: "2025",
    specs: "REACT · D2C ECOMMERCE · INGREDIENT CALCULATOR · MOTION UI",
    img: "assets/img/projects/ratio-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Antarmuka e-commerce berorientasi performa tinggi untuk Ratio, brand nutrisi gym dan suplemen serat fungsional harian. Dirancang dengan tipografi bold modern, kalkulator nutrisi interaktif, visualisasi takaran ilmiah, dan motion UI yang energetik.",
    descEn: "High-performance direct-to-consumer eCommerce interface for Ratio functional fiber and athletic supplements. Crafted with modern bold typography, interactive nutrition calculators, transparent scientific dosage breakdowns, and high-energy motion UI."
  },
  {
    id: "monster",
    title: "Monster TCG Marketplace",
    series: "Collectibles Marketplace",
    place: "Tokyo · California",
    year: "2025",
    specs: "VUE.JS · TAILWIND · TCG RARITY FILTER · REAL-TIME VALUE",
    img: "assets/img/projects/monster-section.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Pengembangan antarmuka platform jual-beli kartu koleksi Pokemon Monster. Dilengkapi sistem filter kelangkaan kartu (PSA grading, holo, vintage), pelacak fluktuasi harga pasar real-time, dan etalase galeri kartu interaktif dengan efek pantulan holografik dinamis.",
    descEn: "Trading platform and marketplace interface for Pokemon card collectors and graded TCG rarities. Engineered with PSA grade filters, real-time market price trackers, and an interactive collector showcase with dynamic holographic card tilt effects."
  },
  {
    id: "omodeo",
    title: "Omodeo Architectural Decor",
    series: "Interior Atelier",
    place: "Milan, Italy",
    year: "2025",
    specs: "THREE.JS · NEXT.JS · MINIMALIST SPATIAL LAYOUT · GSAP",
    img: "assets/img/projects/omodeo-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    descId: "Situs web atelier furnitur dan dekorasi interior arsitektural Omodeo. Menggabungkan grid tata letak spasial minimalis ala studio desain Italia, penjelajahan tekstur material alami, dan katalog furnitur kurasi dengan tipografi editorial presisi tinggi.",
    descEn: "Architectural furniture and bespoke interior decor web atelier for Omodeo. Harmonizing minimalist spatial layouts, tactile natural material exploration, and high-precision editorial typography reflecting Italian craft excellence."
  },
  // {
  //   id: "techinventory",
  //   title: "TechInventory System",
  //   series: "Web Application",
  //   place: "Surabaya",
  //   year: "2025",
  //   specs: "REACT · NODE.JS · POSTGRESQL · TAILWIND",
  //   img: "assets/img/projects/techinventory.webp",
  //   url: "https://github.com/chikka-creator/TechInventory.git",
  //   btnLabelId: "Buka Repositori",
  //   btnLabelEn: "View Repository",
  //   descId: "Sistem manajemen inventaris laboratorium terintegrasi dengan pelacakan alat fisik, otomatisasi stok real-time, dan sistem penalti poin.",
  //   descEn: "Integrated laboratory inventory management system featuring physical tool tracking, real-time stock automation, and penalty points."
  // },
  {
    id: "streaming-app-ui",
    title: "Streaming Platform UI",
    series: "Mobile UI",
    place: "Surabaya",
    year: "2025",
    specs: "FIGMA · DARK THEME · DESIGN SYSTEM",
    img: "assets/img/projects/streaming-app-ui.webp",
    url: "https://www.figma.com/design/rnLD3kSvpWiQDQYp0hYRto/Study-Case-Kel-8",
    btnLabelId: "Buka di Figma",
    btnLabelEn: "View in Figma",
    descId: "Eksplorasi antarmuka aplikasi streaming berorientasi mobile dengan tipografi tajam, palet gelap kontras tinggi, dan tata letak modular adaptif.",
    descEn: "Mobile streaming platform interface redesign study case featuring high-contrast dark theme, bold typography, and adaptive modular layout."
  }
  // {
  //   id: "portfolio-v2",
  //   title: "Portfolio v2 Experience",
  //   series: "Creative Web",
  //   place: "Surabaya",
  //   year: "2026",
  //   specs: "THREE.JS · WEBGL · GSAP · EDITORIAL MINIMALISM",
  //   img: "assets/img/projects/portfolio-v2.webp",
  //   url: "index.html",
  //   btnLabelId: "Lihat di Beranda",
  //   btnLabelEn: "View on Home",
  //   descId: "Portofolio digital interaktif: 3D helical spiral cards, real-time spatial physics, galeri arsip light-table, dan tipografi editorial presisi.",
  //   descEn: "Interactive digital portfolio experience: 3D helical spiral card gallery, real-time spatial physics, light-table archive, and refined editorial typography."
  // }
];

const ORBIT_PLATES = [
  {
    kind: "project",
    title: "NAAR Luxury Jewelry",
    tag: "Haute Joaillerie",
    place: "Paris · Dubai",
    year: "2025",
    series: "Luxury eCommerce",
    specs: "NEXT.JS · THREE.JS · LUXURY ECOMMERCE",
    descId: "Digital flagship interface untuk rumah perhiasan mewah NAAR. Navigasi editorial haute-joaillerie, tipografi serif anggun, dan alur belanja seamless.",
    descEn: "Digital flagship interface for luxury jewelry house NAAR. Haute-joaillerie editorial navigation, bespoke typography, and seamless checkout journey.",
    img: "assets/img/projects/naar-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Dubai / Paris",
    hintEn: "International Client • Dubai / Paris"
  },
  {
    kind: "project",
    title: "CELUI Leather Cases",
    tag: "Luxury Tech",
    place: "Los Angeles · Milan",
    year: "2025",
    series: "Luxury Accessories",
    specs: "SHOPIFY LIQUID · GSAP · BESPOKE INTERACTION",
    descId: "Pengalaman web interaktif dan showcase casing iPhone mewah berbahan kulit premium dengan konfigurator real-time dan checkout mobile optimal.",
    descEn: "Interactive web showcase for CELUI luxury leather iPhone cases featuring tactile material exploration and real-time customizer.",
    img: "assets/img/projects/celui-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Los Angeles / Milan",
    hintEn: "International Client • Los Angeles / Milan"
  },
  {
    kind: "project",
    title: "HubEngage AI Platform",
    tag: "Enterprise AI",
    place: "Boston, USA",
    year: "2025",
    series: "Enterprise AI SaaS",
    specs: "REACT · TYPESCRIPT · AI WORKFLOW DESIGN",
    descId: "Modul web aplikasi cerdas untuk platform enterprise AI HubEngage: visualisasi multichannel, konsolidasi data, dan analitik prediktif.",
    descEn: "Intelligent web application module for HubEngage enterprise AI platform: multichannel visualization and predictive employee analytics.",
    img: "assets/img/projects/hubengage-section.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Boston, USA",
    hintEn: "International Client • Boston, USA"
  },
  {
    kind: "project",
    title: "FMCR Specialty Coffee",
    tag: "Specialty Roastery",
    place: "Melbourne · Bali",
    year: "2025",
    series: "Artisanal Roastery",
    specs: "HEADLESS COMMERCE · NEXT.JS · FLAVOR WHEEL",
    descId: "Platform e-commerce roastery kopi spesialti dengan visualisasi tasting notes interaktif dan langganan biji kopi segar single-origin.",
    descEn: "Artisanal specialty coffee roastery platform featuring interactive tasting notes flavor wheels and fresh roast subscription.",
    img: "assets/img/projects/fmcr-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Melbourne / Bali",
    hintEn: "International Client • Melbourne / Bali"
  },
  {
    kind: "project",
    title: "Ratio Athletic Nutrition",
    tag: "Performance D2C",
    place: "Sydney, Australia",
    year: "2025",
    series: "Performance D2C",
    specs: "REACT · INGREDIENT CALCULATOR · MOTION UI",
    descId: "Antarmuka e-commerce berorientasi performa untuk suplemen serat harian Ratio dengan kalkulator nutrisi ilmiah dan motion UI energetik.",
    descEn: "High-performance eCommerce experience for Ratio daily functional fiber featuring scientific dose calculators and dynamic motion UI.",
    img: "assets/img/projects/ratio-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Sydney, Australia",
    hintEn: "International Client • Sydney, Australia"
  },
  {
    kind: "project",
    title: "Monster TCG Marketplace",
    tag: "Collectibles",
    place: "Tokyo · California",
    year: "2025",
    series: "Collectibles Marketplace",
    specs: "VUE.JS · TAILWIND · TCG RARITY FILTER",
    descId: "Platform jual-beli kartu koleksi Pokemon Monster dengan filter kelangkaan PSA, pelacak harga real-time, dan efek holografik.",
    descEn: "Marketplace interface for Pokemon collectors featuring PSA grade rarity filters, real-time market value trackers, and holographic cards.",
    img: "assets/img/projects/monster-section.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Tokyo / California",
    hintEn: "International Client • Tokyo / California"
  },
  {
    kind: "project",
    title: "Omodeo Architectural Decor",
    tag: "Interior Atelier",
    place: "Milan, Italy",
    year: "2025",
    series: "Interior Atelier",
    specs: "THREE.JS · NEXT.JS · MINIMALIST SPATIAL",
    descId: "Atelier web furnitur dan dekorasi interior Italia Omodeo dengan grid spasial minimalis dan eksplorasi tekstur material alami.",
    descEn: "Italian architectural furniture and interior atelier website with minimalist spatial grids and natural tactile material exploration.",
    img: "assets/img/projects/omodeo-hero.webp",
    url: "https://github.com/chikka-creator",
    btnLabelId: "Eksplorasi Proyek",
    btnLabelEn: "Explore Project",
    hintId: "Klien Internasional • Milan, Italy",
    hintEn: "International Client • Milan, Italy"
  },
  // {
  //   kind: "project",
  //   title: "TechInventory System",
  //   tag: "Full-Stack",
  //   place: "Surabaya",
  //   year: "2025",
  //   series: "Web Application",
  //   specs: "REACT · NODE.JS · POSTGRESQL · TAILWIND",
  //   descId: "Sistem manajemen inventaris laboratorium terintegrasi dengan pelacakan alat fisik, otomatisasi stok real-time, dan sistem penalti poin.",
  //   descEn: "Integrated laboratory inventory management system featuring physical tool tracking, real-time stock automation, and penalty points.",
  //   img: "assets/img/projects/techinventory.webp",
  //   url: "https://github.com/chikka-creator/TechInventory.git",
  //   btnLabelId: "Buka Repositori",
  //   btnLabelEn: "View Repository",
  //   hintId: "Klik kartu untuk membuka repositori GitHub",
  //   hintEn: "Click card to open GitHub repository"
  // },
  {
    kind: "project",
    title: "Streaming Platform UI",
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
    title: "SIMETRI 2025",
    tag: "UI/UX Design",
    place: "Surabaya",
    year: "2025",
    series: "UI/UX Design Award",
    specs: "COMPETITION · DEPARTEMEN SI ITS",
    descId: "Penghargaan kompetisi desain antarmuka dan pengalaman pengguna tingkat nasional oleh Departemen Sistem Informasi Institut Teknologi Sepuluh Nopember (ITS).",
    descEn: "National UI/UX design competition credential awarded by the Department of Information Systems, Sepuluh Nopember Institute of Technology (ITS).",
    img: "assets/img/certs/simetri-2025.webp",
    url: "assets/img/certs/simetri-2025.webp",
    btnLabelId: "Lihat Sertifikat",
    btnLabelEn: "View Certificate",
    hintId: "Sertifikat Terverifikasi • Departemen SI ITS",
    hintEn: "Verified Certificate • Information Systems ITS"
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
    titleId: "Kolaborasi Klien Internasional",
    titleEn: "International Client Collaborations",
    descId: "Merancang dan merekayasa antarmuka digital untuk 7 brand internasional ternama dari Amerika Serikat, Eropa, dan Asia Pasifik — mencakup brand perhiasan mewah (NAAR), aksesoris eksklusif (CELUI), platform AI enterprise (HubEngage), kopi spesialti (FMCR), nutrisi performa (Ratio), marketplace kartu koleksi (Monster), hingga atelier furnitur arsitektural (Omodeo).",
    descEn: "Designing and engineering bespoke digital interfaces for 7 prestigious international brands across the US, Europe, and APAC — spanning luxury jewelry (NAAR), high-end tech accessories (CELUI), enterprise AI platforms (HubEngage), specialty coffee roastery (FMCR), fitness nutrition (Ratio), collectible TCG marketplace (Monster), and architectural furniture design (Omodeo)."
  },
  {
    id: "exp-2",
    titleId: "Rekayasa Web & Creative Development",
    titleEn: "Web Engineering & Creative Development",
    descId: "Mengembangkan arsitektur frontend modern menggunakan React, Next.js, Three.js WebGL, dan animasi GSAP dengan standar performa 60 FPS, aksesibilitas semantik, dan integrasi API yang tangguh.",
    descEn: "Building modern frontend architectures leveraging React, Next.js, Three.js WebGL, and GSAP motion systems with 60 FPS performance budgets, semantic accessibility standards, and robust API integrations."
  },
  {
    id: "exp-3",
    titleId: "Desain UI/UX & Design Systems",
    titleEn: "UI/UX Strategy & Design Systems",
    descId: "Menerjemahkan identitas brand dan logika produk menjadi sistem desain modular di Figma, alur pengguna yang intuitif, serta prototipe interaktif beresolusi tinggi yang terverifikasi kompetisi nasional (SIMETRI ITS 2025).",
    descEn: "Translating brand identities and complex product logic into scalable design systems, intuitive user workflows, and high-fidelity interactive prototypes backed by national competitive recognition (SIMETRI ITS 2025 awardee)."
  }
];

const CREDITS_SKILLS = {
  focusId: ["Pengembangan Front-End", "Desain UI/UX", "Creative WebGL & 3D", "Design Systems"],
  focusEn: ["Front-End Development", "UI/UX Design", "Creative WebGL & 3D", "Design Systems"],
  tools: ["VS Code", "Figma", "Three.js", "GSAP", "React", "Next.js", "Tailwind", "Git"],
  recognition: ["SIMETRI ITS 2025", "Global Game Jam 2025", "Data Science Expo", "English Discoveries (CEFR)", "Entrepreneur Fest 2026"]
};
