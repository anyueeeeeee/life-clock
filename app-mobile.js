//1. Make sure the page loads first
window.addEventListener("load", function () {
    // console.log("Page has loaded");

    const dateInput = document.getElementById("date_input");

    if (dateInput) {
        // Function to set today's date in the correct format for type="date"
        const setTodayAsDefault = () => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            const dd = String(today.getDate()).padStart(2, "0");

            // Set the value to today's date
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        };

        // Call the function to set the value
        setTodayAsDefault();

        // Debug log to ensure the value is set correctly
        console.log("Date input value set to:", dateInput.value);
    } else {
        console.error("date_input element not found");
    }

    let audioPlayer;
    let isPlaying = true;

    function createAudioPlayer() {
        audioPlayer = document.createElement("audio");
        audioPlayer.src = "music/poolz_lookingatthesamestar.mp3";
        audioPlayer.loop = true;
        audioPlayer.autoplay = true;
        document.body.appendChild(audioPlayer);
    }

    // Check if the audio player already exists
    if (!document.getElementById("persistent-audio")) {
        createAudioPlayer();
    }

    const playPauseButton = document.getElementById("playPauseButton");

    playPauseButton.addEventListener("click", function () {
        if (!audioPlayer) createAudioPlayer(); // Ensure the audio player is created
        if (isPlaying) {
            audioPlayer.pause();
            playPauseButton.src = "icons/playbutton.png"; // Switch to play icon
        } else {
            audioPlayer.play();
            playPauseButton.src = "icons/pausebutton.png"; // Switch to pause icon
        }
        isPlaying = !isPlaying; // Toggle state
    });

    function ageCalculate() {
        let inputDate = new Date(document.getElementById("date_input").value);

        if (isNaN(inputDate.getTime())) {
            alert("Please enter a valid birthdate.");
            return;
        }

        const currentDate = new Date();
        const differenceInTime = currentDate - inputDate;

        // Calculate total days lived
        const daysLived = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
        const weeksLived = Math.floor(daysLived / 7);

        // Calculate remaining days and weeks
        const weeksLeft = 4000 - weeksLived;
        const daysLeft = 28000 - daysLived;
        const lifeLived = ((weeksLived / 4000) * 100).toFixed(2);

        // Update HTML content
        document.getElementById("weeksLived").innerHTML = weeksLived;
        document.getElementById("weeksLeft").innerHTML = weeksLeft;
        document.getElementById("lifeLived").innerHTML = lifeLived + "%";

        updateCircularText(daysLeft);
        updateProgressCircle(lifeLived);

        // Dispatch custom event
        window.weeksLivedGlobal = weeksLived;
        window.dispatchEvent(
            new CustomEvent("weeksLivedUpdated", { detail: weeksLived }),
        );
    }

    function updateCircularText(daysLeft) {
        const textPath = document.querySelector(".circular-text textPath");
        textPath.textContent = `· what are you going to do with your ${daysLeft} remaining sunrises? ·`;
        let textElement = document.getElementById("dynamic-text");
        textElement.textContent = `what are you going to do with your ${daysLeft} remaining sunrises?`;
    }

    function updateProgressCircle(lifeLived) {
        const circle = document.querySelector(".progress-stroke");
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        const offset = circumference - (lifeLived / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    const buttons = document.querySelectorAll(".button");
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            const targetSection = button.getAttribute("data-target");
            if (targetSection) {
                document
                    .querySelector(targetSection)
                    .scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    const ageButton = document.querySelector(".ageButton");
    if (ageButton) {
        ageButton.addEventListener("click", ageCalculate);
    }
});
