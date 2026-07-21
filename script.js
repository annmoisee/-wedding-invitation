// ===============================
// ELEMENTS
// ===============================

const intro = document.getElementById("intro");

const sealButton = document.getElementById("sealButton");

const envelope = document.querySelector(".envelope");

const insideText = document.getElementById("insideText");

const letter = document.getElementById("letter");

const music = document.getElementById("music");

const openInvitation =
document.getElementById("openInvitation");

// ===============================
// OPEN ENVELOPE
// ===============================

sealButton.addEventListener("click", () => {

    sealButton.style.pointerEvents = "none";

    envelope.style.transition =
    "1s";

    envelope.style.transform =
    "scale(.94) rotateX(18deg)";

    setTimeout(() => {

        envelope.style.opacity = "0";

    },700);

    if(music){

        music.volume = .4;

        music.play().catch(()=>{});

    }

    setTimeout(()=>{

        intro.classList.add("hide");

    },900);

    setTimeout(()=>{

        insideText.classList.add("show");

    },1200);

    setTimeout(()=>{

        insideText.classList.remove("show");

    },4200);

    setTimeout(()=>{

        letter.classList.add("show");

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    },4700);

});

// ===============================
// BUTTON
// ===============================

if(openInvitation){

openInvitation.addEventListener(

"click",

()=>{

document
.querySelector(".invitation")
.scrollIntoView({

behavior:"smooth"

});

});

}

// ===============================
// COUNTDOWN
// ===============================

const weddingDate =
new Date(

"September 19, 2026 15:20:00"

);
// ===============================
// TIMER
// ===============================

function updateCountdown(){

    const now = new Date().getTime();

    const distance =
    weddingDate.getTime() - now;

    if(distance <= 0){

        return;

    }

    const days =
    Math.floor(
    distance /
    (1000*60*60*24)
    );

    const hours =
    Math.floor(
    (distance %
    (1000*60*60*24)) /
    (1000*60*60)
    );

    const minutes =
    Math.floor(
    (distance %
    (1000*60*60)) /
    (1000*60)
    );

    const seconds =
    Math.floor(
    (distance %
    (1000*60)) /
    1000
    );

    document.getElementById("days").textContent =
    days;

    document.getElementById("hours").textContent =
    hours;

    document.getElementById("minutes").textContent =
    minutes;

    document.getElementById("seconds").textContent =
    seconds;

}

updateCountdown();

setInterval(updateCountdown,1000);

// ===============================
// SCROLL ANIMATION
// ===============================

const observer =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},

{

threshold:0.15

}

);

document
.querySelectorAll("section")
.forEach(section=>{

section.classList.add("fade-up");

observer.observe(section);

});

// ===============================
// FLOAT ENVELOPE
// ===============================

if(envelope){

envelope.classList.add("float");

}

// ===============================
// START
// ===============================

window.addEventListener(

"load",

()=>{

window.scrollTo(0,0);

}

);