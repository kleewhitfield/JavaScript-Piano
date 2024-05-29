const keys = document.querySelectorAll('.key');
const activeKeys = {}; // To keep track of active keys
const soundSelect = document.getElementById('sound-set-select');
const soundSets = {
    set1: {
        '1': 'kick.wav',
        '2': 'hi-hat.wav',
        '3': 'snare.wav',
        'A': 'Guitar Guitar C.wav',
        'W': 'Guitar Guitar C2.wav',
        'S': 'Guitar Guitar D.wav',
        'E': 'Guitar Guitar D2.wav',
        'D': 'Guitar Guitar E.wav',
        'F': 'Guitar Guitar F.wav',
        'T': 'Guitar Guitar F2.wav',
        'G': 'Guitar Guitar G.wav',
        'Y': 'Guitar Guitar G2.wav',
        'H': 'Guitar Guitar A.wav',
        'U': 'Guitar Guitar A2.wav',
        'J': 'Guitar Guitar B.wav',
        'K': 'Guitar1 Guitar C1.wav',
        'O': 'Guitar1 Guitar C21.wav',
        'L': 'Guitar1 Guitar D1.wav',
        'P': 'Guitar1 Guitar D21.wav',
        ';': 'Guitar1 Guitar E1.wav',
        '\'': 'Guitar1 Guitar F1.wav',
        '[': 'Guitar1 GuitarF21.wav',
        ']': 'Guitar1 Guitar G1.wav',
        '\\': 'Guitar1 Guitar G21.wav',
        'Z': 'Guitar1 Guitar A1.wav',
        'X': 'Guitar1 Guitar A21.wav',
        'C': 'Guitar1 Guitar B1.wav'
    },
    set2: {
        '1': 'kick.wav',
        '2': 'hi-hat.wav',
        '3': 'snare.wav',
        'A': 'Organ Organ C.wav',
        'W': 'Organ Organ C2.wav',
        'S': 'Organ Organ D.wav',
        'E': 'Organ Organ D2.wav',
        'D': 'Organ Organ E.wav',
        'F': 'Organ Organ F.wav',
        'T': 'Organ Organ F2.wav',
        'G': 'Organ Organ G.wav',
        'Y': 'Organ Organ G2.wav',
        'H': 'Organ Organ A.wav',
        'U': 'Organ Organ A2.wav',
        'J': 'Organ Organ B.wav',
        'K': 'Organ1 Organ C1.wav',
        'O': 'Organ1 Organ C21.wav',
        'L': 'Organ1 Organ D1.wav',
        'P': 'Organ1 Organ D21.wav',
        ';': 'Organ1 Organ E1.wav',
        '\'': 'Organ1 Organ F1.wav',
        '[': 'Organ1 Organ F21.wav',
        ']': 'Organ1 Organ G1.wav',
        '\\': 'Organ1 Organ G21.wav',
        'Z': 'Organ1 Organ A1.wav',
        'X': 'Organ1 Organ A21.wav',
        'C': 'Organ1 Organ B1.wav'
    }
};

soundSelect.addEventListener('change', function(event) {
    const selectedSet = event.target.value;
    const newSounds = soundSets[selectedSet];

    for (const key in newSounds) {
        const audioElement = document.getElementById(key);
        if (audioElement) {
            audioElement.src = newSounds[key];
        }
    }
});

let recording = [];
let isRecording = false;
let playbackTimeouts = [];
let recordingStartTime = null;


const recordButton = document.getElementById('record-button');
const stopButton = document.getElementById('stop-button');
const playButton = document.getElementById('play-button');

recordButton.addEventListener('click', function() {
    isRecording = true;
    recording = [];
    recordingStartTime = Date.now();
    recordButton.disabled = true;
    stopButton.disabled = false;
    playButton.disabled = true;
});

stopButton.addEventListener('click', function() {
    isRecording = false;
    stopButton.disabled = true;
    playButton.disabled = false;
    recordButton.disabled = false;
});

playButton.addEventListener('click', function() {
    playbackTimeouts.forEach(timeout => clearTimeout(timeout));
    playbackTimeouts = [];

    recording.forEach(({ key, time, action }) => {
        const timeout = setTimeout(() => {
            if (action === 'down') {
                playSound(key);
            } else if (action === 'up') {
                stopSound(key);
            }
        }, time);
        playbackTimeouts.push(timeout);
    });
});

function recordKeyPress(key, action) {
    if (isRecording) {
        const time = Date.now() - recordingStartTime;
        recording.push({ key, time, action });
    }
}

function playSound(key) {
    const audio = document.querySelector(`audio[data-key="${key.toUpperCase()}"]`);
    const keyElement = document.querySelector(`.key[data-key="${key.toUpperCase()}"]`);
    if (keyElement) {
        animateKey(keyElement);
    }
    if (!audio) return;

    keyElement.classList.add('active');
    audio.currentTime = 0;
    audio.play();
}

function stopSound(key) {
    const audio = document.querySelector(`audio[data-key="${key.toUpperCase()}"]`);
    const keyElement = document.querySelector(`.key[data-key="${key.toUpperCase()}"]`);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    if (keyElement) {
        keyElement.classList.remove('active');
    }
}

window.addEventListener('keydown', function(event) {
    if (!activeKeys[event.key]) {
        activeKeys[event.key] = true;
        playSound(event.key);
        recordKeyPress(event.key, 'down');
    }
});

window.addEventListener('keyup', function(event) {
    activeKeys[event.key] = false;
    stopSound(event.key);
    recordKeyPress(event.key, 'up');
});

keys.forEach(key => {
    key.addEventListener('click', function() {
        const keyAttribute = this.getAttribute('data-key');
        playSound(keyAttribute);
        recordKeyPress(keyAttribute, 'down');
        setTimeout(() => {
            stopSound(keyAttribute);
            recordKeyPress(keyAttribute, 'up');
        }, 200);
    });

    key.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const keyAttribute = this.getAttribute('data-key');
        playSound(keyAttribute);
        recordKeyPress(keyAttribute, 'down');
    });

    key.addEventListener('touchend', function(e) {
        e.preventDefault();
        const keyAttribute = this.getAttribute('data-key');
        stopSound(keyAttribute);
        recordKeyPress(keyAttribute, 'up');
    });
});

function animateKey(key) {
    key.animate([
        
        { transform: 'scale(1)', backgroundColor: '#333' },
        { transform: 'scale(1.1)', backgroundColor: '#ffc600' },
        { transform: 'scale(1)', backgroundColor: '#333' }
    ], {
        
        duration: 100,
        iterations: 1
    });
}
