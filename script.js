/* Custom styles */
body {
    font-family: 'Inter', sans-serif;
    background-color: #fdf2f8; /* Light pink background */
}
h1 {
    font-family: 'Playfair Display', serif;
}

/* Flame animation */
@keyframes flicker {
    0%, 100% { transform: scaleY(1) translateY(0); opacity: 1; }
    50% { transform: scaleY(1.1) translateY(-2px); opacity: 0.8; }
}
.flame {
    animation: flicker 1.5s infinite alternate;
    transform-origin: bottom;
}

/* Message fade-in animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
}

/* Mic level bar */
#micLevel {
    transition: width 0.1s ease-out;
}

/* Confetti Canvas */
#confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* pointer-events: none makes it so you can click through it */
    pointer-events: none;
    z-index: 9999;
}


    
