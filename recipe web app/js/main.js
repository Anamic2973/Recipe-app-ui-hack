// Initialize saved recipes from local storage or create empty array
let savedRecipesArray = JSON.parse(localStorage.getItem('savedRecipes')) || [];

// Current recipe for cooking mode
let currentRecipe = null;

// Document ready function
document.addEventListener('DOMContentLoaded', function () {
    // Toggle between home and recipe page
    document.querySelector('.btn')?.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('homepage').style.display = 'none';
        document.getElementById('recipe').style.display = 'block';
        document.getElementById('savedRecipes').style.display = 'none';
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle')?.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.getElementById('darkModeToggle').checked = true;
        document.body.classList.add('dark-mode');
    }

    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle')?.addEventListener('click', function () {
        document.querySelector('nav ul').classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const menu = document.querySelector('nav ul');
        const menuButton = document.querySelector('.mobile-menu-toggle');

        if (menu?.classList.contains('active') &&
            !menu.contains(event.target) &&
            !menuButton.contains(event.target)) {
            menu.classList.remove('active');
        }
    });

    // Filters toggle
    document.querySelector('.filter-toggle')?.addEventListener('click', function () {
        document.querySelector('.filter-sidebar').classList.toggle('active');
        const arrow = this.querySelector('span');
        if (arrow) {
            arrow.textContent = arrow.textContent === '▼' ? '▲' : '▼';
        }
    });

    // Filter tag selection
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            // If in same category (parent), deselect others
            const parentSection = this.closest('.filter-section');
            if (parentSection.querySelector('h3').textContent === 'Difficulty Level') {
                parentSection.querySelectorAll('.filter-tag').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
            } else {
                this.classList.toggle('active');
            }
        });
    });

    // Cooking time range slider
    const timeRange = document.getElementById('timeRange');
    const timeValue = document.getElementById('timeValue');
    if (timeRange && timeValue) {
        timeRange.addEventListener('input', function () {
            timeValue.textContent = this.value + ' min';
        });
    }

    // Show mobile nav on small screens
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav) {
                mobileNav.style.display = 'flex';
                // Add padding to the bottom of the body to account for the nav bar
                document.body.style.paddingBottom = '65px';
            }
        } else {
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav) {
                mobileNav.style.display = 'none';
                document.body.style.paddingBottom = '0';
            }
        }
    }

    // Check on load and resize
    window.addEventListener('load', checkScreenSize);
    window.addEventListener('resize', checkScreenSize);

    // Mobile nav item click
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            if (!this.hasAttribute('onclick')) {
                e.preventDefault();
            }

            // Highlight active nav item
            document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Add a subtle animation effect
            const icon = this.querySelector('.mobile-nav-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            }

            // Handle navigation based on which tab was clicked
            const tabName = this.querySelector('span').textContent.trim().toLowerCase();

            switch (tabName) {
                case 'home':
                    // Show homepage, hide recipe detail
                    document.getElementById('homepage').style.display = 'block';
                    document.getElementById('recipe').style.display = 'none';
                    document.getElementById('savedRecipes').style.display = 'none';
                    window.scrollTo(0, 0);
                    break;
                case 'recipes':
                    // You could navigate to a recipes page or scroll to recipes section
                    const recipesSection = document.querySelector('.latest-recipes');
                    document.getElementById('homepage').style.display = 'block';
                    document.getElementById('recipe').style.display = 'none';
                    document.getElementById('savedRecipes').style.display = 'none';
                    if (recipesSection) {
                        recipesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                case 'search':
                    // Focus on search bar
                    document.querySelector('.search-bar input')?.focus();
                    break;
                case 'saved':
                    // Show saved recipes
                    showSavedRecipes();
                    break;
                case 'about':
                    // Navigate to about page
                    window.location.href = 'about.html';
                    break;
                case 'contact':
                    // Navigate to contact page
                    window.location.href = 'contact.html';
                    break;
                case 'profile':
                    // You would typically show user profile here
                    alert('User profile feature coming soon!');
                    break;
            }
        });
    });

    // Load any existing recipes
    const allRecipes = JSON.parse(localStorage.getItem('allRecipes')) || [];
    allRecipes.forEach(recipe => {
        createRecipeCard(recipe);
    });
});

// Utility functions
function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = getRandomColor();
        confettiContainer.appendChild(confetti);
    }

    // Remove after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 3000);
}

function getRandomColor() {
    const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0', '#FF9800'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function jumpToRecipe() {
    document.querySelector('.recipe-content')?.scrollIntoView({ behavior: 'smooth' });
}

function printRecipe() {
    window.print();
}

// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const recipeContainer = document.querySelector('.recipe-grid');
    const filterContainer = document.querySelector('.filter-container');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const difficultySortBtn = document.getElementById('difficulty-sort');
    const timeSortBtn = document.getElementById('time-sort');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // Recipe data (sample data)
    const recipes = [
        {
            id: '1',
            name: 'Classic Margherita Pizza',
            description: 'A simple yet delicious pizza topped with fresh mozzarella, tomatoes, and basil.',
            prepTime: 20,
            cookTime: 15,
            servings: 4,
            difficulty: 'Medium',
            imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            category: 'Italian',
            ingredients: [
                '2 1/4 cups all-purpose flour',
                '1 tsp salt',
                '1 tsp active dry yeast',
                '1 cup warm water',
                '2 tbsp olive oil',
                '1 can (14 oz) crushed tomatoes',
                '8 oz fresh mozzarella',
                'Fresh basil leaves',
                'Salt and pepper to taste'
            ],
            instructions: [
                'Combine flour, salt, and yeast in a bowl. Add water and olive oil to form a dough.',
                'Knead the dough for 10 minutes, then let it rise for 1 hour.',
                'Preheat oven to 475°F (245°C).',
                'Roll out the dough and place on a baking sheet.',
                'Spread crushed tomatoes over the dough, leaving a small border for the crust.',
                'Tear mozzarella into pieces and distribute over the sauce.',
                'Bake for 12-15 minutes until the crust is golden and cheese is bubbly.',
                'Remove from oven, top with fresh basil leaves, and season with salt and pepper.'
            ]
        },
        {
            id: '2',
            name: 'Chicken Tikka Masala',
            description: 'Tender chunks of chicken in a creamy tomato sauce with aromatic Indian spices.',
            prepTime: 30,
            cookTime: 40,
            servings: 6,
            difficulty: 'Medium',
            imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            category: 'Indian',
            ingredients: [
                '2 lbs boneless chicken thighs, cut into 1-inch pieces',
                '1 cup plain yogurt',
                '2 tbsp lemon juice',
                '6 cloves garlic, minced',
                '2 tbsp ginger, grated',
                '2 tbsp garam masala',
                '2 tsp ground cumin',
                '2 tsp ground coriander',
                '1 tsp turmeric',
                '1 large onion, diced',
                '2 tbsp butter',
                '1 can (14 oz) tomato sauce',
                '1 cup heavy cream',
                'Fresh cilantro for garnish'
            ],
            instructions: [
                'In a bowl, mix yogurt, lemon juice, 3 cloves of garlic, 1 tbsp ginger, and half of the spices. Add chicken and marinate for at least 2 hours.',
                'Preheat grill or broiler. Thread chicken onto skewers and grill until charred and cooked through, about 8 minutes.',
                'In a large pot, melt butter over medium heat. Add onion and cook until softened.',
                'Add remaining garlic, ginger, and spices. Cook for 1 minute until fragrant.',
                'Stir in tomato sauce and bring to a simmer. Cook for 15 minutes.',
                'Add grilled chicken and cream. Simmer for 10-15 minutes until sauce thickens.',
                'Garnish with fresh cilantro and serve with rice or naan bread.'
            ]
        },
        {
            id: '3',
            name: 'Avocado Toast with Poached Egg',
            description: 'A nutritious breakfast featuring creamy avocado and perfectly poached eggs on artisan toast.',
            prepTime: 10,
            cookTime: 5,
            servings: 2,
            difficulty: 'Easy',
            imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
            category: 'Breakfast',
            ingredients: [
                '2 slices of artisan bread',
                '1 ripe avocado',
                '2 eggs',
                '1 tbsp white vinegar',
                'Red pepper flakes',
                'Salt and pepper to taste',
                '1 tbsp olive oil',
                'Fresh herbs (optional)'
            ],
            instructions: [
                'Toast the bread slices until golden and crisp.',
                'Fill a saucepan with water, add vinegar, and bring to a gentle simmer.',
                'Crack an egg into a small cup, then gently slide it into the simmering water. Repeat with the second egg.',
                'Poach eggs for 3-4 minutes for a runny yolk.',
                'Meanwhile, mash the avocado in a bowl with salt, pepper, and a drizzle of olive oil.',
                'Spread the mashed avocado on the toast slices.',
                'Remove the poached eggs with a slotted spoon and place on top of the avocado toast.',
                'Sprinkle with red pepper flakes and fresh herbs if desired.'
            ]
        },
        {
            id: '4',
            name: 'Chocolate Lava Cake',
            description: 'Decadent individual chocolate cakes with a gooey molten center that flows when cut into.',
            prepTime: 15,
            cookTime: 12,
            servings: 4,
            difficulty: 'Medium',
            imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80',
            category: 'Dessert',
            ingredients: [
                '4 oz dark chocolate, chopped',
                '1/2 cup unsalted butter',
                '1 cup powdered sugar',
                '2 whole eggs',
                '2 egg yolks',
                '6 tbsp all-purpose flour',
                '1 tsp vanilla extract',
                'Pinch of salt',
                'Butter and cocoa powder for ramekins',
                'Vanilla ice cream for serving (optional)'
            ],
            instructions: [
                'Preheat oven to 425°F (220°C). Butter four 6 oz ramekins and dust with cocoa powder.',
                'Melt chocolate and butter in a microwave or double boiler until smooth.',
                'Whisk in powdered sugar until well blended.',
                'Add eggs and egg yolks, one at a time, whisking well after each addition.',
                'Stir in flour, vanilla extract, and salt until just combined.',
                'Pour batter into prepared ramekins, filling each about 3/4 full.',
                'Place ramekins on a baking sheet and bake for 12-14 minutes until the sides are firm but the center is soft.',
                'Let stand for 1 minute, then run a knife around the edges and invert onto dessert plates.',
                'Serve immediately with a scoop of vanilla ice cream if desired.'
            ]
        }
    ];

    // Initialize page
    function init() {
        renderRecipes(recipes);
        populateCategoryFilter();
        setupEventListeners();
        checkSavedRecipes();
    }

    // Render recipes to the page
    function renderRecipes(recipesToRender) {
        recipeContainer.innerHTML = '';

        if (recipesToRender.length === 0) {
            recipeContainer.innerHTML = '<div class="no-results"><p>No recipes found. Try adjusting your filters.</p></div>';
            return;
        }

        recipesToRender.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.name}">
        <div class="recipe-card-body">
          <h3>${recipe.name}</h3>
          <p>${recipe.description.substring(0, 100)}${recipe.description.length > 100 ? '...' : ''}</p>
          <div class="recipe-meta">
            <span><i class="far fa-clock"></i> ${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} min</span>
            <span><i class="fas fa-utensils"></i> ${recipe.difficulty}</span>
          </div>
          <button class="view-details-btn" data-id="${recipe.id}">View Details</button>
        </div>
      `;
            recipeContainer.appendChild(recipeCard);
        });

        // Add event listeners to view details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipeId = e.target.getAttribute('data-id');
                const recipe = recipes.find(r => r.id === recipeId) ||
                    (JSON.parse(localStorage.getItem('savedRecipes')) || []).find(r => r.id === recipeId);

                if (recipe && typeof loadRecipeDetail === 'function') {
                    loadRecipeDetail(recipe);
                }
            });
        });
    }

    // Populate category filter
    function populateCategoryFilter() {
        const categories = ['All', ...new Set(recipes.map(recipe => recipe.category))];

        categoryFilter.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search input
        searchInput.addEventListener('input', filterRecipes);

        // Category filter
        categoryFilter.addEventListener('change', filterRecipes);

        // Sort buttons
        difficultySortBtn.addEventListener('click', () => {
            difficultySortBtn.classList.toggle('active');
            timeSortBtn.classList.remove('active');
            filterRecipes();
        });

        timeSortBtn.addEventListener('click', () => {
            timeSortBtn.classList.toggle('active');
            difficultySortBtn.classList.remove('active');
            filterRecipes();
        });

        // Scroll to top button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Filter recipes based on search, category, and sorting
    function filterRecipes() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;

        let filteredRecipes = recipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryValue === 'All' || recipe.category === categoryValue;

            return matchesSearch && matchesCategory;
        });

        // Apply sorting
        if (difficultySortBtn.classList.contains('active')) {
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            filteredRecipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        }

        if (timeSortBtn.classList.contains('active')) {
            filteredRecipes.sort((a, b) => {
                const totalTimeA = parseInt(a.prepTime) + parseInt(a.cookTime);
                const totalTimeB = parseInt(b.prepTime) + parseInt(b.cookTime);
                return totalTimeA - totalTimeB;
            });
        }

        renderRecipes(filteredRecipes);
    }

    // Check for saved recipes
    function checkSavedRecipes() {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        const savedRecipesSection = document.getElementById('saved-recipes');

        if (savedRecipes.length > 0 && savedRecipesSection) {
            savedRecipesSection.style.display = 'block';
        }
    }

    // Initialize the page
    init();
}); 