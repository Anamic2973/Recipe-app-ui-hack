// Categories Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all category items
    const categoryItems = document.querySelectorAll('.category-item');
    const categoryGrid = document.querySelector('.categories-grid');
    const searchInput = document.getElementById('category-search');

    // Add hover effect for all category items
    categoryItems.forEach(item => {
        // Add animation when clicking on a category
        item.addEventListener('click', function (e) {
            // Add pulse effect
            this.classList.add('pulse');

            // Remove the class after animation completes
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 300);
        });
    });

    // Search functionality for categories
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase().trim();
            let matchCount = 0;

            // Filter categories based on search term
            categoryItems.forEach(item => {
                const categoryName = item.querySelector('h4').textContent.toLowerCase();

                const isMatch = categoryName.includes(searchTerm);

                item.style.display = isMatch ? 'block' : 'none';

                if (isMatch) matchCount++;
            });

            // Show message if no results
            const noResults = document.querySelector('.no-results');
            if (matchCount === 0) {
                if (!noResults) {
                    const noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results';
                    noResultsMsg.innerHTML = '<p>No categories match your search. Try a different term.</p>';
                    if (categoryGrid) {
                        categoryGrid.appendChild(noResultsMsg);
                    }
                }
            } else {
                // Remove any existing no-results message
                if (noResults) noResults.remove();
            }
        });
    }

    // Smooth scroll to section when clicking on an anchor with a hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Scroll to the element with smooth behavior
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Highlight the section briefly
                targetElement.classList.add('highlight');
                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 1500);
            }
        });
    });

    // Get category statistics dynamically (from API or local data)
    function updateCategoryStats() {
        // This would typically fetch from an API
        // For demo purposes, we'll use random numbers
        document.querySelectorAll('.category-count').forEach(countElement => {
            const randomCount = Math.floor(Math.random() * 25) + 5;
            countElement.textContent = randomCount;
        });
    }

    // Initialize category stats on page load
    updateCategoryStats();
}); 