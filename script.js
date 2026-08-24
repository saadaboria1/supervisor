/**
 * ==============================================================================
 * منظومة الإشراف التربوي - مدارس المدينة الأكاديمية
 * Master Application Logic, SPA Router, State Management & Interactivity
 * ==============================================================================
 */

// ==============================================================================
// 1. Initial State & Data Store (Al-Madinah Academic Schools)
// ==============================================================================
const DEFAULT_TEACHERS = [
    { id: 1, name: "أ. أحمد بن سلطان الشمري", subject: "الرياضيات المتقدمة", branch: "المدينة الأكاديمية - ثانوي (بنين)", code: "AC-8841", email: "a.alshammari@academiccity.edu.sa", rating: 96, visitsCount: 3, status: "نشط" },
    { id: 2, name: "أ. محمد بن خالد الدوسري", subject: "الفيزياء (AP Physics)", branch: "المدينة الأكاديمية - المسار الدولي", code: "AC-7410", email: "m.aldosari@academiccity.edu.sa", rating: 88, visitsCount: 2, status: "نشط" },
    { id: 3, name: "أ. سعود بن عبدالله القحطاني", subject: "اللغة العربية والآداب", branch: "المدينة الأكاديمية - متوسط (بنين)", code: "AC-9932", email: "s.alqahtani@academiccity.edu.sa", rating: 90, visitsCount: 2, status: "نشط" },
    { id: 4, name: "أ. ريم بنت خالد العتيبي", subject: "اللغة الإنجليزية", branch: "المدينة الأكاديمية - ثانوي (بنات)", code: "AC-6541", email: "r.alotaibi@academiccity.edu.sa", rating: 94, visitsCount: 3, status: "نشط" },
    { id: 5, name: "أ. يوسف بن زياد الشهري", subject: "المهارات الرقمية والذكاء الاصطناعي", branch: "المدينة الأكاديمية - ابتدائي", code: "AC-5218", email: "y.alshehri@academiccity.edu.sa", rating: 74, visitsCount: 1, status: "تحت التطوير" },
    { id: 6, name: "أ. طارق بن فهد الحربي", subject: "الكيمياء العامة", branch: "المدينة الأكاديمية - ثانوي (بنين)", code: "AC-4102", email: "t.alharbi@academiccity.edu.sa", rating: 95, visitsCount: 2, status: "نشط" },
    { id: 7, name: "أ. سارة بنت عبدالعزيز الشريف", subject: "العلوم العامة", branch: "المدينة الأكاديمية - متوسط (بنات)", code: "AC-3319", email: "s.alshareef@academiccity.edu.sa", rating: 91, visitsCount: 2, status: "نشط" },
    { id: 8, name: "أ. عمر بن حسن العمري", subject: "اللغة الإنجليزية المتقدمة", branch: "المدينة الأكاديمية - متوسط (بنين)", code: "AC-2291", email: "o.alomari@academiccity.edu.sa", rating: 93, visitsCount: 2, status: "نشط" }
];

const DEFAULT_VISITS = [
    { id: 1, teacherName: "أ. أحمد بن سلطان الشمري", subject: "الرياضيات المتقدمة", branch: "المدينة الأكاديمية - ثانوي (بنين)", date: "2026-08-24", time: "08:30 ص", score: "96/100", status: "مكتملة", objectives: "متابعة تطبيق استراتيجيات التعلم النشط وتدقيق ملفات التحضير." },
    { id: 2, teacherName: "أ. محمد بن خالد الدوسري", subject: "الفيزياء (AP Physics)", branch: "المدينة الأكاديمية - المسار الدولي", date: "2026-08-23", time: "10:15 ص", score: "88/100", status: "قيد المراجعة", objectives: "تقييم أداء التجارب المعملية ومطابقتها لمعايير الدبلوما الأمريكية." },
    { id: 3, teacherName: "أ. سعود بن عبدالله القحطاني", subject: "اللغة العربية والآداب", branch: "المدينة الأكاديمية - متوسط (بنين)", date: "2026-08-26", time: "09:00 ص", score: "--", status: "مجدولة", objectives: "متابعة مهارات الإملاء والتعبير الكتابي والصفوف التفاعلية." },
    { id: 4, teacherName: "أ. ريم بنت خالد العتيبي", subject: "اللغة الإنجليزية", branch: "المدينة الأكاديمية - ثانوي (بنات)", date: "2026-08-22", time: "11:30 ص", score: "94/100", status: "مكتملة", objectives: "تقييم مهارات المحادثة وتطبيق استراتيجيات العصف الذهني." },
    { id: 5, teacherName: "أ. يوسف بن زياد الشهري", subject: "المهارات الرقمية", branch: "المدينة الأكاديمية - ابتدائي", date: "2026-08-20", time: "08:00 ص", score: "74/100", status: "ملغاة", objectives: "تأجيل الزيارة لظروف الصيانة في معمل الحاسب الآلي." }
];

const DEFAULT_EVALUATIONS = [
    { id: "EV-101", teacherName: "أ. أحمد بن سلطان الشمري", subject: "الرياضيات المتقدمة", branch: "المدينة الأكاديمية - ثانوي (بنين)", date: "24 أغسطس 2026", score1: 20, score2: 29, score3: 24, score4: 23, totalScore: 96, rating: "ممتاز مرتفع", notes: "أداء متميز وتفاعل استثنائي من الطلاب وتوظيف رائع للسبورة الذكية.", status: "معتمد" },
    { id: "EV-102", teacherName: "أ. ريم بنت خالد العتيبي", subject: "اللغة الإنجليزية", branch: "المدينة الأكاديمية - ثانوي (بنات)", date: "22 أغسطس 2026", score1: 19, score2: 28, score3: 24, score4: 23, totalScore: 94, rating: "ممتاز", notes: "إدارة صفية محكمة واستخدام كامل للغة الهدف طوال الحصة.", status: "معتمد" },
    { id: "EV-103", teacherName: "أ. محمد بن خالد الدوسري", subject: "الفيزياء (AP Physics)", branch: "المدينة الأكاديمية - المسار الدولي", date: "23 أغسطس 2026", score1: 18, score2: 26, score3: 22, score4: 22, totalScore: 88, rating: "جيد جداً مرتفع", notes: "يوصى بزيادة وقت النقاش الحر بين المجموعات الطلابية في التجارب.", status: "قيد المراجعة" }
];

// AppState Container
const AppState = {
    teachers: JSON.parse(localStorage.getItem('AC_TEACHERS')) || DEFAULT_TEACHERS,
    visits: JSON.parse(localStorage.getItem('AC_VISITS')) || DEFAULT_VISITS,
    evaluations: JSON.parse(localStorage.getItem('AC_EVALUATIONS')) || DEFAULT_EVALUATIONS,
    currentView: 'dashboard',
    teacherFilter: 'all',
    teacherViewMode: 'cards',
    supervisor: {
        name: "د. فرج دنيا",
        role: "المشرف التربوي المقيم - مدارس المدينة الأكاديمية",
        email: "f.donia@academiccity.edu.sa",
        phone: "+966 50 123 4567"
    }
};

function saveState() {
    localStorage.setItem('AC_TEACHERS', JSON.stringify(AppState.teachers));
    localStorage.setItem('AC_VISITS', JSON.stringify(AppState.visits));
    localStorage.setItem('AC_EVALUATIONS', JSON.stringify(AppState.evaluations));
}

// Chart.js Instances
let dashboardVisitsChart = null;
let dashboardRatingChart = null;
let reportsBranchChart = null;
let reportsTrendChart = null;

// ==============================================================================
// 2. Lifecycle & Initial Setup
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Setup Navigation Link Handlers
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');
            if (targetView) {
                switchTab(targetView);
            }
        });
    });

    // 2. Setup Sidebar Hamburger & Mobile Drawer
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const appLayout = document.getElementById('appLayout');
    const sidebar = document.getElementById('sidebar');

    function toggleSidebar() {
        if (window.innerWidth <= 1024) {
            const isOpen = sidebar.classList.toggle('mobile-open');
            sidebarBackdrop.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        } else {
            appLayout.classList.toggle('sidebar-collapsed');
        }
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('mobile-open');
        sidebarBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    // 3. Setup Dropdowns
    setupHeaderDropdowns();

    // 4. Modal Triggers
    document.querySelectorAll('.add-visit-trigger').forEach(btn => {
        btn.addEventListener('click', () => openAddVisitModal());
    });

    // Close Modals on click outside or ESC
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            document.getElementById('globalSearchInput')?.focus();
        }
    });

    // 5. Global Search Handler
    const globalSearchInput = document.getElementById('globalSearchInput');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = globalSearchInput.value.trim();
                if (query) {
                    handleGlobalSearch(query);
                }
            }
        });
    }

    // 6. Form Handlers
    const addVisitForm = document.getElementById('addVisitForm');
    if (addVisitForm) {
        addVisitForm.addEventListener('submit', handleSaveNewVisit);
    }

    // 7. Initial Render
    renderAll();
});

// ==============================================================================
// 3. Dynamic Router & View Switching
// ==============================================================================
function switchTab(viewName) {
    AppState.currentView = viewName;

    // Update active class on sidebar
    document.querySelectorAll('.sidebar-menu .menu-link').forEach(link => {
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Switch View Pages
    document.querySelectorAll('.view-page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(`view-${viewName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Auto-close mobile sidebar
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
        document.getElementById('sidebarBackdrop')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Trigger on-demand renders
    if (viewName === 'dashboard') {
        renderDashboardCharts();
        renderVisitsTable();
    } else if (viewName === 'teachers') {
        renderTeachersView();
    } else if (viewName === 'visits') {
        renderVisitsSchedule();
    } else if (viewName === 'evaluations') {
        renderEvaluationsTable();
    } else if (viewName === 'reports') {
        renderReportsCharts();
    }
}
window.switchTab = switchTab;

// ==============================================================================
// 4. Master Render Functions
// ==============================================================================
function renderAll() {
    updateBadgesAndCounters();
    populateTeacherDropdowns();
    renderVisitsTable();
    renderTeachersView();
    renderVisitsSchedule();
    renderEvaluationsTable();
    renderDashboardCharts();
}

function updateBadgesAndCounters() {
    const totalTeachers = AppState.teachers.length;
    const totalVisits = AppState.visits.length;
    const pendingVisits = AppState.visits.filter(v => v.status === 'قيد المراجعة').length;
    const completedVisits = AppState.visits.filter(v => v.status === 'مكتملة').length;

    // Sidebar counts
    const sidebarTeacherCount = document.getElementById('sidebarTeacherCount');
    if (sidebarTeacherCount) sidebarTeacherCount.textContent = totalTeachers;

    const sidebarEvalCount = document.getElementById('sidebarEvalCount');
    if (sidebarEvalCount) sidebarEvalCount.textContent = AppState.evaluations.length;

    // Dashboard Stat Cards
    const statTeacherCount = document.getElementById('statTeacherCount');
    if (statTeacherCount) statTeacherCount.textContent = totalTeachers;

    const statVisitCount = document.getElementById('statVisitCount');
    if (statVisitCount) statVisitCount.textContent = completedVisits;

    const statPendingCount = document.getElementById('statPendingCount');
    if (statPendingCount) statPendingCount.textContent = pendingVisits;

    const countPillAll = document.getElementById('countPillAll');
    if (countPillAll) countPillAll.textContent = totalTeachers;
}

function populateTeacherDropdowns() {
    const teacherSelect = document.getElementById('teacherSelect');
    const evalTeacherSelect = document.getElementById('evalTeacherSelect');

    if (teacherSelect) {
        teacherSelect.innerHTML = '<option value="" disabled selected>-- اختر المعلم من كادر المدينة الأكاديمية --</option>';
        AppState.teachers.forEach(t => {
            const opt = document.createElement('option');
            opt.value = `${t.name}|${t.subject}|${t.branch}`;
            opt.textContent = `${t.name} (${t.subject} - ${t.branch})`;
            teacherSelect.appendChild(opt);
        });
    }

    if (evalTeacherSelect) {
        evalTeacherSelect.innerHTML = '<option value="" disabled selected>-- اختر المعلم لتقييم الزيارة --</option>';
        AppState.teachers.forEach(t => {
            const opt = document.createElement('option');
            opt.value = `${t.name}|${t.subject}|${t.branch}`;
            opt.textContent = `${t.name} - ${t.subject} (${t.branch})`;
            evalTeacherSelect.appendChild(opt);
        });
    }
}

// ==============================================================================
// 5. Dashboard View & Table Rendering
// ==============================================================================
function renderVisitsTable() {
    const tableBody = document.getElementById('visitsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const filterValue = document.getElementById('statusFilter')?.value || 'all';
    const searchQuery = document.getElementById('tableSearchInput')?.value.toLowerCase().trim() || '';

    let visibleCount = 0;

    AppState.visits.forEach(v => {
        const matchesStatus = filterValue === 'all' || v.status === filterValue;
        const rowText = `${v.teacherName} ${v.subject} ${v.branch}`.toLowerCase();
        const matchesSearch = searchQuery === '' || rowText.includes(searchQuery);

        if (matchesStatus && matchesSearch) {
            visibleCount++;
            const tr = document.createElement('tr');
            
            // Badge style
            let badgeClass = 'badge-info';
            let iconClass = 'fa-regular fa-clock';
            if (v.status === 'مكتملة') { badgeClass = 'badge-success'; iconClass = 'fa-solid fa-check'; }
            else if (v.status === 'قيد المراجعة') { badgeClass = 'badge-warning'; iconClass = 'fa-solid fa-spinner fa-spin-pulse'; }
            else if (v.status === 'ملغاة') { badgeClass = 'badge-danger'; iconClass = 'fa-solid fa-triangle-exclamation'; }

            // Score style
            let scoreBadge = `<span class="score-badge score-pending">--</span>`;
            if (v.score && v.score !== '--') {
                const numericScore = parseInt(v.score, 10);
                if (numericScore >= 90) scoreBadge = `<span class="score-badge score-high">${v.score}</span>`;
                else if (numericScore >= 80) scoreBadge = `<span class="score-badge score-mid">${v.score}</span>`;
                else scoreBadge = `<span class="score-badge score-low">${v.score}</span>`;
            }

            // Avatar initials
            const initials = getInitials(v.teacherName);

            tr.innerHTML = `
                <td>
                    <div class="teacher-cell">
                        <div class="avatar-circle avatar-cyan">${initials}</div>
                        <div class="teacher-details">
                            <span class="teacher-name">${v.teacherName}</span>
                            <span class="teacher-id">الزيارة #${v.id}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="subject-badge subject-cs">
                        <i class="fa-solid fa-book-open"></i> ${v.subject}
                    </span>
                </td>
                <td>
                    <div class="school-cell">
                        <span class="school-name">${v.branch}</span>
                        <span class="school-level">مدارس المدينة الأكاديمية</span>
                    </div>
                </td>
                <td>
                    <div class="date-cell">
                        <span class="visit-date"><i class="fa-regular fa-calendar"></i> ${v.date}</span>
                        <span class="visit-time"><i class="fa-regular fa-clock"></i> ${v.time}</span>
                    </div>
                </td>
                <td>${scoreBadge}</td>
                <td>
                    <span class="badge ${badgeClass}">
                        <i class="${iconClass}"></i> ${v.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" title="عرض التفاصيل والتقييم" onclick="openVisitEvaluationQuick('${v.teacherName}', '${v.date}')">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" title="تقييم صفي فوري" onclick="launchEvaluationForTeacher('${v.teacherName}', '${v.subject}', '${v.branch}')">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        }
    });

    const showingCount = document.getElementById('showingCount');
    if (showingCount) showingCount.textContent = visibleCount;

    const totalVisitsCount = document.getElementById('totalVisitsCount');
    if (totalVisitsCount) totalVisitsCount.textContent = AppState.visits.length;
}

// Table search and filter listeners
document.getElementById('tableSearchInput')?.addEventListener('input', renderVisitsTable);
document.getElementById('statusFilter')?.addEventListener('change', renderVisitsTable);

// ==============================================================================
// 6. Teachers View & Filtering
// ==============================================================================
function renderTeachersView() {
    const cardsContainer = document.getElementById('teachersCardsContainer');
    const tableBody = document.getElementById('teachersTableBody');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';

    const filter = AppState.teacherFilter;
    const search = document.getElementById('teacherSearchInput')?.value.toLowerCase().trim() || '';

    AppState.teachers.forEach(t => {
        const matchesFilter = filter === 'all' || t.branch.includes(filter);
        const searchStr = `${t.name} ${t.subject} ${t.branch} ${t.code}`.toLowerCase();
        const matchesSearch = search === '' || searchStr.includes(search);

        if (matchesFilter && matchesSearch) {
            const initials = getInitials(t.name);

            // Card HTML
            const card = document.createElement('div');
            card.className = 'teacher-card';
            card.innerHTML = `
                <div class="teacher-card-top">
                    <div class="teacher-card-info">
                        <div class="avatar-circle avatar-orange">${initials}</div>
                        <div>
                            <h4 class="teacher-card-name">${t.name}</h4>
                            <span class="teacher-card-code">كود: ${t.code}</span>
                        </div>
                    </div>
                    <span class="badge ${t.status === 'نشط' ? 'badge-success' : 'badge-warning'}">${t.status}</span>
                </div>
                <div class="teacher-card-badges">
                    <span class="subject-badge subject-math"><i class="fa-solid fa-graduation-cap"></i> ${t.subject}</span>
                    <span class="badge badge-info">${t.branch.replace('المدينة الأكاديمية - ', '')}</span>
                </div>
                <div class="teacher-card-stats">
                    <span>الزيارات: <strong>${t.visitsCount}</strong></span>
                    <span>متوسط الأداء: <strong class="text-primary">${t.rating}%</strong></span>
                </div>
                <div class="teacher-card-actions">
                    <button class="btn btn-outline btn-sm w-100" onclick="launchEvaluationForTeacher('${t.name}', '${t.subject}', '${t.branch}')">
                        <i class="fa-solid fa-clipboard-check"></i> تقييم صفي
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="quickScheduleForTeacher('${t.name}', '${t.subject}', '${t.branch}')" title="جدولة زيارة">
                        <i class="fa-solid fa-calendar-plus"></i>
                    </button>
                </div>
            `;
            cardsContainer.appendChild(card);

            // Table Row HTML
            if (tableBody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="teacher-cell">
                            <div class="avatar-circle avatar-orange">${initials}</div>
                            <div class="teacher-details">
                                <span class="teacher-name">${t.name}</span>
                                <span class="teacher-id">${t.code}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="subject-badge subject-math">${t.subject}</span></td>
                    <td>${t.branch}</td>
                    <td><strong>${t.visitsCount}</strong> زيارات</td>
                    <td><strong class="text-primary">${t.rating}%</strong></td>
                    <td><span class="badge ${t.status === 'نشط' ? 'badge-success' : 'badge-warning'}">${t.status}</span></td>
                    <td class="text-center">
                        <button class="action-btn view-btn" onclick="launchEvaluationForTeacher('${t.name}', '${t.subject}', '${t.branch}')" title="تقييم"><i class="fa-solid fa-clipboard-check"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        }
    });
}

function filterTeachersByBranch(branchFilter, btnElement) {
    AppState.teacherFilter = branchFilter;
    document.querySelectorAll('.filter-pills-container .pill-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    renderTeachersView();
}
window.filterTeachersByBranch = filterTeachersByBranch;

function searchTeachers() {
    renderTeachersView();
}
window.searchTeachers = searchTeachers;

function setTeacherViewMode(mode) {
    AppState.teacherViewMode = mode;
    const cardsBox = document.getElementById('teachersCardsContainer');
    const tableBox = document.getElementById('teachersTableContainer');
    const btnCards = document.getElementById('viewModeCards');
    const btnTable = document.getElementById('viewModeTable');

    if (mode === 'cards') {
        cardsBox.style.display = 'grid';
        tableBox.style.display = 'none';
        btnCards.classList.add('active');
        btnTable.classList.remove('active');
    } else {
        cardsBox.style.display = 'none';
        tableBox.style.display = 'block';
        btnTable.classList.add('active');
        btnCards.classList.remove('active');
    }
}
window.setTeacherViewMode = setTeacherViewMode;

// Jump from Campus Cards to Teacher Tab Filter
function viewBranchTeachers(branchKeyword) {
    switchTab('teachers');
    const targetPill = document.querySelector(`.pill-btn[data-filter="${branchKeyword}"]`);
    filterTeachersByBranch(branchKeyword, targetPill);
}
window.viewBranchTeachers = viewBranchTeachers;

// ==============================================================================
// 7. Scheduled Visits View & Timeline
// ==============================================================================
function renderVisitsSchedule() {
    const container = document.getElementById('visitsScheduleContainer');
    if (!container) return;

    container.innerHTML = '';

    AppState.visits.forEach(v => {
        const dateObj = new Date(v.date);
        const day = dateObj.getDate() || 24;
        const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const month = monthNames[dateObj.getMonth()] || "أغسطس";

        const card = document.createElement('div');
        card.className = 'visit-card';
        card.innerHTML = `
            <div class="visit-card-header">
                <div class="visit-date-badge">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <span class="badge ${v.status === 'مكتملة' ? 'badge-success' : (v.status === 'قيد المراجعة' ? 'badge-warning' : 'badge-info')}">
                    ${v.status}
                </span>
            </div>
            <div>
                <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem;">${v.teacherName}</h3>
                <p style="font-size: 0.8rem; color: var(--primary-600); font-weight: 600;">${v.subject} - ${v.branch}</p>
            </div>
            <div class="visit-objectives-box">
                <i class="fa-solid fa-bullseye" style="color: var(--primary-600); margin-left: 0.35rem;"></i>
                ${v.objectives}
            </div>
            <div class="visit-card-footer">
                <span class="text-sm text-muted"><i class="fa-regular fa-clock"></i> ${v.time}</span>
                <button class="btn btn-primary btn-sm" onclick="launchEvaluationForTeacher('${v.teacherName}', '${v.subject}', '${v.branch}')">
                    <i class="fa-solid fa-clipboard-check"></i> بدء التقييم
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterVisitsTimeline(statusFilter, btnElement) {
    document.querySelectorAll('#view-visits .pill-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const container = document.getElementById('visitsScheduleContainer');
    if (!container) return;

    const cards = container.querySelectorAll('.visit-card');
    cards.forEach(c => {
        const text = c.textContent;
        if (statusFilter === 'all') c.style.display = '';
        else if (statusFilter === 'completed' && text.includes('مكتملة')) c.style.display = '';
        else if (statusFilter === 'pending' && text.includes('قيد المراجعة')) c.style.display = '';
        else if (statusFilter === 'upcoming' && text.includes('مجدولة')) c.style.display = '';
        else c.style.display = 'none';
    });
}
window.filterVisitsTimeline = filterVisitsTimeline;

// ==============================================================================
// 8. Evaluations View & Dynamic Rubrics
// ==============================================================================
function renderEvaluationsTable() {
    const tableBody = document.getElementById('evaluationsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    AppState.evaluations.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${ev.id}</strong></td>
            <td>
                <div class="teacher-details">
                    <span class="teacher-name">${ev.teacherName}</span>
                    <span class="teacher-id">${ev.branch}</span>
                </div>
            </td>
            <td><span class="subject-badge subject-math">${ev.subject}</span></td>
            <td>${ev.date}</td>
            <td><span class="score-badge score-high">${ev.totalScore} / 100</span></td>
            <td><span class="badge badge-success">${ev.rating}</span></td>
            <td><span class="badge ${ev.status === 'معتمد' ? 'badge-success' : 'badge-warning'}">${ev.status}</span></td>
            <td class="text-center">
                <button class="action-btn view-btn" onclick="showToast('عرض بطاقة التقييم المعتمدة #${ev.id}', 'info')" title="عرض البطاقة">
                    <i class="fa-regular fa-file-lines"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function calculateTotalScore() {
    const s1 = parseInt(document.getElementById('rubricScore1')?.value, 10) || 0;
    const s2 = parseInt(document.getElementById('rubricScore2')?.value, 10) || 0;
    const s3 = parseInt(document.getElementById('rubricScore3')?.value, 10) || 0;
    const s4 = parseInt(document.getElementById('rubricScore4')?.value, 10) || 0;

    const total = s1 + s2 + s3 + s4;
    const totalEl = document.getElementById('evalTotalScore');
    const ratingEl = document.getElementById('evalRatingText');

    if (totalEl) totalEl.textContent = total;

    if (ratingEl) {
        if (total >= 95) ratingEl.textContent = "ممتاز مرتفع";
        else if (total >= 90) ratingEl.textContent = "ممتاز";
        else if (total >= 80) ratingEl.textContent = "جيد جداً";
        else if (total >= 70) ratingEl.textContent = "جيد";
        else ratingEl.textContent = "يحتاج تطوير";
    }
}
window.calculateTotalScore = calculateTotalScore;

function handleSaveEvaluation(e) {
    e.preventDefault();
    const evalSelect = document.getElementById('evalTeacherSelect');
    if (!evalSelect || !evalSelect.value) {
        showToast('يرجى اختيار المعلم المراد تقييمه', 'error');
        return;
    }

    const [teacherName, subject, branch] = evalSelect.value.split('|');
    const s1 = parseInt(document.getElementById('rubricScore1')?.value, 10) || 0;
    const s2 = parseInt(document.getElementById('rubricScore2')?.value, 10) || 0;
    const s3 = parseInt(document.getElementById('rubricScore3')?.value, 10) || 0;
    const s4 = parseInt(document.getElementById('rubricScore4')?.value, 10) || 0;
    const total = s1 + s2 + s3 + s4;
    const notes = document.getElementById('evalNotes')?.value || 'تمت التوصية بالاستمرار على نفس مستوى التميز.';

    const newEval = {
        id: `EV-${Math.floor(100 + Math.random() * 900)}`,
        teacherName,
        subject,
        branch,
        date: new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }),
        score1: s1,
        score2: s2,
        score3: s3,
        score4: s4,
        totalScore: total,
        rating: total >= 90 ? "ممتاز" : "جيد جداً",
        notes,
        status: "معتمد"
    };

    AppState.evaluations.unshift(newEval);

    // Update teacher rating
    const targetTeacher = AppState.teachers.find(t => t.name === teacherName);
    if (targetTeacher) {
        targetTeacher.rating = total;
        targetTeacher.visitsCount = (targetTeacher.visitsCount || 1) + 1;
    }

    // Update or mark visit as completed
    const matchingVisit = AppState.visits.find(v => v.teacherName === teacherName);
    if (matchingVisit) {
        matchingVisit.status = "مكتملة";
        matchingVisit.score = `${total}/100`;
    }

    saveState();
    closeAllModals();
    renderAll();

    showToast(`تم اعتماد بطاقة التقييم بنجاح لـ ${teacherName} بدرجة (${total}/100)!`, 'success');
}
window.handleSaveEvaluation = handleSaveEvaluation;

function launchEvaluationForTeacher(name, subject, branch) {
    openEvaluationModal();
    const evalTeacherSelect = document.getElementById('evalTeacherSelect');
    if (evalTeacherSelect) {
        evalTeacherSelect.value = `${name}|${subject}|${branch}`;
    }
}
window.launchEvaluationForTeacher = launchEvaluationForTeacher;

function openVisitEvaluationQuick(teacherName, visitDate) {
    const targetTeacher = AppState.teachers.find(t => t.name === teacherName);
    if (targetTeacher) {
        launchEvaluationForTeacher(targetTeacher.name, targetTeacher.subject, targetTeacher.branch);
        const dateDisplay = document.getElementById('evalVisitDateDisplay');
        if (dateDisplay) dateDisplay.value = visitDate;
    } else {
        showToast(`عرض بيانات الزيارة لـ ${teacherName}`, 'info');
    }
}
window.openVisitEvaluationQuick = openVisitEvaluationQuick;

function syncEvalFields() {
    // When select changes inside the modal
    calculateTotalScore();
}
window.syncEvalFields = syncEvalFields;

function searchEvaluations() {
    const query = document.getElementById('evalSearchInput')?.value.toLowerCase().trim() || '';
    const rows = document.querySelectorAll('#evaluationsTableBody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = (query === '' || text.includes(query)) ? '' : 'none';
    });
}
window.searchEvaluations = searchEvaluations;

// ==============================================================================
// 9. Modals Management (Open / Close)
// ==============================================================================
function openAddVisitModal() {
    closeAllModals();
    const modal = document.getElementById('addVisitModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const visitDateInput = document.getElementById('visitDate');
        if (visitDateInput && !visitDateInput.value) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            visitDateInput.value = tomorrow.toISOString().split('T')[0];
        }
    }
}
window.openAddVisitModal = openAddVisitModal;

function openAddTeacherModal() {
    closeAllModals();
    const modal = document.getElementById('addTeacherModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
window.openAddTeacherModal = openAddTeacherModal;

function openEvaluationModal() {
    closeAllModals();
    const modal = document.getElementById('evaluationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        calculateTotalScore();
    }
}
window.openEvaluationModal = openEvaluationModal;

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}
window.closeAllModals = closeAllModals;

// Add New Visit Form Submission
function handleSaveNewVisit(e) {
    e.preventDefault();
    const teacherSelect = document.getElementById('teacherSelect');
    const gradeLevel = document.getElementById('gradeLevel');
    const visitType = document.getElementById('visitType');
    const visitDate = document.getElementById('visitDate');
    const visitTime = document.getElementById('visitTime');
    const visitObjectives = document.getElementById('visitObjectives');

    if (!teacherSelect.value || !visitDate.value || !visitTime.value || !visitObjectives.value.trim()) {
        showToast('يرجى تعبئة كافة الحقول الإلزامية للزيارة', 'error');
        return;
    }

    const [teacherName, subject, branch] = teacherSelect.value.split('|');

    const newVisit = {
        id: AppState.visits.length + 1,
        teacherName,
        subject: subject || 'العلوم والرياضيات',
        branch: gradeLevel.value || branch,
        date: visitDate.value,
        time: visitTime.value + ' ص',
        score: '--',
        status: 'مجدولة',
        objectives: visitObjectives.value.trim()
    };

    AppState.visits.unshift(newVisit);
    saveState();
    closeAllModals();
    document.getElementById('addVisitForm')?.reset();
    renderAll();

    showToast(`تمت جدولة الزيارة الإشرافية لـ ${teacherName} بنجاح!`, 'success');
}

// Add New Teacher Form Submission
function handleSaveNewTeacher(e) {
    e.preventDefault();
    const name = document.getElementById('newTeacherName')?.value.trim();
    const subject = document.getElementById('newTeacherSubject')?.value.trim();
    const branch = document.getElementById('newTeacherBranch')?.value;
    const code = document.getElementById('newTeacherCode')?.value.trim() || `AC-${Math.floor(1000 + Math.random() * 9000)}`;
    const email = document.getElementById('newTeacherEmail')?.value.trim() || `${code.toLowerCase()}@academiccity.edu.sa`;

    if (!name || !subject) {
        showToast('يرجى كتابة اسم المعلم والتخصص', 'error');
        return;
    }

    const newTeacher = {
        id: AppState.teachers.length + 1,
        name,
        subject,
        branch,
        code,
        email,
        rating: 90,
        visitsCount: 0,
        status: 'نشط'
    };

    AppState.teachers.unshift(newTeacher);
    saveState();
    closeAllModals();
    document.getElementById('addTeacherForm')?.reset();
    renderAll();

    showToast(`تمت إضافة المعلم ${name} إلى كادر مدارس المدينة الأكاديمية بنجاح!`, 'success');
}
window.handleSaveNewTeacher = handleSaveNewTeacher;

function quickScheduleForTeacher(name, subject, branch) {
    openAddVisitModal();
    const teacherSelect = document.getElementById('teacherSelect');
    if (teacherSelect) {
        teacherSelect.value = `${name}|${subject}|${branch}`;
    }
}
window.quickScheduleForTeacher = quickScheduleForTeacher;

// ==============================================================================
// 10. Chart.js High-Definition Analytics
// ==============================================================================
function renderDashboardCharts() {
    const visitsCanvas = document.getElementById('dashboardVisitsChart');
    const ratingCanvas = document.getElementById('dashboardRatingChart');

    if (!visitsCanvas || !ratingCanvas || typeof Chart === 'undefined') return;

    if (dashboardVisitsChart) dashboardVisitsChart.destroy();
    if (dashboardRatingChart) dashboardRatingChart.destroy();

    // 1. Visits Bar Chart
    dashboardVisitsChart = new Chart(visitsCanvas, {
        type: 'bar',
        data: {
            labels: ['ثانوي بنين', 'المسار الدولي', 'ثانوي بنات', 'متوسط بنين', 'متوسط بنات', 'ابتدائي'],
            datasets: [{
                label: 'الزيارات المنفذة',
                data: [28, 22, 26, 18, 16, 20],
                backgroundColor: 'rgba(37, 99, 235, 0.85)',
                borderRadius: 6
            }, {
                label: 'المستهدف الفصلي',
                data: [30, 25, 28, 22, 20, 24],
                backgroundColor: 'rgba(226, 232, 240, 0.9)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top', rtl: true } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // 2. Rating Breakdown Doughnut Chart
    dashboardRatingChart = new Chart(ratingCanvas, {
        type: 'doughnut',
        data: {
            labels: ['ممتاز مرتفع (+95)', 'ممتاز (90-94)', 'جيد جداً (80-89)', 'تحت التطوير (<80)'],
            datasets: [{
                data: [42, 38, 15, 5],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', rtl: true } }
        }
    });
}

function renderReportsCharts() {
    const branchCanvas = document.getElementById('reportsBranchComparisonChart');
    const trendCanvas = document.getElementById('reportsTrendChart');

    if (!branchCanvas || !trendCanvas || typeof Chart === 'undefined') return;

    if (reportsBranchChart) reportsBranchChart.destroy();
    if (reportsTrendChart) reportsTrendChart.destroy();

    reportsBranchChart = new Chart(branchCanvas, {
        type: 'radar',
        data: {
            labels: ['التخطيط', 'استراتيجيات التعلم', 'إدارة الصف', 'التقويم الصفي', 'الابتكار والتقنية'],
            datasets: [{
                label: 'القسم الثانوي',
                data: [95, 92, 94, 91, 93],
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: '#2563eb'
            }, {
                label: 'المسار الدولي',
                data: [92, 96, 91, 94, 98],
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    reportsTrendChart = new Chart(trendCanvas, {
        type: 'line',
        data: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6'],
            datasets: [{
                label: 'متوسط درجات التقييم',
                data: [88.5, 89.2, 90.4, 91.0, 91.8, 92.4],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.35,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 80, max: 100 } }
        }
    });
}

// ==============================================================================
// 11. Header Dropdowns & Helpers
// ==============================================================================
function setupHeaderDropdowns() {
    const notifBtn = document.getElementById('notifToggleBtn');
    const notifMenu = document.getElementById('notifMenu');
    const profileBtn = document.getElementById('profileToggleBtn');
    const profileMenu = document.getElementById('profileMenu');

    if (notifBtn && notifMenu) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu?.classList.remove('show');
            notifMenu.classList.toggle('show');
        });
    }

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifMenu?.classList.remove('show');
            profileMenu.classList.toggle('show');
        });
    }

    document.addEventListener('click', () => {
        notifMenu?.classList.remove('show');
        profileMenu?.classList.remove('show');
    });

    document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
        document.querySelectorAll('.notif-item.unread').forEach(i => i.classList.remove('unread'));
        const badge = document.getElementById('notifBadge');
        if (badge) badge.style.display = 'none';
        showToast('تم تحديد كافة الإشعارات كمقروءة', 'success');
    });
}

function handleGlobalSearch(query) {
    showToast(`جاري البحث عن "${query}" في كادر وبيانات مدارس المدينة الأكاديمية...`, 'info');
    switchTab('teachers');
    const searchInput = document.getElementById('teacherSearchInput');
    if (searchInput) {
        searchInput.value = query;
        renderTeachersView();
    }
}

function savePlatformSettings() {
    const name = document.getElementById('settingSupervisorName')?.value;
    const title = document.getElementById('settingSupervisorTitle')?.value;
    const email = document.getElementById('settingSupervisorEmail')?.value;

    if (name) {
        AppState.supervisor.name = name;
        AppState.supervisor.title = title;
        AppState.supervisor.email = email;

        document.getElementById('sidebarSupervisorName').textContent = name;
        document.getElementById('headerSupervisorName').textContent = name.split(' ')[1] || name;
        document.getElementById('menuSupervisorName').textContent = name;
        document.getElementById('menuSupervisorEmail').textContent = email;
    }

    showToast('تم حفظ إعدادات منظومة الإشراف التربوي بنجاح!', 'success');
}
window.savePlatformSettings = savePlatformSettings;

function exportPlatformData() {
    showToast('جاري تصدير التقرير الإشرافي لمدارس المدينة الأكاديمية (PDF & Excel)...', 'info');
    setTimeout(() => {
        showToast('تم تحميل التقرير الإشرافي بنجاح!', 'success');
    }, 1200);
}
window.exportPlatformData = exportPlatformData;

function printVisitsSchedule() {
    window.print();
}
window.printVisitsSchedule = printVisitsSchedule;

function handleLogout() {
    showToast('تم تسجيل الخروج من منظومة مدارس المدينة الأكاديمية', 'info');
}
window.handleLogout = handleLogout;

function getInitials(name) {
    const clean = name.replace('أ. ', '').replace('د. ', '').trim();
    const parts = clean.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]) : clean.substring(0, 2);
}

// Toast Utility
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-solid fa-circle-check';
    let title = 'نجاح العملية';

    if (type === 'error') { icon = 'fa-solid fa-circle-xmark'; title = 'تنبيه'; }
    else if (type === 'info') { icon = 'fa-solid fa-circle-info'; title = 'معلومات'; }

    toast.innerHTML = `
        <div class="toast-icon"><i class="${icon}"></i></div>
        <div class="toast-content">
            <h4 class="toast-title">${title}</h4>
            <p class="toast-message">${message}</p>
        </div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3800);
}
window.showToast = showToast;
