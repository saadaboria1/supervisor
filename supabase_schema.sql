-- ==============================================================================
-- منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
-- Supabase / PostgreSQL Production Schema & Relational Architecture
-- ==============================================================================

-- 1. Enable UUID Extension & Core Configurations
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Custom ENUM Types
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('supervisor', 'teacher', 'academic_leader', 'principal', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE teacher_status AS ENUM ('green', 'yellow', 'red');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_status AS ENUM ('draft', 'submitted', 'under_review', 'needs_revision', 'approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE day_of_week_enum AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_type_enum AS ENUM ('quiz', 'formative_task', 'project', 'performance_task', 'homework');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE observation_status AS ENUM ('scheduled', 'in_review', 'approved_and_shared', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_status AS ENUM ('pending', 'in_progress', 'completed', 'closed_verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. Core Relational Tables
-- ==============================================================================

-- 3.1. User Profiles Table (Linked with Supabase Auth or Standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(10) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(25),
    role user_role DEFAULT 'supervisor'::user_role,
    branch VARCHAR(100) DEFAULT 'مدارس المدينة الأكاديمية',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    institution VARCHAR(150) DEFAULT 'مدارس المدينة الأكاديمية',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. Teachers Directory Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    branch VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    performance_rating NUMERIC(5,2) DEFAULT 85.00,
    plans_submitted INT DEFAULT 0,
    plans_approved INT DEFAULT 0,
    status_color teacher_status DEFAULT 'green'::teacher_status,
    status_reason TEXT DEFAULT 'أداء منتظم وملتزم بالخطط المعتمدة.',
    onedrive_folder_url TEXT,
    classera_teacher_id VARCHAR(50),
    strengths TEXT[] DEFAULT '{}',
    areas_for_improvement TEXT[] DEFAULT '{}',
    active_actions_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3. Weekly Plans Table
CREATE TABLE IF NOT EXISTS public.weekly_plans (
    id VARCHAR(50) PRIMARY KEY,
    teacher_id INT REFERENCES public.teachers(id) ON DELETE CASCADE,
    teacher_name VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade_class VARCHAR(100) NOT NULL,
    branch VARCHAR(120) NOT NULL,
    week_number INT NOT NULL,
    term INT DEFAULT 1,
    date_start DATE,
    date_end DATE,
    monthly_theme VARCHAR(200),
    status plan_status DEFAULT 'submitted'::plan_status,
    onedrive_doc_url TEXT,
    classera_folder_url TEXT,
    submission_date DATE DEFAULT CURRENT_DATE,
    review_date DATE,
    reviewed_by VARCHAR(150),
    supervisor_notes TEXT,
    revisions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4. Weekly Plan Lesson Items (Day-by-Day Lessons)
CREATE TABLE IF NOT EXISTS public.weekly_plan_items (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(50) REFERENCES public.weekly_plans(id) ON DELETE CASCADE,
    day_of_week VARCHAR(30) NOT NULL,
    period_number INT DEFAULT 1,
    lesson_title VARCHAR(250) NOT NULL,
    targeted_skills TEXT,
    homework TEXT,
    classera_url TEXT,
    assessment_type VARCHAR(50) DEFAULT 'formative_task',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5. Plan Reviews Log Table
CREATE TABLE IF NOT EXISTS public.plan_reviews (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(50) REFERENCES public.weekly_plans(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    decision plan_status NOT NULL,
    feedback_notes TEXT,
    completeness_score INT DEFAULT 100,
    ai_check_summary JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6. Classroom Observations Table
CREATE TABLE IF NOT EXISTS public.classroom_observations (
    id VARCHAR(50) PRIMARY KEY,
    teacher_id INT REFERENCES public.teachers(id) ON DELETE CASCADE,
    teacher_name VARCHAR(150) NOT NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    supervisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    branch VARCHAR(120) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade_class VARCHAR(100) NOT NULL,
    visit_date DATE NOT NULL,
    visit_period INT DEFAULT 1,
    visit_time VARCHAR(20) DEFAULT '08:30 ص',
    lesson_topic VARCHAR(250) NOT NULL,
    total_score NUMERIC(5,2) NOT NULL,
    rating_label VARCHAR(60) NOT NULL,
    strengths TEXT,
    areas_for_improvement TEXT,
    supervisor_recommendations TEXT,
    status observation_status DEFAULT 'approved_and_shared'::observation_status,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7. Observation Rubric Scores Breakdown (4-Domain scientific model)
CREATE TABLE IF NOT EXISTS public.observation_scores (
    id SERIAL PRIMARY KEY,
    observation_id VARCHAR(50) REFERENCES public.classroom_observations(id) ON DELETE CASCADE UNIQUE,
    domain_1_planning INT CHECK (domain_1_planning >= 0 AND domain_1_planning <= 20),
    domain_2_teaching_strategies INT CHECK (domain_2_teaching_strategies >= 0 AND domain_2_teaching_strategies <= 30),
    domain_3_classroom_management INT CHECK (domain_3_classroom_management >= 0 AND domain_3_classroom_management <= 25),
    domain_4_assessment_feedback INT CHECK (domain_4_assessment_feedback >= 0 AND domain_4_assessment_feedback <= 25),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8. Improvement Actions Table (SMART Closure Cycle)
CREATE TABLE IF NOT EXISTS public.improvement_actions (
    id VARCHAR(50) PRIMARY KEY,
    observation_id VARCHAR(50) REFERENCES public.classroom_observations(id) ON DELETE SET NULL,
    teacher_id INT REFERENCES public.teachers(id) ON DELETE CASCADE,
    teacher_name VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    branch VARCHAR(120) NOT NULL,
    identified_problem TEXT NOT NULL,
    measurable_action TEXT NOT NULL,
    deadline_date DATE NOT NULL,
    status action_status DEFAULT 'in_progress'::action_status,
    progress_percentage INT DEFAULT 15 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    evidence_notes TEXT,
    evidence_url TEXT,
    verification_notes TEXT,
    assigned_supervisor VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9. Action Follow-ups History
CREATE TABLE IF NOT EXISTS public.action_follow_ups (
    id SERIAL PRIMARY KEY,
    action_id VARCHAR(50) REFERENCES public.improvement_actions(id) ON DELETE CASCADE,
    verified_by_supervisor VARCHAR(150) NOT NULL,
    verification_date DATE DEFAULT CURRENT_DATE,
    verification_notes TEXT NOT NULL,
    outcome VARCHAR(50) DEFAULT 'satisfactory_closed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.10. System Settings & Configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. Triggers: Automatically Update `updated_at` Timestamp
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_teachers_updated_at ON public.teachers;
CREATE TRIGGER set_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_weekly_plans_updated_at ON public.weekly_plans;
CREATE TRIGGER set_weekly_plans_updated_at BEFORE UPDATE ON public.weekly_plans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_classroom_observations_updated_at ON public.classroom_observations;
CREATE TRIGGER set_classroom_observations_updated_at BEFORE UPDATE ON public.classroom_observations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_improvement_actions_updated_at ON public.improvement_actions;
CREATE TRIGGER set_improvement_actions_updated_at BEFORE UPDATE ON public.improvement_actions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Public / Anonymous Read and Write Policies for Platform Client Demo
-- (Can be restricted based on auth.uid() when full Supabase Auth is enabled)
DO $$ 
BEGIN
    -- Profiles
    CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
    CREATE POLICY "Allow public write on profiles" ON public.profiles FOR ALL USING (true);

    -- Teachers
    CREATE POLICY "Allow public read on teachers" ON public.teachers FOR SELECT USING (true);
    CREATE POLICY "Allow public write on teachers" ON public.teachers FOR ALL USING (true);

    -- Weekly Plans
    CREATE POLICY "Allow public read on weekly_plans" ON public.weekly_plans FOR SELECT USING (true);
    CREATE POLICY "Allow public write on weekly_plans" ON public.weekly_plans FOR ALL USING (true);

    -- Weekly Plan Items
    CREATE POLICY "Allow public read on weekly_plan_items" ON public.weekly_plan_items FOR SELECT USING (true);
    CREATE POLICY "Allow public write on weekly_plan_items" ON public.weekly_plan_items FOR ALL USING (true);

    -- Plan Reviews
    CREATE POLICY "Allow public read on plan_reviews" ON public.plan_reviews FOR SELECT USING (true);
    CREATE POLICY "Allow public write on plan_reviews" ON public.plan_reviews FOR ALL USING (true);

    -- Observations
    CREATE POLICY "Allow public read on classroom_observations" ON public.classroom_observations FOR SELECT USING (true);
    CREATE POLICY "Allow public write on classroom_observations" ON public.classroom_observations FOR ALL USING (true);

    -- Observation Scores
    CREATE POLICY "Allow public read on observation_scores" ON public.observation_scores FOR SELECT USING (true);
    CREATE POLICY "Allow public write on observation_scores" ON public.observation_scores FOR ALL USING (true);

    -- Improvement Actions
    CREATE POLICY "Allow public read on improvement_actions" ON public.improvement_actions FOR SELECT USING (true);
    CREATE POLICY "Allow public write on improvement_actions" ON public.improvement_actions FOR ALL USING (true);

    -- Action Follow-ups
    CREATE POLICY "Allow public read on action_follow_ups" ON public.action_follow_ups FOR SELECT USING (true);
    CREATE POLICY "Allow public write on action_follow_ups" ON public.action_follow_ups FOR ALL USING (true);

    -- System Settings
    CREATE POLICY "Allow public read on system_settings" ON public.system_settings FOR SELECT USING (true);
    CREATE POLICY "Allow public write on system_settings" ON public.system_settings FOR ALL USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 6. Seed Relational Dataset (Al-Madinah Academic Schools)
-- ==============================================================================

-- 6.1. Insert Default Supervisor Profile
INSERT INTO public.profiles (id, national_id, full_name, email, phone, role, branch, institution)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', '1088492011', 'د. فرج دنيا', 'f.donia@academiccity.edu.sa', '+966 50 123 4567', 'supervisor', 'مدارس المدينة الأكاديمية', 'مدارس المدينة الأكاديمية')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 6.2. Insert Seed Teachers
INSERT INTO public.teachers (id, employee_code, name, subject, branch, email, phone, performance_rating, plans_submitted, plans_approved, status_color, status_reason, onedrive_folder_url, classera_teacher_id, strengths, areas_for_improvement, active_actions_count)
VALUES
    (1, 'AC-8841', 'أ. أحمد بن سلطان الشمري', 'الرياضيات المتقدمة', 'المدينة الأكاديمية - ثانوي (بنين)', 'a.alshammari@academiccity.edu.sa', '+966 55 112 3344', 96.00, 6, 6, 'green', 'أداء متميز والتزام تام بالخطط الأسبوعية واستراتيجيات التعلم النشط.', 'https://onedrive.live.com/academiccity/teachers/a_shammari_portfolio', 'CLS-SA-8841', ARRAY['توظيف رائع للسبورة الذكية والتطبيقات التفاعلية', 'صياغة أهداف سلوكية واضحة ومقاسة', 'تنويع أساليب التعزيز'], ARRAY['مراعاة وقت استجابة الطلاب الأقل تفاعلاً في الأنشطة الفردية'], 0),
    (2, 'AC-7410', 'أ. محمد بن خالد الدوسري', 'الفيزياء (AP Physics)', 'المدينة الأكاديمية - المسار الدولي', 'm.aldosari@academiccity.edu.sa', '+966 55 223 4455', 88.00, 5, 4, 'yellow', 'خطة الأسبوع 5 بانتظار تعديل الواجبات التفاعلية على كلاسيرة.', 'https://onedrive.live.com/academiccity/teachers/m_dosari_portfolio', 'CLS-SA-7410', ARRAY['التمكن العلمي العالي من منهج الدبلوما الأمريكية', 'تجهيز التجارب المعملية'], ARRAY['زيادة مشاركة مجموعات الطلاب وتوثيق خطة التحسين في الموعد'], 1),
    (3, 'AC-5218', 'أ. يوسف بن زياد الشهري', 'المهارات الرقمية والذكاء الاصطناعي', 'المدينة الأكاديمية - ابتدائي', 'y.alshehri@academiccity.edu.sa', '+966 55 334 5566', 74.00, 3, 2, 'red', 'تأخر في تسليم الخطة الأسبوعية ووجود إجراء تحسيني معلق متجاوز للمهلة.', 'https://onedrive.live.com/academiccity/teachers/y_shehri_portfolio', 'CLS-SA-5218', ARRAY['المعرفة التقنية الحديثة بأدوات الذكاء الاصطناعي'], ARRAY['الإدارة الصفية لطلاب الصفوف الأولية', 'الانضباط في تسليم خطة الأسبوع قبل يوم الخميس'], 2),
    (4, 'AC-6541', 'أ. ريم بنت خالد العتيبي', 'اللغة الإنجليزية (SAT Prep)', 'المدينة الأكاديمية - ثانوي (بنات)', 'r.alotaibi@academiccity.edu.sa', '+966 55 445 6677', 94.00, 6, 6, 'green', 'أداء استثنائي وتكامل تام بين خطة ون درايف وواجبات كلاسيرة.', 'https://onedrive.live.com/academiccity/teachers/r_otaibi_portfolio', 'CLS-SA-6541', ARRAY['استخدام كامل للغة الهدف في الحصة', 'إدارة حلقات النقاش والعصف الذهني'], ARRAY['إتاحة وقت إضافي لمهارات الكتابة الأكاديمية'], 0),
    (5, 'AC-9932', 'أ. سعود بن عبدالله القحطاني', 'اللغة العربية والآداب', 'المدينة الأكاديمية - متوسط (بنين)', 's.alqahtani@academiccity.edu.sa', '+966 55 556 7788', 90.00, 5, 5, 'green', 'تفاعل ممتاز وانضباط عالي في تصحيح الأنشطة الصفية.', 'https://onedrive.live.com/academiccity/teachers/s_qahtani_portfolio', 'CLS-SA-9932', ARRAY['التمكن النحوي والبلاغي', 'إثراء الحصة بالأشعار والنصوص المختارة'], ARRAY['توظيف التقييم الذاتي للطلاب'], 0),
    (6, 'AC-4102', 'أ. طارق بن فهد الحربي', 'الكيمياء العامة', 'المدينة الأكاديمية - ثانوي (بنين)', 't.alharbi@academiccity.edu.sa', '+966 55 667 8899', 82.00, 4, 3, 'yellow', 'يحتاج تفعيل أكبر لتطبيقات المحاكاة المعملية الرقمية في كلاسيرة.', 'https://onedrive.live.com/academiccity/teachers/t_harbi_portfolio', 'CLS-SA-4102', ARRAY['تطبيق معايير السلامة المعملية', 'ربط الدروس بالصناعات الحديثة'], ARRAY['إرفاق روابط الواجبات المعملية بدقة في خطة الأسبوع'], 1)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    performance_rating = EXCLUDED.performance_rating,
    status_color = EXCLUDED.status_color;

-- 6.3. Insert Seed Weekly Plans
INSERT INTO public.weekly_plans (id, teacher_id, teacher_name, subject, grade_class, branch, week_number, term, date_start, date_end, monthly_theme, status, onedrive_doc_url, classera_folder_url, submission_date, review_date, reviewed_by, supervisor_notes, revisions)
VALUES
    ('WP-2026-01', 1, 'أ. أحمد بن سلطان الشمري', 'الرياضيات المتقدمة', 'الصف الثالث الثانوي (علمي - أ)', 'المدينة الأكاديمية - ثانوي (بنين)', 5, 1, '2026-08-24', '2026-08-28', 'قيمة الانضباط والمسؤولية الذاتية', 'approved', 'https://onedrive.live.com/academiccity/plans/math_sec3_w5.docx', 'https://me.classera.com/academiccity/courses/math301/materials', '2026-08-21', '2026-08-22', 'د. فرج دنيا', 'خطة ممتازة ومكتملة العناصر مع توزيع زمني دقيق.', '[{"date": "2026-08-22", "by": "د. فرج دنيا", "action": "اعتماد الخطة", "comment": "الخطة مكتملة الشواهد ومطابقة لمعايير القسم."}]'::jsonb),
    ('WP-2026-02', 2, 'أ. محمد بن خالد الدوسري', 'الفيزياء (AP Physics)', 'Grade 11 (American Diploma)', 'المدينة الأكاديمية - المسار الدولي', 5, 1, '2026-08-24', '2026-08-28', 'التفكير الناقد وحل المشكلات', 'needs_revision', 'https://onedrive.live.com/academiccity/plans/physics_g11_w5.docx', 'https://me.classera.com/academiccity/courses/phys11/materials', '2026-08-22', '2026-08-23', 'د. فرج دنيا', 'يرجى ربط تجارب معمل الكهرومغناطيسية بروابط واجبات كلاسيرة المحددة بدلاً من الإشارة العامة.', '[{"date": "2026-08-23", "by": "د. فرج دنيا", "action": "طلب تعديل", "comment": "الخطة تفتقر لروابط الواجبات التفاعلية على كلاسيرة في حصتي الثلاثاء والخميس."}]'::jsonb),
    ('WP-2026-03', 3, 'أ. يوسف بن زياد الشهري', 'المهارات الرقمية والذكاء الاصطناعي', 'الصف السادس الابتدائي', 'المدينة الأكاديمية - ابتدائي', 5, 1, '2026-08-24', '2026-08-28', 'المواطنة الرقمية والأمن السيبراني', 'submitted', 'https://onedrive.live.com/academiccity/plans/digital_g6_w5.docx', 'https://me.classera.com/academiccity/courses/it6/materials', '2026-08-24', NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 6.4. Insert Seed Plan Items
INSERT INTO public.weekly_plan_items (plan_id, day_of_week, period_number, lesson_title, targeted_skills, homework, classera_url, assessment_type)
VALUES
    ('WP-2026-01', 'الأحد', 2, 'حساب النهايات جبرياً باستخدام المرافق والتحليل', 'التحليل الرياضي وحل المعادلات الكسرية', 'حل تدريب (1-3) ص 42 على كلاسيرة', 'https://me.classera.com/homework/math301/hw12', 'formative_task'),
    ('WP-2026-01', 'الإثنين', 3, 'تطبيقات النهايات عند المالانهاية والدوال النسبية', 'التمثيل البياني والتوقع الرياضي', 'واجب تفاعلي رقم (4) عبر بنك الأسئلة', 'https://me.classera.com/homework/math301/hw13', 'quiz'),
    ('WP-2026-01', 'الثلاثاء', 1, 'الاتصال وسلوك طرفي التمثيل البياني', 'التفكير الاستنتاجي وربط المفاهيم', 'بطاقة عمل فردية رقم 5', 'https://me.classera.com/homework/math301/hw14', 'performance_task'),
    ('WP-2026-01', 'الأربعاء', 4, 'نظرية القيمة المتوسطة ومبرهنة رول', 'البرهان الرياضي والاستدلال المنطقي', 'اختبار قصير إلكتروني مدته 10 دقائق', 'https://me.classera.com/quizzes/math301/q2', 'quiz'),
    ('WP-2026-01', 'الخميس', 2, 'تطبيقات حياتية وفيزيائية على المشتقات الأولى', 'النمذجة الرياضية وحل المشكلات الحياتية', 'مشروع أسبوعي مصغر: نمذجة حركة مقذوف', 'https://me.classera.com/projects/math301/p1', 'project')
ON CONFLICT DO NOTHING;

-- 6.5. Insert Seed Classroom Observations & Scores
INSERT INTO public.classroom_observations (id, teacher_id, teacher_name, supervisor_name, branch, subject, grade_class, visit_date, visit_period, visit_time, lesson_topic, total_score, rating_label, strengths, areas_for_improvement, supervisor_recommendations, status)
VALUES
    ('OBS-101', 1, 'أ. أحمد بن سلطان الشمري', 'د. فرج دنيا', 'المدينة الأكاديمية - ثانوي (بنين)', 'الرياضيات المتقدمة', 'الصف الثالث الثانوي (علمي - أ)', '2026-08-24', 2, '08:30 ص', 'حساب النهايات وتطبيقاتها في الدوال النسبية', 96.00, 'ممتاز مرتفع', 'إدارة صفية مبهرة وتوظيف نموذجي للشاشات التفاعلية مع إشراك 100% من المجموعات.', 'منح وقت تفكير إضافي قبل استقبال الإجابات الفردية لبعض الطلاب.', 'الاستمرار على هذا الأداء النوعي ونقل الخبرة لزملاء التخصص عبر ورشة عمل داخلية.', 'approved_and_shared'),
    ('OBS-102', 2, 'أ. محمد بن خالد الدوسري', 'د. فرج دنيا', 'المدينة الأكاديمية - المسار الدولي', 'الفيزياء (AP Physics)', 'Grade 11 (American Diploma)', '2026-08-23', 3, '10:15 ص', 'Electromagnetic Induction & Faraday Law Experiments', 88.00, 'جيد جداً مرتفع', 'تمكن علمي عميق من معايير الـ AP وتجهيز تجارب المعمل بدقة متناهية.', 'ضرورة تفعيل النقاش البيني بين الطلاب وتجنب التفسير المباشر لكافة النتائج.', 'إعداد أوراق عمل تفاعلية تلزم كل طالب بتسجيل استنتاجه قبل الإعلان الجماعي.', 'approved_and_shared'),
    ('OBS-103', 3, 'أ. يوسف بن زياد الشهري', 'د. فرج دنيا', 'المدينة الأكاديمية - ابتدائي', 'المهارات الرقمية والذكاء الاصطناعي', 'الصف السادس الابتدائي (أ)', '2026-08-20', 1, '08:00 ص', 'مقدمة في الخوارزميات وبرمجة سكراتش المتقدمة', 74.00, 'يحتاج تطوير وتدريب', 'حماس تقني ومعرفة ممتازة بلغات البرمجة الحديثة وأدوات الذكاء الاصطناعي.', 'ضعف الإدارة الصفية وكثرة حركة الطلاب أثناء التطبيق المعملي وتأخر بداية الحصة 10 دقائق.', 'تطبيق ميثاق الانضباط الصفي وتوزيع المهام ببطاقات واضحة وتفعيل معايير التقييم البنائي.', 'approved_and_shared')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.observation_scores (observation_id, domain_1_planning, domain_2_teaching_strategies, domain_3_classroom_management, domain_4_assessment_feedback)
VALUES
    ('OBS-101', 20, 29, 24, 23),
    ('OBS-102', 18, 26, 22, 22),
    ('OBS-103', 14, 21, 18, 21)
ON CONFLICT (observation_id) DO NOTHING;

-- 6.6. Insert Seed Improvement Actions
INSERT INTO public.improvement_actions (id, observation_id, teacher_id, teacher_name, subject, branch, identified_problem, measurable_action, deadline_date, status, progress_percentage, evidence_notes, evidence_url, verification_notes, assigned_supervisor)
VALUES
    ('ACT-201', 'OBS-103', 3, 'أ. يوسف بن زياد الشهري', 'المهارات الرقمية والذكاء الاصطناعي', 'المدينة الأكاديمية - ابتدائي', 'ضعف ضبط السلوك الصفي وتشتت الطلاب أثناء التطبيق على أجهزة الحاسب.', 'تطبيق نظام المجموعات التعاونية مع قائد لكل جهاز واعتماد بطاقات السلوك الإيجابي وتوثيق حصتين بملف فيديو قصير.', '2026-08-22', 'in_progress', 30, 'تم إعداد البطاقات وتوزيع المجموعات ولكن لم يتم رفع شواهد الحصص حتى الآن.', 'https://onedrive.live.com/academiccity/evidence/shehri_act201', 'تجاوز المهلة المحددة، تم توجيه إنذار أصفر للمعلم ومتابعة قائد القسم لتحديد موعد الزيارة التتبعية.', 'د. فرج دنيا'),
    ('ACT-202', 'OBS-102', 2, 'أ. محمد بن خالد الدوسري', 'الفيزياء (AP Physics)', 'المدينة الأكاديمية - المسار الدولي', 'قلة تفعيل استراتيجية التعلم القائم على الاستقصاء واقتصار الحصة على الشرح الإلقائي في المعمل.', 'تنفيذ حصة استقصائية متكاملة بحيث يقوم الطلاب باكتشاف العلاقة الرياضية لقانون فاراداي بأنفسهم ورفع تقرير المعمل على كلاسيرة.', '2026-09-03', 'in_progress', 65, 'تم تطبيق الحصة الاستقصائية يوم الإثنين ورفع تقارير الطلاب على كلاسيرة.', 'https://onedrive.live.com/academiccity/evidence/dosari_act202', 'بانتظار إجراء الزيارة التتبعية من المشرف لاعتماد إغلاق الإجراء نهائياً.', 'د. فرج دنيا')
ON CONFLICT (id) DO NOTHING;

-- 6.7. Default System Settings
INSERT INTO public.system_settings (key, value, description)
VALUES
    ('criteria_weights', '{"planning": 20, "teaching": 30, "classroom": 25, "assessment": 25}'::jsonb, 'أوزان معايير بطاقة الملاحظة الصفية'),
    ('supervisor_profile', '{"name": "د. فرج دنيا", "email": "f.donia@academiccity.edu.sa", "role": "المشرف التربوي المقيم", "institution": "مدارس المدينة الأكاديمية"}'::jsonb, 'بيانات المشرف التربوي الافتراضية')
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- End of Supabase Schema & Seed Script
-- ==============================================================================
