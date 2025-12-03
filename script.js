// Game state
let score = 0;
let clickPower = 1;
let perSecond = 0;
let money = 0;
let clickCount = 0;

// Upgrades data
const upgrades = [
    {
        id: 'cursor',
        name: 'Christmas Gloves',
        icon: '🧤',
        description: 'Warmer hands = stronger clicks!',
        baseCost: 10,
        clickBonus: 1,
        production: 0,
        owned: 0,
        type: 'click'
    },
    {
        id: 'tomte',
        name: 'Santa',
        icon: '🎅',
        description: 'A kind Santa who helps out',
        baseCost: 15,
        production: 0.1,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'candy',
        name: 'Candy Cane',
        icon: '🍭',
        description: 'Sugar gives more energy to clicks!',
        baseCost: 50,
        clickBonus: 2,
        production: 0,
        owned: 0,
        type: 'click'
    },
    {
        id: 'elf',
        name: 'Christmas Elf',
        icon: '🧝',
        description: 'A hardworking elf from the workshop',
        baseCost: 100,
        production: 1,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'bell',
        name: 'Christmas Bell',
        icon: '🔔',
        description: 'Magical bell sound amplifies clicks',
        baseCost: 250,
        clickBonus: 5,
        production: 0,
        owned: 0,
        type: 'click'
    },
    {
        id: 'reindeer',
        name: 'Reindeer',
        icon: '🦌',
        description: 'One of Santa\'s reindeer',
        baseCost: 500,
        production: 5,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'sleigh',
        name: 'Sleigh',
        icon: '🛷',
        description: 'A magical Christmas sleigh',
        baseCost: 2000,
        production: 20,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'tree',
        name: 'Christmas Tree',
        icon: '🎄',
        description: 'A beautiful Christmas tree',
        baseCost: 5000,
        production: 50,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'magic',
        name: 'Christmas Magic',
        icon: '✨',
        description: 'Pure Christmas spirit in your fingers!',
        baseCost: 7500,
        clickBonus: 25,
        production: 0,
        owned: 0,
        type: 'click'
    },
    {
        id: 'gift',
        name: 'Christmas Gift',
        icon: '🎁',
        description: 'Magical Christmas presents',
        baseCost: 10000,
        production: 100,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'snowman',
        name: 'Snowman',
        icon: '⛄',
        description: 'A living snowman',
        baseCost: 25000,
        production: 250,
        owned: 0,
        type: 'auto'
    },
    {
        id: 'star',
        name: 'Christmas Star',
        icon: '⭐',
        description: 'A shining Christmas star',
        baseCost: 50000,
        production: 500,
        owned: 0,
        type: 'auto'
    }
];

// Track code usage count
let codeUsageCount = 0;

// Initialize game
function init() {
    loadGame();
    renderUpgrades();
    updateDisplay();
    startAutoProduction();
    createSnowflakes();
    setupCodeModal();
    
    // Add click event to main image
    document.getElementById('clickerImage').addEventListener('click', handleClick);
}

// Setup code modal
function setupCodeModal() {
    const codeButton = document.getElementById('codeButton');
    const modal = document.getElementById('codeModal');
    const submitButton = document.getElementById('submitCode');
    const cancelButton = document.getElementById('cancelCode');
    const codeInput = document.getElementById('codeInput');
    const codeMessage = document.getElementById('codeMessage');
    
    codeButton.addEventListener('click', () => {
        modal.classList.add('active');
        codeInput.value = '';
        codeMessage.textContent = '';
    });
    
    cancelButton.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    submitButton.addEventListener('click', () => {
        const code = codeInput.value.trim();
        if (code === '0987654321') {
            if (codeUsageCount >= 3) {
                codeMessage.textContent = 'Code limit reached! (3/3 used)';
                codeMessage.className = 'modal-message error';
            } else {
                money += 100;
                codeUsageCount++;
                updateDisplay();
                saveGame();
                
                // Close modal immediately
                modal.classList.remove('active');
                
                // Start break and heal animation (8 seconds)
                breakAndHealLogo();
            }
        } else {
            codeMessage.textContent = '❌ Invalid code!';
            codeMessage.className = 'modal-message error';
        }
    });
    
    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
}

// Break and heal logo animation (8 seconds total)
function breakAndHealLogo() {
    const img = document.getElementById('mainImage');
    const clickerDiv = document.getElementById('clickerImage');
    
    // Disable clicking during animation
    clickerDiv.style.pointerEvents = 'none';
    
    // Phase 1: Break apart (4 seconds)
    img.style.transition = 'all 4s ease-in-out';
    img.style.transform = 'scale(0) rotate(720deg)';
    img.style.opacity = '0';
    img.style.filter = 'blur(20px) drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))';
    
    // Phase 2: Heal back together (4 seconds)
    setTimeout(() => {
        img.style.transition = 'all 4s ease-in-out';
        img.style.transform = 'scale(1) rotate(0deg)';
        img.style.opacity = '1';
        img.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))';
        
        // Re-enable clicking after animation
        setTimeout(() => {
            clickerDiv.style.pointerEvents = 'auto';
            img.style.transition = 'transform 0.1s';
        }, 4000);
    }, 4000);
}

// Handle click on main image
function handleClick(e) {
    score += clickPower;
    clickCount++;
    
    // Give money every 3 clicks
    if (clickCount >= 3) {
        money += 1;
        clickCount = 0;
        createFloatingNumber(e.clientX, e.clientY, '+1💰', '#ffd700');
    }
    
    updateDisplay();
    renderUpgrades();
    saveGame();
    
    // Create floating number effect
    createFloatingNumber(e.clientX, e.clientY, `+${clickPower}`, '#fff');
    
    // Add bounce animation
    const img = document.getElementById('mainImage');
    img.style.transform = 'scale(0.9)';
    setTimeout(() => {
        img.style.transform = 'scale(1)';
    }, 100);
}

// Create floating number animation
function createFloatingNumber(x, y, value, color = '#fff') {
    const number = document.createElement('div');
    number.className = 'click-number';
    number.textContent = value;
    number.style.left = x + 'px';
    number.style.top = y + 'px';
    number.style.color = color;
    document.body.appendChild(number);
    
    setTimeout(() => {
        number.remove();
    }, 1000);
}

// Render upgrades
function renderUpgrades() {
    const container = document.getElementById('upgradesContainer');
    container.innerHTML = '';
    
    upgrades.forEach(upgrade => {
        const card = createUpgradeCard(upgrade);
        container.appendChild(card);
    });
}

// Create upgrade card
function createUpgradeCard(upgrade) {
    const cost = calculateCost(upgrade);
    const canAfford = money >= cost;
    
    const card = document.createElement('div');
    card.className = `upgrade-card ${!canAfford ? 'disabled' : ''}`;
    
    let bonusText = '';
    if (upgrade.type === 'click') {
        bonusText = `<div style="margin-top: 10px; color: #ffd700; font-size: 0.9em;">
            👆 +${upgrade.clickBonus} per click
        </div>`;
    } else {
        bonusText = `<div style="margin-top: 10px; color: #4ade80; font-size: 0.9em;">
            ⏱️ +${upgrade.production}/sec
        </div>`;
    }
    
    card.innerHTML = `
        <div class="upgrade-icon">${upgrade.icon}</div>
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-description">${upgrade.description}</div>
        <div class="upgrade-stats">
            <span class="upgrade-cost">💰 ${formatNumber(cost)}</span>
            <span class="upgrade-owned">Owned: ${upgrade.owned}</span>
        </div>
        ${bonusText}
    `;
    
    if (canAfford) {
        card.addEventListener('click', () => buyUpgrade(upgrade));
    }
    
    return card;
}

// Calculate upgrade cost
function calculateCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
}

// Buy upgrade
function buyUpgrade(upgrade) {
    const cost = calculateCost(upgrade);
    
    if (money >= cost) {
        money -= cost;
        upgrade.owned++;
        
        // Update click power if it's a click upgrade
        if (upgrade.type === 'click') {
            clickPower += upgrade.clickBonus;
        }
        
        calculatePerSecond();
        updateDisplay();
        renderUpgrades();
        saveGame();
    }
}

// Calculate production per second
function calculatePerSecond() {
    perSecond = 0;
    upgrades.forEach(upgrade => {
        perSecond += upgrade.production * upgrade.owned;
    });
}

// Start auto production
function startAutoProduction() {
    setInterval(() => {
        if (perSecond > 0) {
            score += perSecond / 10; // Update 10 times per second for smooth animation
            updateDisplay();
        }
    }, 100);
    
    // Save game every 5 seconds
    setInterval(() => {
        saveGame();
    }, 5000);
}

// Update display
function updateDisplay() {
    document.getElementById('score').textContent = formatNumber(Math.floor(score));
    document.getElementById('perSecond').textContent = formatNumber(perSecond.toFixed(1));
    document.getElementById('money').textContent = formatNumber(money);
    
    // Update click progress
    const progress = (clickCount / 3) * 100;
    document.getElementById('clickProgress').style.width = progress + '%';
}

// Format number with spaces
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Save game to localStorage
function saveGame() {
    const gameState = {
        score: score,
        clickPower: clickPower,
        money: money,
        clickCount: clickCount,
        codeUsageCount: codeUsageCount,
        upgrades: upgrades.map(u => ({ id: u.id, owned: u.owned }))
    };
    localStorage.setItem('julClickerSave', JSON.stringify(gameState));
}

// Load game from localStorage
function loadGame() {
    const saved = localStorage.getItem('julClickerSave');
    if (saved) {
        const gameState = JSON.parse(saved);
        score = gameState.score || 0;
        money = gameState.money || 0;
        clickCount = gameState.clickCount || 0;
        codeUsageCount = gameState.codeUsageCount || 0;
        clickPower = 1; // Reset to base
        
        if (gameState.upgrades) {
            gameState.upgrades.forEach(savedUpgrade => {
                const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
                if (upgrade) {
                    upgrade.owned = savedUpgrade.owned;
                    // Recalculate click power from owned upgrades
                    if (upgrade.type === 'click') {
                        clickPower += upgrade.clickBonus * upgrade.owned;
                    }
                }
            });
        }
        
        calculatePerSecond();
    }
}

// Create snowflakes
function createSnowflakes() {
    const snowContainer = document.querySelector('.snow-container');
    const snowflakeChars = ['❄', '❅', '❆'];
    
    setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        
        snowContainer.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, 5000);
    }, 200);
}

// Start game when page loads
window.addEventListener('load', init);
