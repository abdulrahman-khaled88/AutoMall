//Run
ContactPageStart();



function ContactPageStart() {
    onClick_FormSubmit();
}

function showSuccessMessage() {

    let container = document.querySelector(".contact-form");

    let successMessage = document.createElement("h1");
    successMessage.id = "successMessage";
    successMessage.textContent = "Message sent successfully!";


    successMessage.style.color = "#28a745";
    successMessage.style.textAlign = "center";
    successMessage.style.fontSize = "2rem";
    successMessage.style.marginTop = "20px";
    container.appendChild(successMessage);
}

function onClick_FormSubmit() {
    document.querySelector("#contactForm").addEventListener("submit", function (event) {
        event.preventDefault();
        showSuccessMessage();

        setTimeout(() => {
            window.location.href = "index.html"; 
        }, 500);
    });
}

