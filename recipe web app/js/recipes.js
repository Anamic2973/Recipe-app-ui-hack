// Recipe Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM Elements
    const recipeGrid = document.getElementById('recipes-grid');
    const filterTags = document.querySelectorAll('.filter-tag');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const timeRange = document.getElementById('timeRange');
    const timeValue = document.getElementById('timeValue');
    const recipeCount = document.getElementById('recipe-count');
    const activeFiltersContainer = document.querySelector('.active-filters');
    const difficultySort = document.getElementById('difficulty-sort');
    const timeSort = document.getElementById('time-sort');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchInput = document.getElementById('recipe-search');

    // Store active filters
    const activeFilters = {
        meal: [],
        diet: [],
        difficulty: [],
        cuisine: [],
        method: [],
        time: 60 // Default max time (60 min)
    };

    // Update time value display
    if (timeRange && timeValue) {
        timeRange.addEventListener('input', function () {
            const val = this.value;
            timeValue.textContent = val + ' min or less';
            activeFilters.time = parseInt(val);
            updateActiveFiltersDisplay();
            filterRecipes();
        });
    }

    // Filter tag click
    if (filterTags) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function () {
                const filterType = this.getAttribute('data-filter');
                const filterValue = this.getAttribute('data-value');

                // Special case for "All" in difficulty
                if (filterType === 'difficulty' && filterValue === 'all') {
                    // Clear all difficulty filters
                    activeFilters.difficulty = [];
                    document.querySelectorAll(`.filter-tag[data-filter="difficulty"]`).forEach(t => {
                        t.classList.remove('active');
                    });
                    this.classList.add('active');
                } else if (filterType === 'difficulty') {
                    // Remove "All" selection if it was active
                    document.querySelector(`.filter-tag[data-filter="difficulty"][data-value="all"]`)?.classList.remove('active');

                    // Toggle this filter
                    this.classList.toggle('active');

                    // Update active filters
                    if (this.classList.contains('active')) {
                        activeFilters.difficulty.push(filterValue);
                    } else {
                        activeFilters.difficulty = activeFilters.difficulty.filter(v => v !== filterValue);
                    }
                } else {
                    // Normal toggle behavior for other filter types
                    this.classList.toggle('active');

                    // Update active filters
                    if (this.classList.contains('active')) {
                        activeFilters[filterType].push(filterValue);
                    } else {
                        activeFilters[filterType] = activeFilters[filterType].filter(v => v !== filterValue);
                    }
                }

                updateActiveFiltersDisplay();
                filterRecipes();
            });
        });
    }

    // Update active filters display
    function updateActiveFiltersDisplay() {
        if (!activeFiltersContainer) return;

        // Clear current display
        activeFiltersContainer.innerHTML = '';

        // Add filter tags for each active filter
        for (const [filterType, values] of Object.entries(activeFilters)) {
            if (Array.isArray(values) && values.length > 0) {
                values.forEach(value => {
                    const filterTag = document.createElement('div');
                    filterTag.className = 'active-filter-tag';
                    filterTag.innerHTML = `
                        ${capitalizeFirstLetter(value)}
                        <span class="remove-filter" data-type="${filterType}" data-value="${value}">×</span>
                    `;
                    activeFiltersContainer.appendChild(filterTag);
                });
            }
        }

        // Add time filter if it's not the maximum value
        if (activeFilters.time < 120) {
            const timeFilterTag = document.createElement('div');
            timeFilterTag.className = 'active-filter-tag';
            timeFilterTag.innerHTML = `
                ${activeFilters.time} min or less
                <span class="remove-filter" data-type="time" data-value="reset">×</span>
            `;
            activeFiltersContainer.appendChild(timeFilterTag);
        }

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', function () {
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');

                if (type === 'time' && value === 'reset') {
                    // Reset time slider to max
                    timeRange.value = 120;
                    timeValue.textContent = '120 min or less';
                    activeFilters.time = 120;
                } else {
                    // Remove from active filters
                    activeFilters[type] = activeFilters[type].filter(v => v !== value);

                    // Update UI
                    document.querySelector(`.filter-tag[data-filter="${type}"][data-value="${value}"]`)?.classList.remove('active');
                }

                updateActiveFiltersDisplay();
                filterRecipes();
            });
        });
    }

    // Filter recipes based on active filters
    function filterRecipes() {
        if (!recipeCards || !recipeCount) return;

        let visibleCount = 0;

        recipeCards.forEach(card => {
            const mealType = card.getAttribute('data-meal');
            const difficulty = card.getAttribute('data-difficulty');
            const cuisine = card.getAttribute('data-cuisine');
            const cookingTime = parseInt(card.getAttribute('data-cooking-time'));

            // Get card text for search
            const cardText = card.textContent.toLowerCase();
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

            // Check if card matches all active filters
            const matchesMeal = activeFilters.meal.length === 0 || activeFilters.meal.includes(mealType);
            const matchesDifficulty = activeFilters.difficulty.length === 0 || activeFilters.difficulty.includes(difficulty);
            const matchesCuisine = activeFilters.cuisine.length === 0 || activeFilters.cuisine.includes(cuisine);
            const matchesTime = cookingTime <= activeFilters.time;
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);

            const isVisible = matchesMeal && matchesDifficulty && matchesCuisine && matchesTime && matchesSearch;

            // Show/hide card
            card.style.display = isVisible ? 'block' : 'none';

            if (isVisible) visibleCount++;
        });

        // Update recipe count
        recipeCount.textContent = visibleCount;

        // Show "no results" message if needed
        if (visibleCount === 0 && recipeGrid) {
            // Check if we already have a no-results message
            if (!document.querySelector('.no-results')) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = '<p>No recipes match your filters. Try adjusting your selection.</p>';
                recipeGrid.appendChild(noResults);
            }
        } else {
            // Remove any existing no-results message
            document.querySelector('.no-results')?.remove();
        }
    }

    // Sorting functionality
    if (difficultySort) {
        difficultySort.addEventListener('click', function () {
            this.classList.toggle('active');
            if (timeSort.classList.contains('active')) {
                timeSort.classList.remove('active');
            }

            if (this.classList.contains('active')) {
                sortRecipes('difficulty');
            } else {
                // Reset to default order (newest first)
                sortRecipes('default');
            }
        });
    }

    if (timeSort) {
        timeSort.addEventListener('click', function () {
            this.classList.toggle('active');
            if (difficultySort.classList.contains('active')) {
                difficultySort.classList.remove('active');
            }

            if (this.classList.contains('active')) {
                sortRecipes('time');
            } else {
                // Reset to default order (newest first)
                sortRecipes('default');
            }
        });
    }

    // Sort recipes
    function sortRecipes(sortBy) {
        const cards = Array.from(recipeCards);

        if (sortBy === 'difficulty') {
            // Sort by difficulty (easy -> medium -> hard)
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            cards.sort((a, b) => {
                const diffA = a.getAttribute('data-difficulty');
                const diffB = b.getAttribute('data-difficulty');
                return difficultyOrder[diffA] - difficultyOrder[diffB];
            });
        } else if (sortBy === 'time') {
            // Sort by cooking time (shortest -> longest)
            cards.sort((a, b) => {
                const timeA = parseInt(a.getAttribute('data-cooking-time'));
                const timeB = parseInt(b.getAttribute('data-cooking-time'));
                return timeA - timeB;
            });
        } else {
            // Default order is by recipe ID (assuming newest first)
            cards.sort((a, b) => {
                const idA = parseInt(a.querySelector('.view-details-btn').getAttribute('data-id'));
                const idB = parseInt(b.querySelector('.view-details-btn').getAttribute('data-id'));
                return idB - idA; // Newest first
            });
        }

        // Reorder cards in the DOM
        cards.forEach(card => {
            recipeGrid.appendChild(card);
        });

        // Reapply filtering
        filterRecipes();
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', filterRecipes);
    }

    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
            // Reset filter tags UI
            filterTags.forEach(tag => {
                tag.classList.remove('active');
            });

            // Add back "All" for difficulty
            document.querySelector('.filter-tag[data-filter="difficulty"][data-value="all"]')?.classList.add('active');

            // Reset time slider
            if (timeRange) {
                timeRange.value = 120;
                timeValue.textContent = '120 min or less';
            }

            // Reset active filters
            for (const key in activeFilters) {
                if (Array.isArray(activeFilters[key])) {
                    activeFilters[key] = [];
                }
            }
            activeFilters.time = 120;

            // Clear search
            if (searchInput) {
                searchInput.value = '';
            }

            // Update UI
            updateActiveFiltersDisplay();
            filterRecipes();
        });
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize
    updateActiveFiltersDisplay();
    filterRecipes();
}); 