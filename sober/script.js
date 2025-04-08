// script.js
let soberData = JSON.parse(localStorage.getItem('soberData')) || {
    streak: 0,
    history: {},
    settings: {
        reminderTime: '20:00',
        theme: 'light'
    }
};

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    if (pageId === 'home') updateHomePage();
}

function recordSober(wasSober) {
    const today = new Date().toISOString().split('T')[0];
    
    if (wasSober) {
        soberData.streak++;
        soberData.history[today] = true;
    } else {
        soberData.streak = 0;
        soberData.history[today] = false;
    }
    
    saveData();
    updateHomePage();
    showPage('home');
}

function updateHomePage() {
    document.getElementById('streak').textContent = soberData.streak;
    updateContributionChart();
}

function updateContributionChart() {
    const chart = document.getElementById('contribution-chart');
    chart.innerHTML = '';
    
    const today = new Date();
    for (let i = 0; i < 28; i++) { // 4 weeks
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const square = document.createElement('div');
        square.classList.add('chart-square');
        if (soberData.history[dateStr] === true) {
            square.classList.add('active');
        }
        chart.appendChild(square);
    }
}

function saveData() {
    localStorage.setItem('soberData', JSON.stringify(soberData));
}

function resetData() {
    if (confirm('Are you sure you want to reset all data?')) {
        soberData = {
            streak: 0,
            history: {},
            settings: soberData.settings
        };
        saveData();
        updateHomePage();
    }
}

// Settings handlers
document.getElementById('reminder-time').value = soberData.settings.reminderTime;
document.getElementById('reminder-time').addEventListener('change', (e) => {
    soberData.settings.reminderTime = e.target.value;
    saveData();
});

document.getElementById('theme').value = soberData.settings.theme;
document.getElementById('theme').addEventListener('change', (e) => {
    soberData.settings.theme = e.target.value;
    saveData();
    // Add theme switching logic here if desired
});

// Initial setup
updateHomePage();
