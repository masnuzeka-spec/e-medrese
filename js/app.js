// ============================================================================
// js/app.js
// e-Medrese - Siyer TV | Sade Kamp Vitrinli & Sabit Alt Kontrol Barlı Mimari
// ============================================================================

(function () {
  const campsData = window.EMEDRESE_CAMPS || [];
  const lessonsMap = window.EMEDRESE_LESSONS || {};
  const announcementsData = window.EMEDRESE_ANNOUNCEMENTS || [];
  const userData = window.EMEDRESE_USER || {};

  // Uygulama Durumu
  // viewMode: 'hub' (Ana Sayfa: Sadece Kamplar) | 'camp' (Seçilen Kampın İçeriği) | 'duyurular' (Genel Duyurular) | 'profil' (Profilim)
  let viewMode = 'hub';
  let activeCampId = 'imam-nevevi';
  let activeCampSubTab = 'dersler'; // 'dersler' | 'yoklama' | 'duyurular' | 'sertifika'
  let expandedGeneralAnnId = 901;
  let isDarkMode = false;

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const text = document.getElementById('toastMessageText');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    const iconEl = document.getElementById('themeToggleIcon');
    if (iconEl) {
      iconEl.textContent = isDarkMode ? '☀️' : '🌙';
    }
  }

  function getSelectedCamp() {
    return campsData.find(c => c.id === activeCampId) || campsData[0];
  }

  // ==================== ÖZELLİK 2: ÜST BARDA KAMP ADININ GÖRÜNMESİ ====================
  function updateHeaderBreadcrumb() {
    const bcWrap = document.getElementById('headerCampBreadcrumb');
    const bcTitle = document.getElementById('headerCampBreadcrumbTitle');
    const bellBtn = document.getElementById('topGeneralAnnBtn');
    const profBtn = document.getElementById('profileDropdownBtn');

    if (bcWrap && bcTitle) {
      if (viewMode === 'camp') {
        const camp = getSelectedCamp();
        bcTitle.textContent = camp.shortTitle || camp.title;
        bcWrap.classList.remove('hidden');
        bcWrap.classList.add('flex');
      } else {
        bcWrap.classList.add('hidden');
        bcWrap.classList.remove('flex');
      }
    }

    // Sağ üstteki Genel Duyuru ve Profil butonlarının aktiflik vurgusu
    if (bellBtn) {
      bellBtn.className = viewMode === 'duyurular'
        ? 'relative w-10 h-10 rounded-full bg-[#d8a634] text-[#133b2e] flex items-center justify-center transition focus:outline-none shadow-sm'
        : 'relative w-10 h-10 rounded-full bg-[#1c4d3d] hover:bg-[#25614e] border border-[#c8962e]/40 text-[#e5b84b] flex items-center justify-center transition focus:outline-none';
    }
    if (profBtn) {
      profBtn.className = viewMode === 'profil'
        ? 'h-10 px-3.5 rounded-xl bg-white text-[#133b2e] ring-2 ring-[#d8a634] font-heading font-extrabold text-sm flex items-center justify-center shadow-sm transition focus:outline-none'
        : 'h-10 px-3.5 rounded-xl bg-[#d8a634] hover:bg-[#e3b342] text-[#133b2e] font-heading font-extrabold text-sm flex items-center justify-center shadow-sm transition focus:outline-none';
    }
  }

  // ==================== ÖZELLİK 1: SABİT ALT KONTROL BARI (MOBİL & MASAÜSTÜ ORTAK) ====================
  // Ana Sayfada: Sadece [Kamplar | Duyurular | Profilim]
  // Kampa Tıklanınca: [⬅ Ana Sayfa | 📺 Dersler | ✅ Yoklamalar | 📢 Duyurular | 🎓 Sertifika]
  function renderBottomBar() {
    const bottomNav = document.getElementById('mobileBottomNav');
    if (!bottomNav) return;

    if (viewMode === 'camp') {
      const camp = getSelectedCamp();
      const isAct = camp.status === 'active';

      bottomNav.innerHTML = `
        <div class="max-w-3xl w-full mx-auto grid grid-cols-5 gap-1 sm:gap-2 px-1">
          <button type="button" id="mobBackToCampsBtn" class="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold text-amber-200 bg-white/10 hover:bg-white/20 transition">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Ana Sayfa</span>
          </button>

          <button type="button" data-camp-subtab="dersler" class="mob-camp-sub-btn flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition ${activeCampSubTab === 'dersler' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Dersler</span>
          </button>

          <button type="button" data-camp-subtab="yoklama" class="mob-camp-sub-btn flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition relative ${activeCampSubTab === 'yoklama' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            <span>Yoklamalar</span>
            ${isAct ? '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1.5 right-2"></span>' : ''}
          </button>

          <button type="button" data-camp-subtab="duyurular" class="mob-camp-sub-btn flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition ${activeCampSubTab === 'duyurular' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            <span>Duyurular</span>
          </button>

          <button type="button" data-camp-subtab="sertifika" class="mob-camp-sub-btn flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-2 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold transition ${activeCampSubTab === 'sertifika' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sertifika</span>
          </button>
        </div>
      `;

      document.getElementById('mobBackToCampsBtn').addEventListener('click', () => goHomeHub());
      bottomNav.querySelectorAll('.mob-camp-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          openCampWorkspace(activeCampId, btn.getAttribute('data-camp-subtab'));
        });
      });
    } else {
      // Ana Sayfa / Genel Görünümde Sadece 3 Net Buton: Kamplar | Duyurular | Profilim
      bottomNav.innerHTML = `
        <div class="max-w-md w-full mx-auto grid grid-cols-3 gap-2 px-2">
          <button type="button" id="dockGoCampsBtn" class="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${viewMode === 'hub' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            <span>Kamplar</span>
          </button>

          <button type="button" id="dockGoGeneralAnnBtn" class="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${viewMode === 'duyurular' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            <span>Duyurular</span>
          </button>

          <button type="button" id="dockGoProfileBtn" class="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${viewMode === 'profil' ? 'bg-[#d8a634] text-[#133b2e] shadow-md' : 'text-stone-300 hover:text-white hover:bg-white/5'}">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span>Profilim</span>
          </button>
        </div>
      `;

      document.getElementById('dockGoCampsBtn').addEventListener('click', () => goHomeHub());
      document.getElementById('dockGoGeneralAnnBtn').addEventListener('click', () => showGlobalSection('duyurular'));
      document.getElementById('dockGoProfileBtn').addEventListener('click', () => showGlobalSection('profil'));
    }

    updateHeaderBreadcrumb();
  }

  // ==================== ANA SAYFA: SADECE AKTİF VE BİTEN KAMPLAR ====================
  function renderCampsHub() {
    const activeContainer = document.getElementById('activeCampsGrid');
    const completedContainer = document.getElementById('completedCampsGrid');
    if (!activeContainer || !completedContainer) return;

    const activeCamps = campsData.filter(c => c.status === 'active');
    const completedCamps = campsData.filter(c => c.status === 'completed');

    const buildCampCard = (camp) => {
      const isAct = camp.status === 'active';
      const cardBorderClass = isAct ? 'camp-card-active' : 'camp-card-completed';
      const statusPillClass = isAct ? 'status-bar-active' : 'status-bar-completed';
      const statusText = isAct ? `● ${camp.statusBadge}` : `✓ ${camp.statusBadge}`;
      const progressFillClass = isAct ? 'progress-fill-active' : 'progress-fill-completed';
      const progressSummary = isAct
        ? `${camp.completedLessons}/${camp.totalLessons} ders`
        : `${camp.completedLessons}/${camp.totalLessons} ders • 🎓 Sertifika hazır`;
      const actionLabel = isAct ? 'Kampa Git →' : 'Kampı Görüntüle →';
      const actionColor = isAct ? 'text-[#1f7a53]' : 'text-[#7c4f20]';

      return `
        <article data-open-camp="${camp.id}" class="emedrese-card emedrese-card-hover ${cardBorderClass} overflow-hidden cursor-pointer flex flex-col sm:flex-row">
          <!-- Sol: Kamp Görseli -->
          <div class="w-full sm:w-64 md:w-72 shrink-0 bg-stone-900 relative overflow-hidden">
            <img
              src="${camp.image}"
              alt="${camp.title}"
              class="w-full h-48 sm:h-full object-cover transition duration-300 hover:scale-105"
            />
          </div>

          <!-- Sağ: Görseldeki İnce Durum Çubuğu, Başlık, Tarih, Açıklama ve İlerleme -->
          <div class="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="${statusPillClass} px-3.5 py-1 rounded-full text-xs font-bold flex items-center justify-between">
                <span>${statusText}</span>
                <span class="opacity-90 font-medium">${camp.totalLessons} Ders</span>
              </div>

              <h3 class="font-heading text-lg sm:text-xl font-extrabold text-heading-main leading-snug pt-0.5">
                ${camp.title}
              </h3>

              <p class="text-xs sm:text-sm font-medium text-muted-main">
                ${camp.dateRange}
              </p>

              <p class="text-xs sm:text-sm text-body-main leading-relaxed">
                ${camp.description}
              </p>
            </div>

            <div class="pt-2 space-y-2">
              <div class="w-full h-2 rounded-full progress-track overflow-hidden">
                <div class="h-full ${progressFillClass} rounded-full" style="width: ${camp.progressPercent}%"></div>
              </div>
              <div class="flex items-center justify-between pt-0.5">
                <span class="text-xs font-semibold text-muted-main">${progressSummary}</span>
                <span class="text-xs sm:text-sm font-extrabold ${actionColor} inline-flex items-center gap-1">
                  ${actionLabel}
                </span>
              </div>
            </div>
          </div>
        </article>
      `;
    };

    activeContainer.innerHTML = activeCamps.map(buildCampCard).join('');
    completedContainer.innerHTML = completedCamps.map(buildCampCard).join('');

    document.querySelectorAll('[data-open-camp]').forEach(card => {
      card.addEventListener('click', () => {
        openCampWorkspace(card.getAttribute('data-open-camp'), 'dersler');
      });
    });
  }

  // ==================== GENEL DUYURULAR SAYFASI RENDER ====================
  function renderGeneralAnnouncements() {
    const fullContainer = document.getElementById('announcementsContainer');
    if (!fullContainer) return;

    fullContainer.innerHTML = announcementsData.map(ann => {
      const isOpen = expandedGeneralAnnId === ann.id;
      return `
        <div class="emedrese-card overflow-hidden">
          <button type="button" data-gen-ann="${ann.id}" class="gen-ann-btn w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-stone-50/60 transition">
            <div class="flex items-center gap-3.5 min-w-0">
              <span class="w-9 h-9 rounded-xl bg-[#133b2e] text-[#d8a634] flex items-center justify-center shrink-0 font-bold text-sm">
                📢
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2 text-[11px] font-semibold text-muted-main">
                  <span class="text-[#7c4f20] font-bold">${ann.category}</span>
                  <span>•</span>
                  <span>${ann.date}</span>
                </div>
                <h4 class="text-sm sm:text-base font-bold text-heading-main truncate">${ann.title}</h4>
              </div>
            </div>
            <span class="text-xs font-bold text-muted-main shrink-0">${isOpen ? '▲' : '▼'}</span>
          </button>
          ${isOpen ? `
            <div class="px-5 pb-4 pt-2 border-t border-stone-200/70 text-xs sm:text-sm text-body-main leading-relaxed space-y-2.5">
              <p>${ann.body}</p>
              ${ann.actionText ? `
                <div>
                  <button type="button" data-gen-action="${ann.actionText}" data-gen-camp="${ann.campId}" class="gen-ann-action px-3.5 py-1.5 rounded-lg bg-[#133b2e] text-[#d8a634] font-bold text-xs">
                    ${ann.actionText} →
                  </button>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    fullContainer.querySelectorAll('.gen-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-gen-ann'));
        expandedGeneralAnnId = (expandedGeneralAnnId === id) ? null : id;
        renderGeneralAnnouncements();
      });
    });

    fullContainer.querySelectorAll('.gen-ann-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-gen-action');
        const cId = btn.getAttribute('data-gen-camp');
        if (act.includes('Profil')) {
          showGlobalSection('profil');
        } else if (cId && cId !== 'general') {
          openCampWorkspace(cId, act.includes('Yoklama') ? 'yoklama' : act.includes('Sertifika') ? 'sertifika' : 'duyurular');
        } else {
          showToast(`"${act}" açıldı.`);
        }
      });
    });
  }

  // ==================== SERTİFİKA FORMATI ŞABLONU (sertifika-3.png) ====================
  function buildCertificateTemplateHtml(camp) {
    const fullName = `${document.getElementById('inpFirstName')?.value || userData.firstName || 'Emrullah'} ${document.getElementById('inpLastName')?.value || userData.lastName || 'Demir'}`;
    const campNameUpper = (camp.shortTitle || camp.title).toLocaleUpperCase('tr-TR').replace(' KAMPI', '');

    return `
      <div class="certificate-ornate-frame rounded-xl p-6 sm:p-10 text-center space-y-5 shadow-md">
        <div class="space-y-1">
          <div class="font-arabic text-3xl sm:text-4xl font-bold text-[#5c3314] leading-tight">
            ${camp.arabicTitle || 'الإمام النووي'}
          </div>
          <div class="font-heading text-2xl sm:text-4xl font-black tracking-tight text-[#c57b30]">
            ${campNameUpper}
          </div>
          <div class="font-heading text-sm sm:text-base font-extrabold tracking-[0.45em] text-[#1e1b18]">
            KAMPI
          </div>
          <div class="font-heading text-base sm:text-xl font-medium tracking-[0.25em] text-[#1e1b18] pt-1">
            KATILIM SERTİFİKASI
          </div>
        </div>

        <div class="py-2">
          <div class="font-script text-4xl sm:text-5xl text-[#5c3314]">
            ${fullName}
          </div>
        </div>

        <p class="text-xs sm:text-sm text-[#3d352e] max-w-xl mx-auto leading-relaxed">
          <strong>${camp.dateRange}</strong> tarihleri arasında düzenlenen <strong>${camp.shortTitle || camp.title}</strong>'nı
          istikrarlı bir şekilde tamamlayarak bu katılım sertifikasını almaya hak kazandınız.
          Katkı ve katılımınız için teşekkür eder, başarılarınızın devamını dileriz.
        </p>

        <div class="pt-4 flex items-center justify-center gap-8 sm:gap-12 text-xs">
          <div class="text-center">
            <div class="font-heading font-black text-sm tracking-wider text-[#1e1b18]">
              SİYER <span class="text-[#c57b30]">TV</span>
            </div>
            <div class="text-[9px] tracking-widest text-[#7c6f64] uppercase">YOUTUBE KANALI</div>
          </div>
          <div class="h-7 w-px bg-[#d6cbb9]"></div>
          <div class="text-center">
            <div class="font-heading font-extrabold text-sm tracking-wider text-[#5c3314]">
              SİYER VAKFI
            </div>
            <div class="text-[9px] tracking-widest text-[#7c6f64] uppercase">BELGE KODU: ${camp.certificateCode}</div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== KAMP İÇİ SAYFA (DERSLER, YOKLAMALAR, DUYURULAR, SERTİFİKA) ====================
  function openCampWorkspace(campId, subTab = 'dersler') {
    activeCampId = campId;
    activeCampSubTab = subTab;
    viewMode = 'camp';

    document.getElementById('campsHubView').classList.add('hidden');
    document.getElementById('campWorkspaceView').classList.remove('hidden');
    document.getElementById('tab-kamplar').classList.remove('hidden');
    document.getElementById('tab-duyurular').classList.add('hidden');
    document.getElementById('tab-profil').classList.add('hidden');

    renderCampWorkspace();
    renderBottomBar();
    document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goHomeHub() {
    viewMode = 'hub';
    document.getElementById('campWorkspaceView').classList.add('hidden');
    document.getElementById('campsHubView').classList.remove('hidden');
    document.getElementById('tab-kamplar').classList.remove('hidden');
    document.getElementById('tab-duyurular').classList.add('hidden');
    document.getElementById('tab-profil').classList.add('hidden');

    renderCampsHub();
    renderBottomBar();
    document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showGlobalSection(secName) {
    viewMode = secName;
    document.getElementById('tab-kamplar').classList.add('hidden');
    document.getElementById('tab-duyurular').classList.toggle('hidden', secName !== 'duyurular');
    document.getElementById('tab-profil').classList.toggle('hidden', secName !== 'profil');
    renderBottomBar();
    document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderCampWorkspace() {
    const camp = getSelectedCamp();
    const isAct = camp.status === 'active';
    const campLessons = lessonsMap[camp.id] || [];
    const campAnnouncements = announcementsData.filter(a => a.campId === camp.id);

    // Kamp Üst Özeti (Sekme butonları burada DEĞİL, en alttaki sabit bardadır)
    const headerBox = document.getElementById('campWorkspaceHeader');
    const accentColor = isAct ? 'bg-[#1f7a53]' : 'bg-[#7c4f20]';

    const sectionTitles = {
      dersler: '📺 Dersler ve Videolar',
      yoklama: '✅ Yoklama Durumu',
      duyurular: '📢 Kamp Duyuruları',
      sertifika: '🎓 Katılım Sertifikası'
    };

    headerBox.innerHTML = `
      <div class="emedrese-card ${isAct ? 'camp-card-active' : 'camp-card-completed'} p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-5 items-start md:items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center min-w-0">
          <img src="${camp.image}" alt="${camp.title}" class="w-full sm:w-44 h-32 sm:h-28 rounded-xl object-cover shadow-sm shrink-0" />
          <div class="space-y-1.5 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-0.5 rounded-full text-[11px] font-bold text-white ${accentColor}">
                ${isAct ? '● Devam Ediyor' : '✓ Tamamlandı'}
              </span>
              <span class="text-xs font-bold text-muted-main">📅 ${camp.dateRange}</span>
            </div>
            <h2 class="font-heading text-lg sm:text-2xl font-extrabold text-heading-main truncate">${camp.title}</h2>
            <p class="text-xs sm:text-sm font-bold text-[#7c4f20]">${sectionTitles[activeCampSubTab]} • ${camp.completedLessons}/${camp.totalLessons} Ders (%${camp.progressPercent})</p>
          </div>
        </div>

        <button type="button" id="btnBackToAllCamps" class="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-heading-main transition shrink-0 self-start md:self-center">
          ← Tüm Kamplar
        </button>
      </div>
    `;

    document.getElementById('btnBackToAllCamps').addEventListener('click', () => goHomeHub());

    const bodyBox = document.getElementById('campWorkspaceBody');

    // 1. DERSLER SEKMESİ
    if (activeCampSubTab === 'dersler') {
      bodyBox.innerHTML = `
        <div class="emedrese-card overflow-hidden">
          <div class="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between gap-2">
            <h3 class="font-heading text-base sm:text-lg font-bold text-heading-main">Ders Listesi (${campLessons.length} Ders)</h3>
            <span class="text-xs font-semibold text-muted-main">Detay için derse tıklayın</span>
          </div>
          <div class="divide-y divide-stone-200/70">
            ${campLessons.map(l => `
              <button type="button" data-ws-lesson="${l.id}" class="ws-lesson-row w-full text-left px-5 py-4 hover:bg-stone-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group">
                <div class="flex items-start gap-3.5 min-w-0">
                  <span class="w-9 h-9 rounded-xl ${l.isLiveOpen ? 'bg-[#1f7a53] text-white' : 'bg-stone-100 text-heading-main'} font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ▶
                  </span>
                  <div class="min-w-0">
                    <p class="text-sm sm:text-base font-bold text-heading-main group-hover:text-[#7c4f20] transition">${l.title}</p>
                    <p class="text-xs text-muted-main mt-0.5">${l.instructor} • 📅 ${l.date} • ⏱ ${l.videoDuration}</p>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-2 pl-12 sm:pl-0 shrink-0">
                  <span class="text-xs font-bold px-3 py-1 rounded-full ${l.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : l.isLiveOpen ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-600'}">
                    ${l.status === 'Onaylandı' ? '✓ Onaylandı' : l.status}
                  </span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      bodyBox.querySelectorAll('.ws-lesson-row').forEach(btn => {
        btn.addEventListener('click', () => {
          openLessonModal(Number(btn.getAttribute('data-ws-lesson')), camp.id);
        });
      });
    }

    // 2. YOKLAMALAR SEKMESİ
    else if (activeCampSubTab === 'yoklama') {
      const openLesson = campLessons.find(l => l.isLiveOpen);
      bodyBox.innerHTML = `
        <div class="space-y-4">
          ${openLesson ? `
            <div class="emedrese-card camp-card-active p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <span class="inline-block text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-[#1f7a53] text-white">Yoklaması Açık Ders</span>
                <h3 class="font-heading text-base sm:text-lg font-bold text-heading-main">${openLesson.title}</h3>
                <p class="text-xs sm:text-sm text-body-main">${openLesson.instructor} • Katılımınızı onaylamak için butona tıklayın.</p>
              </div>
              <button type="button" id="wsConfirmOpenLessonBtn" class="px-5 py-2.5 rounded-xl bg-[#1f7a53] hover:bg-[#176141] text-white font-bold text-xs sm:text-sm shrink-0">
                ✓ Derse Katıldım (Yoklama Ver)
              </button>
            </div>
          ` : `
            <div class="emedrese-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="text-xs sm:text-sm font-medium text-body-main">
                Bu kampta şu an açık bir ders yoklaması bulunmuyor. Toplam yoklama durumunuz: <strong>${camp.completedLessons}/${camp.totalLessons} (%${camp.progressPercent})</strong>
              </div>
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-center">
                ✓ Kayıtlar Güncel
              </span>
            </div>
          `}

          <div class="emedrese-card overflow-hidden">
            <div class="px-5 py-3.5 bg-stone-50 border-b border-stone-200/80 text-xs font-bold text-muted-main uppercase tracking-wider">
              ${camp.shortTitle} — Ders Yoklama Çizelgesi
            </div>
            <div class="divide-y divide-stone-200/70">
              ${campLessons.map(l => `
                <div class="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p class="text-xs sm:text-sm font-bold text-heading-main">${l.title}</p>
                    <p class="text-xs text-muted-main">${l.date} • ${l.instructor}</p>
                  </div>
                  <span class="text-xs font-bold px-3 py-1 rounded-full shrink-0 ${l.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : l.isLiveOpen ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'}">
                    ${l.status === 'Onaylandı' ? '✓ Onaylandı' : l.status}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      const confirmBtn = document.getElementById('wsConfirmOpenLessonBtn');
      if (confirmBtn && openLesson) {
        confirmBtn.addEventListener('click', () => {
          openLesson.isLiveOpen = false;
          openLesson.status = 'Onaylandı';
          camp.completedLessons = Math.min(camp.totalLessons, camp.completedLessons + 1);
          camp.progressPercent = Math.round((camp.completedLessons / camp.totalLessons) * 100);
          renderCampWorkspace();
          renderBottomBar();
          showToast('✓ Yoklamanız başarıyla onaylandı!');
        });
      }
    }

    // 3. KAMP DUYURULARI SEKMESİ
    else if (activeCampSubTab === 'duyurular') {
      bodyBox.innerHTML = `
        <div class="space-y-3">
          ${campAnnouncements.map(ann => `
            <div class="emedrese-card p-5 space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-[#7c4f20]">${ann.category}</span>
                <span class="text-xs text-muted-main font-medium">${ann.date}</span>
              </div>
              <h4 class="font-heading text-base font-bold text-heading-main">${ann.title}</h4>
              <p class="text-xs sm:text-sm text-body-main leading-relaxed">${ann.body}</p>
              ${ann.actionText ? `
                <div class="pt-1">
                  <button type="button" data-ws-ann-act="${ann.actionText}" class="ws-ann-act-btn px-4 py-2 rounded-xl bg-[#133b2e] text-[#d8a634] text-xs font-bold hover:opacity-95 transition">
                    ${ann.actionText} →
                  </button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
      bodyBox.querySelectorAll('.ws-ann-act-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-ws-ann-act');
          if (act.includes('Yoklama')) {
            activeCampSubTab = 'yoklama';
            renderCampWorkspace();
            renderBottomBar();
          } else if (act.includes('Sertifika')) {
            activeCampSubTab = 'sertifika';
            renderCampWorkspace();
            renderBottomBar();
          } else {
            showToast(`"${act}" açılıyor...`);
          }
        });
      });
    }

    // 4. SERTİFİKA SEKMESİ (GÖNDERİLEN SERTİFİKA FORMATIYLA BİREBİR)
    else if (activeCampSubTab === 'sertifika') {
      if (camp.certificateEarned) {
        bodyBox.innerHTML = `
          <div class="emedrese-card p-5 sm:p-7 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
              <div>
                <span class="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  🎓 Katılım Sertifikası Hak Edildi
                </span>
                <h3 class="font-heading text-lg sm:text-xl font-extrabold text-heading-main mt-1.5">${camp.title} — Katılım Sertifikası</h3>
                <p class="text-xs sm:text-sm text-body-main mt-0.5">${camp.certificateNote}</p>
              </div>
              <div class="flex items-center gap-2.5 shrink-0">
                <button type="button" id="wsZoomCertBtn" class="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-heading-main font-bold text-xs sm:text-sm">
                  🔍 Tam Ekran Büyüt
                </button>
                <button type="button" id="wsDownloadCertBtn" class="px-5 py-2.5 rounded-xl bg-[#7c4f20] hover:bg-[#613d18] text-white font-bold text-xs sm:text-sm shadow-sm">
                  ⬇ Sertifikayı İndir (PDF)
                </button>
              </div>
            </div>

            ${camp.id === 'imam-nevevi' ? `
              <div class="max-w-4xl mx-auto">
                <img src="${camp.certificateImage}" alt="${camp.title} Sertifikası" class="w-full h-auto rounded-xl border border-stone-300 shadow-lg cursor-pointer" id="wsCertImgClick" />
              </div>
            ` : `
              <div class="max-w-4xl mx-auto">
                ${buildCertificateTemplateHtml(camp)}
              </div>
            `}
          </div>
        `;
        document.getElementById('wsDownloadCertBtn').addEventListener('click', () => {
          showToast(`${camp.shortTitle} sertifikanız PDF olarak indiriliyor...`);
        });
        document.getElementById('wsZoomCertBtn').addEventListener('click', () => {
          document.getElementById('certLightboxModal').classList.remove('hidden');
        });
        const imgClick = document.getElementById('wsCertImgClick');
        if (imgClick) {
          imgClick.addEventListener('click', () => {
            document.getElementById('certLightboxModal').classList.remove('hidden');
          });
        }
      } else {
        bodyBox.innerHTML = `
          <div class="emedrese-card p-6 sm:p-8 space-y-6">
            <div class="max-w-xl mx-auto text-center space-y-3">
              <span class="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                ⏳ Kamp Devam Ediyor (${camp.completedLessons}/${camp.totalLessons} Ders)
              </span>
              <h3 class="font-heading text-lg sm:text-xl font-bold text-heading-main">${camp.title} Sertifika Önizlemesi</h3>
              <p class="text-xs sm:text-sm text-body-main">${camp.certificateNote}</p>
            </div>
            <div class="max-w-3xl mx-auto opacity-80">
              ${buildCertificateTemplateHtml(camp)}
            </div>
          </div>
        `;
      }
    }
  }

  function openLessonModal(lessonId, campKey = 'imam-nevevi') {
    const list = lessonsMap[campKey] || [];
    const lesson = list.find(l => l.id === lessonId);
    if (!lesson) return;
    document.getElementById('modalLessonTitle').textContent = lesson.title;
    document.getElementById('modalLessonInstructor').textContent = lesson.instructor;
    document.getElementById('modalLessonDate').textContent = `${lesson.date} • Süre: ${lesson.videoDuration}`;
    document.getElementById('modalLessonSummary').textContent = lesson.note;
    document.getElementById('lessonDetailModal').classList.remove('hidden');
  }

  // ==================== BAŞLATMA ====================
  window.addEventListener('DOMContentLoaded', () => {
    renderCampsHub();
    renderGeneralAnnouncements();
    renderBottomBar();

    document.querySelectorAll('.compat-action-btn').forEach(b => {
      b.addEventListener('click', () => goHomeHub());
    });

    // Sol Üst Logo ve Üst Kamp Yolu -> Ana Sayfa (Kamplar)
    document.getElementById('brandLogoBtn').addEventListener('click', () => goHomeHub());
    const bcBackBtn = document.getElementById('headerCampBreadcrumb');
    if (bcBackBtn) {
      bcBackBtn.addEventListener('click', () => goHomeHub());
    }

    // Sağ Üst Genel Duyurular (🔔) Butonu
    const topAnnBtn = document.getElementById('topGeneralAnnBtn');
    if (topAnnBtn) {
      topAnnBtn.addEventListener('click', () => showGlobalSection('duyurular'));
    }

    // Sağ Üst Gece/Gündüz Modu (🌙) Butonu
    document.getElementById('themeToggleBtn').addEventListener('click', () => toggleDarkMode());

    // Sağ Üst Profil (ED) Butonu
    document.getElementById('profileDropdownBtn').addEventListener('click', () => {
      showGlobalSection('profil');
    });

    // Profil Sayfasındaki Sertifika ve Kamp Geçmişi Butonları
    document.querySelectorAll('.prof-open-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openCampWorkspace(btn.getAttribute('data-cert-camp'), 'sertifika');
      });
    });

    document.querySelectorAll('.prof-open-camp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openCampWorkspace(btn.getAttribute('data-hist-camp'), 'dersler');
      });
    });

    // Ders Detay Modalı
    document.getElementById('closeLessonModalBtn').addEventListener('click', () => {
      document.getElementById('lessonDetailModal').classList.add('hidden');
    });
    document.getElementById('modalDoneBtn').addEventListener('click', () => {
      document.getElementById('lessonDetailModal').classList.add('hidden');
    });
    document.getElementById('modalOpenPdfBtn').addEventListener('click', () => {
      document.getElementById('lessonDetailModal').classList.add('hidden');
      activeCampSubTab = 'duyurular';
      renderCampWorkspace();
      renderBottomBar();
    });

    // Sertifika Lightbox
    document.getElementById('closeCertLightboxBtn').addEventListener('click', () => {
      document.getElementById('certLightboxModal').classList.add('hidden');
    });

    // Profil Düzenleme Modu
    const setProfileEditMode = (editable) => {
      document.querySelectorAll('.profile-input').forEach(inp => {
        inp.disabled = !editable;
        inp.classList.toggle('bg-stone-50', !editable);
        inp.classList.toggle('bg-white', editable);
        inp.classList.toggle('ring-2', editable);
        inp.classList.toggle('ring-[#1f7a53]/30', editable);
      });
      document.getElementById('profileSaveActions').classList.toggle('hidden', !editable);
      document.getElementById('toggleEditProfileBtn').classList.toggle('hidden', editable);
    };

    document.getElementById('toggleEditProfileBtn').addEventListener('click', () => setProfileEditMode(true));
    document.getElementById('cancelEditProfileBtn').addEventListener('click', () => setProfileEditMode(false));
    document.getElementById('profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('inpFirstName').value + ' ' + document.getElementById('inpLastName').value;
      document.getElementById('profileDisplayName').textContent = fullName;
      setProfileEditMode(false);
      showToast('Profil ve sertifika isim bilgileriniz güncellendi!');
    });
  });
})();
