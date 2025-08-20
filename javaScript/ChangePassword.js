//Run
RunChangePasswordPage();



function RunChangePasswordPage() {

    onClick_UpdatePasswordBTN();

}


function GetPasswordValue() {
    const currentPassword = document.querySelector("#currentPassword").value;
    const newPassword = document.querySelector("#newPassword").value;

    return {
        currentPassword: currentPassword,
        newPassword: newPassword
    };
}

function onClick_UpdatePasswordBTN() {

    document.querySelector("#changePasswordForm").addEventListener("submit", async function (event) {

        event.preventDefault();

        const passwords = GetPasswordValue();

        let uersID = localStorage.getItem("userID");

        let result = await ChangePassword(uersID, passwords.currentPassword, passwords.newPassword)


        if (result) {

            showPasswordChangedMessage();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);

        }
        else {
            showPasswordFailedMessage();
        }

    });

}


async function ChangePassword(userID, currentPassword, newPassword) {

    url = `https://localhost:7235/api/AutoMall/ChangeUserPassword?userID=${encodeURIComponent(userID)}&currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return false;
        }

        return true;

    } catch (error) {
        console.error("Failed to update password:", error);
        return false;
    }

}


function showPasswordChangedMessage() {

    const container = document.querySelector(".auth-content");

    
    const failedMessage = document.querySelector("#passwordFailedMessage");
    if (failedMessage) {
        failedMessage.remove();
    }


    if (document.querySelector("#passwordChangedMessage")) return;


    const message = document.createElement("p");
    message.id = "passwordChangedMessage";
    message.textContent = "✅ Your password successfully updated!";


    message.style.color = "#28a745";
    message.style.textAlign = "center";
    message.style.fontSize = "1.2rem";
    message.style.fontWeight = "bold";
    message.style.marginTop = "15px";
    message.style.padding = "10px";
    message.style.borderRadius = "5px";



    container.appendChild(message);
}


function showPasswordFailedMessage() {
    const container = document.querySelector(".auth-content");

    if (document.querySelector("#passwordFailedMessage")) return;

    const message = document.createElement("p");
    message.id = "passwordFailedMessage";
    message.textContent = "❌ Password update failed. try again!";

    message.style.color = "#dc3545"; // Red for failure
    message.style.textAlign = "center";
    message.style.fontSize = "1.2rem";
    message.style.fontWeight = "bold";
    message.style.marginTop = "15px";
    message.style.padding = "10px";
    message.style.borderRadius = "5px";

    container.appendChild(message);
}

