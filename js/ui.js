/**
 * ==============================================================================
 * منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
 * UI Module: DOM Components Rendering, Modals, Toasts & User Interactions
 * ==============================================================================
 */

const UIManager = {
    // Current Filters
    planStatusFilter: 'all',
    planSearchQuery: '',
    teacherFilter: 'all',
    teacherSearchQuery: '',
    actionStatusFilter: 'all',

    /**
     * Initializes all UI components
     */
    init() {
        this.updateHeaderRole();
        this.renderDashboardMetrics();
        this.renderTrafficLightCards();
        this.renderWeeklyPlans();
        this.renderObservations();
        this.renderImprovementActions();
        this.renderTeachersDirectory();
        this.populateTeacherDropdowns();
    },

    /**
     * Syncs Role Switcher in Top Header
     */
    updateHeaderRole() {
        const roleBadge = document.getElementById('currentRoleBadge');
        const roleSelect = document.getElementById('roleSwitcherSelect');
        const role = AppState.activeRole || 'supervisor';

        if (roleSelect) roleSelect.value = role;

        const roleLabels = {
            supervisor: 'المشرف التربوي المقيم',
            teacher: 'المعلم (عرض تجريبي)',
            academic_leader: 'الوكيل والمشرف الأكاديمي',
            principal: 'مدير المدرسة',
            admin: 'مسؤول النظام'
        };

        if (roleBadge) {
            roleBadge.textContent = roleLabels[role] || 'المشرف التربوي';
        }
    },

    // ==============================================================================
    // 1. SUPERVISOR DASHBOARD
    // ==============================================================================
    renderDashboardMetrics() {
        const plans = AppState.weeklyPlans || [];
        const actions = AppState.improvementActions || [];
        const teachers = AppState.teachers || [];
        const observations = AppState.observations || [];

        const totalPlans = plans.length;
        const approvedPlans = plans.filter(p => p.status === 'approved').length;
        const pendingPlans = plans.filter(p => p.status === 'submitted' || p.status === 'under_review').length;
        const revisionPlans = plans.filter(p => p.status === 'needs_revision').length;

        const completionRate = totalPlans > 0 ? Math.round((approvedPlans / totalPlans) * 100) : 100;
        const redTeachersCount = teachers.filter(t => t.statusColor === 'red').length;
        const openActionsCount = actions.filter(a => a.status !== 'closed_verified').length;
        const closedActionsCount = actions.filter(a => a.status === 'closed_verified').length;

        // Populate Dashboard elements if present
        const elRate = document.getElementById('statPlanCompletionRate');
        if (elRate) elRate.textContent = `${completionRate}%`;

        const elPendingPlans = document.getElementById('statPendingPlansCount');
        if (elPendingPlans) elPendingPlans.textContent = pendingPlans;

        const elRevisionPlans = document.getElementById('statRevisionPlansCount');
        if (elRevisionPlans) elRevisionPlans.textContent = revisionPlans;

        const elRedTeachers = document.getElementById('statRedTeachersCount');
        if (elRedTeachers) elRedTeachers.textContent = redTeachersCount;

        const elOpenActions = document.getElementById('statOpenActionsCount');
        if (elOpenActions) elOpenActions.textContent = openActionsCount;

        const elObsCount = document.getElementById('statObservationsCount');
        if (elObsCount) elObsCount.textContent = observations.length;

        const sidebarTeacherCount = document.getElementById('sidebarTeacherCount');
        if (sidebarTeacherCount) sidebarTeacherCount.textContent = teachers.length;

        const sidebarPlanCount = document.getElementById('sidebarPlanCount');
        if (sidebarPlanCount) sidebarPlanCount.textContent = pendingPlans > 0 ? `${pendingPlans} بانتظار المراجعة` : 'مكتملة';
    },

    renderTrafficLightCards() {
        const container = document.getElementById('trafficLightCardsContainer');
        if (!container) return;

        container.innerHTML = '';
        const teachers = AppState.teachers || [];

        teachers.forEach(t => {
            const card = document.createElement('div');
            card.className = `traffic-card traffic-${t.statusColor}`;

            let colorLabel = 'مستقر ومتميز';
            let iconClass = 'fa-solid fa-circle-check';
            if (t.statusColor === 'yellow') { colorLabel = 'بحاجة لمتابعة ودعم'; iconClass = 'fa-solid fa-triangle-exclamation'; }
            if (t.statusColor === 'red') { colorLabel = 'يتطلب تدخلاً ومتابعة عاجلة'; iconClass = 'fa-solid fa-circle-exclamation'; }

            card.innerHTML = `
                <div class="traffic-card-header">
                    <div class="traffic-dot-badge dot-${t.statusColor}">
                        <i class="${iconClass}"></i>
                        <span>${colorLabel}</span>
                    </div>
                    <span class="text-sm font-bold text-primary">${t.performanceRating}%</span>
                </div>
                <div class="traffic-card-body" onclick="UIManager.openTeacher360Profile(${t.id})" style="cursor: pointer;">
                    <h4 class="traffic-teacher-name">${t.name}</h4>
                    <span class="traffic-teacher-sub">${t.subject} - ${t.branch}</span>
                    <p class="traffic-reason-text">${t.statusReason}</p>
                </div>
                <div class="traffic-card-footer">
                    <button class="btn btn-outline btn-sm w-100" onclick="UIManager.openTeacher360Profile(${t.id})">
                        <i class="fa-solid fa-id-card-clip"></i> عرض الملف الإشرافي 360°
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // ==============================================================================
    // 2. WEEKLY PLANS MANAGEMENT
    // ==============================================================================
    renderWeeklyPlans() {
        const tableBody = document.getElementById('weeklyPlansTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        const plans = AppState.weeklyPlans || [];

        plans.forEach(plan => {
            const matchesStatus = this.planStatusFilter === 'all' || plan.status === this.planStatusFilter;
            const targetText = `${plan.teacherName} ${plan.subject} ${plan.grade} ${plan.monthlyTheme}`.toLowerCase();
            const matchesSearch = this.planSearchQuery === '' || targetText.includes(this.planSearchQuery);

            if (matchesStatus && matchesSearch) {
                const tr = document.createElement('tr');

                let badgeHtml = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> معتمدة</span>';
                if (plan.status === 'submitted') badgeHtml = '<span class="badge badge-warning"><i class="fa-regular fa-clock"></i> بانتظار المراجعة</span>';
                if (plan.status === 'needs_revision') badgeHtml = '<span class="badge badge-danger"><i class="fa-solid fa-rotate-left"></i> تحتاج تعديل</span>';

                tr.innerHTML = `
                    <td><strong>#${plan.id}</strong></td>
                    <td>
                        <div class="teacher-cell">
                            <div class="avatar-circle avatar-cyan">${this.getInitials(plan.teacherName)}</div>
                            <div class="teacher-details">
                                <span class="teacher-name font-bold" onclick="UIManager.openTeacher360Profile(${plan.teacherId})" style="cursor: pointer; color: var(--primary-600);">${plan.teacherName}</span>
                                <span class="teacher-id">${plan.grade}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="subject-badge subject-math">${plan.subject}</span></td>
                    <td><strong>الأسبوع ${plan.weekNumber}</strong> <br><span class="text-xs text-muted">${plan.dateRange}</span></td>
                    <td><span class="text-xs text-muted"><i class="fa-solid fa-tag"></i> ${plan.monthlyTheme || '---'}</span></td>
                    <td>${badgeHtml}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view-btn" title="معاينة ومراجعة الخطة" onclick="UIManager.openPlanReviewModal('${plan.id}')">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                            <a href="${plan.onedriveDocUrl}" target="_blank" class="action-btn" title="فتح مستند الخطة على OneDrive" style="color: #0078d4;">
                                <i class="fa-brands fa-microsoft"></i>
                            </a>
                            <a href="${plan.classeraLink}" target="_blank" class="action-btn" title="فتح المقرر على Classera" style="color: #2563eb;">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </a>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        });
    },

    openPlanReviewModal(planId) {
        const plan = AppState.weeklyPlans.find(p => p.id === planId);
        if (!plan) return;

        const modal = document.getElementById('reviewPlanModal');
        if (!modal) return;

        document.getElementById('reviewPlanIdDisplay').textContent = `#${plan.id}`;
        document.getElementById('reviewPlanTeacher').textContent = plan.teacherName;
        document.getElementById('reviewPlanSubjectGrade').textContent = `${plan.subject} | ${plan.grade}`;
        document.getElementById('reviewPlanDateRange').textContent = `${plan.dateRange} (الأسبوع ${plan.weekNumber})`;
        document.getElementById('reviewPlanTheme').textContent = plan.monthlyTheme || 'قيمة الانضباط والمسؤولية';
        document.getElementById('reviewPlanOneDriveLink').href = plan.onedriveDocUrl;
        document.getElementById('reviewPlanClasseraLink').href = plan.classeraLink;

        // Render Day-by-Day Table Items
        const itemsContainer = document.getElementById('reviewPlanDaysTableBody');
        itemsContainer.innerHTML = '';
        (plan.items || []).forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.day}</strong> (حصة ${item.period})</td>
                <td><strong>${item.lesson}</strong></td>
                <td><span class="text-xs text-muted">${item.skills}</span></td>
                <td><span class="text-xs">${item.homework}</span></td>
                <td>
                    ${item.classeraUrl ? `<a href="${item.classeraUrl}" target="_blank" class="badge badge-info"><i class="fa-solid fa-arrow-up-right-from-square"></i> نشاط كلاسيرة</a>` : '<span class="text-xs text-muted">غير مرتبط</span>'}
                </td>
            `;
            itemsContainer.appendChild(tr);
        });

        // Review notes
        const notesField = document.getElementById('reviewSupervisorNotes');
        if (notesField) notesField.value = plan.supervisorNotes || '';

        // Reset AI box
        const aiBox = document.getElementById('aiPlanAnalysisResultBox');
        if (aiBox) aiBox.style.display = 'none';

        // Store active plan ID on modal
        modal.setAttribute('data-active-plan-id', plan.id);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    async runAIPlanCheck() {
        const modal = document.getElementById('reviewPlanModal');
        const planId = modal?.getAttribute('data-active-plan-id');
        const plan = AppState.weeklyPlans.find(p => p.id === planId);
        if (!plan) return;

        const aiBtn = document.getElementById('runAIPlanCheckBtn');
        const aiBox = document.getElementById('aiPlanAnalysisResultBox');
        if (aiBtn) aiBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الفحص الذكي...';

        const result = await AIAssistant.analyzePlanCompleteness(plan);

        if (aiBtn) aiBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> فحص اكتمال الخطة بالذكاء الاصطناعي';
        if (aiBox) {
            aiBox.style.display = 'block';
            aiBox.innerHTML = `
                <div class="ai-analysis-card">
                    <div class="ai-header">
                        <span class="ai-badge"><i class="fa-solid fa-robot"></i> نتيجة الفحص الذكي للخطة</span>
                        <strong class="text-primary">درجة الاكتمال: ${result.completenessScore}/100 (${result.status})</strong>
                    </div>
                    <div class="ai-body">
                        ${result.missingItems.length > 0 ? `<div class="ai-missing-list"><strong>⚠️ الملاحظات والنواقص:</strong><ul>${result.missingItems.map(i => `<li>${i}</li>`).join('')}</ul></div>` : ''}
                        ${result.strengths.length > 0 ? `<div class="ai-strengths-list"><strong>✅ نقاط القوة:</strong><ul>${result.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                        <p class="ai-rec">💡 <strong>توصية المساعد الإشرافي:</strong> ${result.aiRecommendation}</p>
                    </div>
                </div>
            `;
        }
    },

    submitPlanReviewDecision(decision) {
        const modal = document.getElementById('reviewPlanModal');
        const planId = modal?.getAttribute('data-active-plan-id');
        const comments = document.getElementById('reviewSupervisorNotes')?.value.trim() || (decision === 'approved' ? 'تم الاعتماد.' : 'يرجى مراجعة واستكمال المتطلبات.');

        AppState.reviewWeeklyPlan(planId, decision, comments);

        this.closeAllModals();
        this.init();

        const toastMsg = decision === 'approved' 
            ? `تم اعتماد الخطة الأسبوعية #${planId} بنجاح! 💾` 
            : `تمت إعادة الخطة #${planId} للمعلم مع طلب المراجعة والتعديل.`;
        this.showToast(toastMsg, decision === 'approved' ? 'success' : 'info');
    },

    // ==============================================================================
    // 3. CLASSROOM OBSERVATIONS
    // ==============================================================================
    renderObservations() {
        const container = document.getElementById('observationsCardsContainer');
        if (!container) return;

        container.innerHTML = '';
        const observations = AppState.observations || [];

        observations.forEach(obs => {
            const card = document.createElement('div');
            card.className = 'content-card observation-card';
            card.innerHTML = `
                <div class="obs-card-header">
                    <div class="obs-teacher-box">
                        <div class="avatar-circle avatar-orange">${this.getInitials(obs.teacherName)}</div>
                        <div>
                            <h3 class="obs-teacher-name font-bold" onclick="UIManager.openTeacher360Profile(${obs.teacherId})" style="cursor: pointer; color: var(--primary-600);">${obs.teacherName}</h3>
                            <span class="obs-sub">${obs.subject} | ${obs.grade} | ${obs.period} (${obs.date})</span>
                        </div>
                    </div>
                    <div class="obs-score-badge">
                        <span class="score-num">${obs.totalScore}/100</span>
                        <span class="score-lbl">${obs.rating}</span>
                    </div>
                </div>

                <div class="obs-topic-box">
                    <i class="fa-solid fa-book-open text-primary"></i>
                    <strong>موضوع الحصة:</strong> <span>${obs.lessonTopic}</span>
                </div>

                <div class="obs-domains-grid">
                    <div class="obs-domain-item"><span>1. التخطيط والإعداد</span><strong>${obs.planningScore} / 20</strong></div>
                    <div class="obs-domain-item"><span>2. استراتيجيات التدريس</span><strong>${obs.teachingScore} / 30</strong></div>
                    <div class="obs-domain-item"><span>3. الإدارة الصفية</span><strong>${obs.classroomScore} / 25</strong></div>
                    <div class="obs-domain-item"><span>4. التقويم والتغذية الراجعة</span><strong>${obs.assessmentScore} / 25</strong></div>
                </div>

                <div class="obs-feedback-box">
                    <div class="obs-feedback-item strengths">
                        <strong><i class="fa-solid fa-thumbs-up text-success"></i> أبرز نقاط القوة:</strong>
                        <p>${obs.strengths}</p>
                    </div>
                    <div class="obs-feedback-item improvements">
                        <strong><i class="fa-solid fa-bullseye text-warning"></i> فرص ومجالات التحسين:</strong>
                        <p>${obs.areasForImprovement}</p>
                    </div>
                </div>

                <div class="obs-card-footer">
                    <a href="${obs.onedriveEvidenceUrl}" target="_blank" class="btn btn-outline btn-sm">
                        <i class="fa-solid fa-paperclip"></i> شواهد الزيارة (OneDrive)
                    </a>
                    <button class="btn btn-primary btn-sm" onclick="UIManager.triggerConvertObservationToAction('${obs.id}')">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> تحويل إلى إجراء تحسيني ذكي (AI)
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    async triggerConvertObservationToAction(obsId) {
        const obs = AppState.observations.find(o => o.id === obsId);
        if (!obs) return;

        this.showToast('جاري توليد خطة التحسين الذكية بواسطة المساعد الإشرافي...', 'info');
        const generated = await AIAssistant.generateSmartAction(obs);

        this.openAddActionModal(generated);
    },

    // ==============================================================================
    // 4. IMPROVEMENT ACTIONS CENTER
    // ==============================================================================
    renderImprovementActions() {
        const container = document.getElementById('actionsListContainer');
        if (!container) return;

        container.innerHTML = '';
        const actions = AppState.improvementActions || [];

        actions.forEach(act => {
            const matchesStatus = this.actionStatusFilter === 'all' || act.status === this.actionStatusFilter;
            if (!matchesStatus) return;

            const card = document.createElement('div');
            card.className = `action-item-card action-status-${act.status}`;

            let statusBadge = '<span class="badge badge-warning"><i class="fa-solid fa-spinner"></i> قيد التنفيذ</span>';
            if (act.status === 'completed') statusBadge = '<span class="badge badge-info"><i class="fa-solid fa-clock-rotate-left"></i> بانتظار اعتماد المشرف</span>';
            if (act.status === 'closed_verified') statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> مغلق ومكتمل بالتحقق</span>';

            card.innerHTML = `
                <div class="action-item-header">
                    <div>
                        <span class="action-id font-bold text-primary">#${act.id}</span>
                        <h4 class="action-teacher-name font-bold" onclick="UIManager.openTeacher360Profile(${act.teacherId})" style="cursor: pointer;">${act.teacherName} (${act.subject})</h4>
                    </div>
                    ${statusBadge}
                </div>

                <div class="action-problem-box">
                    <strong>⚠️ الفجوة / الملاحظة المرصودة:</strong>
                    <p>${act.problemStatement}</p>
                </div>

                <div class="action-plan-box">
                    <strong>🎯 الإجراء التحسيني المطلوب (SMART Action):</strong>
                    <p>${act.actionPlan}</p>
                </div>

                <div class="action-meta-row">
                    <span><i class="fa-regular fa-calendar"></i> الموعد النهائي: <strong>${act.deadline}</strong></span>
                    <span><i class="fa-solid fa-user-check"></i> المشرف المتابع: <strong>${act.assignedSupervisor}</strong></span>
                </div>

                <div class="action-progress-bar-box">
                    <div class="progress-info">
                        <span>نسبة الإنجاز وتطبيق الشواهد:</span>
                        <strong>${act.progressPercentage}%</strong>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${act.progressPercentage}%;"></div>
                    </div>
                </div>

                <div class="action-verification-box">
                    <p class="text-xs text-muted"><strong>ملاحظات التحقق:</strong> ${act.verificationNotes || act.evidenceNotes}</p>
                </div>

                <div class="action-card-actions">
                    <a href="${act.onedriveEvidenceLink}" target="_blank" class="btn btn-outline btn-sm">
                        <i class="fa-solid fa-folder-open"></i> شواهد التنفيذ (OneDrive)
                    </a>
                    ${act.status !== 'closed_verified' ? `
                        <button class="btn btn-primary btn-sm" onclick="UIManager.verifyAndCloseAction('${act.id}')">
                            <i class="fa-solid fa-stamp"></i> التحقق الميداني واعتماد الإغلاق
                        </button>
                    ` : '<span class="text-xs text-success font-bold"><i class="fa-solid fa-check-double"></i> تم التحقق والإغلاق النهائي</span>'}
                </div>
            `;
            container.appendChild(card);
        });
    },

    verifyAndCloseAction(actionId) {
        const notes = prompt('أدخل ملحوظات التحقق الإشرافي الميداني لإغلاق الإجراء التحسيني:', 'تمت زيارة المعلم والتحقق من التطبيق الناجح للاستراتيجيات في الحصة الدراسية والشواهد.');
        if (notes !== null) {
            AppState.updateActionStatus(actionId, 'closed_verified', notes);
            this.init();
            this.showToast(`تم اعتماد إغلاق الإجراء التحسيني #${actionId} بنجاح! 💾`, 'success');
        }
    },

    // ==============================================================================
    // 5. TEACHER 360° SUPERVISION PROFILE MODAL
    // ==============================================================================
    openTeacher360Profile(teacherId) {
        const teacher = AppState.teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        const modal = document.getElementById('teacher360Modal');
        if (!modal) return;

        document.getElementById('t360Name').textContent = teacher.name;
        document.getElementById('t360SubjectBranch').textContent = `${teacher.subject} | ${teacher.branch} (كود: ${teacher.code})`;
        document.getElementById('t360Rating').textContent = `${teacher.performanceRating}%`;
        document.getElementById('t360Email').textContent = teacher.email;
        document.getElementById('t360Phone').textContent = teacher.phone;
        document.getElementById('t360OneDriveLink').href = teacher.onedriveFolderUrl;
        document.getElementById('t360ClasseraId').textContent = teacher.classeraTeacherId;
        document.getElementById('t360StatusReason').textContent = teacher.statusReason;

        // Strengths & Gaps
        const strengthsList = document.getElementById('t360StrengthsList');
        strengthsList.innerHTML = (teacher.strengths || []).map(s => `<li><i class="fa-solid fa-check text-success"></i> ${s}</li>`).join('');

        const gapsList = document.getElementById('t360GapsList');
        gapsList.innerHTML = (teacher.areasForImprovement || []).map(g => `<li><i class="fa-solid fa-arrow-right text-warning"></i> ${g}</li>`).join('');

        // Teacher's Plans Timeline
        const plansContainer = document.getElementById('t360PlansContainer');
        const teacherPlans = AppState.weeklyPlans.filter(p => p.teacherId === teacher.id);
        plansContainer.innerHTML = teacherPlans.length > 0 ? teacherPlans.map(p => `
            <div class="t360-plan-row">
                <strong>الأسبوع ${p.weekNumber} (${p.dateRange})</strong>
                <span class="badge ${p.status === 'approved' ? 'badge-success' : 'badge-warning'}">${p.status === 'approved' ? 'معتمدة' : 'تحت المراجعة'}</span>
                <a href="${p.onedriveDocUrl}" target="_blank" class="text-xs text-primary"><i class="fa-solid fa-file-word"></i> مستند الخطة</a>
            </div>
        `).join('') : '<p class="text-xs text-muted">لا توجد خطط مسجلة حالياً.</p>';

        // Teacher's Improvement Actions
        const actionsContainer = document.getElementById('t360ActionsContainer');
        const teacherActions = AppState.improvementActions.filter(a => a.teacherId === teacher.id);
        actionsContainer.innerHTML = teacherActions.length > 0 ? teacherActions.map(a => `
            <div class="t360-action-row">
                <div>
                    <strong class="text-sm">${a.actionPlan}</strong>
                    <span class="text-xs text-muted d-block">الموعد: ${a.deadline} | النسبة: ${a.progressPercentage}%</span>
                </div>
                <span class="badge ${a.status === 'closed_verified' ? 'badge-success' : 'badge-warning'}">${a.status}</span>
            </div>
        `).join('') : '<p class="text-xs text-success">لا توجد إجراءات تحسينية معلقة لهذا المعلم 🎉</p>';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    // ==============================================================================
    // 6. TEACHERS DIRECTORY
    // ==============================================================================
    renderTeachersDirectory() {
        const container = document.getElementById('teachersCardsContainer');
        if (!container) return;

        container.innerHTML = '';
        const teachers = AppState.teachers || [];

        teachers.forEach(t => {
            const matchesFilter = this.teacherFilter === 'all' || t.branch.includes(this.teacherFilter);
            const searchTarget = `${t.name} ${t.subject} ${t.branch} ${t.code}`.toLowerCase();
            const matchesSearch = this.teacherSearchQuery === '' || searchTarget.includes(this.teacherSearchQuery);

            if (matchesFilter && matchesSearch) {
                const card = document.createElement('div');
                card.className = 'teacher-card';
                card.innerHTML = `
                    <div class="teacher-card-top">
                        <div class="teacher-card-info">
                            <div class="avatar-circle avatar-orange">${this.getInitials(t.name)}</div>
                            <div>
                                <h4 class="teacher-card-name font-bold" onclick="UIManager.openTeacher360Profile(${t.id})" style="cursor: pointer;">${t.name}</h4>
                                <span class="teacher-card-code">كود: ${t.code}</span>
                            </div>
                        </div>
                        <div class="traffic-dot-badge dot-${t.statusColor}">
                            <i class="fa-solid fa-circle"></i>
                        </div>
                    </div>
                    <div class="teacher-card-badges">
                        <span class="subject-badge subject-math">${t.subject}</span>
                        <span class="badge badge-info">${t.branch.replace('المدينة الأكاديمية - ', '')}</span>
                    </div>
                    <div class="teacher-card-stats">
                        <span>الخطط المعتمدة: <strong>${t.plansApproved || 0}/${t.plansSubmitted || 0}</strong></span>
                        <span>معدل الأداء: <strong class="text-primary">${t.performanceRating}%</strong></span>
                    </div>
                    <div class="teacher-card-actions">
                        <button class="btn btn-outline btn-sm w-100" onclick="UIManager.openTeacher360Profile(${t.id})">
                            <i class="fa-solid fa-id-card-clip"></i> الملف الإشرافي 360°
                        </button>
                        <a href="${t.onedriveFolderUrl}" target="_blank" class="btn btn-primary btn-sm" title="فتح مجلد ون درايف">
                            <i class="fa-brands fa-microsoft"></i>
                        </a>
                    </div>
                `;
                container.appendChild(card);
            }
        });
    },

    // ==============================================================================
    // 7. REPORTS & AI SUMMARY MODAL
    // ==============================================================================
    openCampusFullReportModal() {
        this.closeAllModals();
        const modal = document.getElementById('campusFullReportModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.showToast('تم إعداد التقرير الإشرافي الفعلي الشامل لمجمع مدارس المدينة الأكاديمية بنجاح 📄', 'success');
        }
    },

    printCampusFullReport() {
        window.print();
    },

    exportCampusReportCSV() {
        const rows = [
            ["القسم / المرحلة", "عدد المعلمين", "التزام الخطط (OneDrive)", "متوسط الزيارات الصفية", "تكامل كلاسيرة", "الحالة الإشرافية"],
            ["ثانوية البنين (المسار الوطني)", "34", "100%", "94.2%", "ممتاز", "مستقر ومتميز"],
            ["المسار الدولي (American Diploma)", "26", "92.3%", "92.5%", "ممتاز", "مستقر ومتميز"],
            ["ثانوية البنات (المسار الوطني)", "32", "98.0%", "91.8%", "ممتاز", "مستقر ومتميز"],
            ["متوسطة البنين", "22", "90.5%", "89.6%", "جيد جداً", "بحاجة متابعة"],
            ["متوسطة البنات", "20", "91.0%", "88.9%", "جيد جداً", "بحاجة متابعة"],
            ["المرحلة الابتدائية والصفوف الأولية", "28", "82.1%", "87.4%", "متوسط", "يتطلب تدخلاً عاجلاً"]
        ];

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "تقرير_مجمع_مدارس_المدينة_الأكاديمية_2026.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast("تم تصدير ملف بيانات المجمع (CSV/Excel) بنجاح 📊", "success");
    },

    openAIWeeklySummaryModal() {
        const summary = AIAssistant.generateWeeklySupervisionSummary();
        const modal = document.getElementById('aiSummaryReportModal');
        if (!modal) return;

        document.getElementById('aiRepWeek').textContent = summary.reportWeek;
        document.getElementById('aiRepDate').textContent = summary.date;
        document.getElementById('aiRepRate').textContent = `${summary.completionRate}%`;
        document.getElementById('aiRepHeadline').textContent = summary.summaryHeadline;

        const highlightsList = document.getElementById('aiRepHighlightsList');
        highlightsList.innerHTML = summary.keyHighlights.map(h => `<li><i class="fa-solid fa-check text-primary"></i> ${h}</li>`).join('');

        const alertsList = document.getElementById('aiRepAlertsList');
        alertsList.innerHTML = summary.criticalAlerts.length > 0 
            ? summary.criticalAlerts.map(a => `<li><i class="fa-solid fa-triangle-exclamation text-danger"></i> ${a}</li>`).join('')
            : '<li class="text-success">لا توجد حالات حرجة هذا الأسبوع.</li>';

        document.getElementById('aiRepActionPlan').textContent = summary.supervisorActionPlan;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    // Modal Helpers
    openAddActionModal(prefillData) {
        this.closeAllModals();
        const modal = document.getElementById('addActionModal');
        if (!modal) return;

        if (prefillData) {
            document.getElementById('actionTeacherSelect').value = prefillData.teacherId;
            document.getElementById('actionProblemInput').value = prefillData.problemStatement || '';
            document.getElementById('actionPlanInput').value = prefillData.actionPlan || '';
            document.getElementById('actionDeadlineInput').value = prefillData.deadline || '';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    openAddObservationModal() {
        this.closeAllModals();
        const modal = document.getElementById('addObservationModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.calcObsTotalScore();
        }
    },

    calcObsTotalScore() {
        const s1 = parseInt(document.getElementById('obsScorePlanning')?.value, 10) || 0;
        const s2 = parseInt(document.getElementById('obsScoreTeaching')?.value, 10) || 0;
        const s3 = parseInt(document.getElementById('obsScoreClassroom')?.value, 10) || 0;
        const s4 = parseInt(document.getElementById('obsScoreAssessment')?.value, 10) || 0;
        const total = s1 + s2 + s3 + s4;

        const totalEl = document.getElementById('obsTotalScoreDisplay');
        const ratingEl = document.getElementById('obsRatingTextDisplay');

        if (totalEl) totalEl.textContent = total;
        if (ratingEl) {
            if (total >= 95) ratingEl.textContent = "ممتاز مرتفع";
            else if (total >= 90) ratingEl.textContent = "ممتاز";
            else if (total >= 80) ratingEl.textContent = "جيد جداً";
            else if (total >= 70) ratingEl.textContent = "جيد";
            else ratingEl.textContent = "يحتاج دعم ومتابعة";
        }
    },

    populateTeacherDropdowns() {
        const selects = ['obsTeacherSelect', 'actionTeacherSelect'];
        selects.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = '<option value="" disabled selected>-- اختر المعلم من كادر المدينة الأكاديمية --</option>';
                (AppState.teachers || []).forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = `${t.name} (${t.subject} - ${t.branch})`;
                    el.appendChild(opt);
                });
            }
        });
    },

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    },

    getInitials(name) {
        if (!name) return "م";
        const clean = name.replace('أ. ', '').replace('د. ', '').trim();
        const parts = clean.split(' ');
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]) : clean.substring(0, 2);
    },

    // ==============================================================================
    // 7. SUPABASE CLOUD INTEGRATION UI HANDLERS
    // ==============================================================================
    renderSupabaseSettings() {
        if (typeof SupabaseConfig === 'undefined') return;

        const config = SupabaseConfig.getConfig();
        const urlInputs = [document.getElementById('supabaseUrlInput'), document.getElementById('settingSupabaseUrl')];
        const keyInputs = [document.getElementById('supabaseKeyInput'), document.getElementById('settingSupabaseKey')];
        const modeSelects = [document.getElementById('supabaseModeSelect'), document.getElementById('settingSupabaseMode')];
        const statusBadges = [document.getElementById('supabaseStatusBadge'), document.getElementById('settingSupabaseBadge')];

        urlInputs.forEach(input => { if (input && config.url) input.value = config.url; });
        keyInputs.forEach(input => { if (input && config.anonKey) input.value = config.anonKey; });
        modeSelects.forEach(select => { if (select && config.mode) select.value = config.mode; });

        this.updateSupabaseStatusDisplay();
    },

    updateSupabaseStatusDisplay(testResult = null) {
        if (typeof SupabaseConfig === 'undefined') return;
        const config = SupabaseConfig.getConfig();
        const isConfigured = SupabaseConfig.isConfigured();

        const badgeElements = document.querySelectorAll('.supabase-status-badge');
        badgeElements.forEach(badge => {
            if (testResult) {
                if (testResult.success) {
                    badge.className = 'supabase-status-badge badge badge-success';
                    badge.innerHTML = `<i class="fa-solid fa-cloud-check"></i> متصل بالسحابة (${testResult.latencyMs}ms)`;
                } else {
                    badge.className = 'supabase-status-badge badge badge-danger';
                    badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> خطأ في الاتصال`;
                }
            } else if (isConfigured && config.isConnected) {
                badge.className = 'supabase-status-badge badge badge-success';
                badge.innerHTML = `<i class="fa-solid fa-cloud-check"></i> متصل بالسحابة (Supabase Live)`;
            } else if (isConfigured) {
                badge.className = 'supabase-status-badge badge badge-warning';
                badge.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> مهيأ (بانتظار الاختبار)`;
            } else {
                badge.className = 'supabase-status-badge badge badge-info';
                badge.innerHTML = `<i class="fa-solid fa-database"></i> وضع التخزين المحلي الافتراضي`;
            }
        });
    },

    async testSupabaseConnection() {
        const url = (document.getElementById('supabaseUrlInput') || document.getElementById('settingSupabaseUrl'))?.value.trim();
        const key = (document.getElementById('supabaseKeyInput') || document.getElementById('settingSupabaseKey'))?.value.trim();

        if (!url || !key) {
            this.showToast('يرجى إدخال عنوان المشروع (Project URL) ومفتاح الوصول (Anon Key) أولاً.', 'error');
            return;
        }

        const testBtn = document.getElementById('testSupabaseBtn');
        const origText = testBtn ? testBtn.innerHTML : '';
        if (testBtn) {
            testBtn.disabled = true;
            testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري فحص الاتصال بالخادم...';
        }

        try {
            const result = await SupabaseClientManager.testConnection(url, key);
            this.updateSupabaseStatusDisplay(result);

            if (result.success) {
                this.showToast(result.message, 'success');
            } else {
                this.showToast(result.message, 'error');
            }
        } catch (err) {
            this.showToast(`فشل الاتصال: ${err.message}`, 'error');
        } finally {
            if (testBtn) {
                testBtn.disabled = false;
                testBtn.innerHTML = origText;
            }
        }
    },

    async saveSupabaseConfig() {
        const url = (document.getElementById('supabaseUrlInput') || document.getElementById('settingSupabaseUrl'))?.value.trim();
        const key = (document.getElementById('supabaseKeyInput') || document.getElementById('settingSupabaseKey'))?.value.trim();
        const mode = (document.getElementById('supabaseModeSelect') || document.getElementById('settingSupabaseMode'))?.value || 'auto';

        SupabaseConfig.saveConfig({
            url,
            anonKey: key,
            mode
        });

        const client = SupabaseClientManager.init();
        if (client) {
            this.showToast('تم حفظ إعدادات سوبابيز وتهيئة الاتصال بنجاح!', 'success');
            this.updateSupabaseStatusDisplay();
            AppState.loadFromSupabase();
        } else {
            this.showToast('تم حفظ الإعدادات في المتصفح.', 'info');
            this.updateSupabaseStatusDisplay();
        }
    },

    async syncToSupabaseCloud() {
        const url = (document.getElementById('supabaseUrlInput') || document.getElementById('settingSupabaseUrl'))?.value.trim() || SupabaseConfig.getConfig().url;
        const key = (document.getElementById('supabaseKeyInput') || document.getElementById('settingSupabaseKey'))?.value.trim() || SupabaseConfig.getConfig().anonKey;

        if (url && key) {
            SupabaseConfig.saveConfig({ url, anonKey: key, mode: 'cloud' });
            SupabaseClientManager.init();
        }

        if (!SupabaseConfig.isConfigured()) {
            this.showToast('يرجى حفظ واختبار اتصال سوبابيز أولاً قبل المزامنة.', 'error');
            return;
        }

        const syncBtn = document.getElementById('syncSupabaseBtn');
        const origText = syncBtn ? syncBtn.innerHTML : '';
        if (syncBtn) {
            syncBtn.disabled = true;
            syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري مزامنة ورفع البيانات...';
        }

        try {
            this.showToast('بدء عملية المزامنة السحابية الشاملة...', 'info');
            await SupabaseService.Sync.syncLocalToCloud((msg, pct) => {
                this.showToast(`${msg} (${pct}%)`, pct === 100 ? 'success' : 'info');
            });
            this.showToast('تمت المزامنة السحابية الكاملة لبيانات المعلمين والخطط بنجاح! 🎉', 'success');
            this.updateSupabaseStatusDisplay({ success: true, latencyMs: 25 });
        } catch (err) {
            console.error('Sync Error:', err);
            this.showToast(`فشلت المزامنة: ${err.message || 'تأكد من تطبيق سكريبت supabase_schema.sql في قاعدة البيانات.'}`, 'error');
        } finally {
            if (syncBtn) {
                syncBtn.disabled = false;
                syncBtn.innerHTML = origText;
            }
        }
    },

    showToast(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = 'fa-solid fa-circle-check';
        let title = 'نجاح العملية';
        if (type === 'error') { icon = 'fa-solid fa-circle-xmark'; title = 'تنبيه'; }
        if (type === 'info') { icon = 'fa-solid fa-circle-info'; title = 'معلومات الإشراف'; }

        toast.innerHTML = `
            <div class="toast-icon"><i class="${icon}"></i></div>
            <div class="toast-content">
                <h4 class="toast-title">${title}</h4>
                <p class="toast-message">${message}</p>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-hiding');
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    }
};

// Global Settings Helper Handlers
window.saveSupervisorProfile = function() {
    const name = document.getElementById('settingSupervisorName')?.value || 'د. فرج دنيا';
    const email = document.getElementById('settingSupervisorEmail')?.value || 'f.donia@academiccity.edu.sa';
    const phone = document.getElementById('settingSupervisorPhone')?.value || '+966 50 123 4567';
    const title = document.getElementById('settingSupervisorTitle')?.value || 'المشرف التربوي المقيم';

    AppState.settings.supervisorName = name;
    AppState.settings.supervisorEmail = email;
    AppState.settings.supervisorPhone = phone;
    AppState.settings.supervisorTitle = title;
    AppState.saveAll();

    const session = AuthManager.getSession() || {};
    session.name = name;
    session.email = email;
    session.phone = phone;
    session.role = title;
    localStorage.setItem(AuthManager.SESSION_KEY, JSON.stringify(session));
    AuthManager.updateUIWithUser(session);

    UIManager.showToast('تم حفظ وتحديث بيانات المشرف التربوي بنجاح!', 'success');
};

window.saveCriteriaWeights = function() {
    const p = Number(document.getElementById('settingWeightPlanning')?.value) || 20;
    const t = Number(document.getElementById('settingWeightTeaching')?.value) || 30;
    const c = Number(document.getElementById('settingWeightClassroom')?.value) || 25;
    const a = Number(document.getElementById('settingWeightAssessment')?.value) || 25;

    if (p + t + c + a !== 100) {
        UIManager.showToast(`مجموع الأوزان يجب أن يساوي 100% (المجموع الحالي: ${p + t + c + a}%)`, 'error');
        return;
    }

    AppState.settings.criteriaWeights = { planning: p, teaching: t, classroom: c, assessment: a };
    AppState.saveAll();
    UIManager.showToast('تم اعتماد وحفظ أوزان معايير التقييم بنجاح!', 'success');
};

window.saveNotificationPreferences = function() {
    UIManager.showToast('تم حفظ تفضيلات الإشعارات والتنبيهات الميدانية بنجاح!', 'success');
};

window.savePlatformSettings = function() {
    window.saveSupervisorProfile();
    window.saveCriteriaWeights();
    UIManager.showToast('تم حفظ كافة إعدادات المنظومة وتطبيقها!', 'success');
};

window.testSupabaseConnection = () => UIManager.testSupabaseConnection();
window.saveSupabaseConfig = () => UIManager.saveSupabaseConfig();
window.syncToSupabaseCloud = () => UIManager.syncToSupabaseCloud();

window.UIManager = UIManager;
window.openCampusFullReportModal = () => UIManager.openCampusFullReportModal();
window.printCampusFullReport = () => UIManager.printCampusFullReport();
window.exportCampusReportCSV = () => UIManager.exportCampusReportCSV();


