// ============================================================================
// js/app.js
// e-Medrese - Siyer TV Kamp Merkezli Mimari & Seçenek A Akıllı Sabit Alt Bar
// ============================================================================

(function () {
  const campsData = window.EMEDRESE_CAMPS || [];
  const lessonsMap = window.EMEDRESE_LESSONS || {};
  const announcementsData = window.EMEDRESE_ANNOUNCEMENTS || [];

  // Uygulama Durumu (State)
  let viewMode = 'hub'; // 'hub' (Ana Ekran Kamplar Vitrini) | 'camp' (Seçili Kampın Odası) | 'global-tab'
  let hubCampFilter = 'all'; // 'all' | 'active' | 'completed'
  let activeCampId = 'imam-nevevi'; // Seçili kamp ID'si
  let activeCampSubTab = 'dersler'; // 'dersler' | 'yoklama' | 'duyurular' | 'sertifika'
  let currentGlobalTab = 'kamplar'; // 'kamplar' | 'dersler' | 'duyurular' | 'sertifika' | 'profil'
  let lessonFilter = 'all';
  let lessonSearchQuery = '';
  let announcementFilter = 'all';
  let expandedAnnouncementId = 1;
  let isLiveAttendanceSimulated = false;
  let countdownSeconds = 18 * 60 + 42;

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const text = document.getElementById('toastMessageText');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  function startCountdownTimer() {
    clearInterval(window._countdownInterval);
    window._countdownInterval = setInterval(() => {
      if (countdownSeconds > 0) countdownSeconds--;
      const mins = String(Math.floor(countdownSeconds / 60)).padStart(2, '0');
      const secs = String(countdownSeconds % 60).padStart(2, '0');
      const el = document.getElementById('liveCountdownTimer');
      if (el) el.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    document.querySelectorAll('.theme-switch-btn').forEach(btn => {
      const active = btn.getAttribute('data-set-theme') === themeName;
      btn.className = active
        ? 'theme-switch-btn px-2 py-1 rounded-md text-[11px] font-semibold bg-amber-600 text-white transition'
        : 'theme-switch-btn px-2 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white transition';
    });
  }

  function getSelectedCamp() {
    return campsData.find(c => c.id === activeCampId) || campsData[0];
  }

  // ==================== SEÇENEK A: AKILLI BAĞLAM DEĞİŞTİREN ALT BAR ====================
  function renderMobileBottomBar() {
    const nav = document.getElementById('mobileBottomNav');
    if (!nav) return;

    if (viewMode === 'camp') {
      const camp = getSelectedCamp();
      const isAct = camp.status === 'active';
      nav.innerHTML = `
        <button type="button" id="mobBackToCampsBtn" class="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          <span>Kamplar</span>
        </button>
        <button type="button" data-camp-subtab="dersler" class="mob-camp-sub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${activeCampSubTab === 'dersler' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Dersler</span>
        </button>
        <button type="button" data-camp-subtab="yoklama" class="mob-camp-sub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition relative ${activeCampSubTab === 'yoklama' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          <span>Yoklama</span>
          ${isAct ? '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute top-1 right-2"></span>' : ''}
        </button>
        <button type="button" data-camp-subtab="duyurular" class="mob-camp-sub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${activeCampSubTab === 'duyurular' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
          <span>Duyuru</span>
        </button>
        <button type="button" data-camp-subtab="sertifika" class="mob-camp-sub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${activeCampSubTab === 'sertifika' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Sertifika</span>
        </button>
      `;

      document.getElementById('mobBackToCampsBtn').addEventListener('click', () => exitCampWorkspace());
      nav.querySelectorAll('.mob-camp-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          openCampWorkspace(activeCampId, btn.getAttribute('data-camp-subtab'));
        });
      });
    } else {
      // Ana Ekran (Kamplar Vitrini) Alt Barı
      nav.innerHTML = `
        <button type="button" data-hub-nav="all" class="mob-hub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${(viewMode === 'hub' && hubCampFilter === 'all') ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          <span>Kamplar</span>
        </button>
        <button type="button" data-hub-nav="active" class="mob-hub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition relative ${(viewMode === 'hub' && hubCampFilter === 'active') ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'}">
          <span class="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-3"></span>
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span>Aktif (1)</span>
        </button>
        <button type="button" data-hub-nav="completed" class="mob-hub-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${(viewMode === 'hub' && hubCampFilter === 'completed') ? 'bg-stone-700 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Biten (1)</span>
        </button>
        <button type="button" data-global-tab="duyurular" class="mob-global-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${(viewMode === 'global-tab' && currentGlobalTab === 'duyurular') ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
          <span>Duyurular</span>
        </button>
        <button type="button" data-global-tab="profil" class="mob-global-btn flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition ${(viewMode === 'global-tab' && currentGlobalTab === 'profil') ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'}">
          <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span>Profilim</span>
        </button>
      `;

      nav.querySelectorAll('.mob-hub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          setHubFilter(btn.getAttribute('data-hub-nav'));
          exitCampWorkspace();
        });
      });
      nav.querySelectorAll('.mob-global-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          switchTab(btn.getAttribute('data-global-tab'));
        });
      });
    }
  }

  // ==================== KAMP VİTRİNİ (AKTİF VE BİTEN KAMPLAR RENK AYRIMLI) ====================
  function setHubFilter(filterVal) {
    hubCampFilter = filterVal;
    document.querySelectorAll('.camp-status-filter-btn').forEach(btn => {
      const f = btn.getAttribute('data-camp-status-filter');
      if (f === filterVal) {
        if (f === 'active') {
          btn.className = 'camp-status-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm transition flex items-center gap-1.5';
        } else if (f === 'completed') {
          btn.className = 'camp-status-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-700 text-white shadow-sm transition flex items-center gap-1.5';
        } else {
          btn.className = 'camp-status-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-sm transition flex items-center gap-1.5';
        }
      } else {
        btn.className = 'camp-status-filter-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1.5';
      }
    });
    renderCampsHubList();
    renderMobileBottomBar();
  }

  function renderCampsHubList() {
    const container = document.getElementById('campsHubListContainer');
    if (!container) return;

    const filtered = campsData.filter(c => hubCampFilter === 'all' || c.status === hubCampFilter);

    container.innerHTML = filtered.map(camp => {
      const isAct = camp.status === 'active';
      const cardThemeClass = isAct
        ? 'camp-card-active bg-white border-emerald-300/90'
        : 'camp-card-completed border-stone-300/90';

      const statusBadgeHtml = isAct
        ? `<span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
             <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
             🟢 DEVAM EDEN AKTİF KAMP
           </span>`
        : `<span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-stone-200 text-stone-800 border border-stone-300">
             🏁 SÜRESİ BİTTİ • TAMAMLANDI
           </span>`;

      const ribbonHtml = isAct
        ? `<div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
             🟢 Aktif • Yoklama Açık
           </div>`
        : `<div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-stone-800/90 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider shadow border border-amber-400/40">
             🏁 Süresi Bitti • Arşiv
           </div>`;

      const footerBgClass = isAct
        ? 'bg-emerald-50/60 border-t border-emerald-200/70'
        : 'bg-stone-100/80 border-t border-stone-200/90';

      const progressBarClass = isAct
        ? 'from-emerald-500 to-teal-600'
        : 'from-stone-600 to-amber-700';

      return `
        <div class="rounded-2xl border shadow-sm overflow-hidden flex flex-col transition hover:shadow-md ${cardThemeClass}">
          <!-- Üst Durum Şeridi (Aktif vs Biten Kamp Rengi Hemen Belli Olur) -->
          <div class="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 ${isAct ? 'bg-emerald-500/10 border-b border-emerald-200/60' : 'bg-stone-200/60 border-b border-stone-300/60'}">
            ${statusBadgeHtml}
            <span class="text-xs font-bold ${isAct ? 'text-emerald-800' : 'text-amber-800'}">
              ${camp.liveNotice}
            </span>
          </div>

          <!-- Orta: Kamp Görseli & Açıklama -->
          <div class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
            <button type="button" data-enter-camp="${camp.id}" data-enter-sub="dersler" class="enter-camp-trigger w-full sm:w-56 rounded-xl overflow-hidden shrink-0 shadow-md border border-stone-800/30 relative group bg-stone-900 block text-left focus:outline-none">
              <img
                src="${camp.image}"
                alt="${camp.title}"
                class="camp-thumb-img w-full aspect-video sm:aspect-[16/10] object-cover group-hover:scale-105 transition duration-300"
              />
              ${ribbonHtml}
            </button>

            <div class="flex-1 min-w-0 space-y-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="text-[11px] font-bold uppercase tracking-wider ${isAct ? 'text-emerald-700' : 'text-stone-500'}">${camp.subtitle}</span>
                  <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">${camp.title}</h2>
                </div>
                ${camp.certificateEarned ? `
                  <span class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    🎓 Sertifika Kazanıldı
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ Kayıtlısınız
                  </span>
                `}
              </div>

              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ${camp.description}
              </p>

              <!-- Kamp Tarihleri -->
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg ${isAct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-200/70 text-stone-700 border border-stone-300'}">
                  📅 ${camp.dateRange}
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg ${isAct ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-500 border border-stone-200'}">
                  ⏰ ${camp.deadline}
                </span>
              </div>
            </div>
          </div>

          <!-- Alt: Kamp İlerlemesi & Kampa Özel 4 Hızlı Buton -->
          <div class="mt-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 ${footerBgClass}">
            <div class="flex-1 max-w-xs">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-semibold text-slate-700">Kamp Tamamlama Oranı</span>
                <span class="font-extrabold ${isAct ? 'text-emerald-700' : 'text-stone-700'}">${camp.completedLessons} / ${camp.totalLessons} Ders (%${camp.progressPercent})</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div class="h-full bg-gradient-to-r ${progressBarClass} rounded-full" style="width: ${camp.progressPercent}%"></div>
              </div>
            </div>

            <!-- Kampa Tıklayınca Açılan 4 Modül Butonu -->
            <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              <button type="button" data-enter-camp="${camp.id}" data-enter-sub="dersler" class="enter-camp-trigger px-3 py-2 rounded-xl text-xs font-bold ${isAct ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-stone-800 hover:bg-stone-900 text-white'} shadow-sm transition flex items-center justify-center gap-1.5">
                <span>📺 Dersler (${camp.totalLessons})</span>
              </button>
              <button type="button" data-enter-camp="${camp.id}" data-enter-sub="yoklama" class="enter-camp-trigger px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition flex items-center justify-center gap-1.5">
                <span>✅ Yoklamalar</span>
              </button>
              <button type="button" data-enter-camp="${camp.id}" data-enter-sub="duyurular" class="enter-camp-trigger px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition flex items-center justify-center gap-1.5">
                <span>📢 Duyurular</span>
              </button>
              <button type="button" data-enter-camp="${camp.id}" data-enter-sub="sertifika" class="enter-camp-trigger px-3 py-2 rounded-xl text-xs font-bold ${camp.certificateEarned ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'} transition flex items-center justify-center gap-1.5">
                <span>🎓 Sertifika</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.enter-camp-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.getAttribute('data-enter-camp');
        const sub = btn.getAttribute('data-enter-sub') || 'dersler';
        openCampWorkspace(cId, sub);
      });
    });
  }

  // ==================== KAMP ODASI (SEÇİLEN KAMPIN 4 MODÜLÜ) ====================
  function openCampWorkspace(campId, subTab = 'dersler') {
    activeCampId = campId;
    activeCampSubTab = subTab;
    viewMode = 'camp';

    // Ana vitrini gizle, Kamp Odasını göster
    document.getElementById('campsHubView').classList.add('hidden');
    document.getElementById('campWorkspaceView').classList.remove('hidden');

    // Diğer global sekmeleri gizle, tab-kamplar kapsayıcısını aktif tut
    ['dersler', 'duyurular', 'sertifika', 'profil'].forEach(id => {
      const sec = document.getElementById('tab-' + id);
      if (sec) sec.classList.add('hidden');
    });
    document.getElementById('tab-kamplar').classList.remove('hidden');

    renderCampWorkspace();
    renderMobileBottomBar();
  }

  function exitCampWorkspace() {
    viewMode = 'hub';
    document.getElementById('campWorkspaceView').classList.add('hidden');
    document.getElementById('campsHubView').classList.remove('hidden');
    ['dersler', 'duyurular', 'sertifika', 'profil'].forEach(id => {
      const sec = document.getElementById('tab-' + id);
      if (sec) sec.classList.add('hidden');
    });
    document.getElementById('tab-kamplar').classList.remove('hidden');
    renderCampsHubList();
    renderMobileBottomBar();
  }

  function renderCampWorkspace() {
    const camp = getSelectedCamp();
    const isAct = camp.status === 'active';
    const campLessons = lessonsMap[camp.id] || [];
    const campAnnouncements = announcementsData.filter(a => a.campId === camp.id);

    // Kamp Üst Başlığı ve 4'lü Kamp İçi Sekme Çubuğu
    const headerBox = document.getElementById('campWorkspaceHeader');
    headerBox.className = `rounded-2xl border shadow-sm overflow-hidden ${isAct ? 'camp-card-active bg-white border-emerald-300' : 'camp-card-completed border-stone-300'}`;
    headerBox.innerHTML = `
      <div class="p-4 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <button type="button" id="btnBackToAllCamps" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Tüm Kamplara Dön
          </button>
          <span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full ${isAct ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-200 text-stone-800 border border-stone-300'}">
            ${isAct ? '🟢 DEVAM EDEN AKTİF KAMP' : '🏁 SÜRESİ BİTEN KAMP (ARŞİV)'}
          </span>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <img src="${camp.image}" alt="${camp.title}" class="w-full sm:w-44 aspect-video rounded-xl object-cover border border-stone-300 shadow-sm shrink-0" />
          <div class="flex-1 min-w-0 space-y-1.5">
            <p class="text-xs font-bold ${isAct ? 'text-emerald-700' : 'text-stone-500'}">${camp.subtitle}</p>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">${camp.title}</h2>
            <p class="text-xs sm:text-sm text-slate-600">${camp.description}</p>
            <div class="pt-1 flex flex-wrap items-center gap-3 text-xs font-bold">
              <span class="text-slate-700">📅 ${camp.dateRange}</span>
              <span class="${isAct ? 'text-emerald-700' : 'text-amber-800'}">✓ İlerleme: ${camp.completedLessons}/${camp.totalLessons} Ders (%${camp.progressPercent})</span>
            </div>
          </div>
        </div>

        <!-- Kampa Özel 4 Ana Buton -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80">
          <button type="button" data-ws-tab="dersler" class="ws-tab-btn py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${activeCampSubTab === 'dersler' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
            <span>📺 Dersler (${campLessons.length})</span>
          </button>
          <button type="button" data-ws-tab="yoklama" class="ws-tab-btn py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${activeCampSubTab === 'yoklama' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
            <span>✅ Yoklamalar (${camp.completedLessons}/${camp.totalLessons})</span>
          </button>
          <button type="button" data-ws-tab="duyurular" class="ws-tab-btn py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${activeCampSubTab === 'duyurular' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
            <span>📢 Duyurular (${campAnnouncements.length})</span>
          </button>
          <button type="button" data-ws-tab="sertifika" class="ws-tab-btn py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${activeCampSubTab === 'sertifika' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
            <span>🎓 Sertifika</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnBackToAllCamps').addEventListener('click', () => exitCampWorkspace());
    headerBox.querySelectorAll('.ws-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCampSubTab = btn.getAttribute('data-ws-tab');
        renderCampWorkspace();
        renderMobileBottomBar();
      });
    });

    // Kamp Odası Alt İçerik Alanı
    const bodyBox = document.getElementById('campWorkspaceBody');
    if (activeCampSubTab === 'dersler') {
      bodyBox.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div class="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-base font-bold text-slate-900">${camp.title} — Ders Videoları ve Notları</h3>
              <p class="text-xs text-slate-500">Ders satırına tıklayarak ders videosunu, özet notunu ve yoklama bilgisini açabilirsiniz.</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-lg bg-brand-50 text-brand-700 self-start sm:self-center">
              Toplam ${campLessons.length} Ders
            </span>
          </div>
          <div class="divide-y divide-slate-100">
            ${campLessons.map(l => `
              <button type="button" data-ws-lesson="${l.id}" class="ws-lesson-row w-full text-left px-4 sm:px-5 py-3.5 hover:bg-brand-50/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                <div class="flex items-start gap-3 min-w-0">
                  <span class="w-8 h-8 rounded-lg ${l.isLiveOpen ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700'} font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ▶
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700">${l.title}</p>
                    <p class="text-xs text-slate-500 mt-0.5">${l.instructor} • 📅 ${l.date} • ⏱ ${l.videoDuration}</p>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-2 pl-11 sm:pl-0">
                  <span class="text-[11px] font-bold px-2.5 py-1 rounded-full ${l.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : l.isLiveOpen ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'}">
                    ${l.status}
                  </span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      bodyBox.querySelectorAll('.ws-lesson-row').forEach(btn => {
        btn.addEventListener('click', () => {
          const lId = Number(btn.getAttribute('data-ws-lesson'));
          openLessonModal(lId, camp.id);
        });
      });
    } else if (activeCampSubTab === 'yoklama') {
      const openLesson = campLessons.find(l => l.isLiveOpen);
      bodyBox.innerHTML = `
        <div class="space-y-4">
          ${openLesson ? `
            <div class="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-600 text-white">🔴 Canlı Ders Yoklaması Açık</span>
                <h3 class="text-base font-bold text-slate-900 mt-1.5">${openLesson.title}</h3>
                <p class="text-xs text-slate-600">${openLesson.instructor} • Tek tıkla bu dersin yoklamasını onaylayın.</p>
              </div>
              <button type="button" id="wsConfirmOpenLessonBtn" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shrink-0">
                ✓ Yoklamamı Şimdi Onayla
              </button>
            </div>
          ` : `
            <div class="bg-stone-100 border border-stone-300 rounded-2xl p-4 flex items-center justify-between">
              <div class="text-xs sm:text-sm font-semibold text-stone-700">
                Bu kampta şu an açık bir canlı yoklama bulunmuyor. Katılım oranınız: <strong>${camp.completedLessons}/${camp.totalLessons} (%${camp.progressPercent})</strong>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-700">Tamamlandı</span>
            </div>
          `}

          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div class="px-5 py-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
              ${camp.title} — Yoklama Çizelgesi
            </div>
            <div class="divide-y divide-slate-100">
              ${campLessons.map(l => `
                <div class="px-4 sm:px-5 py-3 flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <div>
                    <p class="font-bold text-slate-800">${l.title}</p>
                    <p class="text-xs text-slate-500">${l.date} • ${l.instructor}</p>
                  </div>
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${l.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : l.isLiveOpen ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}">
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
          showToast('✓ 6. Ders yoklamanız başarıyla onaylandı! (6/10 Ders)');
        });
      }
    } else if (activeCampSubTab === 'duyurular') {
      bodyBox.innerHTML = `
        <div class="space-y-3">
          ${campAnnouncements.map(ann => `
            <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">${ann.category}</span>
                <span class="text-xs text-slate-400 font-medium">${ann.date}</span>
              </div>
              <h4 class="text-sm sm:text-base font-bold text-slate-900">${ann.title}</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${ann.body}</p>
              ${ann.actionText ? `
                <div class="pt-1">
                  <button type="button" data-ws-ann-act="${ann.title}" class="ws-ann-act-btn px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition">
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
          showToast(`"${btn.getAttribute('data-ws-ann-act')}" açılıyor...`);
        });
      });
    } else if (activeCampSubTab === 'sertifika') {
      if (camp.certificateEarned) {
        bodyBox.innerHTML = `
          <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div class="lg:col-span-5 space-y-3">
              <span class="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                🎓 Sertifikanız Hazır
              </span>
              <h3 class="text-lg font-bold text-slate-900">${camp.title} Katılım Sertifikası</h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${camp.certificateNote}</p>
              <div class="flex gap-2 pt-2">
                <button type="button" id="wsDownloadCertBtn" class="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs">
                  Sertifikayı İndir (PDF)
                </button>
                <button type="button" id="wsZoomCertBtn" class="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs">
                  🔍 Büyüt
                </button>
              </div>
            </div>
            <div class="lg:col-span-7">
              <img src="${camp.certificateImage}" alt="Sertifika" class="w-full rounded-xl border border-stone-300 shadow-md" />
            </div>
          </div>
        `;
        document.getElementById('wsDownloadCertBtn').addEventListener('click', () => {
          showToast('Emrullah_Demir_Imam_Nevevi_Sertifika.pdf indiriliyor...');
        });
        document.getElementById('wsZoomCertBtn').addEventListener('click', () => {
          document.getElementById('certLightboxModal').classList.remove('hidden');
        });
      } else {
        bodyBox.innerHTML = `
          <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm text-center max-w-xl mx-auto space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold text-lg">
              ⏳
            </div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900">${camp.title} — Sertifika Süreci Devam Ediyor</h3>
            <p class="text-xs sm:text-sm text-slate-600">${camp.certificateNote}</p>
            <div class="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" style="width: ${camp.progressPercent}%"></div>
            </div>
            <p class="text-xs font-bold text-emerald-700">Mevcut Yoklama: ${camp.completedLessons} / ${camp.totalLessons} Ders (%${camp.progressPercent})</p>
          </div>
        `;
      }
    }
  }

  // ==================== GENEL SEKME GEÇİŞİ ====================
  function switchTab(tabId, skipSkeleton = false) {
    if (!['kamplar', 'dersler', 'duyurular', 'sertifika', 'profil'].includes(tabId)) return;
    currentGlobalTab = tabId;
    if (tabId === 'kamplar') {
      viewMode = 'hub';
      document.getElementById('campWorkspaceView').classList.add('hidden');
      document.getElementById('campsHubView').classList.remove('hidden');
    } else {
      viewMode = 'global-tab';
    }

    document.getElementById('profileDropdownMenu').classList.add('hidden');

    document.querySelectorAll('#desktopNav .nav-tab-btn').forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.className = isTarget
        ? 'nav-tab-btn px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 bg-brand-600 text-white shadow-sm'
        : 'nav-tab-btn px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/70';
    });

    const mainEl = document.getElementById('mainContent');
    const skelEl = document.getElementById('skeletonContainer');

    const activateSection = () => {
      ['kamplar', 'dersler', 'duyurular', 'sertifika', 'profil'].forEach(id => {
        const sec = document.getElementById('tab-' + id);
        if (sec) sec.classList.toggle('hidden', id !== tabId);
      });
      renderMobileBottomBar();
    };

    if (skipSkeleton) {
      activateSection();
      return;
    }

    mainEl.classList.add('hidden');
    skelEl.classList.remove('hidden');
    clearTimeout(window._tabSwitchTimer);
    window._tabSwitchTimer = setTimeout(() => {
      skelEl.classList.add('hidden');
      mainEl.classList.remove('hidden');
      activateSection();
    }, 130);
  }

  // ==================== GENEL DERSLER, YOKLAMA VE DUYURULAR RENDER ====================
  function renderAttendanceBox() {
    const box = document.getElementById('attendanceAlertBox');
    const btnText = document.getElementById('toggleLiveAttendanceText');
    if (!box || !btnText) return;

    if (!isLiveAttendanceSimulated) {
      btnText.textContent = 'Açık Yoklama Kartını Test Et';
      box.className = 'bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3';
      box.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <h3 class="text-sm font-bold text-emerald-950">İmâm Gazâlî Kampı — 6. Ders Yoklaması Açık!</h3>
            <p class="text-xs text-emerald-800 mt-0.5">Aktif kampın canlı ders yoklamasını onaylamak için Kamp Odasına geçebilirsiniz.</p>
          </div>
        </div>
        <button type="button" id="quickGoActiveCampAttendance" class="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 self-start sm:self-center">
          Yoklamaya Git →
        </button>
      `;
      const qBtn = document.getElementById('quickGoActiveCampAttendance');
      if (qBtn) qBtn.addEventListener('click', () => openCampWorkspace('imam-gazali', 'yoklama'));
    } else {
      btnText.textContent = 'Normal Görünüme Dön';
      box.className = 'bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm';
      box.innerHTML = `
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-pulse">
            ▶
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">Canlı Yoklama Açık</span>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-1">6. Eyyühe'l-Veled Okumaları - 3: Peygamberî Ahlak</h3>
            <p class="text-xs text-slate-600">Dr. Öğr. Üy. Mesut Çakır • Tek tıkla yoklamanızı onaylayabilirsiniz.</p>
          </div>
        </div>
        <button type="button" id="confirmLiveAttendanceBtn" class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition shrink-0">
          ✓ Derse Katıldım (Yoklama Ver)
        </button>
      `;
      const confirmBtn = document.getElementById('confirmLiveAttendanceBtn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          isLiveAttendanceSimulated = false;
          renderAttendanceBox();
          showToast('Canlı ders yoklamanız başarıyla kaydedildi!');
        });
      }
    }
  }

  function renderLessons() {
    const container = document.getElementById('lessonsListContainer');
    if (!container) return;
    const allLessons = lessonsMap['imam-nevevi'] || [];
    const q = lessonSearchQuery.trim().toLowerCase();

    const filtered = allLessons.filter(item => {
      const matchCat = lessonFilter === 'all' || item.category === lessonFilter;
      const matchText = !q || item.title.toLowerCase().includes(q) || item.instructor.toLowerCase().includes(q);
      return matchCat && matchText;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">Arama kriterinize uygun ders bulunamadı.</div>`;
      return;
    }

    container.innerHTML = filtered.map(lesson => `
      <button type="button" data-lesson-id="${lesson.id}" class="lesson-row-btn w-full text-left px-4 sm:px-5 py-3.5 hover:bg-brand-50/40 transition flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4 group">
        <div class="sm:col-span-7 flex items-start gap-3 min-w-0">
          <span class="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-700 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            ${lesson.order}
          </span>
          <div class="min-w-0">
            <p class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700 leading-snug">${lesson.title}</p>
            <p class="text-xs text-slate-500 mt-0.5 truncate">${lesson.instructor}</p>
          </div>
        </div>
        <div class="sm:col-span-5 flex items-center justify-between sm:grid sm:grid-cols-5 pl-10 sm:pl-0 pt-1 sm:pt-0 w-full">
          <div class="sm:col-span-2 sm:text-center text-xs font-medium text-slate-500">${lesson.date}</div>
          <div class="sm:col-span-3 flex items-center justify-end gap-2">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ${lesson.status}
            </span>
          </div>
        </div>
      </button>
    `).join('');

    container.querySelectorAll('.lesson-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-lesson-id'));
        openLessonModal(id, 'imam-nevevi');
      });
    });
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

  function renderAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;
    const filtered = announcementsData.filter(a => announcementFilter === 'all' || a.category === announcementFilter);

    container.innerHTML = filtered.map(ann => {
      const isOpen = expandedAnnouncementId === ann.id;
      const isGeneral = ann.category === 'Genel';
      const badgeClass = isGeneral
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-brand-50 text-brand-700 border-brand-200';

      return `
        <div class="bg-white rounded-2xl border ${isOpen ? 'border-brand-300 ring-2 ring-brand-500/10' : 'border-slate-200/90'} shadow-sm overflow-hidden transition">
          <button type="button" data-ann-id="${ann.id}" class="ann-toggle-btn w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
            <div class="flex items-start gap-3.5 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-xl ${ann.isNew ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'} flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                📢
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5 mb-1">
                  <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}">${ann.category}</span>
                  <span class="text-[11px] text-slate-400 font-medium">${ann.date}</span>
                  ${ann.isNew ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">YENİ</span>' : ''}
                </div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">${ann.title}</h3>
              </div>
            </div>
            <span class="text-slate-400 text-xs font-bold">${isOpen ? '▲' : '▼'}</span>
          </button>
          ${isOpen ? `
            <div class="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${ann.body}</p>
              ${ann.actionText ? `
                <div class="flex justify-end">
                  <button type="button" data-ann-action="${ann.title}" class="ann-action-btn px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition">
                    ${ann.actionText} →
                  </button>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.querySelectorAll('.ann-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-ann-id'));
        const targetAnn = announcementsData.find(a => a.id === id);
        if (targetAnn) targetAnn.isNew = false;
        expandedAnnouncementId = (expandedAnnouncementId === id) ? null : id;
        renderAnnouncements();
      });
    });

    container.querySelectorAll('.ann-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(`"${btn.getAttribute('data-ann-action')}" bağlantısı açılıyor...`);
      });
    });
  }

  function setSimulatorMode(useMobileFrame) {
    const wrapper = document.getElementById('appViewportWrapper');
    const desktopNav = document.getElementById('desktopNav');
    const mobileBottomNav = document.getElementById('mobileBottomNav');
    const dashboardGrid = document.getElementById('dashboardGrid');
    const btnAuto = document.getElementById('btnViewAuto');
    const btnMob = document.getElementById('btnViewMobileSim');

    if (useMobileFrame) {
      wrapper.classList.add('mobile-simulator-frame');
      desktopNav.classList.remove('md:flex');
      mobileBottomNav.classList.remove('md:hidden', 'fixed', 'bottom-3', 'left-3', 'right-3');
      mobileBottomNav.classList.add('sticky', 'bottom-2', 'mx-2');
      if (dashboardGrid) dashboardGrid.classList.remove('lg:grid-cols-3');
      btnMob.className = 'px-2.5 py-1 rounded-md font-medium transition bg-brand-600 text-white flex items-center gap-1';
      btnAuto.className = 'px-2.5 py-1 rounded-md font-medium transition bg-slate-800 text-slate-300 hover:bg-slate-700';
    } else {
      wrapper.classList.remove('mobile-simulator-frame');
      desktopNav.classList.add('md:flex');
      mobileBottomNav.classList.add('md:hidden', 'fixed', 'bottom-3', 'left-3', 'right-3');
      mobileBottomNav.classList.remove('sticky', 'bottom-2', 'mx-2');
      if (dashboardGrid) dashboardGrid.classList.add('lg:grid-cols-3');
      btnAuto.className = 'px-2.5 py-1 rounded-md font-medium transition bg-brand-600 text-white';
      btnMob.className = 'px-2.5 py-1 rounded-md font-medium transition bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1';
    }
  }

  // ==================== BAŞLATMA ====================
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.compat-action-btn').forEach(b => b.addEventListener('click', () => exitCampWorkspace()));
    renderCampsHubList();
    renderAttendanceBox();
    renderLessons();
    renderAnnouncements();
    switchTab('kamplar', true);
    startCountdownTimer();

    // Kamp Durum Filtresi Butonları (Tümü / Aktif / Biten)
    document.querySelectorAll('.camp-status-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setHubFilter(btn.getAttribute('data-camp-status-filter'));
      });
    });

    // Tema Seçici
    document.querySelectorAll('.theme-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.getAttribute('data-set-theme')));
    });

    // Global Canlı Yoklama Bandı
    const globalBanner = document.getElementById('globalLiveAttendanceBanner');
    document.getElementById('btnToggleGlobalAttendance').addEventListener('click', () => {
      globalBanner.classList.toggle('hidden');
    });
    document.getElementById('btnGlobalConfirmAttendance').addEventListener('click', () => {
      globalBanner.classList.add('hidden');
      showToast('✓ İmâm Gazâlî Kampı 6. Ders canlı yoklamanız onaylandı!');
    });

    // Masaüstü Üst Sekmeler
    document.querySelectorAll('#desktopNav .nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    document.getElementById('brandLogoBtn').addEventListener('click', () => exitCampWorkspace());
    document.getElementById('cardGoLessonsBtn').addEventListener('click', () => openCampWorkspace('imam-nevevi', 'dersler'));
    document.getElementById('cardGoCertBtn').addEventListener('click', () => openCampWorkspace('imam-nevevi', 'sertifika'));
    document.getElementById('widgetSeeAllAnnouncements').addEventListener('click', () => switchTab('duyurular'));
    document.getElementById('widgetDownloadCertBtn').addEventListener('click', () => openCampWorkspace('imam-nevevi', 'sertifika'));

    document.querySelectorAll('.quick-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        expandedAnnouncementId = Number(btn.getAttribute('data-open-announcement'));
        renderAnnouncements();
        switchTab('duyurular');
      });
    });

    // Profil Dropdown
    const profBtn = document.getElementById('profileDropdownBtn');
    const profMenu = document.getElementById('profileDropdownMenu');
    profBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', () => profMenu.classList.add('hidden'));

    document.getElementById('menuGoProfileBtn').addEventListener('click', () => switchTab('profil'));
    document.getElementById('menuGoCertBtn').addEventListener('click', () => switchTab('sertifika'));
    document.getElementById('menuLogoutBtn').addEventListener('click', () => {
      profMenu.classList.add('hidden');
      showToast('Güvenli çıkış simülasyonu tetiklendi.');
    });

    // Ders Arama & Filtre
    document.getElementById('lessonSearchInput').addEventListener('input', (e) => {
      lessonSearchQuery = e.target.value;
      renderLessons();
    });
    document.querySelectorAll('.lesson-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        lessonFilter = btn.getAttribute('data-lesson-filter');
        document.querySelectorAll('.lesson-filter-btn').forEach(b => {
          b.className = (b === btn)
            ? 'lesson-filter-btn px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-brand-600 text-white'
            : 'lesson-filter-btn px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200';
        });
        renderLessons();
      });
    });

    document.getElementById('toggleLiveAttendanceBtn').addEventListener('click', () => {
      isLiveAttendanceSimulated = !isLiveAttendanceSimulated;
      renderAttendanceBox();
    });

    // Modallar
    document.getElementById('closeLessonModalBtn').addEventListener('click', () => {
      document.getElementById('lessonDetailModal').classList.add('hidden');
    });
    document.getElementById('modalDoneBtn').addEventListener('click', () => {
      document.getElementById('lessonDetailModal').classList.add('hidden');
    });
    document.getElementById('modalOpenPdfBtn').addEventListener('click', () => {
      document.getElementById('lessonDetailModal').classList.add('hidden');
      expandedAnnouncementId = 3;
      renderAnnouncements();
      switchTab('duyurular');
    });

    document.querySelectorAll('.ann-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        announcementFilter = btn.getAttribute('data-ann-filter');
        document.querySelectorAll('.ann-filter-btn').forEach(b => {
          b.className = (b === btn)
            ? 'ann-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white'
            : 'ann-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
        });
        renderAnnouncements();
      });
    });

    // Sertifika
    document.getElementById('downloadCertBtn').addEventListener('click', () => {
      showToast('Emrullah_Demir_Imam_Nevevi_Sertifika.pdf indiriliyor...');
    });
    document.getElementById('shareCertBtn').addEventListener('click', () => {
      showToast('Sertifika doğrulama bağlantısı kopyalandı!');
    });
    document.getElementById('copyCertCodeBtn').addEventListener('click', () => {
      showToast('Doğrulama kodu (SYR-1448-NVV-8942) kopyalandı!');
    });
    document.getElementById('btnZoomCertificate').addEventListener('click', () => {
      document.getElementById('certLightboxModal').classList.remove('hidden');
    });
    document.getElementById('certImagePreviewBtn').addEventListener('click', () => {
      document.getElementById('certLightboxModal').classList.remove('hidden');
    });
    document.getElementById('closeCertLightboxBtn').addEventListener('click', () => {
      document.getElementById('certLightboxModal').classList.add('hidden');
    });

    // Profil Düzenleme
    const setProfileEditMode = (editable) => {
      document.querySelectorAll('.profile-input').forEach(inp => {
        inp.disabled = !editable;
        inp.classList.toggle('bg-slate-50', !editable);
        inp.classList.toggle('bg-white', editable);
        inp.classList.toggle('border-brand-400', editable);
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
      showToast('Profil bilgileriniz başarıyla güncellendi!');
    });

    // GitHub & Veri Gönderme Modalı
    document.getElementById('btnOpenAdminModal').addEventListener('click', () => {
      document.getElementById('adminDataModal').classList.remove('hidden');
    });
    document.getElementById('closeAdminModalBtn').addEventListener('click', () => {
      document.getElementById('adminDataModal').classList.add('hidden');
    });
    document.getElementById('btnAdminPublishAnn').addEventListener('click', () => {
      const title = document.getElementById('adminNewAnnTitle').value.trim() || 'Yeni Kamp Duyurusu';
      const category = document.getElementById('adminNewAnnCat').value;
      const body = document.getElementById('adminNewAnnBody').value.trim() || 'Duyuru detayı eklendi.';
      const newId = announcementsData.length + 300;
      announcementsData.unshift({
        id: newId,
        campId: category === 'İmâm Nevevî Kampı' ? 'imam-nevevi' : 'imam-gazali',
        title,
        category,
        date: 'Şimdi',
        isNew: true,
        actionText: 'Bağlantıya Git',
        body
      });
      expandedAnnouncementId = newId;
      renderAnnouncements();
      document.getElementById('adminDataModal').classList.add('hidden');
      switchTab('duyurular');
      showToast('Yeni duyuru başarıyla yayınlandı!');
    });

    document.getElementById('btnAdminPublishCamp').addEventListener('click', () => {
      document.getElementById('adminDataModal').classList.add('hidden');
      setHubFilter('active');
      exitCampWorkspace();
      showToast('Aktif Kamp (İmâm Gazâlî Kampı) gösteriliyor!');
    });

    // Görünüm Modları
    document.getElementById('btnViewAuto').addEventListener('click', () => setSimulatorMode(false));
    document.getElementById('btnViewMobileSim').addEventListener('click', () => setSimulatorMode(true));
    document.getElementById('btnOpenFixesModal').addEventListener('click', () => {
      document.getElementById('fixesComparisonModal').classList.remove('hidden');
    });
    document.getElementById('closeFixesModalBtn').addEventListener('click', () => {
      document.getElementById('fixesComparisonModal').classList.add('hidden');
    });
    document.getElementById('ackFixesModalBtn').addEventListener('click', () => {
      document.getElementById('fixesComparisonModal').classList.add('hidden');
    });
  });
})();
