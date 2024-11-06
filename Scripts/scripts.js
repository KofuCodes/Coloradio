const happyColours = [
    "light-red",
    "normal-orange",
    "light-orange",
    "normal-yellow",
    "light-yellow",
    "normal-green",
    "light-green",
    "light-blue",
    "light-purple"
];

const sadColours = [
    "normal-red",
    "dark-red",
    "dark-orange",
    "dark-yellow",
    "dark-green",
    "normal-blue",
    "dark-blue",
    "normal-purple",
    "dark-purple"
];

const clickedColors = [];
const circles = [
    document.getElementById("circle1"),
    document.getElementById("circle2"),
    document.getElementById("circle3")
];

function handleClick(event) {
    const clickedElement = event.target;
    const colorClass = clickedElement.classList[0]; 

    if (clickedColors.length < 3) {
        clickedColors.push(colorClass);
    }

    if (clickedColors.length === 3) {
        let happyCount = 0;
        let sadCount = 0;

        clickedColors.forEach(color => {
            if (happyColours.includes(color)) {
                happyCount++;
            } else if (sadColours.includes(color)) {
                sadCount++;
            }
        });

        if (happyCount > sadCount) {
            const MajorMusic = document.getElementById("MajorMelody");
            MajorMusic.play();
        } else if (sadCount > happyCount) {
            const MinorMusic = document.getElementById("MinorMelody");
            MinorMusic.play();
        } else {
            console.log("Error");
        }

        // Change the color of the circles
        circles.forEach((circle, index) => {
            if (circle) {
                circle.className = clickedColors[index]; // Update the circle's class to the clicked color class
            }
        });

        clickedColors.length = 0;
    }
}

const colorElements = [
    document.querySelector(".normal-red"),
    document.querySelector(".dark-red"),
    document.querySelector(".light-red"),
    document.querySelector(".normal-orange"),
    document.querySelector(".dark-orange"),
    document.querySelector(".light-orange"),
    document.querySelector(".normal-yellow"),
    document.querySelector(".dark-yellow"),
    document.querySelector(".light-yellow"),
    document.querySelector(".normal-green"),
    document.querySelector(".dark-green"),
    document.querySelector(".light-green"),
    document.querySelector(".normal-blue"),
    document.querySelector(".dark-blue"),
    document.querySelector(".light-blue"),
    document.querySelector(".normal-purple"),
    document.querySelector(".dark-purple"),
    document.querySelector(".light-purple")
];

colorElements.forEach(element => {
    element.addEventListener("click", handleClick);
});
