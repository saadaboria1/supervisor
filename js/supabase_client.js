/**
 * ==============================================================================
 * منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
 * Supabase Client Initializer & Connection Manager
 * ==============================================================================
 */

const SupabaseConfig = {
    STORAGE_KEY: 'AC_SUPABASE_CONFIG',
    
    // Configured for Al-Madinah Academic Schools project
    defaultConfig: {
        url: 'https://cxcawkqtbwcorrmpdmlj.supabase.co',
        anonKey: 'sb_publishable_PlMp4cZYNLGEkAZYfRjFJQ_ahy59e6h',
        mode: 'cloud', // 'auto' | 'cloud' | 'local'
        lastTested: null,
        isConnected: false
    },

    /**
     * Gets current configuration from localStorage
     */
    getConfig() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : {};
            return {
                url: parsed.url || this.defaultConfig.url,
                anonKey: parsed.anonKey || this.defaultConfig.anonKey,
                mode: parsed.mode || this.defaultConfig.mode,
                lastTested: parsed.lastTested || null,
                isConnected: parsed.isConnected ?? this.defaultConfig.isConnected
            };
        } catch (e) {
            return { ...this.defaultConfig };
        }
    },

    /**
     * Saves configuration to localStorage
     */
    saveConfig(config) {
        const current = this.getConfig();
        const updated = { ...current, ...config };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('supabase-config-updated', { detail: updated }));
        return updated;
    },

    /**
     * Checks if Supabase credentials are configured
     */
    isConfigured() {
        const config = this.getConfig();
        return Boolean(config.url && config.anonKey && config.url.startsWith('http'));
    }
};

const SupabaseClientManager = {
    client: null,
    isInitialized: false,

    /**
     * Checks if configured
     */
    isConfigured() {
        return SupabaseConfig.isConfigured();
    },

    /**
     * Initializes the Supabase JS Client instance
     */
    init() {
        const config = SupabaseConfig.getConfig();

        // Verify if Supabase JS SDK is loaded via CDN
        if (typeof window.supabase === 'undefined' && typeof window.createClient === 'undefined') {
            console.warn('[Supabase] SDK not detected on window. Operating in Offline/LocalStorage Mode.');
            return null;
        }

        const createClientFn = window.supabase?.createClient || window.createClient;

        if (config.url && config.anonKey && createClientFn) {
            try {
                this.client = createClientFn(config.url.trim(), config.anonKey.trim(), {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                });
                this.isInitialized = true;
                window.supabaseClient = this.client;
                console.log('✅ [Supabase] Client initialized successfully for:', config.url);
                return this.client;
            } catch (err) {
                console.error('❌ [Supabase] Initialization error:', err);
                this.client = null;
                this.isInitialized = false;
                return null;
            }
        } else {
            this.client = null;
            this.isInitialized = false;
            return null;
        }
    },

    /**
     * Gets the active Supabase Client instance
     */
    getClient() {
        if (!this.client && SupabaseConfig.isConfigured()) {
            this.init();
        }
        return this.client;
    },

    /**
     * Tests live cloud connectivity and measures latency
     */
    async testConnection(customUrl = null, customKey = null) {
        const url = (customUrl || SupabaseConfig.getConfig().url || '').trim();
        const key = (customKey || SupabaseConfig.getConfig().anonKey || '').trim();

        if (!url || !key) {
            return {
                success: false,
                message: 'يرجى إدخال عنوان المشروع (Project URL) ومفتاح الوصول (Anon Key) أولاً.'
            };
        }

        const startTime = performance.now();

        try {
            // First check direct REST endpoint ping
            const cleanUrl = url.replace(/\/$/, '');
            const restResponse = await fetch(`${cleanUrl}/rest/v1/teachers?select=id&limit=1`, {
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`
                }
            });

            const latencyMs = Math.round(performance.now() - startTime);

            if (restResponse.ok) {
                SupabaseConfig.saveConfig({ url, anonKey: key, isConnected: true, lastTested: new Date().toISOString() });
                this.init();
                return {
                    success: true,
                    latencyMs,
                    needsMigration: false,
                    message: `تم الاتصال بقاعدة البيانات السحابية بنجاح تام! سرعة الاستجابة: ${latencyMs} مللي ثانية.`
                };
            }

            // If table doesn't exist (404 or relation missing), check system_settings or root
            if (restResponse.status === 404 || restResponse.status === 400) {
                const text = await restResponse.text();
                if (text.includes('does not exist') || text.includes('relation') || restResponse.status === 404) {
                    SupabaseConfig.saveConfig({ url, anonKey: key, isConnected: true, lastTested: new Date().toISOString() });
                    this.init();
                    return {
                        success: true,
                        latencyMs,
                        needsMigration: true,
                        message: `تم الاتصال بمشروعك في سوبابيز بنجاح (${latencyMs}ms)! يرجى تشغيل سكريبت supabase_schema.sql لإنشاء الجداول.`
                    };
                }
            }

            if (restResponse.status === 401 || restResponse.status === 403) {
                throw new Error('مفتاح الوصول غير صحيح أو منتهي الصلاحية (Invalid API Key).');
            }

            throw new Error(`استجابة الخادم: ${restResponse.status} ${restResponse.statusText}`);
        } catch (err) {
            SupabaseConfig.saveConfig({ isConnected: false, lastTested: new Date().toISOString() });
            return {
                success: false,
                error: err,
                message: `فشل الاتصال: ${err.message || 'تأكد من صحة الرابط ومفتاح الوصول ومن اتصال الإنترنت.'}`
            };
        }
    }
};

// Global expose
window.SupabaseConfig = SupabaseConfig;
window.SupabaseClientManager = SupabaseClientManager;

// Auto-initialize on load if keys exist
document.addEventListener('DOMContentLoaded', () => {
    SupabaseClientManager.init();
});
