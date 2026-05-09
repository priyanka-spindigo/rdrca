document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Data Source (Backend)
    const blogPosts = window.rdrBlogPosts || [];

    // 2. DOM Elements
    const grid = document.getElementById('blog-grid');
    const searchInput = document.getElementById('blog-search');
    const categorySelect = document.getElementById('blog-category');
    const subcategorySelect = document.getElementById('blog-subcategory');
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
        renderPosts(blogPosts);
        attachEventListeners();
        checkActiveFilters();
    }

    // 5. Populate Filter Dropdowns
    function populateFilters() {
        // Extract unique Categories
        const categories = [...new Set(blogPosts.map(post => post.category))].sort();
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

        // Subcategories will be populated based on Category selection
    }

    function updateSubcategories(selectedCategory) {
        // Clear existing
        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
        subcategorySelect.disabled = !selectedCategory;

        if (!selectedCategory) {
            filters.subcategory = '';
            return;
        }

        // Filter posts by category first to find relevant subcategories
        const relevantPosts = blogPosts.filter(post => post.category === selectedCategory);
        const subcategories = [...new Set(relevantPosts.map(post => post.subcategory))].sort();

        subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subcategorySelect.appendChild(option);
        });
    }

    // 6. Render Posts
    function renderPosts(posts) {
        grid.innerHTML = '';
        
        if (posts.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#676769]/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#3305d8]/10 hover:-translate-y-2 h-full relative';
            
            card.innerHTML = `
                <a href="${post.link}" class="absolute inset-0 z-20 focus:outline-none" aria-label="${post.title}"></a>
                
                <div class="relative h-48 overflow-hidden z-0">
                    <div class="absolute inset-0 bg-[#3305d8]/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                    <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <span class="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#3305d8] rounded-full shadow-sm">
                        ${post.category}
                    </span>
                </div>
                
                <div class="flex flex-col flex-grow p-8 z-0">
                    <div class="flex items-center gap-2 text-xs text-[#676769] mb-4 font-medium uppercase tracking-wider">
                        <span>${post.date}</span>
                        <span>&bull;</span>
                        <span>${post.subcategory}</span>
                    </div>
                    <h3 class="text-2xl font-serif text-slate-900 mb-3 group-hover:text-[#3305d8] transition-colors leading-tight relative">
                        ${post.title}
                    </h3>
                    <p class="text-[#676769] font-light leading-relaxed text-sm mb-6 flex-grow line-clamp-3">
                        ${post.excerpt}
                    </p>
                    
                    <div class="flex items-center text-[#3305d8] text-sm font-medium uppercase tracking-widest group-hover:gap-2 transition-all gap-1 mt-auto">
                        Read Article 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    // 7. Filtering Logic
    function applyFilters() {
        const filtered = blogPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                                  post.excerpt.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = filters.category === '' || post.category === filters.category;
            const matchesSubcategory = filters.subcategory === '' || post.subcategory === filters.subcategory;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });

        renderPosts(filtered);
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
