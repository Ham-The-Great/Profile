let wakeLock = null;
let timerId = null;

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}

// Timer functionality
function setTimer() {
    const minutes = parseInt(document.getElementById('minutes').value);
    if (!minutes || minutes <= 0) {
        document.getElementById('timerStatus').textContent = 'Please enter valid minutes';
        return;
    }

    const timeMs = minutes * 60 * 1000;
    document.getElementById('timerStatus').textContent = `Timer set for ${minutes} minutes`;

    if (timerId) clearTimeout(timerId);
    
    timerId = setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: `Your ${minutes} minute timer is up!`,
                icon: '/icon.png'
            });
        }
        document.getElementById('timerStatus').textContent = 'Timer completed!';
    }, timeMs);
}

// Wake Lock functionality
async function toggleWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            document.getElementById('wakeStatus').textContent = 'Wake Lock is active';
            wakeLock.addEventListener('release', () => {
                document.getElementById('wakeStatus').textContent = 'Wake Lock released';
            });
        }
    } catch (err) {
        document.getElementById('wakeStatus').textContent = `Error: ${err.message}`;
    }
}

async function releaseWakeLock() {
    if (wakeLock) {
        await wakeLock.release();
        wakeLock = null;
        document.getElementById('wakeStatus').textContent = 'Wake Lock released';
    }
}

// Extra PWA features
function getGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('extraStatus').textContent = 
                    `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
            },
            (error) => {
                document.getElementById('extraStatus').textContent = `Location error: ${error.message}`;
            }
        );
    }
}

function vibrateDevice() {
    if ('vibrate' in navigator) {
        navigator.vibrate(200); // Vibrate for 200ms
        document.getElementById('extraStatus').textContent = 'Device vibrated!';
    } else {
        document.getElementById('extraStatus').textContent = 'Vibration not supported';
    }
}