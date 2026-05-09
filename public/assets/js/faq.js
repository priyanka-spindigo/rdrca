document.addEventListener('DOMContentLoaded', () => {

    // Configuration
    const config = {
        expandOneOnly: true // Set to true to allow only one FAQ to be expanded at a time
    };

    // 1. Data Source (Backend)
    const faqData = window.rdrFaqs || [];

    const normalizeText = (value) => {
        if (value == null) return '';
        return String(value)
            .replace(/\\n/g, ' ')
            .replace(/\\t/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // 2. DOM Elements
    const listContainer = document.getElementById('faq-list');
    const searchInput = document.getElementById('faq-search');
    const categorySelect = document.getElementById('faq-category');
    const subcategorySelect = document.getElementById('faq-subcategory');
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
        renderFAQs(faqData);
        attachEventListeners();
        checkActiveFilters();
    }

    // 5. Populate Filter Dropdowns
    function populateFilters() {
        // Extract unique Categories
        const categories = [...new Set(faqData.map(item => item.category))].sort();
        
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
        const relevantItems = faqData.filter(item => item.category === selectedCategory);
        const subcategories = [...new Set(relevantItems.map(item => item.subcategory))].sort();

        subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subcategorySelect.appendChild(option);
        });
    }

    // 6. Render FAQs
    function renderFAQs(items) {
        listContainer.innerHTML = '';
        
        if (items.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        items.forEach(item => {
            const safeQuestion = normalizeText(item.question);
            const safeAnswer = normalizeText(item.answer);
            const accordionItem = document.createElement('div');
            accordionItem.className = 'bg-white rounded-2xl border border-[#676769]/10 shadow-sm overflow-hidden transition-all duration-300';
            
            // Generate unique IDs for accessibility
            const headerId = `faq-header-${item.id}`;
            const contentId = `faq-content-${item.id}`;

            accordionItem.innerHTML = `
                <button 
                    class="w-full text-left p-6 flex items-center justify-between group focus:outline-none"
                    aria-expanded="false"
                    aria-controls="${contentId}"
                    id="${headerId}"
                >
                    <div class="pr-6">
                        <div class="flex items-center gap-2 text-xs text-[#676769] mb-2 font-medium uppercase tracking-wider">
                            <span class="bg-slate-100 px-2 py-0.5 rounded text-[#3305d8]">${item.category}</span>
                            <span>&bull;</span>
                            <span>${item.subcategory}</span>
                        </div>
                        <h3 class="text-xl font-serif text-slate-900 group-hover:text-[#3305d8] transition-colors leading-tight">
                            ${safeQuestion}
                        </h3>
                    </div>
                    <div class="shrink-0 text-[#676769] group-hover:text-[#3305d8] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus transition-transform duration-300 transform"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </div>
                </button>
                <div 
                    id="${contentId}" 
                    class="overflow-hidden transition-[max-height] duration-500 ease-in-out border-t border-[#676769]/10 bg-slate-50/50"
                    style="max-height: 0; opacity: 0; border-top-width: 0;"
                    aria-labelledby="${headerId}"
                >
                    <div class="p-6 text-[#676769] leading-relaxed font-light">
                        ${safeAnswer}
                    </div>
                </div>
            `;
            
            const button = accordionItem.querySelector('button');
            const content = accordionItem.querySelector(`#${contentId}`);
            
            // Pre-calculate needs logic, but max-height transition works best with setting value
            
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                // If config says expand one only, close all others
                if (config.expandOneOnly && !isExpanded) {
                    const allButtons = listContainer.querySelectorAll('button[aria-expanded="true"]');
                    allButtons.forEach(otherBtn => {
                        closeAccordion(otherBtn);
                    });
                }

                if (isExpanded) {
                    closeAccordion(button);
                } else {
                    openAccordion(button);
                }
            });

            listContainer.appendChild(accordionItem);
        });
    }

    function openAccordion(button) {
        const contentId = button.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const icon = button.querySelector('svg'); // Plus icon

        button.setAttribute('aria-expanded', 'true');
        
        // Prepare content for transition
        content.style.opacity = '1';
        content.style.borderTopWidth = '1px';
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Transform Plus to Minus (rotate 45deg)
        icon.style.transform = 'rotate(45deg)';
        
        // active styling
        button.parentElement.classList.add('shadow-md', 'border-[#3305d8]/20');
        button.parentElement.classList.remove('shadow-sm');
    }

    function closeAccordion(button) {
        const contentId = button.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const icon = button.querySelector('svg');

        button.setAttribute('aria-expanded', 'false');
        
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        
        // Delay border width change slightly or immediate? 
        // If we remove border immediately, it might jump. Let's rely on opacity for hiding visual border or height 0 also hides it if overflow hidden.
        // Actually border-top is outside the content that has height? No, it's on the wrapper div that has max-height.
        // So height 0 will hide the border-top too if box-sizing includes border or if logic handles it.
        // However, with max-height 0, border might still be visible if not 0.
        // Let's set border-top-width to 0 after transition is done? 
        // For simplicity, let's keep it clean: transition border-top-width as well.
        // but border-top-width transition might look mismatched with height.
        // Safest is to just let max-height hide it IF the border is PART of the height. 
        // Standard box model: height is content. Border is extra. 
        // If I put border on the hidden div, max-height:0 will make content 0. Border still shows.
        // So I must toggle border-width or opacity. I added opacity:0 and border-top-width:0 in style initially.
        // So let's transition it back.
        
        setTimeout(() => {
             if (button.getAttribute('aria-expanded') === 'false') {
                 content.style.borderTopWidth = '0px';
             }
        }, 500); // Match duration

        // Reset rotation
        icon.style.transform = 'rotate(0deg)';

        // Reset styling
        button.parentElement.classList.remove('shadow-md', 'border-[#3305d8]/20');
        button.parentElement.classList.add('shadow-sm');
    }

    // 7. Filtering Logic
    function applyFilters() {
        const filtered = faqData.filter(item => {
            const search = normalizeText(filters.search).toLowerCase();
            const q = normalizeText(item.question).toLowerCase();
            const a = normalizeText(item.answer).toLowerCase();
            const matchesSearch = q.includes(search) || a.includes(search);
            const matchesCategory = filters.category === '' || item.category === filters.category;
            const matchesSubcategory = filters.subcategory === '' || item.subcategory === filters.subcategory;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });

        renderFAQs(filtered);
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
