/**
 * ==============================================================================
 * منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
 * Relational State Management & Supervision Workflow Layer
 * Bridging: Classera (LMS) + OneDrive (Documents/Plans) + Supervision Layer
 * ==============================================================================
 */

const AppState = {
    STORAGE_KEYS: {
        TEACHERS: 'AC_SUPERVISION_TEACHERS',
        WEEKLY_PLANS: 'AC_WEEKLY_PLANS',
        OBSERVATIONS: 'AC_CLASSROOM_OBSERVATIONS',
        ACTIONS: 'AC_IMPROVEMENT_ACTIONS',
        SETTINGS: 'AC_SUPERVISION_SETTINGS',
        ACTIVE_ROLE: 'AC_ACTIVE_USER_ROLE',
        NOTIFICATIONS: 'AC_SUPERVISION_NOTIFICATIONS'
    },

    // Current active simulated role (Default: Educational Supervisor)
    activeRole: 'supervisor', // 'supervisor' | 'teacher' | 'academic_leader' | 'principal' | 'admin'

    // ==============================================================================
    // SEED RELATIONAL DATASET
    // ==============================================================================
    DEFAULT_DATA: {
        teachers: [
            {
                id: 1,
                name: "أ. أحمد بن سلطان الشمري",
                subject: "الرياضيات المتقدمة",
                branch: "المدينة الأكاديمية - ثانوي (بنين)",
                code: "AC-8841",
                email: "a.alshammari@academiccity.edu.sa",
                phone: "+966 55 112 3344",
                performanceRating: 96,
                plansSubmitted: 6,
                plansApproved: 6,
                statusColor: "green", // green | yellow | red
                statusReason: "أداء متميز والتزام تام بالخطط الأسبوعية واستراتيجيات التعلم النشط.",
                onedriveFolderUrl: "https://onedrive.live.com/academiccity/teachers/a_shammari_portfolio",
                classeraTeacherId: "CLS-SA-8841",
                strengths: ["توظيف رائع للسبورة الذكية والتطبيقات التفاعلية", "صياغة أهداف سلوكية واضحة ومقاسة", "تنويع أساليب التعزيز"],
                areasForImprovement: ["مراعاة وقت استجابة الطلاب الأقل تفاعلاً في الأنشطة الفردية"],
                activeActionsCount: 0
            },
            {
                id: 2,
                name: "أ. محمد بن خالد الدوسري",
                subject: "الفيزياء (AP Physics)",
                branch: "المدينة الأكاديمية - المسار الدولي",
                code: "AC-7410",
                email: "m.aldosari@academiccity.edu.sa",
                phone: "+966 55 223 4455",
                performanceRating: 88,
                plansSubmitted: 5,
                plansApproved: 4,
                statusColor: "yellow",
                statusReason: "خطة الأسبوع 5 بانتظار تعديل الواجبات التفاعلية على كلاسيرة.",
                onedriveFolderUrl: "https://onedrive.live.com/academiccity/teachers/m_dosari_portfolio",
                classeraTeacherId: "CLS-SA-7410",
                strengths: ["التمكن العلمي العالي من منهج الدبلوما الأمريكية", "تجهيز التجارب المعملية"],
                areasForImprovement: ["زيادة مشاركة مجموعات الطلاب وتوثيق خطة التحسين في الموعد"],
                activeActionsCount: 1
            },
            {
                id: 3,
                name: "أ. يوسف بن زياد الشهري",
                subject: "المهارات الرقمية والذكاء الاصطناعي",
                branch: "المدينة الأكاديمية - ابتدائي",
                code: "AC-5218",
                email: "y.alshehri@academiccity.edu.sa",
                phone: "+966 55 334 5566",
                performanceRating: 74,
                plansSubmitted: 3,
                plansApproved: 2,
                statusColor: "red",
                statusReason: "تأخر في تسليم الخطة الأسبوعية ووجود إجراء تحسيني معلق متجاوز للمهلة.",
                onedriveFolderUrl: "https://onedrive.live.com/academiccity/teachers/y_shehri_portfolio",
                classeraTeacherId: "CLS-SA-5218",
                strengths: ["المعرفة التقنية الحديثة بأدوات الذكاء الاصطناعي"],
                areasForImprovement: ["الإدارة الصفية لطلاب الصفوف الأولية", "الانضباط في تسليم خطة الأسبوع قبل يوم الخميس"],
                activeActionsCount: 2
            },
            {
                id: 4,
                name: "أ. ريم بنت خالد العتيبي",
                subject: "اللغة الإنجليزية (SAT Prep)",
                branch: "المدينة الأكاديمية - ثانوي (بنات)",
                code: "AC-6541",
                email: "r.alotaibi@academiccity.edu.sa",
                phone: "+966 55 445 6677",
                performanceRating: 94,
                plansSubmitted: 6,
                plansApproved: 6,
                statusColor: "green",
                statusReason: "أداء استثنائي وتكامل تام بين خطة ون درايف وواجبات كلاسيرة.",
                onedriveFolderUrl: "https://onedrive.live.com/academiccity/teachers/r_otaibi_portfolio",
                classeraTeacherId: "CLS-SA-6541",
                strengths: ["استخدام كامل للغة الهدف في الحصة", "إدارة حلقات النقاش والعصف الذهني"],
                areasForImprovement: ["إتاحة وقت إضافي لمهارات الكتابة الأكاديمية"],
                activeActionsCount: 0
            },
            {
                id: 5,
                name: "أ. سعود بن عبدالله القحطاني",
                subject: "اللغة العربية والآداب",
                branch: "المدينة الأكاديمية - متوسط (بنين)",
                code: "AC-9932",
                email: "s.alqahtani@academiccity.edu.sa",
                phone: "+966 55 556 7788",
                performanceRating: 90,
                plansSubmitted: 6,
                plansApproved: 5,
                statusColor: "green",
                statusReason: "الخطة مكتملة ومطابقة لمعايير الوزارة.",
                onedriveFolderUrl: "https://onedrive.live.com/academiccity/teachers/s_qahtani_portfolio",
                classeraTeacherId: "CLS-SA-9932",
                strengths: ["فصاحة التقديم وتنمية مهارات التعبير والخطابة لدى الطلاب"],
                areasForImprovement: ["التوسع في الأنشطة الإلكترونية والواجبات الرقمية"],
                activeActionsCount: 0
            }
        ],

        weeklyPlans: [
            {
                id: "WP-2026-04-01",
                teacherId: 1,
                teacherName: "أ. أحمد بن سلطان الشمري",
                subject: "الرياضيات المتقدمة",
                grade: "الصف الثالث الثانوي (مسار الهندسة والحاسب)",
                weekNumber: 4,
                term: "الفصل الدراسي الأول",
                dateRange: "24 أغسطس 2026 - 28 أغسطس 2026",
                monthlyTheme: "قيمة الانضباط والمسؤولية الذاتية",
                status: "approved", // submitted | under_review | needs_revision | approved
                submissionDate: "2026-08-21",
                reviewDate: "2026-08-22",
                reviewedBy: "د. فرج دنيا (المشرف المقيم)",
                supervisorNotes: "خطة نموذجية محكمة ومكتملة العناصر مع توزيع زمني دقيق.",
                onedriveDocUrl: "https://onedrive.live.com/academiccity/plans/math_grade12_week4.docx",
                classeraLink: "https://me.classera.com/courses/math-12-academiccity",
                items: [
                    { day: "الأحد", period: 1, lesson: "حساب النهايات بيانياً وجبرياً", skills: "التحليل والاستنتاج الرياضي", homework: "واجب إلكتروني #3 على كلاسيرة", assessment: "تقويم بنائي قصير", classeraUrl: "https://me.classera.com/quiz/101" },
                    { day: "الإثنين", period: 2, lesson: "تقدير النهايات جبرياً باستخدام المرافق والتحليل", skills: "حل المشكلات المعقدة", homework: "تمارين الكتاب ص 34 (1-6)", assessment: "مهمة أدائية", classeraUrl: "https://me.classera.com/assign/102" },
                    { day: "الثلاثاء", period: 1, lesson: "الاتصال وسلوك طرفي التمثيل البياني", skills: "التفكير الناقد والربط الهندسي", homework: "نشاط تفاعلي Geogebra", assessment: "مناقشة صفية", classeraUrl: "https://me.classera.com/activity/103" },
                    { day: "الأربعاء", period: 3, lesson: "القيم القصوى ومتوسط معدل التغير", skills: "النمذجة الرياضية والتطبيق الحياتي", homework: "مشروع مصغر: حساب السرعة اللحظية", assessment: "مشروع فردي", classeraUrl: "https://me.classera.com/project/104" },
                    { day: "الخميس", period: 2, lesson: "مراجعة وتدريبات قياس التحصيل والقدرات", skills: "السرعة والدقة وحل نماذج القدرات", homework: "اختبار تجريبي على كلاسيرة", assessment: "اختبار تشخيصي أسبوعي", classeraUrl: "https://me.classera.com/quiz/105" }
                ],
                revisions: [
                    { date: "2026-08-22 09:15", by: "د. فرج دنيا", action: "اعتماد نهائي", comment: "تم التحقق من اكتمال عناصر الخطة ومطابقتها للمنهج." }
                ]
            },
            {
                id: "WP-2026-04-02",
                teacherId: 2,
                teacherName: "أ. محمد بن خالد الدوسري",
                subject: "الفيزياء (AP Physics)",
                grade: "المسار الدولي - Grade 11 (American Diploma)",
                weekNumber: 4,
                term: "Fall Semester 2026",
                dateRange: "24 أغسطس 2026 - 28 أغسطس 2026",
                monthlyTheme: "Academic Integrity & Scientific Innovation",
                status: "needs_revision",
                submissionDate: "2026-08-22",
                reviewDate: "2026-08-23",
                reviewedBy: "د. فرج دنيا",
                supervisorNotes: "الخطة جيدة ولكن ينقصها تحديد الواجب الرقمي ليومي الثلاثاء والخميس على كلاسيرة.",
                onedriveDocUrl: "https://onedrive.live.com/academiccity/plans/ap_physics_week4.docx",
                classeraLink: "https://me.classera.com/courses/physics-11-american",
                items: [
                    { day: "الأحد", period: 2, lesson: "2D Kinematics & Projectile Motion Vectors", skills: "Vector Decomposition & Modeling", homework: "AP Classroom Unit 1 Practice #4", assessment: "Lab Pre-Quiz", classeraUrl: "https://me.classera.com/quiz/201" },
                    { day: "الإثنين", period: 4, lesson: "Lab Investigation: Measuring Launch Velocity", skills: "Experimental Design & Data Collection", homework: "Complete Lab Data Analysis", assessment: "Lab Report Rubric", classeraUrl: "https://me.classera.com/lab/202" },
                    { day: "الثلاثاء", period: 2, lesson: "Newton's Laws with Friction on Inclined Planes", skills: "Free Body Diagrams", homework: "--- (غير محدد)", assessment: "Whiteboard Group Solve", classeraUrl: "" },
                    { day: "الأربعاء", period: 1, lesson: "Uniform Circular Motion & Centripetal Acceleration", skills: "Critical Physics Reasoning", homework: "Read Chapter 4.2 & Concept Check", assessment: "Exit Ticket", classeraUrl: "https://me.classera.com/activity/204" },
                    { day: "الخميس", period: 3, lesson: "AP Style Problem Solving Workshop", skills: "Exam Synthesis & Timing", homework: "--- (غير محدد)", assessment: "Weekly AP Quiz", classeraUrl: "" }
                ],
                revisions: [
                    { date: "2026-08-23 11:30", by: "د. فرج دنيا", action: "طلب تعديل", comment: "يرجى استكمال تحديد روابط الواجبات والاختبارات الأسبوعية ليومي الثلاثاء والخميس لتفعيل تكامل كلاسيرة." }
                ]
            },
            {
                id: "WP-2026-04-03",
                teacherId: 3,
                teacherName: "أ. يوسف بن زياد الشهري",
                subject: "المهارات الرقمية",
                grade: "الصف الخامس الابتدائي",
                weekNumber: 4,
                term: "الفصل الدراسي الأول",
                dateRange: "24 أغسطس 2026 - 28 أغسطس 2026",
                monthlyTheme: "قيمة التعاون والعمل الجماعي",
                status: "submitted",
                submissionDate: "2026-08-23",
                reviewDate: "--",
                reviewedBy: "بانتظار المراجعة",
                supervisorNotes: "خطة جديدة تم استلامها، بانتظار التدقيق الإشرافي.",
                onedriveDocUrl: "https://onedrive.live.com/academiccity/plans/digital_skills_g5_week4.docx",
                classeraLink: "https://me.classera.com/courses/digital-g5",
                items: [
                    { day: "الأحد", period: 3, lesson: "التعامل مع المستندات النصية وتنسيق الجداول", skills: "الكتابة والتنسيق الرقمي", homework: "ورقة عمل تفاعلية #1", assessment: "مهمة عملية بالحاسب", classeraUrl: "https://me.classera.com/assign/301" },
                    { day: "الثلاثاء", period: 2, lesson: "إدراج الصور والأشكال والرسوم البيانية", skills: "التصميم والتنظيم المرئي", homework: "مشروع تصميم مجلة مدرسية", assessment: "تطبيق معملي", classeraUrl: "https://me.classera.com/assign/302" }
                ],
                revisions: []
            }
        ],

        observations: [
            {
                id: "OBS-881",
                teacherId: 1,
                teacherName: "أ. أحمد بن سلطان الشمري",
                subject: "الرياضيات المتقدمة",
                branch: "المدينة الأكاديمية - ثانوي (بنين)",
                grade: "3/علمي - قاعة 102",
                date: "2026-08-24",
                period: "الحصة الثانية (08:30 ص)",
                lessonTopic: "تطبيقات حساب النهايات والقيم القصوى في الحياة الواقعية",
                planningScore: 20, // max 20
                teachingScore: 29, // max 30
                classroomScore: 24, // max 25
                assessmentScore: 23, // max 25
                totalScore: 96,
                rating: "ممتاز مرتفع",
                strengths: "تحضير ذهني وكتابي استثنائي، تفاعل نشط من الطلاب بنسبة تجاوزت 95%، وتوظيف بارع لبرمجية Geogebra التفاعلية.",
                areasForImprovement: "منح الطلاب وقتاً إضافياً (30 ثانية) للتفكير الفردي قبل تلقي الإجابات في الأسئلة المعقدة.",
                recommendations: "ترشيح المعلم لتنفيذ ورشة تدريبية لزملائه في قسم الرياضيات حول استراتيجيات التقويم البنائي الذكي.",
                onedriveEvidenceUrl: "https://onedrive.live.com/academiccity/evidence/obs_881_shammari.pdf",
                status: "approved_and_shared"
            },
            {
                id: "OBS-882",
                teacherId: 2,
                teacherName: "أ. محمد بن خالد الدوسري",
                subject: "الفيزياء (AP Physics)",
                branch: "المدينة الأكاديمية - المسار الدولي",
                grade: "Grade 11 - Room 204",
                date: "2026-08-23",
                period: "الحصة الثالثة (10:15 ص)",
                lessonTopic: "Projectile Motion Laboratory & Velocity Measurement",
                planningScore: 18,
                teachingScore: 26,
                classroomScore: 22,
                assessmentScore: 22,
                totalScore: 88,
                rating: "جيد جداً مرتفع",
                strengths: "إعداد معملي دقيق وتطبيق لمعايير السلامة المهنية ومطابقة تامة لمعايير الدبلوما الأمريكية (AP College Board).",
                areasForImprovement: "لوحظ أن المعلم يقدم الإجابات الجاهزة عند مواجهة الطلاب لصعوبات بدلاً من توجيههم بالأسئلة السقراطية (Active Inquiry).",
                recommendations: "صياغة إجراء تحسيني لتطبيق استراتيجية التعلم القائم على الاستقصاء في التجارب المعملية.",
                onedriveEvidenceUrl: "https://onedrive.live.com/academiccity/evidence/obs_882_dosari.pdf",
                status: "approved_and_shared"
            },
            {
                id: "OBS-883",
                teacherId: 3,
                teacherName: "أ. يوسف بن زياد الشهري",
                subject: "المهارات الرقمية",
                branch: "المدينة الأكاديمية - ابتدائي",
                grade: "الخامس الابتدائي - معمل الحاسب 1",
                date: "2026-08-20",
                period: "الحصة الأولى (08:00 ص)",
                lessonTopic: "تنسيق الجداول والقوائم في المستندات الرقمية",
                planningScore: 16,
                teachingScore: 21,
                classroomScore: 18,
                assessmentScore: 19,
                totalScore: 74,
                rating: "يحتاج إلى دعم ومتابعة",
                strengths: "المحتوى العلمي سليم وتجهيز أجهزة المعمل مسبقاً.",
                areasForImprovement: "ضعف السيطرة على حركة الطلاب داخل المعمل، وعدم توفير خطة لمعالجة تفاوت سرعة الإنجاز بين الطلاب الموهوبين والأقل استيعاباً.",
                recommendations: "وضع خطة تحسين فورية لإدارة المعمل واستراتيجيات التمايز وتحديد موعد زيارة متابعة تشخيصية.",
                onedriveEvidenceUrl: "https://onedrive.live.com/academiccity/evidence/obs_883_shehri.pdf",
                status: "approved_and_shared"
            }
        ],

        improvementActions: [
            {
                id: "ACT-101",
                teacherId: 2,
                teacherName: "أ. محمد بن خالد الدوسري",
                subject: "الفيزياء (AP Physics)",
                observationId: "OBS-882",
                problemStatement: "الاعتماد على التلقين المباشر أثناء التجارب المعملية دون إتاحة مساحة كافية للاستقصاء وحل المشكلات التفاعلي.",
                actionPlan: "تطبيق استراتيجية الاستقصاء الموجه (Inquiry-Based Learning) في تجربتين معمليتين قادمتين مع بطاقة ملاحظة الأقران وتوثيقها على ون درايف.",
                deadline: "2026-09-03",
                assignedSupervisor: "د. فرج دنيا",
                status: "in_progress", // pending | in_progress | completed | closed_verified
                progressPercentage: 65,
                evidenceNotes: "تم تطبيق التجربة الأولى وتوثيق فيديو قصير في مجلد الشواهد المشترك.",
                verificationNotes: "بانتظار تنفيذ التجربة الثانية لزيارة المعلم والتحقق النهائي.",
                onedriveEvidenceLink: "https://onedrive.live.com/academiccity/actions/act_101_evidence"
            },
            {
                id: "ACT-102",
                teacherId: 3,
                teacherName: "أ. يوسف بن زياد الشهري",
                subject: "المهارات الرقمية",
                observationId: "OBS-883",
                problemStatement: "ضعف إدارة وقت المعمل وعدم تطبيق استراتيجيات التعليم المتمايز للطلاب الأقل تفاعلاً.",
                actionPlan: "إعداد بطاقات عمل متدرجة الصعوبة (مستوى 1 و2 و3) وتطبيق استراتيجية التعلم بالقرين وتدريب الطلاب على قواعد حركة المعمل.",
                deadline: "2026-08-30",
                assignedSupervisor: "د. فرج دنيا",
                status: "pending",
                progressPercentage: 20,
                evidenceNotes: "تم إرسال نماذج البطاقات للمشرف بالبريد الإلكتروني.",
                verificationNotes: "تجاوزت المهلة الأولية وبحاجة إلى متابعة إشرافية عاجلة.",
                onedriveEvidenceLink: "https://onedrive.live.com/academiccity/actions/act_102_evidence"
            },
            {
                id: "ACT-103",
                teacherId: 4,
                teacherName: "أ. ريم بنت خالد العتيبي",
                subject: "اللغة الإنجليزية",
                observationId: "OBS-880",
                problemStatement: "الحاجة إلى تعزيز مهارات كتابة المقال الأكاديمي المتقدم (SAT Essay Synthesis).",
                actionPlan: "إنشاء بنك نماذج مقالات تفاعلي على كلاسيرة وإقامة ورشة تدريب مصغرة لطالبات الصف الثالث الثانوي.",
                deadline: "2026-08-25",
                assignedSupervisor: "د. فرج دنيا",
                status: "closed_verified",
                progressPercentage: 100,
                evidenceNotes: "تم نشر 15 نموذج مقال مصحح بمعايير Rubric وحضور 38 طالبة للورشة.",
                verificationNotes: "تم إغلاق الإجراء التحسيني بنجاح بعد التحقق الميداني من أثر التعلم في ملفات الإنجاز.",
                onedriveEvidenceLink: "https://onedrive.live.com/academiccity/actions/act_103_evidence"
            }
        ],

        notifications: [
            {
                id: 1,
                title: "إجراء تحسيني متجاوز للمهلة",
                message: "أ. يوسف الشهري (المهارات الرقمية) لم يرفع شواهد المعمل للأسبوع 4.",
                time: "منذ ساعتين",
                type: "danger",
                icon: "fa-solid fa-triangle-exclamation",
                unread: true,
                targetView: "actions",
                actionType: "openTeacherProfile",
                targetId: 3
            },
            {
                id: 2,
                title: "خطة أسبوعية بانتظار الاعتماد",
                message: "رفع أ. محمد بن خالد الدوسري خطة الأسبوع 4 (AP Physics) بانتظار المراجعة والاعتماد.",
                time: "منذ 4 ساعات",
                type: "warning",
                icon: "fa-regular fa-clock",
                unread: true,
                targetView: "weekly-plans",
                actionType: "openPlanReview",
                targetId: "WP-2026-04-02"
            },
            {
                id: 3,
                title: "تنبيه نظام الإنذار المبكر",
                message: "انخفاض معدل تسليم الخطط في قسم الصفوف الأولية - يتطلب تدخلاً ومتابعة ميدانية.",
                time: "اليوم 08:30",
                type: "danger",
                icon: "fa-solid fa-circle-exclamation",
                unread: true,
                targetView: "dashboard",
                actionType: "openTeacherProfile",
                targetId: 3
            },
            {
                id: 4,
                title: "زيارة صفية مجدولة اليوم",
                message: "زيارة صفية مجدولة مع أ. أحمد بن سلطان الشمري (الرياضيات) الساعة 09:30 ص.",
                time: "اليوم 09:30",
                type: "info",
                icon: "fa-solid fa-calendar-check",
                unread: true,
                targetView: "visits",
                actionType: "openTeacherProfile",
                targetId: 1
            },
            {
                id: 5,
                title: "إغلاق واعتماد إجراء تحسيني",
                message: "تم اعتماد شواهد ورش العمل وإغلاق إجراء أ. ريم بنت خالد العتيبي بنجاح.",
                time: "أمس",
                type: "success",
                icon: "fa-solid fa-circle-check",
                unread: false,
                targetView: "actions",
                actionType: "openTeacherProfile",
                targetId: 4
            }
        ],

        settings: {
            supervisorName: "د. فرج دنيا",
            supervisorTitle: "المشرف التربوي المقيم - مدارس المدينة الأكاديمية",
            supervisorEmail: "f.donia@academiccity.edu.sa",
            supervisorPhone: "+966 50 123 4567",
            institutionName: "مدارس المدينة الأكاديمية",
            weights: { planning: 20, teaching: 30, classroom: 25, assessment: 25 },
            notifications: { reminder: true, dept: true, pending: true }
        }
    },

    // In-memory active stores
    teachers: [],
    weeklyPlans: [],
    observations: [],
    improvementActions: [],
    notifications: [],
    settings: {},

    /**
     * Initializes state from localStorage or loads seed defaults
     * Automatically attempts to sync with Supabase Cloud if configured.
     */
    init() {
        this.teachers = this.load(this.STORAGE_KEYS.TEACHERS, this.DEFAULT_DATA.teachers);
        this.weeklyPlans = this.load(this.STORAGE_KEYS.WEEKLY_PLANS, this.DEFAULT_DATA.weeklyPlans);
        this.observations = this.load(this.STORAGE_KEYS.OBSERVATIONS, this.DEFAULT_DATA.observations);
        this.improvementActions = this.load(this.STORAGE_KEYS.ACTIONS, this.DEFAULT_DATA.improvementActions);
        this.notifications = this.load(this.STORAGE_KEYS.NOTIFICATIONS, this.DEFAULT_DATA.notifications);
        this.settings = this.load(this.STORAGE_KEYS.SETTINGS, this.DEFAULT_DATA.settings);
        this.activeRole = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_ROLE) || 'supervisor';

        this.recalculateTrafficLights();

        // Background Supabase Cloud Sync
        if (typeof SupabaseClientManager !== 'undefined' && SupabaseConfig.isConfigured()) {
            this.loadFromSupabase();
        }
    },

    markNotificationRead(notificationId) {
        const notif = this.notifications.find(n => n.id === notificationId);
        if (notif) {
            notif.unread = false;
            this.save(this.STORAGE_KEYS.NOTIFICATIONS, this.notifications);
        }
    },

    markAllNotificationsRead() {
        this.notifications.forEach(n => n.unread = false);
        this.save(this.STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    },

    /**
     * Fetches live state from Supabase Cloud
     */
    async loadFromSupabase() {
        try {
            if (typeof SupabaseService === 'undefined' || !SupabaseService.isLive()) return;

            console.log('🔄 [AppState] Fetching live dataset from Supabase Cloud...');
            const [remoteTeachers, remotePlans, remoteObs, remoteActions] = await Promise.allSettled([
                SupabaseService.Teachers.fetchAll(),
                SupabaseService.Plans.fetchAll(),
                SupabaseService.Observations.fetchAll(),
                SupabaseService.Actions.fetchAll()
            ]);

            let hasUpdates = false;

            if (remoteTeachers.status === 'fulfilled' && remoteTeachers.value && remoteTeachers.value.length > 0) {
                this.teachers = remoteTeachers.value;
                hasUpdates = true;
            }
            if (remotePlans.status === 'fulfilled' && remotePlans.value && remotePlans.value.length > 0) {
                this.weeklyPlans = remotePlans.value;
                hasUpdates = true;
            }
            if (remoteObs.status === 'fulfilled' && remoteObs.value && remoteObs.value.length > 0) {
                this.observations = remoteObs.value;
                hasUpdates = true;
            }
            if (remoteActions.status === 'fulfilled' && remoteActions.value && remoteActions.value.length > 0) {
                this.improvementActions = remoteActions.value;
                hasUpdates = true;
            }

            if (hasUpdates) {
                this.recalculateTrafficLights();
                this.saveAll();
                console.log('✅ [AppState] Successfully synced with Supabase Cloud dataset.');
                if (typeof AppRouter !== 'undefined' && AppRouter.onRouteChange) {
                    AppRouter.onRouteChange(AppRouter.currentRoute);
                }
            }
        } catch (err) {
            console.warn('⚠️ [AppState] Supabase sync fallback to local storage:', err);
        }
    },

    load(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return fallback;
        }
    },

    saveAll() {
        localStorage.setItem(this.STORAGE_KEYS.TEACHERS, JSON.stringify(this.teachers));
        localStorage.setItem(this.STORAGE_KEYS.WEEKLY_PLANS, JSON.stringify(this.weeklyPlans));
        localStorage.setItem(this.STORAGE_KEYS.OBSERVATIONS, JSON.stringify(this.observations));
        localStorage.setItem(this.STORAGE_KEYS.ACTIONS, JSON.stringify(this.improvementActions));
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
        localStorage.setItem(this.STORAGE_KEYS.ACTIVE_ROLE, this.activeRole);
    },

    /**
     * Dynamic Traffic Light Status Calculation for all teachers
     * 🟢 Green = Good (Rating >= 90 & 0 urgent actions)
     * 🟡 Yellow = Needs Attention (Rating 80-89 OR 1 pending revision)
     * 🔴 Red = Requires Immediate Follow-up (Rating < 80 OR overdue action)
     */
    recalculateTrafficLights() {
        const today = new Date().toISOString().split('T')[0];

        this.teachers.forEach(t => {
            const teacherActions = this.improvementActions.filter(a => a.teacherId === t.id && a.status !== 'closed_verified');
            const hasOverdueAction = teacherActions.some(a => a.deadline < today);
            const pendingPlans = this.weeklyPlans.filter(p => p.teacherId === t.id && (p.status === 'needs_revision' || p.status === 'submitted'));

            t.activeActionsCount = teacherActions.length;

            if (t.performanceRating < 80 || hasOverdueAction) {
                t.statusColor = "red";
                t.statusReason = hasOverdueAction ? "يوجد إجراء تحسيني متجاوز للموعد النهائي ومؤشر أداء منخفض." : "معدل التقييم الصفي أقل من 80% وبحاجة لتدخل إشرافي.";
            } else if (t.performanceRating < 90 || pendingPlans.length > 0 || teacherActions.length > 0) {
                t.statusColor = "yellow";
                t.statusReason = pendingPlans.length > 0 ? "توجد خطة أسبوعية تتطلب مراجعة أو تعديل." : "يوجد إجراء تحسيني قيد التنفيذ.";
            } else {
                t.statusColor = "green";
                t.statusReason = "مستوى متميز، التزام كامل بالخطط، ولا توجد أي إجراءات معلقة.";
            }
        });
    },

    // ==============================================================================
    // WORKFLOW CRUD: WEEKLY PLANS
    // ==============================================================================
    reviewWeeklyPlan(planId, decision, comments) {
        const plan = this.weeklyPlans.find(p => p.id === planId);
        if (!plan) return false;

        plan.status = decision; // 'approved' | 'needs_revision'
        plan.reviewDate = new Date().toISOString().split('T')[0];
        plan.reviewedBy = this.settings.supervisorName;
        plan.supervisorNotes = comments;

        plan.revisions.push({
            date: new Date().toLocaleDateString('ar-SA') + ' ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            by: this.settings.supervisorName,
            action: decision === 'approved' ? 'اعتماد الخطة' : 'طلب تعديل ومراجعة',
            comment: comments
        });

        // Update teacher approved plans count
        const teacher = this.teachers.find(t => t.id === plan.teacherId);
        if (teacher && decision === 'approved') {
            teacher.plansApproved = this.weeklyPlans.filter(p => p.teacherId === teacher.id && p.status === 'approved').length;
        }

        this.recalculateTrafficLights();
        this.saveAll();

        // Async Cloud Sync
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            SupabaseService.Plans.reviewPlan(planId, decision, comments, this.settings.supervisorName)
                .catch(err => console.warn('[Supabase] Plan review sync error:', err));
        }

        return plan;
    },

    submitWeeklyPlan(newPlan) {
        const planObj = {
            id: `WP-${new Date().getFullYear()}-0${Math.floor(10 + Math.random() * 90)}`,
            submissionDate: new Date().toISOString().split('T')[0],
            status: 'submitted',
            revisions: [],
            ...newPlan
        };

        this.weeklyPlans.unshift(planObj);

        // Update teacher plans submitted count
        const teacher = this.teachers.find(t => t.id === planObj.teacherId);
        if (teacher) {
            teacher.plansSubmitted = (teacher.plansSubmitted || 0) + 1;
        }

        this.recalculateTrafficLights();
        this.saveAll();

        // Async Cloud Sync
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            SupabaseService.Plans.submitPlan(planObj)
                .catch(err => console.warn('[Supabase] Plan submit sync error:', err));
        }

        return planObj;
    },

    // ==============================================================================
    // WORKFLOW CRUD: OBSERVATIONS & RUBRICS
    // ==============================================================================
    addObservation(obsData) {
        const newObs = {
            id: `OBS-${Math.floor(100 + Math.random() * 900)}`,
            status: 'approved_and_shared',
            ...obsData
        };

        this.observations.unshift(newObs);

        // Update teacher average performance
        const teacher = this.teachers.find(t => t.id === obsData.teacherId);
        if (teacher) {
            const allTeacherObs = this.observations.filter(o => o.teacherId === teacher.id);
            const avg = Math.round(allTeacherObs.reduce((acc, curr) => acc + curr.totalScore, 0) / allTeacherObs.length);
            teacher.performanceRating = avg;
        }

        this.recalculateTrafficLights();
        this.saveAll();

        // Async Cloud Sync
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            SupabaseService.Observations.addObservation(newObs)
                .catch(err => console.warn('[Supabase] Observation sync error:', err));
        }

        return newObs;
    },

    // ==============================================================================
    // WORKFLOW CRUD: IMPROVEMENT ACTIONS & CLOSURE
    // ==============================================================================
    createImprovementAction(actionData) {
        const newAction = {
            id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
            status: 'in_progress',
            progressPercentage: 15,
            evidenceNotes: 'تم تسجيل الإجراء وبانتظار بدء التطبيق الميداني.',
            verificationNotes: 'بانتظار استكمال الشواهد لزيارة المشرف والاعتماد.',
            assignedSupervisor: this.settings.supervisorName,
            ...actionData
        };

        this.improvementActions.unshift(newAction);
        this.recalculateTrafficLights();
        this.saveAll();

        // Async Cloud Sync
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            SupabaseService.Actions.createAction(newAction)
                .catch(err => console.warn('[Supabase] Action create sync error:', err));
        }

        return newAction;
    },

    updateActionStatus(actionId, newStatus, verificationNotes) {
        const action = this.improvementActions.find(a => a.id === actionId);
        if (!action) return false;

        action.status = newStatus;
        if (newStatus === 'closed_verified') {
            action.progressPercentage = 100;
            action.verificationNotes = verificationNotes || `تم التحقق الميداني واعتماد إغلاق الإجراء بواسطة ${this.settings.supervisorName}.`;
        } else if (newStatus === 'completed') {
            action.progressPercentage = 90;
            action.evidenceNotes = verificationNotes || 'تم رفع شواهد الإنجاز بانتظار اعتماد المشرف التربوي.';
        }

        this.recalculateTrafficLights();
        this.saveAll();

        // Async Cloud Sync
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            SupabaseService.Actions.updateStatus(actionId, newStatus, verificationNotes)
                .catch(err => console.warn('[Supabase] Action update sync error:', err));
        }

        return action;
    },

    // Set Active Role
    setActiveRole(roleCode) {
        this.activeRole = roleCode;
        localStorage.setItem(this.STORAGE_KEYS.ACTIVE_ROLE, roleCode);
    }
};

window.AppState = AppState;

