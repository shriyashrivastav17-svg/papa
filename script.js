document.addEventListener('DOMContentLoaded', () => {
    
    // DOM Elements
    const startButton = document.getElementById('startButton');
    const cutButton = document.getElementById('cutButton');
    const flames = document.getElementById('flames');
    const cakeWhole = document.getElementById('cakeWhole');
    const cutLines = document.getElementById('cutLines');
    const birthdayMessage = document.getElementById('birthdayMessage');
    const instructions = document.getElementById('instructions');
    const micLevelContainer = document.getElementById('micLevelContainer');
    const micLevel = document.getElementById('micLevel');

    // Audio state
    let audioContext;
    let analyser;
    let dataArray;
    let mediaStream;
    let areCandlesLit = true;

    // --- 1. Start Button: Initialize Audio ---
    if (startButton) {
        startButton.addEventListener('click', initAudio);
    }

    async function initAudio() {
        try {
            // Get microphone access
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Set up audio processing
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(mediaStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            dataArray = new Uint8Array(analyser.frequencyBinCount);

            // Update UI
            if (startButton) startButton.classList.add('hidden');
            if (instructions) instructions.textContent = 'Now, blow out the candles!';
            if (micLevelContainer) micLevelContainer.classList.remove('hidden');

            // Start checking mic level
            checkMicLevel();

        } catch (err) {
            console.error("Error accessing microphone:", err);
            if (instructions) {
                instructions.textContent = 'Could not access microphone. Please allow permission and refresh.';
                instructions.classList.add('text-red-500');
            }
        }
    }

    // --- 2. Check Mic Level ---
    function checkMicLevel() {
        if (!areCandlesLit) return; // Stop checking if candles are out

        // Request animation frame for smooth looping
        requestAnimationFrame(checkMicLevel);

        if (analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            for (const value of dataArray) {
                sum += value;
            }
            const avgVolume = sum / dataArray.length;

            // Update the visualizer bar
            // We multiply by 1.5 to make it more sensitive
            if (micLevel) {
                micLevel.style.width = Math.min(100, avgVolume * 1.5) + '%'; 
            }

            // Set the "blow" threshold. You may need to adjust this value.
            const blowThreshold = 55; 

            if (avgVolume > blowThreshold) {
                blowOutCandles();
            }
        }
    }

    // --- 3. Blow Out Candles ---
    function blowOutCandles() {
        if (!areCandlesLit) return; // Ensure this only runs once
        
        areCandlesLit = false;
        
        // Hide flames with a fade-out effect
        if (flames) {
            flames.style.transition = 'opacity 0.5s';
            flames.style.opacity = '0';
        }

        // After fade-out, hide completely and show cut button
        setTimeout(() => {
            if (flames) flames.style.display = 'none';
            if (instructions) instructions.textContent = 'Great job! Now, cut the cake!';
            if (cutButton) cutButton.classList.remove('hidden');
            if (micLevelContainer) micLevelContainer.classList.add('hidden');
        }, 500);

        // Clean up audio resources
        if (audioContext) {
            audioContext.close();
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
    }

    // --- 4. Cut the Cake ---
    if (cutButton) {
        cutButton.addEventListener('click', cutTheCake);
    }

    function cutTheCake() {
        // Show the "cut lines"
        if (cutLines) cutLines.style.display = 'block';
        
        // Add a pulsing animation to simulate "cutting"
        if (cakeWhole) cakeWhole.classList.add('animate-pulse');
        
        // Hide buttons and update instructions
        if (cutButton) cutButton.classList.add('hidden');
        if (instructions) instructions.textContent = '...';

        // After a short delay, hide the cake and show the message
        setTimeout(() => {
            if (cakeWhole) cakeWhole.style.display = 'none';
            if (instructions) instructions.style.display = 'none';
            if (birthdayMessage) {
                birthdayMessage.classList.remove('hidden');
                birthdayMessage.classList.add('animate-fade-in'); // Trigger fade-in
            }
        }, 1200); // Wait for the pulse animation
    }

});
