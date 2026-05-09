document.addEventListener('DOMContentLoaded', () => {

    // 1. Data Source
    const datesData = window.rdrDates || [];

    const normalizeText = (value) => {
        if (value == null) return '';
        return String(value)
            .replace(/\\n/g, ' ')
            .replace(/\\t/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // 2. DOM Elements
    const listContainer = document.getElementById('dates-list');
    const searchInput = document.getElementById('date-search');
    const categorySelect = document.getElementById('date-category');
    const subcategorySelect = document.getElementById('date-subcategory');
    const noResults = document.getElementById('no-results');
    const clearBtn = document.getElementById('clear-filters');
    const filterToggle = document.getElementById('filter-toggle');
    const filterSection = document.getElementById('filter-section');
    const filterArrow = document.getElementById('filter-arrow');
    const sidebarClearWrapper = document.getElementById('sidebar-clear-wrapper');
    const sidebarClearBtn = document.getElementById('sidebar-clear');

    // 3. State
    let filters = {
        search: '',
        category: '',
        subcategory: ''
    };

    // 4. Initialization
    init();

    function init() {
        populateFilters();
        updateSubcategories(filters.category);
        renderDates(datesData);
        attachEventListeners();
        checkActiveFilters();
    }

    // 5. Populate Filter Dropdowns
    function populateFilters() {
        // Extract unique Categories
        const categories = [...new Set(datesData.map(item => item.category))].filter(Boolean).sort();
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }

    function updateSubcategories(selectedCategory) {
        // Clear existing
        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
        subcategorySelect.disabled = !selectedCategory;

        if (!selectedCategory) {
            filters.subcategory = '';
            return;
        }

        // Filter items by category first to find relevant subcategories
        const relevantItems = datesData.filter(item => item.category === selectedCategory);
        const subcategories = [...new Set(relevantItems.map(item => item.subcategory))].filter(Boolean).sort();

        subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subcategorySelect.appendChild(option);
        });
    }

    // 6. Render Dates
    function renderDates(items) {
        listContainer.innerHTML = '';
        
        if (items.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        items.forEach(item => {
            const safeTitle = normalizeText(item.title);
            const safeDescription = normalizeText(item.description);
            const card = document.createElement('div');
            card.className = 'group flex flex-col md:flex-row border-l-[4px] transition-all hover:border-[#3305d8] hover:bg-[#3305d8]/5 bg-white border-[#3305d8]/20 p-10 shadow-sm items-start md:items-center justify-between gap-6';

            card.innerHTML = `
                <div class="flex flex-col md:flex-row items-start md:items-center gap-10 w-full">
                    <div class="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#676769]/20 pb-6 md:pb-0 md:pr-10 group-hover:border-[#676769]/30 transition-colors shrink-0 min-w-[100px]">
                        <span class="uppercase text-sm font-semibold text-[#3305d8] tracking-widest">${item.month}</span>
                        <span class="text-5xl font-serif text-slate-900 font-medium">${item.day}</span>
                    </div>
                    <div class="text-left w-full">
                        <div class="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2 justify-start">
                             ${item.category ? `<span class="text-xs font-semibold uppercase tracking-wider text-[#676769] bg-slate-100 px-2 py-1 rounded">${item.category}</span>` : ''}
                             ${item.subcategory ? `<span class="text-xs font-medium text-[#676769]">&bull; ${item.subcategory}</span>` : ''}
                        </div>
                        <h4 class="text-2xl font-normal text-slate-900 group-hover:text-[#3305d8] transition-colors">${safeTitle}</h4>
                        <p class="text-lg text-[#676769] mt-2 font-light leading-relaxed">${safeDescription}</p>
                    </div>
                </div>
            `;
            
            listContainer.appendChild(card);
        });
    }

    // 7. Filtering Logic
    function applyFilters() {
        const filtered = datesData.filter(item => {
            const search = normalizeText(filters.search).toLowerCase();
            const title = normalizeText(item.title).toLowerCase();
            const desc = normalizeText(item.description).toLowerCase();
            const matchesSearch = title.includes(search) || desc.includes(search);
            const matchesCategory = filters.category === '' || item.category === filters.category;
            const matchesSubcategory = filters.subcategory === '' || item.subcategory === filters.subcategory;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });

        renderDates(filtered);
        checkActiveFilters();
    }

    function checkActiveFilters() {
        const hasActiveFilters = filters.search !== '' || filters.category !== '' || filters.subcategory !== '';
        
        if (hasActiveFilters) {
            sidebarClearWrapper.classList.remove('hidden');
        } else {
            sidebarClearWrapper.classList.add('hidden');
        }
    }

    function clearAllFilters() {
        filters.search = '';
        filters.category = '';
        filters.subcategory = '';
        
        searchInput.value = '';
        categorySelect.value = '';
        updateSubcategories('');
        
        applyFilters();
    }

    // 8. Event Listeners
    function attachEventListeners() {
        searchInput.addEventListener('input', (e) => {
            filters.search = e.target.value.trim();
            applyFilters();
        });

        categorySelect.addEventListener('change', (e) => {
            filters.category = e.target.value;
            // When category changes, reset subcategory
            filters.subcategory = '';
            
            // Update subcategory dropdown
            updateSubcategories(filters.category);
            
            applyFilters();
        });

        subcategorySelect.addEventListener('change', (e) => {
            filters.subcategory = e.target.value;
            applyFilters();
        });

        clearBtn.addEventListener('click', clearAllFilters);
        
        if (sidebarClearBtn) {
            sidebarClearBtn.addEventListener('click', clearAllFilters);
        }

        // Mobile Toggle
        if (filterToggle && filterSection) {
            filterToggle.addEventListener('click', () => {
                filterSection.classList.toggle('hidden');
                
                // Rotate arrow
                if (filterSection.classList.contains('hidden')) {
                    filterArrow.style.transform = 'rotate(0deg)';
                } else {
                    filterArrow.style.transform = 'rotate(180deg)';
                }
            });
        }
    }

});
