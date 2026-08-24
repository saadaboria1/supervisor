/**
 * ==============================================================================
 * منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
 * Master App Coordinator: Bootstrapping, Event Binding & Interactivity
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Guard route: redirect to login.html if not authenticated
    AuthManager.initAuthGuard(false);

    // 2. Initialize Central Relational State & UI
    AppState.init();
    UIManager.init();
    AppRouter.init();

    // 3. Setup Global Event Handlers
    setupLayoutEvents();
    setupForms();
    setupRoleSwitcher();
    setupDropdowns();
});

/**
 * Setup Global Layout and Navigation
 */
function setupLayoutEvents() {
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

    sidebarToggle?.addEventListener('click', toggleSidebar);
    sidebarCloseBtn?.addEventListener('click', closeMobileSidebar);
    sidebarBackdrop?.addEventListener('click', closeMobileSidebar);

    // Sidebar navigation click
    document.querySelectorAll('.sidebar-menu .menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            if (view) {
                AppRouter.navigateTo(view);
                if (window.innerWidth <= 1024) closeMobileSidebar();
            }
        });
    });

    // Global Search Bar
    const globalSearchInput = document.getElementById('globalSearchInput');
    globalSearchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = globalSearchInput.value.trim();
            if (query) {
                UIManager.showToast(`جاري البحث عن "${query}" في ملفات وخطط المعلمين...`, 'info');
                AppRouter.navigateTo('teachers');
                const searchField = document.getElementById('teacherSearchInput');
                if (searchField) {
                    searchField.value = query;
                    UIManager.teacherSearchQuery = query.toLowerCase();
                    UIManager.renderTeachersDirectory();
                }
            }
        }
    });

    // Close Modals on click outside or ESC
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) UIManager.closeAllModals();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') UIManager.closeAllModals();
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            document.getElementById('globalSearchInput')?.focus();
        }
    });
}

/**
 * Setup Role Switcher in Header
 */
function setupRoleSwitcher() {
    const roleSelect = document.getElementById('roleSwitcherSelect');
    roleSelect?.addEventListener('change', (e) => {
        const newRole = e.target.value;
        AppState.setActiveRole(newRole);
        UIManager.updateHeaderRole();

        const roleNames = {
            supervisor: 'المشرف التربوي المقيم',
            teacher: 'المعلم',
            academic_leader: 'الوكيل والمشرف الأكاديمي',
            principal: 'مدير المدرسة',
            admin: 'مسؤول النظام'
        };

        UIManager.showToast(`تم تبديل العرض والصلاحيات إلى: [${roleNames[newRole]}] 🎭`, 'info');
    });
}

/**
 * Setup Forms (Observation Form & Action Form)
 */
function setupForms() {
    // 1. Add Observation Form
    const obsForm = document.getElementById('addObservationForm');
    obsForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const teacherId = parseInt(document.getElementById('obsTeacherSelect')?.value, 10);
        const lessonTopic = document.getElementById('obsLessonTopic')?.value.trim();
        const visitGrade = document.getElementById('obsGradeLevel')?.value.trim();
        const visitDate = document.getElementById('obsVisitDate')?.value;
        const visitPeriod = document.getElementById('obsPeriodSelect')?.value;

        const s1 = parseInt(document.getElementById('obsScorePlanning')?.value, 10) || 0;
        const s2 = parseInt(document.getElementById('obsScoreTeaching')?.value, 10) || 0;
        const s3 = parseInt(document.getElementById('obsScoreClassroom')?.value, 10) || 0;
        const s4 = parseInt(document.getElementById('obsScoreAssessment')?.value, 10) || 0;
        const total = s1 + s2 + s3 + s4;

        const strengths = document.getElementById('obsStrengthsInput')?.value.trim();
        const areasForImprovement = document.getElementById('obsGapsInput')?.value.trim();
        const recommendations = document.getElementById('obsRecsInput')?.value.trim();

        const teacher = AppState.teachers.find(t => t.id === teacherId);
        if (!teacher) {
            UIManager.showToast('يرجى اختيار المعلم', 'error');
            return;
        }

        AppState.addObservation({
            teacherId,
            teacherName: teacher.name,
            subject: teacher.subject,
            branch: teacher.branch,
            grade: visitGrade || 'الصف الثالث الثانوي',
            date: visitDate || new Date().toISOString().split('T')[0],
            period: visitPeriod || 'الحصة الثانية (08:30 ص)',
            lessonTopic,
            planningScore: s1,
            teachingScore: s2,
            classroomScore: s3,
            assessmentScore: s4,
            totalScore: total,
            rating: total >= 90 ? "ممتاز" : (total >= 80 ? "جيد جداً" : "يحتاج دعم ومتابعة"),
            strengths,
            areasForImprovement,
            recommendations,
            onedriveEvidenceUrl: teacher.onedriveFolderUrl
        });

        UIManager.closeAllModals();
        obsForm.reset();
        UIManager.init();

        UIManager.showToast(`تم توثيق واعتماد الزيارة والملاحظة الصفية لـ ${teacher.name} (${total}/100) بنجاح! 💾`, 'success');
    });

    // 2. Add Improvement Action Form
    const actionForm = document.getElementById('addImprovementActionForm');
    actionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const teacherId = parseInt(document.getElementById('actionTeacherSelect')?.value, 10);
        const problemStatement = document.getElementById('actionProblemInput')?.value.trim();
        const actionPlan = document.getElementById('actionPlanInput')?.value.trim();
        const deadline = document.getElementById('actionDeadlineInput')?.value;

        const teacher = AppState.teachers.find(t => t.id === teacherId);
        if (!teacher || !problemStatement || !actionPlan || !deadline) {
            UIManager.showToast('يرجى تعبئة كافة حقول الإجراء التحسيني', 'error');
            return;
        }

        AppState.createImprovementAction({
            teacherId,
            teacherName: teacher.name,
            subject: teacher.subject,
            problemStatement,
            actionPlan,
            deadline,
            onedriveEvidenceLink: teacher.onedriveFolderUrl
        });

        UIManager.closeAllModals();
        actionForm.reset();
        UIManager.init();

        UIManager.showToast(`تم إنشاء الإجراء التحسيني وجدولته للمعلم ${teacher.name} بنجاح! 🎯`, 'success');
    });
}

/**
 * Setup Header Dropdowns & Logout
 */
function setupDropdowns() {
    const notifBtn = document.getElementById('notifToggleBtn');
    const notifMenu = document.getElementById('notifMenu');
    const profileBtn = document.getElementById('profileToggleBtn');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    notifBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu?.classList.remove('show');
        notifMenu?.classList.toggle('show');
    });

    profileBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        notifMenu?.classList.remove('show');
        profileMenu?.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        notifMenu?.classList.remove('show');
        profileMenu?.classList.remove('show');
    });

    logoutBtn?.addEventListener('click', () => {
        if (confirm('هل ترغب بتسجيل الخروج من منظومة مدارس المدينة الأكاديمية؟')) {
            AuthManager.logout();
        }
    });
}

// Global Save & Sync Trigger
function confirmSaveAllState() {
    const btn = document.getElementById('globalSaveSyncBtn');
    const btnText = document.getElementById('globalSaveBtnText');

    if (btn && btnText) {
        btn.classList.add('btn-saving');
        btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
    }

    AppState.saveAll();

    setTimeout(() => {
        if (btn && btnText) {
            btn.classList.remove('btn-saving');
            btn.classList.add('btn-saved');
            btnText.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم الحفظ والمزامنة!';
            setTimeout(() => {
                btn.classList.remove('btn-saved');
                btnText.innerHTML = 'حفظ وتأكيد المتغيرات';
            }, 2500);
        }

        const now = new Date().toLocaleTimeString('ar-SA');
        UIManager.showToast(`تم تأكيد وحفظ كافة متغيرات المنظومة ومزامنتها بنجاح في ${now} 💾`, 'success');
    }, 450);
}
window.confirmSaveAllState = confirmSaveAllState;

// Plan Filters
window.filterWeeklyPlans = (status, btn) => {
    UIManager.planStatusFilter = status;
    document.querySelectorAll('#view-weekly-plans .pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    UIManager.renderWeeklyPlans();
};

// Action Filters
window.filterActions = (status, btn) => {
    UIManager.actionStatusFilter = status;
    document.querySelectorAll('#view-actions .pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    UIManager.renderImprovementActions();
};

// Exposing modal openers globally
window.openAddObservationModal = () => UIManager.openAddObservationModal();
window.openAddActionModal = () => UIManager.openAddActionModal();
window.openAIWeeklySummaryModal = () => UIManager.openAIWeeklySummaryModal();
window.closeAllModals = () => UIManager.closeAllModals();
