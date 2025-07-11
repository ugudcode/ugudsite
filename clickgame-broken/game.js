const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
const inflation_element = document.getElementById("inflation");
let inflation_level = 0; // Each level multiplies cost by 10.
let score = 5; // Start with some score to avoid being stuck.
let super_gompei_count = 0;
const MAX_WIDGETS = 12; // The maximum number of widgets allowed
let draggedWidget = null; // To keep track of the widget being dragged

function changeScore(amount) {
    score += amount;
    score_element.textContent = score;

    // --- Inflation Calculation ---
    // Inflation level increases for every 1,000,000 points.
    const new_level = Math.floor(score / 1000000);
    if (new_level > inflation_level) {
        inflation_level = new_level;
        inflation_element.textContent = "Inflation Level: " + inflation_level;
        // The data-level for CSS warnings can be the level itself.
        inflation_element.dataset.level = inflation_level;
    }
    // Each level of inflation multiplies the cost by 10.
    const cost_multiplier = Math.pow(10, inflation_level);

    // Update the stores to show ones that are too expensive
    for (let store of stores) {
        // The actual cost needs to account for inflation
        let cost = parseInt(store.getAttribute("cost")) * cost_multiplier;
        const costDisplay = store.querySelector('.cost-display');
        if (costDisplay) costDisplay.textContent = `${cost} points`;

        if (score < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}
function buy(store) {
    // Calculate the current cost multiplier based on the inflation level.
    const cost_multiplier = Math.pow(10, inflation_level);
    let cost = parseInt(store.getAttribute("cost")) * cost_multiplier;

    // Handle the special case for Super-Gompei upgrades first
    if (store.getAttribute("name") === "Super-Gompei") {
        const super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
        // If Super-Gompei already exists, this is an upgrade, not a new tile.
        if (super_gompei) {
            if (score < cost) return; // Check cost for upgrade
            changeScore(-cost);
            const newReap = parseInt(super_gompei.getAttribute("reap")) + 100;
            super_gompei.setAttribute("reap", newReap);
            const reapDisplay = super_gompei.querySelector('.widget-reap');
            if (reapDisplay) {
                reapDisplay.textContent = `+${newReap}`;
            }

            // --- Sacrifice & Evolution Mechanic ---
            let sacrifices = parseInt(super_gompei.dataset.sacrifices || '0') + 1;
            super_gompei.dataset.sacrifices = sacrifices;

            // Change color on every sacrifice by setting a CSS variable for hue rotation.
            super_gompei.style.setProperty('--sacrifice-hue', `${sacrifices * 15}deg`);

            // Evolve (double speed) every 50 sacrifices
            if (sacrifices > 0 && sacrifices % 50 === 0) {
                const currentCooldown = parseFloat(super_gompei.getAttribute('cooldown'));
                super_gompei.setAttribute('cooldown', currentCooldown / 2); // Becomes 2x faster
                super_gompei.classList.add('evolved-widget'); // Ensure it has the evolved style
            }
            return; // Exit after upgrading
        }
    }

    // For all new widgets, check if there is space.
    if (widget_container.children.length >= MAX_WIDGETS) {
        // You could add UI feedback here to tell the user the space is full.
        return;
    }

    // check available to buy
    if (score < cost) return;

    // change score
    changeScore(-cost);

    super_gompei_count += 1;
    document.body.style = "--gompei-count: " + super_gompei_count + ";"

    // clone node for widget, and add to container
    const widget = store.firstElementChild.cloneNode(true);

    // Ensure every widget has a progress bar overlay for consistent visuals.
    if (!widget.querySelector('.overlay-slide')) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay-slide';
        widget.appendChild(overlay);
    }

    // Add a dynamic display for the widget's reap value
    const reapDisplay = document.createElement('span');
    reapDisplay.className = 'widget-reap';
    reapDisplay.textContent = `+${widget.getAttribute('reap')}`;
    widget.appendChild(reapDisplay);

    widget.onclick = () => {
        harvest(widget);
    }
    // Make the new widget draggable for combining
    widget.draggable = true;
    addDragAndDropHandlers(widget);
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        // Immediately start the first harvest cycle.
        // harvest() will set the 'harvesting' attribute and call setup_end_harvest itself.
        harvest(widget);
    }
}

/**
 * Adds all necessary drag-and-drop event handlers to a widget.
 * @param {HTMLElement} widget The widget element.
 */
function addDragAndDropHandlers(widget) {
    widget.addEventListener('dragstart', handleDragStart);
    widget.addEventListener('dragover', handleDragOver);
    widget.addEventListener('drop', handleDrop);
    widget.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    draggedWidget = this;
    e.dataTransfer.effectAllowed = 'move';
    this.classList.add('dragging'); // Add style for visual feedback
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow a drop.
}

function handleDrop(e) {
    e.preventDefault();
    const dropTarget = this;

    // Check for a valid combination: same type, not the same element
    if (draggedWidget && draggedWidget !== dropTarget && draggedWidget.getAttribute('name') === dropTarget.getAttribute('name')) {
        // Combine the widgets' power
        const reap1 = parseInt(draggedWidget.getAttribute('reap'));
        const reap2 = parseInt(dropTarget.getAttribute('reap'));
        const newReap = reap1 + reap2;
        dropTarget.setAttribute('reap', newReap);
        const reapDisplay = dropTarget.querySelector('.widget-reap');
        if (reapDisplay) {
            reapDisplay.textContent = `+${newReap}`;
        }
        dropTarget.classList.add('mega-widget'); // Mark as a mega widget
        draggedWidget.remove(); // Remove the old widget, freeing up space
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedWidget = null; // Clean up
}

function setup_end_harvest(widget, cooldown) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    }, cooldown * 1000);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;

    // --- Calculate effective cooldown ---
    let effectiveCooldown = parseFloat(widget.getAttribute("cooldown"));
    // If this is a Gompei, check for lawn speed boost
    if (widget.getAttribute("name") === "Gompei" || widget.getAttribute("name") === "Super-Gompei") {
        let totalLawnPower = 0;
        const lawnWidgets = document.querySelectorAll('#widget-container .widget[name="Lawn"]');
        lawnWidgets.forEach(lawn => {
            totalLawnPower += parseInt(lawn.getAttribute('reap'));
        });
        // A base lawn has a reap value of 2. We calculate the total number of "base lawns".
        const lawnCount = Math.floor(totalLawnPower / 2);
        const speedBoostTiers = Math.floor(lawnCount / 10);
        if (speedBoostTiers > 0) {
            // For each tier of 10 lawns, double the speed (halve the cooldown).
            effectiveCooldown *= Math.pow(0.5, speedBoostTiers);
        }
    }

    // Set harvesting flag to prevent re-triggering
    widget.setAttribute("harvesting", "");

    const overlay = widget.querySelector('.overlay-slide');
    if (overlay) {
        // Force a reflow to reliably restart the CSS animation.
        overlay.classList.remove('is-animating');
        void overlay.offsetWidth; // This is a well-known trick to trigger a browser reflow.
        overlay.classList.add('is-animating');
    }

    // Set the animation duration to match the widget's cooldown
    widget.style.setProperty('--cooldown-duration', `${effectiveCooldown}s`);
 
    // If manual, collect points now
    let reapAmount = parseInt(widget.getAttribute("reap"));

    changeScore(reapAmount);
    showPoint(widget, reapAmount);

    setup_end_harvest(widget, effectiveCooldown);
}


function showPoint(widget, reapAmount) {
    let number = document.createElement("span");
    number.className = "point";
    // Use the calculated amount for the display, which includes bonuses
    number.innerHTML = "+" + reapAmount;
    number.onanimationend = () => {
        number.remove();
    }
    widget.appendChild(number);
}

changeScore(0);

/**
 * Sets up the welcome screen functionality.
 * Finds the start button and adds a click listener to hide the welcome screen.
 */
function start_game() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const startGameBtn = document.getElementById('start-game-btn');

    if (welcomeScreen && startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            welcomeScreen.classList.add('hidden');
        });
    }
}

// Set up the welcome screen button
start_game();

/**
 * Initializes the store item displays.
 * Reads the `reap` attribute from each store item and updates its
 * generation text to be consistent with the on-field widgets.
 */
function initializeStoreDisplays() {
    const storeItems = document.querySelectorAll('#store-container .store');
    storeItems.forEach(item => {
        const cost = item.getAttribute('cost');
        const reapValue = item.getAttribute('reap');
        const costDisplay = item.querySelector('.cost-display');
        const generationDisplay = item.querySelector('.generation');

        if (cost && costDisplay) costDisplay.textContent = `${cost} points`;
        if (reapValue && generationDisplay) {
            generationDisplay.textContent = `+${reapValue} sqft`;
        }
    });
}

// Initialize store displays on page load
initializeStoreDisplays();