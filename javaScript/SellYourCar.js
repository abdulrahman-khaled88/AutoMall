//Run
Start_SellYourCar();



function Start_SellYourCar() {

    onClick_UploadArea();
    onChange_CarImages();
    onClick_ListMyCarBtn();

}



function onClick_ListMyCarBtn() {

    document.getElementById("sellCarForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        try {
            let carInfo = await GetCarsInfo();
            let result = await UploadCar(carInfo);

            if (result) {

                UploadSuccessUI();
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 500);

            }
            else {

                UploadFailedUI();

            }

        } catch (error) {
            throw error;
        }
    });

}



function onClick_UploadArea() {

    document.getElementById("uploadArea").addEventListener("click", function () {
        document.getElementById("carImages").click();
    });

}


function onChange_CarImages() {

    document.getElementById("carImages").addEventListener("change", function () {
        if (this.files.length > 0) {
            let previewContainer = document.getElementById("imagePreview");
            previewContainer.innerHTML = `<img src="${URL.createObjectURL(this.files[0])}" alt="Preview" style="max-width: 100%; height: 50%;">`;
        }
    });

}


async function GetCarsInfo() {
    let file = document.getElementById("carImages").files[0];
    let base64 = await convertImageToBase64(file);
    return {
        make: document.getElementById("make").value,
        model: document.getElementById("model").value,
        year: document.getElementById("year").value,
        mileage: document.getElementById("mileage").value,
        condition: document.getElementById("condition").value,
        imagePath: base64,
        fuelType: document.getElementById("fuelType").value,
        category: document.getElementById("category").value,
        transmission: document.getElementById("transmission").value,
        price: document.getElementById("price").value
    }
}

async function UploadCar(NewCar) {

    let userID = localStorage.getItem('userID');
    let Car = await NewCar;

    if (!NewCar || !userID) {
        console.error("Invalid car data or missing username");
        return false;
    }

    let endPoint = (`https://localhost:7235/api/AutoMall/AddNewUserCar?UserID=${encodeURIComponent(userID)}`);




    try {
        let response = await fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Car)
        });

        if (!response.ok) {
            console.error(errorData.message);
            return false;
        }

        return true;




    } catch (error) {
        console.error("Upload failed:", error.message);
        return false;
    }


}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {

        if (!file || !(file instanceof Blob)) {
            reject(new Error("Invalid file: Must be a Blob or File object"));
            return;
        }

        let reader = new FileReader();


        reader.onload = () => {
            let result = reader.result;


            if (typeof result !== "string" || !result.startsWith("data:")) {
                reject(new Error("Failed to generate valid Base64 Data URL"));
                return;
            }


            let base64Data = result.split(",")[1];
            resolve(base64Data || result);
        };


        reader.onerror = () => {
            reject(new Error("File read failed: " + reader.error?.message));
        };


        reader.readAsDataURL(file);
    });
}

function UploadSuccessUI() {
    document.getElementById('uploadSuccessMessage').style.display = 'block';
}

function UploadFailedUI() {
    document.getElementById('uploadFailedMessage').style.display = 'block';
}


