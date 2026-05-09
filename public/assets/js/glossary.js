document.addEventListener('DOMContentLoaded', () => {

    // 1. Data Source (Backend)
    const glossaryData = window.rdrGlossaryTerms || [];



    // 2. DOM Elements
    const listContainer = document.getElementById('glossary-list');
    const searchInput = document.getElementById('glossary-search');
    const categorySelect = document.getElementById('glossary-category');
    const subcategorySelect = document.getElementById('glossary-subcategory');
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
        renderGlossary(glossaryData);
        attachEventListeners();
        checkActiveFilters();
    }

    // 5. Populate Filter Dropdowns
    function populateFilters() {
        // Extract unique Categories
        const categories = [...new Set(glossaryData.map(item => item.category))].sort();
        
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
        const relevantItems = glossaryData.filter(item => item.category === selectedCategory);
        const subcategories = [...new Set(relevantItems.map(item => item.subcategory))].sort();

        subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subcategorySelect.appendChild(option);
        });
    }

    // 6. Render Glossary
    function renderGlossary(items) {
        listContainer.innerHTML = '';
        
        if (items.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl border border-[#676769]/10 shadow-sm p-8 hover:shadow-md transition-shadow duration-300';
            
            card.innerHTML = `
                <div class="flex items-center gap-2 text-xs text-[#676769] mb-3 font-medium uppercase tracking-wider">
                    <span class="bg-slate-100 px-2 py-0.5 rounded text-[#3305d8]">${item.category}</span>
                    <span>&bull;</span>
                    <span>${item.subcategory}</span>
                </div>
                <h3 class="text-2xl font-serif text-slate-900 mb-4 text-[#3305d8]">
                    ${item.term}
                </h3>
                <p class="text-[#676769] leading-relaxed font-light">
                    ${item.definition}
                </p>
            `;
            
            listContainer.appendChild(card);
        });
    }

    // 7. Filtering Logic
    function applyFilters() {
        const filtered = glossaryData.filter(item => {
            const matchesSearch = item.term.toLowerCase().includes(filters.search.toLowerCase()) || 
                                  item.definition.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = filters.category === '' || item.category === filters.category;
            const matchesSubcategory = filters.subcategory === '' || item.subcategory === filters.subcategory;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });

        renderGlossary(filtered);
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
