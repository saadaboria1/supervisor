/**
 * ==============================================================================
 * منظومة الإشراف التربوي - مدارس المدينة الأكاديمية
 * Auth Module: Authentication, Session Management & Route Guards
 * ==============================================================================
 */

const AuthManager = {
    SESSION_KEY: 'AC_SUPERVISOR_SESSION',

    // Pre-configured authorized supervisor credentials for Al-Madinah Academic Schools
    DEMO_USER: {
        id: 'SUP-8801',
        name: 'د. فرج دنيا',
        role: 'المشرف التربوي المقيم',
        institution: 'مدارس المدينة الأكاديمية',
        email: 'f.donia@academiccity.edu.sa',
        phone: '+966 50 123 4567',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        nationalId: '1088492011'
    },

    /**
     * Checks if current supervisor is authenticated.
     * If not on a public page (like login.html), redirects to login.html.
     */
    initAuthGuard(isLoginPage = false) {
        const session = this.getSession();

        if (isLoginPage) {
            // If already logged in and visiting login.html, redirect to dashboard
            if (session) {
                window.location.href = 'index.html';
            }
        } else {
            // If on protected page and not logged in, redirect to login.html
            if (!session) {
                // Determine path to login.html (handling subfolder /pages/ if any)
                const isInSubfolder = window.location.pathname.includes('/pages/');
                window.location.href = isInSubfolder ? '../login.html' : 'login.html';
            } else {
                this.updateUIWithUser(session);
            }
        }
    },

    /**
     * Authenticates supervisor (via Supabase Auth if connected, or Local Demo Fallback)
     */
    async login(emailOrId, password, rememberMe = true) {
        const normalizedInput = emailOrId.trim().toLowerCase();

        // 1. If Supabase Client is configured & live, try authenticating via Supabase Auth
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            try {
                console.log('[AuthManager] Attempting Supabase Auth Cloud login...');
                const authResult = await SupabaseService.Auth.signIn(emailOrId.trim(), password);
                
                const sessionData = {
                    id: authResult.profile?.id || authResult.user.id,
                    name: authResult.profile?.full_name || authResult.user.user_metadata?.full_name || 'د. فرج دنيا',
                    role: authResult.profile?.role || 'المشرف التربوي المقيم',
                    institution: authResult.profile?.institution || 'مدارس المدينة الأكاديمية',
                    email: authResult.user.email,
                    avatar: authResult.profile?.avatar_url || this.DEMO_USER.avatar,
                    nationalId: authResult.profile?.national_id || this.DEMO_USER.nationalId,
                    loginTime: new Date().toISOString(),
                    rememberMe,
                    authProvider: 'supabase'
                };

                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                return sessionData;
            } catch (supaErr) {
                console.warn('[AuthManager] Supabase Auth failed, checking demo fallback:', supaErr.message);
                // If demo credentials, allow fallback
                const isDemo = normalizedInput.includes('academiccity.edu.sa') || normalizedInput.includes('donia') || normalizedInput.includes('admin');
                if (!isDemo) {
                    throw new Error(supaErr.message || 'بيانات الدخول غير صحيحة.');
                }
            }
        }

        // 2. Local Demo Authentication Fallback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isEmailValid = normalizedInput.includes('academiccity.edu.sa') || 
                                     normalizedInput.includes('admin') || 
                                     normalizedInput.includes('1088492011') ||
                                     normalizedInput.includes('donia') ||
                                     normalizedInput === 'f.donia@academiccity.edu.sa';

                if (isEmailValid && password && password.length >= 4) {
                    const sessionData = {
                        ...this.DEMO_USER,
                        loginTime: new Date().toISOString(),
                        rememberMe,
                        authProvider: 'local'
                    };

                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                    resolve(sessionData);
                } else {
                    reject(new Error('بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.'));
                }
            }, 500);
        });
    },

    /**
     * Instant Demo Login for reviewers
     */
    quickDemoLogin() {
        return this.login('f.donia@academiccity.edu.sa', '123456', true);
    },

    /**
     * Logs out the user and clears sessions
     */
    async logout() {
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isLive()) {
            try {
                await SupabaseService.Auth.signOut();
            } catch (e) {
                console.warn('Supabase logout error:', e);
            }
        }

        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
        
        const isInSubfolder = window.location.pathname.includes('/pages/');
        window.location.href = isInSubfolder ? '../login.html' : 'login.html';
    },

    /**
     * Gets current session data
     */
    getSession() {
        const local = localStorage.getItem(this.SESSION_KEY);
        const session = sessionStorage.getItem(this.SESSION_KEY);
        return local ? JSON.parse(local) : (session ? JSON.parse(session) : null);
    },

    /**
     * Syncs supervisor info across Header and Sidebar elements
     */
    updateUIWithUser(user) {
        if (!user) return;

        // Ensure modern supervisor identity
        if (user.name && user.name.includes('عبدالرحمن')) {
            user.name = 'د. فرج دنيا';
            user.email = 'f.donia@academiccity.edu.sa';
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        }

        const nameElements = ['sidebarSupervisorName', 'headerSupervisorName', 'menuSupervisorName'];
        nameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'headerSupervisorName') {
                    el.textContent = user.name.startsWith('د.') ? user.name : (user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1] || ''));
                } else {
                    el.textContent = user.name;
                }
            }
        });

        const emailEl = document.getElementById('menuSupervisorEmail');
        if (emailEl) emailEl.textContent = user.email;
    }
};

window.AuthManager = AuthManager;
