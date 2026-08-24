/**
 * ==============================================================================
 * منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
 * Supabase Data Access Service (CRUD, Sync & Relational Operations)
 * ==============================================================================
 */

const SupabaseService = {

    /**
     * Helper to get active Supabase client
     */
    getClient() {
        return SupabaseClientManager.getClient();
    },

    /**
     * Checks if Supabase is active and operational
     */
    isLive() {
        return Boolean(this.getClient());
    },

    // ==============================================================================
    // 1. AUTHENTICATION & PROFILES SERVICE
    // ==============================================================================
    Auth: {
        async signIn(email, password) {
            const client = SupabaseService.getClient();
            if (!client) throw new Error('عميل سوبابيز غير مهيأ.');

            const { data, error } = await client.auth.signInWithPassword({ email, password });
            if (error) throw error;

            // Fetch profile
            const { data: profile } = await client
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            return {
                user: data.user,
                session: data.session,
                profile: profile || {
                    id: data.user.id,
                    full_name: data.user.user_metadata?.full_name || 'د. فرج دنيا',
                    email: data.user.email,
                    role: data.user.user_metadata?.role || 'supervisor'
                }
            };
        },

        async signOut() {
            const client = SupabaseService.getClient();
            if (client) {
                await client.auth.signOut();
            }
        },

        async getProfile(userId) {
            const client = SupabaseService.getClient();
            if (!client) return null;

            const { data, error } = await client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Profile fetch failed:', error);
                return null;
            }
            return data;
        }
    },

    // ==============================================================================
    // 2. TEACHERS DIRECTORY SERVICE
    // ==============================================================================
    Teachers: {
        async fetchAll() {
            const client = SupabaseService.getClient();
            if (!client) return null;

            const { data, error } = await client
                .from('teachers')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            // Map database columns to app internal camelCase structure
            return (data || []).map(t => ({
                id: t.id,
                name: t.name,
                subject: t.subject,
                branch: t.branch,
                code: t.employee_code,
                email: t.email,
                phone: t.phone,
                performanceRating: Number(t.performance_rating) || 85,
                plansSubmitted: t.plans_submitted || 0,
                plansApproved: t.plans_approved || 0,
                statusColor: t.status_color || 'green',
                statusReason: t.status_reason || '',
                onedriveFolderUrl: t.onedrive_folder_url || '',
                classeraTeacherId: t.classera_teacher_id || '',
                strengths: t.strengths || [],
                areasForImprovement: t.areas_for_improvement || [],
                activeActionsCount: t.active_actions_count || 0
            }));
        },

        async updateStatus(teacherId, statusColor, statusReason) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            const { data, error } = await client
                .from('teachers')
                .update({
                    status_color: statusColor,
                    status_reason: statusReason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', teacherId)
                .select();

            if (error) throw error;
            return data;
        },

        async updatePerformance(teacherId, rating, submitted, approved) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            const { error } = await client
                .from('teachers')
                .update({
                    performance_rating: rating,
                    plans_submitted: submitted,
                    plans_approved: approved,
                    updated_at: new Date().toISOString()
                })
                .eq('id', teacherId);

            if (error) throw error;
            return true;
        }
    },

    // ==============================================================================
    // 3. WEEKLY PLANS SERVICE
    // ==============================================================================
    Plans: {
        async fetchAll() {
            const client = SupabaseService.getClient();
            if (!client) return null;

            // Fetch plans with their daily items
            const { data, error } = await client
                .from('weekly_plans')
                .select(`
                    *,
                    weekly_plan_items (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(p => ({
                id: p.id,
                teacherId: p.teacher_id,
                teacherName: p.teacher_name,
                subject: p.subject,
                grade: p.grade_class || p.grade || p.branch || 'المرحلة العامة',
                gradeClass: p.grade_class || p.grade || p.branch || 'المرحلة العامة',
                branch: p.branch,
                weekNumber: p.week_number,
                term: p.term || 'الفصل الدراسي الأول',
                dateStart: p.date_start,
                dateEnd: p.date_end,
                dateRange: p.date_start ? `${p.date_start} - ${p.date_end}` : (p.dateRange || '24 - 28 أغسطس 2026'),
                monthlyTheme: p.monthly_theme || p.monthlyTheme || 'قيمة الانضباط والتميز',
                status: p.status,
                onedriveDocUrl: p.onedrive_doc_url,
                classeraFolderUrl: p.classera_folder_url,
                submissionDate: p.submission_date,
                reviewDate: p.review_date,
                reviewedBy: p.reviewed_by,
                supervisorNotes: p.supervisor_notes,
                revisions: p.revisions || [],
                items: (p.weekly_plan_items || []).map(item => ({
                    id: item.id,
                    day: item.day_of_week,
                    period: item.period_number,
                    lessonTitle: item.lesson_title,
                    targetedSkills: item.targeted_skills,
                    homework: item.homework,
                    classeraUrl: item.classera_url,
                    assessmentType: item.assessment_type
                }))
            }));
        },

        async reviewPlan(planId, decision, comments, reviewerName) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            const reviewEntry = {
                date: new Date().toISOString().split('T')[0],
                by: reviewerName,
                action: decision === 'approved' ? 'اعتماد الخطة' : 'طلب تعديل ومراجعة',
                comment: comments
            };

            // Get existing revisions
            const { data: currentPlan } = await client
                .from('weekly_plans')
                .select('revisions')
                .eq('id', planId)
                .single();

            const revisions = currentPlan?.revisions || [];
            revisions.push(reviewEntry);

            const { data, error } = await client
                .from('weekly_plans')
                .update({
                    status: decision,
                    review_date: new Date().toISOString().split('T')[0],
                    reviewed_by: reviewerName,
                    supervisor_notes: comments,
                    revisions: revisions,
                    updated_at: new Date().toISOString()
                })
                .eq('id', planId)
                .select();

            if (error) throw error;

            // Log review to plan_reviews table
            await client.from('plan_reviews').insert({
                plan_id: planId,
                supervisor_name: reviewerName,
                decision: decision,
                feedback_notes: comments
            });

            return data;
        },

        async submitPlan(planObj) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            const { data: planData, error: planErr } = await client
                .from('weekly_plans')
                .insert({
                    id: planObj.id,
                    teacher_id: planObj.teacherId,
                    teacher_name: planObj.teacherName,
                    subject: planObj.subject,
                    grade_class: planObj.gradeClass,
                    branch: planObj.branch,
                    week_number: planObj.weekNumber,
                    term: planObj.term || 1,
                    date_start: planObj.dateStart,
                    date_end: planObj.dateEnd,
                    monthly_theme: planObj.monthlyTheme,
                    status: 'submitted',
                    onedrive_doc_url: planObj.onedriveDocUrl,
                    classera_folder_url: planObj.classeraFolderUrl,
                    submission_date: planObj.submissionDate || new Date().toISOString().split('T')[0],
                    revisions: []
                })
                .select()
                .single();

            if (planErr) throw planErr;

            // Insert lesson items if any
            if (planObj.items && planObj.items.length > 0) {
                const itemsToInsert = planObj.items.map(item => ({
                    plan_id: planObj.id,
                    day_of_week: item.day,
                    period_number: item.period || 1,
                    lesson_title: item.lessonTitle,
                    targeted_skills: item.targetedSkills || '',
                    homework: item.homework || '',
                    classera_url: item.classeraUrl || '',
                    assessment_type: item.assessmentType || 'formative_task'
                }));

                await client.from('weekly_plan_items').insert(itemsToInsert);
            }

            return planData;
        }
    },

    // ==============================================================================
    // 4. CLASSROOM OBSERVATIONS SERVICE
    // ==============================================================================
    Observations: {
        async fetchAll() {
            const client = SupabaseService.getClient();
            if (!client) return null;

            const { data, error } = await client
                .from('classroom_observations')
                .select(`
                    *,
                    observation_scores (*)
                `)
                .order('visit_date', { ascending: false });

            if (error) throw error;

            return (data || []).map(o => {
                const scores = o.observation_scores || {};
                return {
                    id: o.id,
                    teacherId: o.teacher_id,
                    teacherName: o.teacher_name,
                    supervisorName: o.supervisor_name,
                    branch: o.branch,
                    subject: o.subject,
                    gradeClass: o.grade_class,
                    visitDate: o.visit_date,
                    visitPeriod: o.visit_period,
                    visitTime: o.visit_time || '08:30 ص',
                    lessonTopic: o.lesson_topic,
                    totalScore: Number(o.total_score) || 0,
                    ratingLabel: o.rating_label,
                    domain1_planning: scores.domain_1_planning || 18,
                    domain2_teaching: scores.domain_2_teaching_strategies || 27,
                    domain3_classroom: scores.domain_3_classroom_management || 23,
                    domain4_assessment: scores.domain_4_assessment_feedback || 22,
                    strengths: o.strengths || '',
                    areasForImprovement: o.areas_for_improvement || '',
                    supervisorRecommendations: o.supervisor_recommendations || '',
                    status: o.status
                };
            });
        },

        async addObservation(obsData) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            const obsId = obsData.id || `OBS-${Math.floor(100 + Math.random() * 900)}`;

            const { error: obsErr } = await client
                .from('classroom_observations')
                .insert({
                    id: obsId,
                    teacher_id: obsData.teacherId,
                    teacher_name: obsData.teacherName,
                    supervisor_name: obsData.supervisorName,
                    branch: obsData.branch,
                    subject: obsData.subject,
                    grade_class: obsData.gradeClass,
                    visit_date: obsData.visitDate,
                    visit_period: obsData.visitPeriod || 1,
                    visit_time: obsData.visitTime || '08:30 ص',
                    lesson_topic: obsData.lessonTopic,
                    totalScore: obsData.totalScore,
                    rating_label: obsData.ratingLabel,
                    strengths: obsData.strengths,
                    areas_for_improvement: obsData.areasForImprovement,
                    supervisor_recommendations: obsData.supervisorRecommendations,
                    status: 'approved_and_shared'
                });

            if (obsErr) throw obsErr;

            // Insert score breakdown
            await client.from('observation_scores').upsert({
                observation_id: obsId,
                domain_1_planning: obsData.domain1_planning || 0,
                domain_2_teaching_strategies: obsData.domain2_teaching || 0,
                domain_3_classroom_management: obsData.domain3_classroom || 0,
                domain_4_assessment_feedback: obsData.domain4_assessment || 0
            });

            return { id: obsId, ...obsData };
        }
    },

    // ==============================================================================
    // 5. IMPROVEMENT ACTIONS SERVICE
    // ==============================================================================
    Actions: {
        async fetchAll() {
            const client = SupabaseService.getClient();
            if (!client) return null;

            const { data, error } = await client
                .from('improvement_actions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(a => ({
                id: a.id,
                observationId: a.observation_id,
                teacherId: a.teacher_id,
                teacherName: a.teacher_name,
                subject: a.subject,
                branch: a.branch,
                identifiedProblem: a.identified_problem,
                measurableAction: a.measurable_action,
                deadlineDate: a.deadline_date,
                status: a.status,
                progressPercentage: a.progress_percentage || 15,
                evidenceNotes: a.evidence_notes || '',
                evidenceUrl: a.evidence_url || '',
                verificationNotes: a.verification_notes || '',
                assignedSupervisor: a.assigned_supervisor
            }));
        },

        async createAction(actionData) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            const actId = actionData.id || `ACT-${Math.floor(100 + Math.random() * 900)}`;

            const { data, error } = await client
                .from('improvement_actions')
                .insert({
                    id: actId,
                    observation_id: actionData.observationId || null,
                    teacher_id: actionData.teacherId,
                    teacher_name: actionData.teacherName,
                    subject: actionData.subject,
                    branch: actionData.branch,
                    identified_problem: actionData.identifiedProblem,
                    measurable_action: actionData.measurableAction,
                    deadline_date: actionData.deadlineDate,
                    status: 'in_progress',
                    progress_percentage: 15,
                    evidence_notes: actionData.evidenceNotes || 'تم تسجيل الإجراء وبانتظار بدء التطبيق الميداني.',
                    evidence_url: actionData.evidenceUrl || '',
                    verification_notes: actionData.verificationNotes || 'بانتظار استكمال الشواهد لاعتماد المشرف.',
                    assigned_supervisor: actionData.assignedSupervisor
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async updateStatus(actionId, newStatus, verificationNotes) {
            const client = SupabaseService.getClient();
            if (!client) return false;

            let progress = 50;
            if (newStatus === 'closed_verified') progress = 100;
            if (newStatus === 'completed') progress = 90;

            const updatePayload = {
                status: newStatus,
                progress_percentage: progress,
                updated_at: new Date().toISOString()
            };

            if (verificationNotes) {
                if (newStatus === 'closed_verified') {
                    updatePayload.verification_notes = verificationNotes;
                } else {
                    updatePayload.evidence_notes = verificationNotes;
                }
            }

            const { data, error } = await client
                .from('improvement_actions')
                .update(updatePayload)
                .eq('id', actionId)
                .select();

            if (error) throw error;
            return data;
        }
    },

    // ==============================================================================
    // 6. SYNC LOCAL SEED DATA TO SUPABASE CLOUD
    // ==============================================================================
    Sync: {
        /**
         * Pushes all local storage state to Supabase Cloud
         */
        async syncLocalToCloud(onProgress = () => {}) {
            const client = SupabaseService.getClient();
            if (!client) throw new Error('يرجى تهيئة وربط سوبابيز أولاً قبل المزامنة.');

            onProgress('بدء فحص الاتصال ومزامنة البيانات...', 10);

            // 1. Sync System Settings
            onProgress('مزامنة الإعدادات العامة...', 20);
            if (AppState.settings) {
                await client.from('system_settings').upsert([
                    {
                        key: 'criteria_weights',
                        value: AppState.settings.criteriaWeights || { planning: 20, teaching: 30, classroom: 25, assessment: 25 },
                        description: 'أوزان معايير بطاقة الملاحظة الصفية'
                    },
                    {
                        key: 'supervisor_profile',
                        value: {
                            name: AppState.settings.supervisorName,
                            email: AppState.settings.supervisorEmail,
                            institution: AppState.settings.institutionName
                        },
                        description: 'بيانات المشرف التربوي'
                    }
                ]);
            }

            // 2. Sync Teachers
            onProgress('مزامنة سجلات المعلمين...', 40);
            const teachersPayload = (AppState.teachers || []).map(t => ({
                id: t.id,
                employee_code: t.code || `AC-${Math.floor(1000 + Math.random() * 9000)}`,
                name: t.name,
                subject: t.subject,
                branch: t.branch,
                email: t.email,
                phone: t.phone,
                performance_rating: t.performanceRating,
                plans_submitted: t.plansSubmitted,
                plans_approved: t.plansApproved,
                status_color: t.statusColor,
                status_reason: t.statusReason,
                onedrive_folder_url: t.onedriveFolderUrl,
                classera_teacher_id: t.classeraTeacherId,
                strengths: t.strengths || [],
                areas_for_improvement: t.areasForImprovement || [],
                active_actions_count: t.activeActionsCount || 0
            }));
            if (teachersPayload.length > 0) {
                await client.from('teachers').upsert(teachersPayload, { onConflict: 'id' });
            }

            // 3. Sync Weekly Plans & Items
            onProgress('مزامنة الخطط الأسبوعية وجداول الحصص...', 65);
            for (const p of AppState.weeklyPlans || []) {
                await client.from('weekly_plans').upsert({
                    id: p.id,
                    teacher_id: p.teacherId,
                    teacher_name: p.teacherName,
                    subject: p.subject,
                    grade_class: p.gradeClass,
                    branch: p.branch,
                    week_number: p.weekNumber,
                    term: p.term || 1,
                    date_start: p.dateStart,
                    date_end: p.dateEnd,
                    monthly_theme: p.monthlyTheme,
                    status: p.status,
                    onedrive_doc_url: p.onedriveDocUrl,
                    classera_folder_url: p.classeraFolderUrl,
                    submission_date: p.submissionDate,
                    review_date: p.reviewDate,
                    reviewed_by: p.reviewedBy,
                    supervisor_notes: p.supervisorNotes,
                    revisions: p.revisions || []
                }, { onConflict: 'id' });

                if (p.items && p.items.length > 0) {
                    await client.from('weekly_plan_items').delete().eq('plan_id', p.id);
                    const itemsPayload = p.items.map(item => ({
                        plan_id: p.id,
                        day_of_week: item.day,
                        period_number: item.period || 1,
                        lesson_title: item.lessonTitle,
                        targeted_skills: item.targetedSkills,
                        homework: item.homework,
                        classera_url: item.classeraUrl,
                        assessment_type: item.assessmentType || 'formative_task'
                    }));
                    await client.from('weekly_plan_items').insert(itemsPayload);
                }
            }

            // 4. Sync Observations & Rubric Scores
            onProgress('مزامنة الزيارات وبطاقات الملاحظة الصفية...', 80);
            for (const o of AppState.observations || []) {
                await client.from('classroom_observations').upsert({
                    id: o.id,
                    teacher_id: o.teacherId,
                    teacher_name: o.teacherName,
                    supervisor_name: o.supervisorName,
                    branch: o.branch,
                    subject: o.subject,
                    grade_class: o.gradeClass,
                    visit_date: o.visitDate,
                    visit_period: o.visitPeriod || 1,
                    visit_time: o.visitTime || '08:30 ص',
                    lesson_topic: o.lessonTopic,
                    total_score: o.totalScore,
                    rating_label: o.ratingLabel,
                    strengths: o.strengths,
                    areas_for_improvement: o.areasForImprovement,
                    supervisor_recommendations: o.supervisorRecommendations,
                    status: o.status
                }, { onConflict: 'id' });

                await client.from('observation_scores').upsert({
                    observation_id: o.id,
                    domain_1_planning: o.domain1_planning || 18,
                    domain_2_teaching_strategies: o.domain2_teaching || 27,
                    domain_3_classroom_management: o.domain3_classroom || 23,
                    domain_4_assessment_feedback: o.domain4_assessment || 22
                }, { onConflict: 'observation_id' });
            }

            // 5. Sync Improvement Actions
            onProgress('مزامنة الإجراءات التحسينية ومسارات الإغلاق...', 95);
            for (const a of AppState.improvementActions || []) {
                await client.from('improvement_actions').upsert({
                    id: a.id,
                    observation_id: a.observationId || null,
                    teacher_id: a.teacherId,
                    teacher_name: a.teacherName,
                    subject: a.subject,
                    branch: a.branch,
                    identified_problem: a.identifiedProblem,
                    measurable_action: a.measurableAction,
                    deadline_date: a.deadlineDate,
                    status: a.status,
                    progress_percentage: a.progressPercentage || 15,
                    evidence_notes: a.evidenceNotes,
                    evidence_url: a.evidenceUrl,
                    verification_notes: a.verificationNotes,
                    assigned_supervisor: a.assignedSupervisor
                }, { onConflict: 'id' });
            }

            onProgress('تمت المزامنة بنجاح واكتمال تحميل كافة البيانات إلى سحابة Supabase! 🎉', 100);
            return true;
        }
    }
};

window.SupabaseService = SupabaseService;
