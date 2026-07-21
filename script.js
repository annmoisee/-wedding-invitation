const seal = document.getElementById("seal");
const envelope = document.querySelector(".envelope");
const letter = document.querySelector(".letter");
const message = document.querySelector(".inside-message");

seal.addEventListener("click", () => {

    // печать исчезает
    seal.style.transform = "translate(-50%,-50%) scale(0)";
    seal.style.opacity = "0";

    // конверт немного уменьшается
    envelope.style.transition = "1s";
    envelope.style.transform = "scale(0.92)";

    // текст внутри
    setTimeout(() => {
        message.style.transition = "1s";
        message.style.opacity = "1";
    }, 600);

    // письмо выезжает
    setTimeout(() => {
        letter.style.transition = "1.4s ease";
        letter.style.opacity = "1";
        letter.style.transform = "translate(-50%,-25%)";
    }, 1400);

});