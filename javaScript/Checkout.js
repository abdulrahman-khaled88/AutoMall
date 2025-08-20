//Start
StartCheckout();



function StartCheckout() {
    ShowCarInfo(GetSelectedCar());
    on_ClickCompletePurchase();
}

function on_ClickCompletePurchase() {


    document.getElementById("payment-form").addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!this.checkValidity()) {
            return;
        }





        if ( await AddPurchaseRecord(GetPaymentInfo(), getUserID(), getCarImagePath())) {
            purchaseSuccessUI();
        }
        else {
            purchaseFailedUI();
        }


    });


}


function purchaseSuccessUI() {

    document.querySelector("#payment-form").style.display = "none";
    document.querySelector(".payment-form-Title").style.display = "none";
    document.querySelector("#purchase-success").style.display = "block";

    let paymentForm = document.querySelector(".payment-form");

    paymentForm.style.display = "flex";
    paymentForm.style.flexDirection = "column";
    paymentForm.style.justifyContent = "center";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);

}

function purchaseFailedUI() {
    document.querySelector("#payment-form").style.display = "none";
    document.querySelector(".payment-form-Title").style.display = "none";
    document.querySelector("#purchase-failed").style.display = "block";

    let paymentForm = document.querySelector(".payment-form");

    paymentForm.style.display = "flex";
    paymentForm.style.flexDirection = "column";
    paymentForm.style.justifyContent = "center";

    setTimeout(() => {
        location.reload();
    }, 500);
}


function getCarImagePath() {
    let selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
    return selectedCar.imageSrc.split('/').slice(-2).join('/');
}

function getUserID() {
    return localStorage.getItem("userID");
}

async function AddPurchaseRecord(PaymentInfoDTO, UserID, CarImagePath) {
    try {

        let url = `https://localhost:7235/api/AutoMall/AddPurchaseRecord?UserID=${encodeURIComponent(UserID)}&CarImagePath=${encodeURIComponent(CarImagePath)}`;

        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(PaymentInfoDTO)
        });

        if (!response.ok) {
            console.error(`Failed to add purchase record: ${response.statusText}`);
            return false;
        }



    }
    catch (error) {
        console.error("Error in AddPurchaseRecord:", error);
    }


    return true;

}

function GetPaymentInfo() {
    let cardNumber = document.getElementById("card-number").value;
    let cardHolder = document.getElementById("card-holder").value.trim();
    let expiryDate = document.getElementById("expiry-date").value;
    let cvv = document.getElementById("cvv").value;

    let [expiryMonth, expiryYear] = expiryDate.split("/").map(Number);

    return {
        cardNumber: cardNumber,
        cardHolderName: cardHolder,
        expiryMonth: expiryMonth,
        expiryYear: 2000 + expiryYear,
        cvv: cvv
    };
}

function GetSelectedCar() {
    return JSON.parse(localStorage.getItem('selectedCar'));
}

function ShowCarInfo(Car) {
    document.getElementById('car-image-Checkout').src = Car.imageSrc;
    document.getElementById('car-title').textContent = Car.title;
    document.getElementById('car-mileage').textContent = Car.mileage;
    document.getElementById('car-fuel').textContent = Car.fuelType;
    document.getElementById('car-category').textContent = Car.category;
    document.getElementById('car-condition').textContent = Car.condition;
    document.getElementById('car-Transmission').textContent = Car.transmission;
    document.getElementById('car-price').textContent = Car.price;
}