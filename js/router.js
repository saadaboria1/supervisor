/**
 * ==============================================================================
 * منظومة الإشراف التربوي الذكي - مدارس المدينة الأكاديمية
 * Router Module: Tab Switching, Dynamic Page Routing & History Sync
 * ==============================================================================
 */

const AppRouter = {
    currentRoute: 'dashboard',

    /**
     * Initializes router and listens to hash changes
     */
    init() {
        const hash = window.location.hash.replace('#', '');
        const initialRoute = hash && document.getElementById(`view-${hash}`) ? hash : 'dashboard';
        this.navigateTo(initialRoute, false);

        window.addEventListener('hashchange', () => {
            const currentHash = window.location.hash.replace('#', '');
            if (currentHash && currentHash !== this.currentRoute) {
                this.navigateTo(currentHash, false);
            }
        });
    },

    /**
     * Navigates to a specific view tab
     */
    navigateTo(viewName, updateHash = true) {
        if (!document.getElementById(`view-${viewName}`)) {
            viewName = 'dashboard';
        }

        this.currentRoute = viewName;

        if (updateHash) {
            window.location.hash = viewName;
        }

        // Update active class on sidebar links
        document.querySelectorAll('.sidebar-menu .menu-link').forEach(link => {
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Switch View Pages in DOM
        document.querySelectorAll('.view-page').forEach(page => {
            page.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Trigger on-demand view initializers
        this.onRouteChange(viewName);
    },

    /**
     * Lifecycle hooks on tab change
     */
    onRouteChange(viewName) {
        if (viewName === 'dashboard') {
            UIManager.renderDashboardMetrics();
            UIManager.renderTrafficLightCards();
            ChartsManager.renderDashboardCharts();
        } else if (viewName === 'weekly-plans') {
            UIManager.renderWeeklyPlans();
        } else if (viewName === 'observations') {
            UIManager.renderObservations();
        } else if (viewName === 'actions') {
            UIManager.renderImprovementActions();
        } else if (viewName === 'teachers') {
            UIManager.renderTeachersDirectory();
        } else if (viewName === 'reports') {
            ChartsManager.renderReportsCharts();
        } else if (viewName === 'settings') {
            UIManager.renderSupabaseSettings();
        }
    }
};

window.AppRouter = AppRouter;
window.switchTab = (viewName) => AppRouter.navigateTo(viewName);
