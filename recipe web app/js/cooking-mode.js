// Cooking mode variables
let currentStep = 1;
let totalSteps = 9;
let timer;
let timerRunning = false;
let timerSeconds = 300; // 5 minutes default

// Cooking Mode
function toggleCookingMode() {
    const recipeDetail = document.querySelector('.recipe-detail');
    recipeDetail.classList.toggle('cooking-mode');

    // If no recipe is loaded yet (default state), create a default recipe object
    if (!currentRecipe) {
        currentRecipe = {
            name: "Classic Beef Stew with Garden Vegetables",
            instructions: [
                "Season beef chunks with salt and pepper, then toss with flour until lightly coated.",
                "In a large Dutch oven or heavy pot, heat olive oil over medium-high heat. Add beef in batches (don't overcrowd) and brown on all sides, about 5 minutes per batch. Transfer to a plate.",
                "In the same pot, add butter. Once melted, add onions and cook until softened, about 3 minutes. Add garlic and cook for another minute.",
                "Pour in wine (if using) and scrape up any browned bits from the bottom of the pot. Let simmer for 2 minutes.",
                "Return beef to the pot. Add beef broth, tomato paste, bay leaf, and thyme. Bring to a boil, then reduce heat to low, cover, and simmer for 1 hour.",
                "Add carrots, celery, and potatoes. Continue to simmer, covered, until vegetables and beef are tender, about 45-60 minutes more.",
                "Stir in frozen peas during the last 5 minutes of cooking.",
                "Remove bay leaf. Taste and adjust seasoning with salt and pepper if needed.",
                "Serve hot, garnished with fresh parsley."
            ],
            ingredients: [
                { quantity: "2", unit: "pounds", name: "beef chuck, cut into 1-inch cubes" },
                { quantity: "1/4", unit: "cup", name: "all-purpose flour" },
                { quantity: "2", unit: "tablespoons", name: "olive oil" },
                { quantity: "2", unit: "tablespoons", name: "butter" },
                { quantity: "1", unit: "large", name: "onion, chopped" },
                { quantity: "3", unit: "cloves", name: "garlic, minced" },
                { quantity: "1", unit: "cup", name: "red wine (optional)" },
                { quantity: "4", unit: "cups", name: "beef broth" },
                { quantity: "2", unit: "tablespoons", name: "tomato paste" },
                { quantity: "1", unit: "", name: "bay leaf" },
                { quantity: "1", unit: "teaspoon", name: "dried thyme" },
                { quantity: "3", unit: "medium", name: "carrots, sliced" },
                { quantity: "2", unit: "", name: "celery stalks, sliced" },
                { quantity: "1", unit: "pound", name: "baby potatoes, halved" },
                { quantity: "1", unit: "cup", name: "frozen peas" }
            ]
        };
    }

    if (recipeDetail.classList.contains('cooking-mode') && currentRecipe) {
        // Create cooking mode UI
        const cookingModeUI = document.createElement('div');
        cookingModeUI.className = 'cooking-mode-interface';
        cookingModeUI.innerHTML = `
      <div class="cooking-mode-header">
        <h2>Cooking Mode: ${currentRecipe.name}</h2>
        <button onclick="toggleCookingMode()">Exit Cooking Mode</button>
      </div>
      <div class="cooking-mode-content">
        <div class="step-navigation">
          <button id="prevStep" disabled>Previous Step</button>
          <span id="stepCounter">Step 1 of ${currentRecipe.instructions.length}</span>
          <button id="nextStep">Next Step</button>
        </div>
        <div class="current-step">
          <h3>Step 1</h3>
          <p>${currentRecipe.instructions[0]}</p>
        </div>
        <div class="timer-controls">
          <button id="startTimer"><i>⏱️</i> Start Timer</button>
          <div class="timer-display" style="display:none;">
            <span id="timerCount">05:00</span>
            <button id="pauseTimer">Pause</button>
            <button id="resetTimer">Reset</button>
          </div>
        </div>
        <div class="current-ingredients">
          <h4>Ingredients for this recipe:</h4>
          <ul>
            ${currentRecipe.ingredients.map(ing =>
            `<li>${ing.quantity} ${ing.unit} ${ing.name}</li>`
        ).join('')}
          </ul>
        </div>
      </div>
    `;
        recipeDetail.appendChild(cookingModeUI);

        // Set up cooking mode navigation
        document.getElementById('nextStep').addEventListener('click', navigateSteps);
        document.getElementById('prevStep').addEventListener('click', navigateSteps);
        document.getElementById('startTimer').addEventListener('click', toggleTimer);

        // Reset current step
        currentStep = 1;
        totalSteps = currentRecipe.instructions.length;
    } else {
        // Remove cooking mode UI
        document.querySelector('.cooking-mode-interface')?.remove();
    }
}

function navigateSteps() {
    if (this.id === 'nextStep' && currentStep < totalSteps) {
        currentStep++;
    } else if (this.id === 'prevStep' && currentStep > 1) {
        currentStep--;
    }

    // Update UI
    document.getElementById('stepCounter').textContent = `Step ${currentStep} of ${totalSteps}`;
    document.getElementById('prevStep').disabled = currentStep === 1;
    document.getElementById('nextStep').disabled = currentStep === totalSteps;

    // Update current step content
    const stepContent = document.querySelector('.current-step');
    stepContent.innerHTML = `
    <h3>Step ${currentStep}</h3>
    <p>${currentRecipe ? currentRecipe.instructions[currentStep - 1] : ''}</p>
  `;
}

function getStepContent(step) {
    if (currentRecipe && currentRecipe.instructions && currentRecipe.instructions.length >= step) {
        return currentRecipe.instructions[step - 1];
    }

    const steps = [
        "Season beef chunks with salt and pepper, then toss with flour until lightly coated.",
        "In a large Dutch oven or heavy pot, heat olive oil over medium-high heat. Add beef in batches (don't overcrowd) and brown on all sides, about 5 minutes per batch. Transfer to a plate.",
        "In the same pot, add butter. Once melted, add onions and cook until softened, about 3 minutes. Add garlic and cook for another minute.",
        "Pour in wine (if using) and scrape up any browned bits from the bottom of the pot. Let simmer for 2 minutes.",
        "Return beef to the pot. Add beef broth, tomato paste, bay leaf, and thyme. Bring to a boil, then reduce heat to low, cover, and simmer for 1 hour.",
        "Add carrots, celery, and potatoes. Continue to simmer, covered, until vegetables and beef are tender, about 45-60 minutes more.",
        "Stir in frozen peas during the last 5 minutes of cooking.",
        "Remove bay leaf. Taste and adjust seasoning with salt and pepper if needed.",
        "Serve hot, garnished with fresh parsley."
    ];
    return steps[step - 1];
}

function getIngredientsForStep(step) {
    if (currentRecipe && currentRecipe.ingredients) {
        return currentRecipe.ingredients.map(ing => `<li>${ing.quantity} ${ing.unit} ${ing.name}</li>`).join('');
    }

    const stepIngredients = {
        1: ["2 pounds beef chuck, cut into 1-inch cubes", "1/4 cup all-purpose flour", "Salt and pepper"],
        2: ["2 tablespoons olive oil", "Floured beef chunks"],
        3: ["2 tablespoons butter", "1 large onion, chopped", "3 cloves garlic, minced"],
        4: ["1 cup red wine (optional)"],
        5: ["Browned beef", "4 cups beef broth", "2 tablespoons tomato paste", "1 bay leaf", "1 teaspoon dried thyme"],
        6: ["3 medium carrots, sliced", "2 celery stalks, sliced", "1 pound baby potatoes, halved"],
        7: ["1 cup frozen peas"],
        8: ["Salt and pepper to taste"],
        9: ["Freshly chopped parsley for garnish"]
    };

    return stepIngredients[step].map(ing => `<li>${ing}</li>`).join('');
}

function toggleTimer() {
    const timerDisplay = document.querySelector('.timer-display');
    const timerButton = document.getElementById('startTimer');

    if (!timerRunning) {
        // Start timer
        timerDisplay.style.display = 'block';
        timerButton.style.display = 'none';
        timerRunning = true;

        timer = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();

            if (timerSeconds <= 0) {
                clearInterval(timer);
                timerRunning = false;
                alert("Timer finished!");
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerCount').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Set up timer controls when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Pause/Resume Timer button
    document.getElementById('pauseTimer')?.addEventListener('click', function () {
        if (timerRunning) {
            clearInterval(timer);
            timerRunning = false;
            this.textContent = 'Resume';
        } else {
            toggleTimer();
            this.textContent = 'Pause';
        }
    });

    // Reset Timer button
    document.getElementById('resetTimer')?.addEventListener('click', function () {
        clearInterval(timer);
        timerRunning = false;
        timerSeconds = 300;
        updateTimerDisplay();
    });
}); 