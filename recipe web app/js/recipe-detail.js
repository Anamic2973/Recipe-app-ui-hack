// Show Recipe Details
function showRecipeDetails(recipe) {
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('recipe').style.display = 'block';
    document.getElementById('savedRecipes').style.display = 'none';

    // Update recipe header
    const recipeHeader = document.querySelector('.recipe-header');
    recipeHeader.style.backgroundImage = `url('${recipe.imageUrl}')`;

    // Update recipe title and description
    const headerOverlay = document.querySelector('.recipe-header-overlay');
    headerOverlay.querySelector('h1').textContent = recipe.name;
    headerOverlay.querySelector('p').textContent = recipe.description;

    // Update recipe meta information
    document.querySelector('.recipe-details-meta .meta-item:nth-child(1) p').textContent = recipe.prepTime + ' minutes';
    document.querySelector('.recipe-details-meta .meta-item:nth-child(2) p').textContent = recipe.cookTime + ' minutes';
    document.getElementById('servingsCount').textContent = recipe.servings;

    // Update difficulty badge
    const difficultyBadge = document.querySelector('.difficulty-badge');
    difficultyBadge.className = `difficulty-badge ${recipe.difficulty}`;
    difficultyBadge.textContent = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);

    // Update ingredients
    const ingredientsContainer = document.querySelector('.ingredients');
    const ingredientsList = ingredientsContainer.querySelectorAll('.ingredient-item');

    // Remove all existing ingredients except the first one (template)
    for (let i = ingredientsList.length - 1; i >= 0; i--) {
        ingredientsList[i].remove();
    }

    // Add new ingredients
    recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.innerHTML = `
      <input type="checkbox">
      <span><span class="ingredient-amount">${ingredient.quantity}</span> ${ingredient.unit} ${ingredient.name}</span>
    `;
        ingredientsContainer.appendChild(ingredientItem);
    });

    // Update instructions
    const instructionsContainer = document.querySelector('.instructions');
    const instructionsList = instructionsContainer.querySelectorAll('.step');

    // Remove all existing instructions
    for (let i = instructionsList.length - 1; i >= 0; i--) {
        instructionsList[i].remove();
    }

    // Add new instructions
    recipe.instructions.forEach((instruction, index) => {
        const step = document.createElement('div');
        step.className = 'step';
        step.innerHTML = `
      <span class="step-number">${index + 1}</span>
      ${instruction}
    `;
        instructionsContainer.appendChild(step);
    });

    // Update save button state
    const saveButton = document.getElementById('saveButton');
    if (recipe.isSaved || savedRecipesArray.some(r => r.id === recipe.id)) {
        saveButton.innerHTML = '<i>♥</i> Saved!';
        saveButton.classList.add('saved');
    } else {
        saveButton.innerHTML = '<i>♥</i> Save Recipe';
        saveButton.classList.remove('saved');
    }

    // Store current recipe ID for save functionality
    saveButton.dataset.recipeId = recipe.id;

    // Update cooking mode steps
    currentRecipe = recipe;

    // Reset timer
    clearInterval(timer);
    timerRunning = false;
    timerSeconds = 300;
}

// Save Recipe functionality
function saveRecipe() {
    const saveButton = document.getElementById('saveButton');
    const recipeId = parseInt(saveButton.dataset.recipeId);

    // Find the recipe in all recipes
    const allRecipes = JSON.parse(localStorage.getItem('allRecipes')) || [];
    const recipeIndex = allRecipes.findIndex(r => r.id === recipeId);

    if (recipeIndex !== -1) {
        const recipe = allRecipes[recipeIndex];

        if (saveButton.classList.contains('saved')) {
            // Remove from saved recipes
            saveButton.innerHTML = '<i>♥</i> Save Recipe';
            saveButton.classList.remove('saved');

            // Update recipe saved status
            recipe.isSaved = false;
            allRecipes[recipeIndex] = recipe;

            // Remove from saved recipes array
            savedRecipesArray = savedRecipesArray.filter(r => r.id !== recipeId);
        } else {
            // Add to saved recipes
            saveButton.innerHTML = '<i>♥</i> Saved!';
            saveButton.classList.add('saved');

            // Update recipe saved status
            recipe.isSaved = true;
            allRecipes[recipeIndex] = recipe;

            // Add to saved recipes array if not already there
            if (!savedRecipesArray.some(r => r.id === recipeId)) {
                savedRecipesArray.push(recipe);
            }

            // Show confetti animation
            showConfetti();
        }

        // Update local storage
        localStorage.setItem('allRecipes', JSON.stringify(allRecipes));
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipesArray));
    }
}

// Show Saved Recipes
function showSavedRecipes() {
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('recipe').style.display = 'none';
    document.getElementById('savedRecipes').style.display = 'block';

    // Get saved recipes
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const savedRecipesList = document.getElementById('savedRecipesList');

    // Clear current content
    savedRecipesList.innerHTML = '';

    if (savedRecipes.length === 0) {
        // Show empty state
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
      <h3>No saved recipes yet</h3>
      <p>Save your favorite recipes to access them quickly later</p>
    `;
        savedRecipesList.appendChild(emptyState);
    } else {
        // Create recipe cards for each saved recipe
        savedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.dataset.id = recipe.id;

            recipeCard.innerHTML = `
        <div class="recipe-difficulty difficulty-${recipe.difficulty}">${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</div>
        <div class="card-image" style="background-image: url('${recipe.imageUrl}');"></div>
        <div class="card-content">
          <h3>${recipe.name}</h3>
          <p>${recipe.description}</p>
          <div class="recipe-meta">
            <div><i>⏱️</i> ${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins</div>
            <div><i>🍽️</i> ${recipe.category}</div>
          </div>
        </div>
      `;

            // Add click event to show recipe details
            recipeCard.addEventListener('click', function () {
                showRecipeDetails(recipe);
            });

            savedRecipesList.appendChild(recipeCard);
        });
    }
}

// Servings adjustment
const initialServings = 6;
const ingredientBaseAmounts = [2, 0.25, 2, 2, 1, 3, 1, 4, 2, 1, 1, 1, 1, 1];

function adjustServings(change) {
    const servingsElement = document.getElementById('servingsCount');
    let currentServings = parseInt(servingsElement.textContent);
    currentServings += change;

    // Don't allow less than 1 serving
    if (currentServings < 1) currentServings = 1;

    servingsElement.textContent = currentServings;

    // Adjust ingredient amounts
    const ratio = currentServings / initialServings;
    const amountElements = document.querySelectorAll('.ingredient-amount');

    amountElements.forEach((el, index) => {
        if (index < ingredientBaseAmounts.length) {
            const newAmount = ingredientBaseAmounts[index] * ratio;
            // Round to 2 decimal places
            el.textContent = Math.round(newAmount * 100) / 100;
            // Remove .0 if it's a whole number
            if (el.textContent.endsWith('.0')) {
                el.textContent = el.textContent.slice(0, -2);
            }
        }
    });
} 