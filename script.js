// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Sidebar Management
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResize();
    }

    bindEvents() {
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!this.sidebar.contains(e.target) && this.sidebar.classList.contains('active')) {
                    this.closeSidebar();
                }
            }
        });

        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    closeSidebar() {
        this.sidebar.classList.remove('active');
    }

    handleResize() {
        if (window.innerWidth > 1024) {
            this.sidebar.classList.remove('active');
        }
    }
}

// Modal Management
class ModalManager {
    constructor() {
        this.modals = {
            add: document.getElementById('addModal'),
            update: document.getElementById('updateModal'),
            settings: document.getElementById('settingsModal'),
            alumniRecords: document.getElementById('alumniRecordsModal')
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.showCurrentPage();
    }

    bindEvents() {
        // Add Alumni Modal
        const addBtn = document.getElementById('addAlumniBtn');
        const closeAddBtn = document.getElementById('closeAddModal');
        const cancelAddBtn = document.getElementById('cancelAdd');
        const saveAddBtn = document.getElementById('saveAdd');

        if (addBtn) addBtn.addEventListener('click', () => this.openModal('add'));
        if (closeAddBtn) closeAddBtn.addEventListener('click', () => this.closeModal('add'));
        if (cancelAddBtn) cancelAddBtn.addEventListener('click', () => this.closeModal('add'));
        if (saveAddBtn) saveAddBtn.addEventListener('click', () => this.handleAddAlumni());

        // Update Alumni Modal
        const updateBtn = document.getElementById('updateBtn');
        const closeUpdateBtn = document.getElementById('closeUpdateModal');
        const cancelUpdateBtn = document.getElementById('cancelUpdate');
        const saveUpdateBtn = document.getElementById('saveUpdate');

        if (updateBtn) updateBtn.addEventListener('click', () => this.handleUpdateSelected());
        if (closeUpdateBtn) closeUpdateBtn.addEventListener('click', () => this.closeModal('update'));
        if (cancelUpdateBtn) cancelUpdateBtn.addEventListener('click', () => this.closeModal('update'));
        if (saveUpdateBtn) saveUpdateBtn.addEventListener('click', () => this.handleUpdateAlumni());

        // Settings Modal
        const settingsLink = document.getElementById('settingsLink');
        const closeSettingsBtn = document.getElementById('closeSettingsModal');
        const cancelSettingsBtn = document.getElementById('cancelSettings');
        const saveSettingsBtn = document.getElementById('saveSettings');

        if (settingsLink) settingsLink.addEventListener('click', () => this.openModal('settings'));
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => this.closeModal('settings'));
        if (cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', () => this.closeModal('settings'));
        if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', () => this.handleSaveSettings());

        // Alumni Records Modal
        const alumniRecordsLink = document.getElementById('alumniRecordsLink');
        const closeAlumniRecordsBtn = document.getElementById('closeAlumniRecordsModal');
        const closeRecordsModalBtn = document.getElementById('closeRecordsModal');

        if (alumniRecordsLink) alumniRecordsLink.addEventListener('click', () => this.openModal('alumniRecords'));
        if (closeAlumniRecordsBtn) closeAlumniRecordsBtn.addEventListener('click', () => this.closeModal('alumniRecords'));
        if (closeRecordsModalBtn) closeRecordsModalBtn.addEventListener('click', () => this.closeModal('alumniRecords'));

        // Alumni Records functionality
        const exportCSVBtn = document.getElementById('exportCSV');
        const exportPDFBtn = document.getElementById('exportPDF');
        const exportExcelBtn = document.getElementById('exportExcel');
        const importBtn = document.getElementById('importBtn');
        const backupDataBtn = document.getElementById('backupData');
        const restoreDataBtn = document.getElementById('restoreData');
        const clearAllDataBtn = document.getElementById('clearAllData');

        if (exportCSVBtn) exportCSVBtn.addEventListener('click', () => this.handleExport('csv'));
        if (exportPDFBtn) exportPDFBtn.addEventListener('click', () => this.handleExport('pdf'));
        if (exportExcelBtn) exportExcelBtn.addEventListener('click', () => this.handleExport('excel'));
        if (importBtn) importBtn.addEventListener('click', () => this.handleImport());
        if (backupDataBtn) backupDataBtn.addEventListener('click', () => this.handleBackup());
        if (restoreDataBtn) restoreDataBtn.addEventListener('click', () => this.handleRestore());
        if (clearAllDataBtn) clearAllDataBtn.addEventListener('click', () => this.handleClearAll());

        // Edit buttons in table
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                this.openModal('update');
            }
        });

        // Close modal when clicking overlay
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal.id.replace('Modal', ''));
                    }
                });
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(type) {
        const modal = this.modals[type];
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Load settings into form when settings modal opens
            if (type === 'settings') {
                this.loadSettingsToForm();
            }
            
            // Focus first input
            const firstInput = modal.querySelector('input, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(type) {
        const modal = this.modals[type];
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        Object.keys(this.modals).forEach(type => {
            this.closeModal(type);
        });
    }

    handleAddAlumni() {
        // Get form data
        const formData = {
            name: document.getElementById('addName').value,
            email: document.getElementById('addEmail').value,
            department: document.getElementById('addDepartment').value,
            year: document.getElementById('addYear').value,
            jobTitle: document.getElementById('addJobTitle').value,
            company: document.getElementById('addCompany').value
        };

        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Simulate API call
        this.showNotification('Alumni added successfully!', 'success');
        this.closeModal('add');
        this.clearForm('add');
        
        // Add to table (simulation)
        this.addAlumniToTable(formData);
    }

    handleUpdateSelected() {
        const selectedRows = document.querySelectorAll('tbody tr.selected');
        if (selectedRows.length === 0) {
            this.showNotification('Please select at least one alumni record to update', 'error');
            return;
        }
        if (selectedRows.length > 1) {
            this.showNotification('Please select only one alumni record to update', 'error');
            return;
        }
        
        const row = selectedRows[0];
        const cells = row.cells;
        
        // Populate the update form with selected row data
        document.getElementById('updateName').value = cells[2].querySelector('span').textContent;
        document.getElementById('updateEmail').value = cells[3].textContent;
        document.getElementById('updateDepartment').value = cells[4].querySelector('.dept-badge').textContent;
        document.getElementById('updateYear').value = cells[5].textContent;
        document.getElementById('updateJobTitle').value = cells[6].textContent;
        document.getElementById('updateCompany').value = cells[7].textContent;
        
        this.openModal('update');
    }

    handleUpdateAlumni() {
        console.log('handleUpdateAlumni called'); // Debug log
        
        // Get form data
        const formData = {
            name: document.getElementById('updateName').value,
            email: document.getElementById('updateEmail').value,
            department: document.getElementById('updateDepartment').value,
            year: document.getElementById('updateYear').value,
            jobTitle: document.getElementById('updateJobTitle').value,
            company: document.getElementById('updateCompany').value
        };

        console.log('Form data:', formData); // Debug log

        // Validate form
        if (!this.validateForm(formData)) {
            console.log('Form validation failed'); // Debug log
            return;
        }

        // Find the selected row and update it
        const selectedRows = document.querySelectorAll('tbody tr.selected');
        console.log('Selected rows found:', selectedRows.length); // Debug log
        
        if (selectedRows.length === 1) {
            const row = selectedRows[0];
            const cells = row.cells;
            
            console.log('Updating row:', row); // Debug log
            
            try {
                // Update the table row with new data
                const nameSpan = cells[2].querySelector('span');
                if (nameSpan) {
                    nameSpan.textContent = formData.name;
                    console.log('Updated name to:', formData.name); // Debug log
                }
                
                cells[3].textContent = formData.email;
                console.log('Updated email to:', formData.email); // Debug log
                
                // Update department badge
                const deptBadge = cells[4].querySelector('.dept-badge');
                if (deptBadge) {
                    deptBadge.textContent = formData.department;
                    deptBadge.className = `dept-badge ${this.getDepartmentClass(formData.department)}`;
                    console.log('Updated department to:', formData.department); // Debug log
                }
                
                cells[5].textContent = formData.year;
                cells[6].textContent = formData.jobTitle;
                cells[7].textContent = formData.company;
                
                console.log('All fields updated successfully'); // Debug log
                
                // Clear selection manually
                row.classList.remove('selected');
                const checkbox = row.querySelector('.checkbox');
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                // Update the global selectedRows Set if it exists
                if (window.tableManager && window.tableManager.selectedRows) {
                    window.tableManager.selectedRows.delete(row);
                    window.tableManager.updateDeleteButton();
                }
                
                console.log('Selection cleared'); // Debug log
                
            } catch (error) {
                console.error('Error updating row:', error); // Debug log
                this.showNotification('Error updating alumni record', 'error');
                return;
            }
        } else {
            console.log('No row selected or multiple rows selected'); // Debug log
            this.showNotification('Please select exactly one alumni record to update', 'error');
            return;
        }

        // Simulate API call
        this.showNotification('Alumni updated successfully!', 'success');
        this.closeModal('update');
        this.clearForm('update');
        
        console.log('Update completed successfully'); // Debug log
    }

    handleSaveSettings() {
        const settings = {
            theme: document.getElementById('themeSetting').value,
            language: document.getElementById('languageSetting').value,
            recordsPerPage: document.getElementById('recordsPerPage').value,
            autoSave: document.getElementById('autoSave').checked,
            emailNotifications: document.getElementById('emailNotifications').checked,
            browserNotifications: document.getElementById('browserNotifications').checked
        };
        
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        // Apply settings to TableManager
        if (window.tableManager) {
            window.tableManager.applySettings(settings);
        }
        
        this.showNotification('Settings saved successfully!', 'success');
        this.closeModal('settings');
    }

    loadSettingsToForm() {
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                // Load settings into form fields
                if (settings.theme) {
                    document.getElementById('themeSetting').value = settings.theme;
                }
                if (settings.language) {
                    document.getElementById('languageSetting').value = settings.language;
                }
                if (settings.recordsPerPage) {
                    document.getElementById('recordsPerPage').value = settings.recordsPerPage;
                }
                if (settings.autoSave !== undefined) {
                    document.getElementById('autoSave').checked = settings.autoSave;
                }
                if (settings.emailNotifications !== undefined) {
                    document.getElementById('emailNotifications').checked = settings.emailNotifications;
                }
                if (settings.browserNotifications !== undefined) {
                    document.getElementById('browserNotifications').checked = settings.browserNotifications;
                }
            }
        } catch (error) {
            console.error('Error loading settings to form:', error);
        }
    }

    handleExport(format) {
        const table = document.querySelector('.alumni-table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        let data = [];
        rows.forEach(row => {
            const cells = row.cells;
            data.push({
                id: cells[1].textContent,
                name: cells[2].querySelector('span').textContent,
                email: cells[3].textContent,
                department: cells[4].querySelector('.dept-badge').textContent,
                year: cells[5].textContent,
                jobTitle: cells[6].textContent,
                company: cells[7].textContent
            });
        });
        
        if (format === 'csv') {
            this.exportToCSV(data);
        } else if (format === 'excel') {
            this.exportToExcel(data);
        } else if (format === 'pdf') {
            this.exportToPDF(data);
        }
        
        this.showNotification(`${format.toUpperCase()} export completed!`, 'success');
    }

    exportToCSV(data) {
        const headers = ['ID', 'Name', 'Email', 'Department', 'Year', 'Job Title', 'Company'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.id,
                `"${row.name}"`,
                `"${row.email}"`,
                `"${row.department}"`,
                row.year,
                `"${row.jobTitle}"`,
                `"${row.company}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'alumni_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    exportToExcel(data) {
        // Simple Excel-like export using CSV format
        this.exportToCSV(data);
    }

    exportToPDF(data) {
        // Simple PDF-like export using print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>Alumni Data</title></head>
                <body>
                    <h1>Alumni Data</h1>
                    <table border="1" style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Year</th><th>Job Title</th><th>Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => `
                                <tr>
                                    <td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.department}</td><td>${row.year}</td><td>${row.jobTitle}</td><td>${row.company}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    handleImport() {
        const fileInput = document.getElementById('importFile');
        fileInput.click();
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showNotification('File import functionality would be implemented here', 'info');
            }
        });
    }

    handleBackup() {
        const tableData = this.getTableData();
        const backup = {
            timestamp: new Date().toISOString(),
            data: tableData
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `alumni_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Backup created successfully!', 'success');
    }

    handleRestore() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showNotification('Restore functionality would be implemented here', 'info');
            }
        };
        input.click();
    }

    handleClearAll() {
        if (confirm('Are you sure you want to clear all alumni data? This action cannot be undone.')) {
            const tbody = document.getElementById('alumniTableBody');
            tbody.innerHTML = '';
            this.showNotification('All alumni data cleared!', 'success');
        }
    }

    getTableData() {
        const table = document.querySelector('.alumni-table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        return rows.map(row => {
            const cells = row.cells;
            return {
                id: cells[1].textContent,
                name: cells[2].querySelector('span').textContent,
                email: cells[3].textContent,
                department: cells[4].querySelector('.dept-badge').textContent,
                year: cells[5].textContent,
                jobTitle: cells[6].textContent,
                company: cells[7].textContent
            };
        });
    }

    validateForm(data) {
        const required = ['name', 'email', 'department', 'year'];
        const missing = required.filter(field => !data[field] || data[field].trim() === '');
        
        if (missing.length > 0) {
            this.showNotification(`Please fill in all required fields: ${missing.join(', ')}`, 'error');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    clearForm(type) {
        const modal = this.modals[type];
        if (modal) {
            const inputs = modal.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }
    }

    addAlumniToTable(data) {
        const tbody = document.getElementById('alumniTableBody');
        if (!tbody) return;

        const newId = String(tbody.children.length + 1).padStart(3, '0');
        const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        const deptClass = this.getDepartmentClass(data.department);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="checkbox"></td>
            <td><span class="id-badge">${newId}</span></td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${initials}</div>
                    <span>${data.name}</span>
                </div>
            </td>
            <td>${data.email}</td>
            <td><span class="dept-badge ${deptClass}">${data.department}</span></td>
            <td>${data.year}</td>
            <td>${data.jobTitle || '-'}</td>
            <td>${data.company || '-'}</td>
            <td>
                <div class="action-buttons-cell">
                    <button class="btn-icon-small edit-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon-small delete-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    }

    getDepartmentClass(department) {
        const deptMap = {
            'Computer Science & Engineering': 'cs',
            'Computer Science': 'cs',
            'Electrical Engineering': 'ee',
            'Mechanical Engineering': 'me',
            'Civil Engineering': 'ce',
            'Data Science': 'cs'
        };
        return deptMap[department] || 'cs';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 3000;
                    max-width: 400px;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: var(--shadow-lg);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    background-color: var(--success-green);
                    color: white;
                }
                .notification-error {
                    background-color: var(--danger-red);
                    color: white;
                }
                .notification-info {
                    background-color: var(--primary-yellow);
                    color: white;
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    showCurrentPage() {
        // Only paginate rows that are currently filtered in (data-visible="true")
        const allRows = Array.from(document.querySelectorAll('tbody tr'));
        const visibleRows = allRows.filter(row => row.getAttribute('data-visible') === 'true');
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;

        visibleRows.forEach((row, index) => {
            if (index >= startIndex && index < endIndex) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        // Hide all other rows
        allRows.forEach(row => {
            if (!visibleRows.includes(row)) {
                row.style.display = 'none';
            }
        });
    }
}

// Table Management
class TableManager {
    constructor() {
        this.selectedRows = new Set();
        this.currentPage = 1;
        this.recordsPerPage = 4;
        this.searchTerm = '';
        this.selectedDepartment = 'All Departments';
        this.selectedYear = 'All Years';
        this.loadSettings(); // Load saved settings
        this.init();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (settings.recordsPerPage) {
                    this.recordsPerPage = parseInt(settings.recordsPerPage);
                    console.log(`Loaded records per page setting: ${this.recordsPerPage}`);
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    applySettings(settings) {
        if (settings.recordsPerPage) {
            const newRecordsPerPage = parseInt(settings.recordsPerPage);
            if (newRecordsPerPage !== this.recordsPerPage) {
                this.recordsPerPage = newRecordsPerPage;
                this.currentPage = 1; // Reset to first page when changing records per page
                this.updatePagination();
                this.showCurrentPage();
                console.log(`Applied new records per page setting: ${this.recordsPerPage}`);
            }
        }
    }

    init() {
        this.bindEvents();
        this.updatePagination();
        this.showCurrentPage();
    }

    bindEvents() {
        // Select all checkbox
        const selectAllCheckbox = document.querySelector('thead .checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.selectAll(e.target.checked);
            });
        }

        // Individual row checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('checkbox') && e.target.closest('tbody')) {
                this.handleRowSelection(e.target);
            }
        });

        // Delete button
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.handleDelete());
        }

        // Delete buttons in table
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                this.handleRowDelete(e.target.closest('tr'));
            }
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
            });
        }

        // Department and Year filter functionality (native <select> only for reliability)
        const filterSelects = document.querySelectorAll('.filter-select');
        if (filterSelects.length >= 2) {
            filterSelects[0].addEventListener('change', (e) => {
                this.selectedDepartment = e.target.value;
                this.applyFilters();
            });
            filterSelects[1].addEventListener('change', (e) => {
                this.selectedYear = e.target.value;
                this.applyFilters();
            });
        }

        // Pagination controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn')) {
                const page = e.target.textContent;
                if (page === 'Previous') {
                    this.goToPage(this.currentPage - 1);
                } else if (page === 'Next') {
                    this.goToPage(this.currentPage + 1);
                } else if (!isNaN(page)) {
                    this.goToPage(parseInt(page));
                }
            }
        });
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.showCurrentPage();
            this.updatePagination();
        }
    }

    getTotalPages() {
        // Only count rows that are currently filtered in (data-visible="true")
        const visibleRows = Array.from(document.querySelectorAll('tbody tr')).filter(row => row.getAttribute('data-visible') === 'true');
        return Math.ceil(visibleRows.length / this.recordsPerPage) || 1;
    }

    showCurrentPage() {
        // Only paginate rows that are currently filtered in (data-visible="true")
        const allRows = Array.from(document.querySelectorAll('tbody tr'));
        const visibleRows = allRows.filter(row => row.getAttribute('data-visible') === 'true');
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;

        visibleRows.forEach((row, index) => {
            if (index >= startIndex && index < endIndex) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        // Hide all other rows
        allRows.forEach(row => {
            if (!visibleRows.includes(row)) {
                row.style.display = 'none';
            }
        });
    }

    updatePagination() {
        // Only count rows that are currently filtered in (data-visible="true")
        const visibleRows = Array.from(document.querySelectorAll('tbody tr')).filter(row => row.getAttribute('data-visible') === 'true');
        const totalRows = visibleRows.length;
        const totalPages = Math.max(1, Math.ceil(totalRows / this.recordsPerPage));
        // If current page is out of bounds, reset to 1
        if (this.currentPage > totalPages) {
            this.currentPage = 1;
        }
        const startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
        const endRecord = Math.min(this.currentPage * this.recordsPerPage, totalRows);

        // Update pagination info
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = totalRows === 0
                ? 'No alumni to display'
                : `Showing ${startRecord}-${endRecord} of ${totalRows} alumni`;
        }

        // Update pagination controls
        const paginationControls = document.querySelector('.pagination-controls');
        if (paginationControls) {
            let paginationHTML = '';
            // Previous button
            paginationHTML += `<button class="pagination-btn"${this.currentPage === 1 ? ' disabled' : ''}>Previous</button>`;
            // Page numbers (show all if <=5, else window around current)
            if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                    paginationHTML += `<button class="pagination-btn${i === this.currentPage ? ' active' : ''}">${i}</button>`;
                }
            } else {
                let startPage = Math.max(1, this.currentPage - 2);
                let endPage = Math.min(totalPages, this.currentPage + 2);
                if (startPage > 1) {
                    paginationHTML += `<button class="pagination-btn">1</button>`;
                    if (startPage > 2) paginationHTML += `<span class="pagination-dots">...</span>`;
                }
                for (let i = startPage; i <= endPage; i++) {
                    paginationHTML += `<button class="pagination-btn${i === this.currentPage ? ' active' : ''}">${i}</button>`;
                }
                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) paginationHTML += `<span class="pagination-dots">...</span>`;
                    paginationHTML += `<button class="pagination-btn">${totalPages}</button>`;
                }
            }
            // Next button
            paginationHTML += `<button class="pagination-btn"${this.currentPage === totalPages ? ' disabled' : ''}>Next</button>`;
            paginationControls.innerHTML = paginationHTML;
        }
    }

    selectAll(checked) {
        const checkboxes = document.querySelectorAll('tbody tr:not([style*="display: none"]) .checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const row = checkbox.closest('tr');
            if (checked) {
                this.selectedRows.add(row);
                row.classList.add('selected');
            } else {
                this.selectedRows.delete(row);
                row.classList.remove('selected');
            }
        });
        this.updateDeleteButton();
    }

    handleRowSelection(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            this.selectedRows.add(row);
            row.classList.add('selected');
        } else {
            this.selectedRows.delete(row);
            row.classList.remove('selected');
        }
        
        // Update select all checkbox
        const selectAllCheckbox = document.querySelector('thead .checkbox');
        const visibleCheckboxes = document.querySelectorAll('tbody tr:not([style*="display: none"]) .checkbox');
        const checkedCheckboxes = document.querySelectorAll('tbody tr:not([style*="display: none"]) .checkbox:checked');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = visibleCheckboxes.length === checkedCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkedCheckboxes.length < visibleCheckboxes.length;
        }
        
        this.updateDeleteButton();
    }

    updateDeleteButton() {
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.disabled = this.selectedRows.size === 0;
            deleteBtn.textContent = this.selectedRows.size > 0 ? `Delete (${this.selectedRows.size})` : 'Delete';
        }
    }

    clearSelections() {
        this.selectedRows.clear();
        document.querySelectorAll('tbody tr.selected').forEach(row => {
            row.classList.remove('selected');
        });
        document.querySelectorAll('tbody .checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        const selectAllCheckbox = document.querySelector('thead .checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
        this.updateDeleteButton();
    }

    handleDelete() {
        if (this.selectedRows.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedRows.size} alumni record(s)?`)) {
            this.selectedRows.forEach(row => {
                row.remove();
            });
            this.selectedRows.clear();
            this.updateDeleteButton();
            this.updatePagination();
            this.showCurrentPage();
            
            // Show notification
            const modalManager = new ModalManager();
            modalManager.showNotification('Selected alumni records deleted successfully!', 'success');
        }
    }

    handleRowDelete(row) {
        if (confirm('Are you sure you want to delete this alumni record?')) {
            row.remove();
            this.selectedRows.delete(row);
            this.updateDeleteButton();
            this.updatePagination();
            this.showCurrentPage();
            
            // Show notification
            const modalManager = new ModalManager();
            modalManager.showNotification('Alumni record deleted successfully!', 'success');
        }
    }

    applyFilters() {
        const rows = Array.from(document.querySelectorAll('tbody tr'));
        const searchTerm = (this.searchTerm || '').toLowerCase().trim();
        const selectedDepartment = (this.selectedDepartment || 'All Departments').toLowerCase().trim();
        const selectedYear = (this.selectedYear || 'All Years').toLowerCase().trim();

        let visibleRows = [];
        rows.forEach(row => {
            // Get department and year text from the row
            const deptCell = row.querySelector('td:nth-child(5)');
            const yearCell = row.querySelector('td:nth-child(6)');
            let deptText = '';
            let yearText = '';
            if (deptCell) {
                const badge = deptCell.querySelector('span.dept-badge');
                deptText = badge ? badge.textContent.toLowerCase().trim() : deptCell.textContent.toLowerCase().trim();
            }
            if (yearCell) {
                yearText = yearCell.textContent.toLowerCase().trim();
            }

            // Department filter
            const matchesDepartment = (selectedDepartment === 'all departments') || (deptText === selectedDepartment);
            // Year filter
            const matchesYear = (selectedYear === 'all years') || (yearText === selectedYear);
            // Search filter
            const matchesSearch = !searchTerm || row.textContent.toLowerCase().includes(searchTerm);

            if (matchesDepartment && matchesYear && matchesSearch) {
                row.setAttribute('data-visible', 'true');
                visibleRows.push(row);
            } else {
                row.setAttribute('data-visible', 'false');
            }
        });

        // Reset to first page when filtering
        this.currentPage = 1;
        this.updatePagination();
        this.showCurrentPage();

        // Update pagination info
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            if (searchTerm || selectedDepartment !== 'all departments' || selectedYear !== 'all years') {
                paginationInfo.textContent = `Showing ${visibleRows.length} of ${rows.length} alumni (filtered)`;
            } else {
                this.updatePagination();
            }
        }

        // Show or hide 'No results found' message
        let noResultsMsg = document.getElementById('noResultsMsg');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.textContent = 'No results found.';
            noResultsMsg.style.cssText = 'text-align:center;padding:2rem;color:#888;font-size:1.2rem;display:none;';
            const tableContainer = document.querySelector('.table-container');
            if (tableContainer) {
                tableContainer.appendChild(noResultsMsg);
            }
        }
        if (visibleRows.length === 0) {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }

    handleSearch(query) {
        this.searchTerm = query;
        this.applyFilters();
    }
}

// Animation and Interaction Effects
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addLoadingAnimations();
    }

    addHoverEffects() {
        // Add ripple effect to buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                this.createRipple(e);
            }
        });
    }

    createRipple(e) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        if (!button) return;

        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addLoadingAnimations() {
        // Animate stats cards on load
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        });

        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Add fadeInUp animation
        if (!document.querySelector('#fade-animation')) {
            const style = document.createElement('style');
            style.id = 'fade-animation';
            style.textContent = `
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set filter selects to default values on load
    const filterSelects = document.querySelectorAll('.filter-select');
    if (filterSelects.length >= 2) {
        filterSelects[0].value = 'All Departments';
        filterSelects[1].value = 'All Years';
    }
    new ThemeManager();
    new SidebarManager();
    new ModalManager();
    window.tableManager = new TableManager();
    // Force TableManager's filter state to default and show all rows
    window.tableManager.selectedDepartment = 'All Departments';
    window.tableManager.selectedYear = 'All Years';
    window.tableManager.applyFilters();
    new AnimationManager();

    // Add selected row styles
    const style = document.createElement('style');
    style.textContent = `
        .alumni-table tbody tr.selected {
            background-color: rgba(245, 158, 11, 0.1) !important;
        }
    `;
    document.head.appendChild(style);

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading state to buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
            const button = e.target;
            const originalText = button.textContent;
            
            button.disabled = true;
            button.innerHTML = `
                <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Processing...
            `;

            // Add spin animation
            if (!document.querySelector('#spin-animation')) {
                const style = document.createElement('style');
                style.id = 'spin-animation';
                style.textContent = `
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
            }, 1500);
        }
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        SidebarManager,
        ModalManager,
        TableManager,
        AnimationManager
    };
}