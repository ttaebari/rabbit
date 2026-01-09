document.addEventListener("DOMContentLoaded", () => {
    const carrot = document.getElementById("carrot");
    const mouthIdle = document.getElementById("mouth-idle");
    const mouthChewing = document.getElementById("mouth-chewing");
    const mouthFinished = document.getElementById("mouth-finished");
    const mouthGroup = document.getElementById("mouth-group");

    // State Machine
    const STATE = {
        IDLE: "IDLE",
        MOVING: "MOVING",
        CHEWING: "CHEWING",
    };

    let currentState = STATE.IDLE;

    // Config
    const ANIMATION_DURATION = 800; // ms for carrot move
    const CHEW_DURATION = 1000; // ms for chewing cycle

    function setMouth(type) {
        mouthIdle.style.display = "none";
        mouthChewing.style.display = "none";
        mouthFinished.style.display = "none";

        if (type === "idle") mouthIdle.style.display = "block";
        if (type === "chewing") mouthChewing.style.display = "block";
        if (type === "finished") mouthFinished.style.display = "block";
    }

    function playChewAnimation() {
        // Simple manual animation for chewing since SVG paths are different
        let toggle = false;
        const interval = setInterval(() => {
            if (toggle) {
                mouthGroup.style.transform = "translate(100px, 135px) scaleY(0.7)";
            } else {
                mouthGroup.style.transform = "translate(100px, 135px) scaleY(1)";
            }
            toggle = !toggle;
        }, 150);

        return interval;
    }

    function startSequence() {
        if (currentState !== STATE.IDLE) return;

        currentState = STATE.MOVING;
        console.log("State: MOVING");

        // 1. Reset Carrot
        carrot.style.animation = "none";
        carrot.offsetHeight; // Trigger reflow

        // 2. Start Carrot Animation
        // Updated animation timing: total 800ms.
        // We want it to reach mouth around 70% of that time ~560ms?
        // Let's use CSS animation definition
        carrot.style.animation = `carrot-move ${ANIMATION_DURATION}ms linear forwards`;

        // 3. Listen for "reach" moment (approx 70% of animation or based on timeout)
        // Since CSS is linear 800ms, and we defined 70% as reaching point in CSS
        const reachTime = ANIMATION_DURATION * 0.7;

        setTimeout(() => {
            // Carrot reached mouth
            currentState = STATE.CHEWING;
            console.log("State: CHEWING");

            // Switch mouth
            setMouth("chewing");

            // Start chewing motion
            const chewInterval = playChewAnimation();

            // Wait for chew duration
            setTimeout(() => {
                clearInterval(chewInterval);
                mouthGroup.style.transform = "translate(100px, 135px) scaleY(1)"; // Reset transform

                // Finished state briefly
                setMouth("finished");

                setTimeout(() => {
                    // Back to Idle
                    setMouth("idle");
                    currentState = STATE.IDLE;
                    console.log("State: IDLE");

                    // Loop immediately? or wait for user click?
                    // Spec says "Loop possible"
                    setTimeout(startSequence, 500); // Loop with delay
                }, 500);
            }, CHEW_DURATION);
        }, reachTime);
    }

    // Start on click to play sound permissions etc (future proof), or auto start
    document.addEventListener("click", () => {
        if (currentState === STATE.IDLE) {
            startSequence();
        }
    });

    // Auto start after a moment
    setTimeout(startSequence, 1000);
});
