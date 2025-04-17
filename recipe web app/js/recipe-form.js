// Show Create Recipe Form
function showCreateRecipeForm() {
    const modal = document.getElementById('createRecipeModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling of the page behind
    }
}

// Close Create Recipe Form
function closeCreateRecipeForm() {
    const modal = document.getElementById('createRecipeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow scrolling again
    }
}

// Add Ingredient Field
function addIngredient() {
    const ingredientsList = document.getElementById('ingredientsList');
    if (ingredientsList) {
        const newIngredient = document.createElement('div');
        newIngredient.className = 'ingredient-input';
        newIngredient.innerHTML = `
      <input type="text" placeholder="Quantity (e.g., 2)" class="quantity">
      <input type="text" placeholder="Unit (e.g., cups)" class="unit">
      <input type="text" placeholder="Ingredient (e.g., flour)" class="ingredient-name">
      <button type="button" class="remove-btn" onclick="removeIngredient(this)">✕</button>
    `;
        ingredientsList.appendChild(newIngredient);
    }
}

// Remove Ingredient Field
function removeIngredient(button) {
    const ingredientsList = document.getElementById('ingredientsList');
    if (ingredientsList && ingredientsList.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('You need at least one ingredient!');
    }
}

// Add Instruction Field
function addInstruction() {
    const instructionsList = document.getElementById('instructionsList');
    if (instructionsList) {
        const newInstruction = document.createElement('div');
        newInstruction.className = 'instruction-input';
        newInstruction.innerHTML = `
      <textarea placeholder="Step instructions" class="instruction-step"></textarea>
      <button type="button" class="remove-btn" onclick="removeInstruction(this)">✕</button>
    `;
        instructionsList.appendChild(newInstruction);
    }
}

// Remove Instruction Field
function removeInstruction(button) {
    const instructionsList = document.getElementById('instructionsList');
    if (instructionsList && instructionsList.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('You need at least one instruction step!');
    }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function () {
    // Add initial ingredient and instruction fields
    addIngredient();
    addInstruction();

    // Connect Create Recipe button to modal
    const createRecipeBtn = document.querySelector('.create-recipe-btn');
    if (createRecipeBtn) {
        createRecipeBtn.addEventListener('click', showCreateRecipeForm);
    }

    // Connect close button
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCreateRecipeForm);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('createRecipeModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeCreateRecipeForm();
            }
        });
    }

    // Connect "Add Ingredient" button
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', addIngredient);
    }

    // Connect "Add Instruction" button
    const addInstructionBtn = document.getElementById('addInstructionBtn');
    if (addInstructionBtn) {
        addInstructionBtn.addEventListener('click', addInstruction);
    }

    // Save Recipe Form Submission
    const recipeForm = document.getElementById('recipeForm');
    if (recipeForm) {
        recipeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('recipeName').value;
            const description = document.getElementById('recipeDescription').value;
            const prepTime = document.getElementById('prepTime').value;
            const cookTime = document.getElementById('cookTime').value;
            const servings = document.getElementById('servings').value;
            const difficulty = document.getElementById('difficulty').value;
            const imageUrl = document.getElementById('recipeImage').value || 'https://via.placeholder.com/400x300?text=Recipe+Image';
            const category = document.getElementById('category').value;

            // Get ingredients
            const ingredients = [];
            document.querySelectorAll('.ingredient-input').forEach(input => {
                const quantity = input.querySelector('.quantity').value;
                const unit = input.querySelector('.unit').value;
                const name = input.querySelector('.ingredient-name').value;

                if (quantity && name) {
                    ingredients.push({
                        quantity,
                        unit,
                        name
                    });
                }
            });

            // Get instructions
            const instructions = [];
            document.querySelectorAll('.instruction-step').forEach(step => {
                if (step.value.trim()) {
                    instructions.push(step.value.trim());
                }
            });

            // Validate form
            if (!name || !description || !prepTime || !cookTime || !servings || ingredients.length === 0 || instructions.length === 0) {
                alert('Please fill out all required fields');
                return;
            }

            // Create recipe object
            const recipe = {
                id: Date.now(), // Generate unique ID based on timestamp
                name,
                description,
                prepTime,
                cookTime,
                servings,
                difficulty,
                imageUrl,
                category,
                ingredients,
                instructions,
                isSaved: false,
                dateCreated: new Date().toISOString()
            };

            // Add recipe to all recipes array
            const allRecipes = JSON.parse(localStorage.getItem('allRecipes')) || [];
            allRecipes.push(recipe);
            localStorage.setItem('allRecipes', JSON.stringify(allRecipes));

            // Create and display the recipe card
            createRecipeCard(recipe);

            // Add to saved recipes if option is checked
            if (document.getElementById('saveToMyRecipes')?.checked) {
                // Add to saved recipes
                const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
                recipe.isSaved = true;
                savedRecipes.push(recipe);
                localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

                // Update saved recipes display if it exists
                if (typeof displaySavedRecipes === 'function') {
                    displaySavedRecipes();
                }
            }

            // Reset form
            recipeForm.reset();

            // Close modal
            closeCreateRecipeForm();

            // Show success message with notifications
            showNotification('Recipe created successfully!');
        });
    }
});

// Create Recipe Card
function createRecipeCard(recipe) {
    const recipesGrid = document.querySelector('.recipes-grid');
    if (recipesGrid) {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.dataset.id = recipe.id;

        recipeCard.innerHTML = `
      <div class="recipe-difficulty difficulty-${recipe.difficulty}">${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</div>
      <div class="card-image" style="background-image: url('${recipe.imageUrl}');"></div>
      <div class="card-content">
        <h3>${recipe.name}</h3>
        <p>${recipe.description.substring(0, 100)}${recipe.description.length > 100 ? '...' : ''}</p>
        <div class="recipe-meta">
          <div><i>⏱️</i> ${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins</div>
          <div><i>🍽️</i> ${recipe.category}</div>
        </div>
        <button class="view-details-btn" data-id="${recipe.id}">View Details</button>
      </div>
    `;

        // Add click event to show recipe details
        recipeCard.querySelector('.view-details-btn').addEventListener('click', function () {
            const recipeId = this.getAttribute('data-id');
            const allRecipes = JSON.parse(localStorage.getItem('allRecipes')) || [];
            const recipe = allRecipes.find(r => r.id == recipeId);

            if (recipe && typeof showRecipeDetails === 'function') {
                showRecipeDetails(recipe);
            }
        });

        // Add to the beginning of the grid
        recipesGrid.insertBefore(recipeCard, recipesGrid.firstChild);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Display saved recipes
function displaySavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const savedRecipesSection = document.getElementById('saved-recipes');
    const noSavedRecipesMessage = document.getElementById('no-saved-recipes');
    const savedRecipesContainer = document.getElementById('saved-recipes-container');

    if (!savedRecipesSection || !noSavedRecipesMessage || !savedRecipesContainer) {
        return;
    }

    // Toggle visibility of saved recipes section and no-recipes message
    savedRecipesSection.style.display = 'block';

    if (savedRecipes.length === 0) {
        noSavedRecipesMessage.style.display = 'block';
        savedRecipesContainer.style.display = 'none';
    } else {
        noSavedRecipesMessage.style.display = 'none';
        savedRecipesContainer.style.display = 'grid';

        // Clear current recipes
        savedRecipesContainer.innerHTML = '';

        // Add recipe cards
        savedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
          <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-image">
          <div class="recipe-card-body">
            <h3>${recipe.name}</h3>
            <p>${recipe.description.substring(0, 100)}${recipe.description.length > 100 ? '...' : ''}</p>
            <div class="recipe-meta">
              <span><i class="far fa-clock"></i> ${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} min</span>
              <span><i class="fas fa-utensils"></i> ${recipe.difficulty}</span>
            </div>
            <div class="recipe-card-actions">
              <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
              <button class="delete-recipe" data-id="${recipe.id}">Delete</button>
            </div>
          </div>
        `;
            savedRecipesContainer.appendChild(recipeCard);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.view-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipeId = e.target.getAttribute('data-id');
                viewRecipe(recipeId);
            });
        });

        document.querySelectorAll('.delete-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipeId = e.target.getAttribute('data-id');
                deleteRecipe(recipeId);
            });
        });
    }
}

// View recipe details
function viewRecipe(recipeId) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const recipe = savedRecipes.find(r => r.id == recipeId);

    if (recipe && typeof showRecipeDetails === 'function') {
        showRecipeDetails(recipe);
    }
}

// Delete recipe
function deleteRecipe(recipeId) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        savedRecipes = savedRecipes.filter(r => r.id != recipeId);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

        displaySavedRecipes();
        showNotification('Recipe deleted successfully!');
    }
}

// Recipe Form Functionality
document.addEventListener('DOMContentLoaded', () => {
    const createRecipeBtn = document.querySelector('.create-recipe-btn');
    const recipeModal = document.getElementById('recipeFormModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const recipeForm = document.getElementById('recipeForm');
    const addIngredientBtn = document.getElementById('addIngredient');
    const ingredientsList = document.getElementById('ingredientsList');
    const addInstructionBtn = document.getElementById('addInstruction');
    const instructionsList = document.getElementById('instructionsList');
    const savedRecipesSection = document.getElementById('savedRecipes');
    const savedRecipesList = document.getElementById('savedRecipesList');
    const noSavedRecipesMsg = document.querySelector('.no-saved-recipes');

    // Local storage key for saved recipes
    const SAVED_RECIPES_KEY = 'savedRecipes';

    // Open modal when clicking the create recipe button
    if (createRecipeBtn) {
        createRecipeBtn.addEventListener('click', () => {
            if (recipeModal) {
                recipeModal.style.display = 'flex';
                document.body.classList.add('modal-open');

                // Focus on the first input field
                setTimeout(() => {
                    const firstInput = recipeForm.querySelector('input[type="text"]');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        });
    }

    // Close modal when clicking the close button or outside the modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === recipeModal) {
            closeModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && recipeModal && recipeModal.style.display === 'flex') {
            closeModal();
        }
    });

    function closeModal() {
        if (recipeModal) {
            recipeModal.style.display = 'none';
            document.body.classList.remove('modal-open');

            // Reset form
            if (recipeForm) recipeForm.reset();

            // Clear dynamic fields
            if (ingredientsList) ingredientsList.innerHTML = '<li><input type="text" placeholder="e.g., 2 cups flour" required></li>';
            if (instructionsList) instructionsList.innerHTML = '<li><textarea placeholder="e.g., Preheat oven to 350°F" required></textarea></li>';
        }
    }

    // Add new ingredient field
    if (addIngredientBtn && ingredientsList) {
        addIngredientBtn.addEventListener('click', () => {
            const newIngredient = document.createElement('li');
            newIngredient.innerHTML = `
                <input type="text" placeholder="e.g., 1 tbsp olive oil" required>
                <button type="button" class="remove-item">✕</button>
            `;
            ingredientsList.appendChild(newIngredient);

            // Focus on the new input
            const newInput = newIngredient.querySelector('input');
            if (newInput) newInput.focus();

            // Add event listener to the remove button
            const removeBtn = newIngredient.querySelector('.remove-item');
            if (removeBtn) {
                removeBtn.addEventListener('click', function () {
                    this.parentElement.remove();
                });
            }
        });
    }

    // Add new instruction field
    if (addInstructionBtn && instructionsList) {
        addInstructionBtn.addEventListener('click', () => {
            const newInstruction = document.createElement('li');
            newInstruction.innerHTML = `
                <textarea placeholder="e.g., Mix dry ingredients in a bowl" required></textarea>
                <button type="button" class="remove-item">✕</button>
            `;
            instructionsList.appendChild(newInstruction);

            // Focus on the new textarea
            const newTextarea = newInstruction.querySelector('textarea');
            if (newTextarea) newTextarea.focus();

            // Add event listener to the remove button
            const removeBtn = newInstruction.querySelector('.remove-item');
            if (removeBtn) {
                removeBtn.addEventListener('click', function () {
                    this.parentElement.remove();
                });
            }
        });
    }

    // Set up event delegation for removing items
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('remove-item')) {
            e.target.parentElement.remove();
        }
    });

    // Handle form submission
    if (recipeForm) {
        recipeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather form data
            const formData = new FormData(recipeForm);
            const recipeData = {
                id: Date.now().toString(),
                name: formData.get('recipeName'),
                description: formData.get('description'),
                prepTime: parseInt(formData.get('prepTime')),
                cookTime: parseInt(formData.get('cookTime')),
                totalTime: parseInt(formData.get('prepTime')) + parseInt(formData.get('cookTime')),
                servings: parseInt(formData.get('servings')),
                difficulty: formData.get('difficulty'),
                imageUrl: formData.get('imageUrl') || 'https://via.placeholder.com/300x200?text=Recipe+Image',
                ingredients: [],
                instructions: [],
                category: formData.get('category'),
                dateCreated: new Date().toISOString(),
                isFavorite: false
            };

            // Get all ingredients
            const ingredientInputs = ingredientsList.querySelectorAll('input');
            ingredientInputs.forEach(input => {
                if (input.value.trim()) {
                    recipeData.ingredients.push(input.value.trim());
                }
            });

            // Get all instructions
            const instructionTextareas = instructionsList.querySelectorAll('textarea');
            instructionTextareas.forEach(textarea => {
                if (textarea.value.trim()) {
                    recipeData.instructions.push(textarea.value.trim());
                }
            });

            // Save recipe
            saveRecipe(recipeData);

            // Close modal and reset form
            closeModal();

            // Show success message
            showNotification('Recipe created successfully!');

            // Refresh the saved recipes list
            loadSavedRecipes();
        });
    }

    // Save recipe to local storage
    function saveRecipe(recipeData) {
        let savedRecipes = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY)) || [];
        savedRecipes.push(recipeData);
        localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(savedRecipes));
    }

    // Load saved recipes from local storage
    function loadSavedRecipes() {
        if (!savedRecipesList) return;

        const savedRecipes = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY)) || [];

        // Show/hide empty state message
        if (noSavedRecipesMsg) {
            noSavedRecipesMsg.style.display = savedRecipes.length ? 'none' : 'block';
        }

        // Show/hide saved recipes section
        if (savedRecipesSection) {
            savedRecipesSection.style.display = savedRecipes.length ? 'block' : 'none';
        }

        // Clear list before repopulating
        savedRecipesList.innerHTML = '';

        // Add each recipe to the list
        savedRecipes.forEach(recipe => {
            const recipeCard = createRecipeCard(recipe);
            savedRecipesList.appendChild(recipeCard);
        });
    }

    // Create a recipe card element
    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.id = recipe.id;

        card.innerHTML = `
            <div class="recipe-card-image">
                <img src="${recipe.imageUrl}" alt="${recipe.name}">
                <div class="recipe-card-time">${recipe.totalTime} min</div>
            </div>
            <div class="recipe-card-content">
                <h3>${recipe.name}</h3>
                <p class="recipe-card-description">${recipe.description}</p>
                <div class="recipe-card-meta">
                    <span class="difficulty ${recipe.difficulty.toLowerCase()}">${recipe.difficulty}</span>
                    <span>${recipe.servings} servings</span>
                </div>
                <div class="recipe-card-actions">
                    <button class="view-recipe-btn" data-id="${recipe.id}">View</button>
                    <button class="delete-recipe-btn" data-id="${recipe.id}">Delete</button>
                </div>
            </div>
        `;

        // Add event listeners to the buttons
        const viewBtn = card.querySelector('.view-recipe-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                // Navigate to recipe detail page (in a real app)
                // For now, show notification
                showNotification('Viewing recipe: ' + recipe.name);
            });
        }

        const deleteBtn = card.querySelector('.delete-recipe-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteRecipe(recipe.id);
            });
        }

        return card;
    }

    // Delete a recipe
    function deleteRecipe(recipeId) {
        let savedRecipes = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY)) || [];
        savedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
        localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(savedRecipes));

        // Refresh the list
        loadSavedRecipes();

        showNotification('Recipe deleted');
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize
    loadSavedRecipes();
}); 