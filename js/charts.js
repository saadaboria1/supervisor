/**
 * ==============================================================================
 * منظومة الإشراف التربوي - مدارس المدينة الأكاديمية
 * Charts Module: High-Definition Chart.js Visualizations
 * ==============================================================================
 */

const ChartsManager = {
    instances: {
        dashboardVisits: null,
        dashboardRating: null,
        reportsBranch: null,
        reportsTrend: null
    },

    /**
     * Renders Dashboard Visualizations
     */
    renderDashboardCharts() {
        if (typeof Chart === 'undefined') return;

        const visitsCanvas = document.getElementById('dashboardVisitsChart');
        const ratingCanvas = document.getElementById('dashboardRatingChart');

        if (visitsCanvas) {
            if (this.instances.dashboardVisits) this.instances.dashboardVisits.destroy();

            this.instances.dashboardVisits = new Chart(visitsCanvas, {
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
                    plugins: {
                        legend: { position: 'top', rtl: true }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        if (ratingCanvas) {
            if (this.instances.dashboardRating) this.instances.dashboardRating.destroy();

            this.instances.dashboardRating = new Chart(ratingCanvas, {
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
                    plugins: {
                        legend: { position: 'bottom', rtl: true }
                    }
                }
            });
        }
    },

    /**
     * Renders Reports & Advanced Analytics Charts
     */
    renderReportsCharts() {
        if (typeof Chart === 'undefined') return;

        const branchCanvas = document.getElementById('reportsBranchComparisonChart');
        const trendCanvas = document.getElementById('reportsTrendChart');

        if (branchCanvas) {
            if (this.instances.reportsBranch) this.instances.reportsBranch.destroy();

            this.instances.reportsBranch = new Chart(branchCanvas, {
                type: 'radar',
                data: {
                    labels: ['التخطيط', 'استراتيجيات التعلم', 'إدارة الصف', 'التقويم الصفي', 'الابتكار والتقنية'],
                    datasets: [{
                        label: 'القسم الثانوي',
                        data: [95, 92, 94, 91, 93],
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderColor: '#2563eb',
                        borderWidth: 2
                    }, {
                        label: 'المسار الدولي (American Diploma)',
                        data: [92, 96, 91, 94, 98],
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: '#10b981',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', rtl: true }
                    }
                }
            });
        }

        if (trendCanvas) {
            if (this.instances.reportsTrend) this.instances.reportsTrend.destroy();

            this.instances.reportsTrend = new Chart(trendCanvas, {
                type: 'line',
                data: {
                    labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6'],
                    datasets: [{
                        label: 'متوسط درجات التقييم العام',
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
                    scales: {
                        y: { min: 80, max: 100 }
                    }
                }
            });
        }
    }
};

window.ChartsManager = ChartsManager;
