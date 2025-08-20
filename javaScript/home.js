
let carGrid = document.querySelector('.car-grid');

// Run 
StartHome();










function StartHome() {
    AddCarsToGrid(carGrid, CarsData());
    handleSelectChange();
    handleSearchButtonClick();
    on_ClickSellYourCarBTN();
    handleSearchBoxInput();
}

function NoCarsFoundMessage(container) {
    let noCarsMessage = document.createElement("h1");
    noCarsMessage.id = "noCarsMessage"; 
    noCarsMessage.textContent = "NO CARS FOUND!"; 
    container.appendChild(noCarsMessage); 
}

function on_ClickSellYourCarBTN() {
    document.querySelector("#Sell-Now-BTN").addEventListener("click", function () {
        IsLoggedIn() ? window.location.href = "Sell-Your-Car.html" :
            window.location.href = "Login.html";
    });
}

async function handelUserCarsBtn() {

    if (localStorage.getItem("isUserLogged") !== "true") {
        return;
    }

    let UserID = localStorage.getItem("userID");
    let userCarImages = await GetAllUserCars('Available', UserID);
    let foundCount = 0;
    document.querySelectorAll(".car-card").forEach(card => {

        let imgElement = card.querySelector(".car-image img");
        let buyButton = card.querySelector(".Buy-Now-Btn");
        let imgSrc = imgElement.src.split("/").pop();


        if (userCarImages.includes(`imges/${imgSrc}`)) {
            buyButton.style.display = "none";
            foundCount++;
        }
        if (foundCount === userCarImages.length) {
            return;
        }

    });

}

async function GetAllUserCars(status, userID) {

    try {
        let url = `https://localhost:7235/api/AutoMall/GetAllUserCars?status=${encodeURIComponent(status)}&userID=${encodeURIComponent(userID)}`

        let response = await fetch(url);

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return false;
        }

        let imagePaths = await response.json();



        return imagePaths;

    } catch (error) {
        console.error("Error fetching data:", error);
    }



}

function handleSelectChange() {
    document.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", () => AddCarsToGrid(carGrid, CarsData()));
    });
}

function handleSearchButtonClick() {
    document.querySelector(".search-btn").addEventListener("click", () => AddCarsToGrid(carGrid, GetCarsByMake()));
}

function handleSearchBoxInput() {
    document.querySelector('.search-box input').addEventListener("input", () => {
        if (isSearchBarEmpty()) {
            AddCarsToGrid(carGrid, CarsData());
        }
    });
}


function onClick_BuyNowBtn() {

    document.querySelectorAll(".Buy-Now-Btn").forEach(button => {
        button.addEventListener("click", function () {
            if (localStorage.getItem("isUserLogged") === "true") {

                let carCard = this.closest(".car-card");
                let carTitle = carCard.querySelector(".car-Name").textContent;
                let carPrice = carCard.querySelector(".car--price").textContent;
                let carMileage = carCard.querySelector(".car-mileage").textContent;
                let carFuel = carCard.querySelector(".car-fuelType").textContent;
                let carCategory = carCard.querySelector(".car-category").textContent;
                let carTransmission = carCard.querySelector(".car-transmission").getAttribute("data-id");
                let carCondition = carCard.querySelector(".car-condition").textContent;
                let carimg = carCard.querySelector(".car-Photo").src;

                localStorage.setItem("selectedCar", JSON.stringify({
                    imageSrc: carimg,
                    title: carTitle,
                    price: carPrice,
                    mileage: carMileage,
                    fuelType: carFuel,
                    category: carCategory,
                    transmission: carTransmission,
                    condition: carCondition
                }));

                window.location.href = "Checkout.html";
            }
            else {
                window.location.href = "Login.html";
            }

        });
    });

}


function ClearElement(element) {
    element.innerHTML = '';
}



function CreateCarCard(car) {
    let CarCard = document.createElement('div');
    CarCard.className = 'car-card';

    CarCard.innerHTML = `
                    <div  class="car-transmission" data-id="${car.transmission}">
                    <div class="car-image">
                        <img class="car-Photo" src="${car.imagePath}" loading="lazy" alt="${car.make} ${car.model}">
                        <!-- Used or New -->
                        <span class="${car.condition === 'New' ? 'featured-tag-New car-condition' : 'featured-tag-Used car-condition'}">${car.condition}</span>
                        <!-- Used or New -->                        
                    </div>
                    <div class="car-details">
                        <h3 class="car-Name">${car.make} ${car.model} ${car.year}</h3>
                        <div class="car-specs">
                            <span class="car-mileage"><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} mi</span>
                            <span class="car-fuelType"><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                            <span class="car-category"><i class="fas fa-car"></i> ${car.category}</span>
                        </div>
                        <div class="car-price">
                            <span class="car--price">$${car.price.toLocaleString()}</span>
                            <button class="btn btn-inquire Buy-Now-Btn">Buy Now</button>
                        </div>
                    </div>
                
    `

    return CarCard;
}



async function GetCarsListFromApi() {
    let ApiEndPoint = "https://localhost:7235/api/AutoMall/GetAllCars"

    try {
        let response = await fetch(ApiEndPoint, { method: "GET" })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else {
            let Cars = await response.json();
            return Cars;
        }
    }
    catch (error) {
        console.error("Error fetching cars:", error);
        return [];
    }
}




// async function AddCarsToGrid(Grid, CarsData) {
//     let Cars = await CarsData;

//     ClearElement(Grid);

//     if (!Cars || Cars.length === 0) {
//         NoCarsFoundMessage(Grid);
//         return; 
//     }

    

//     let fragment = document.createDocumentFragment();

//     Cars.forEach(car => {
//         fragment.appendChild(CreateCarCard(car));
//     });

//     Grid.appendChild(fragment);
//     handelUserCarsBtn();
//     onClick_BuyNowBtn();

// }



async function CarsData() {
    let HaveFilter = CheckFilters();
    let fetchData = HaveFilter ? GetCarsByFilters(GetFiltersValues()) :
        GetCarsListFromApi();

    return await fetchData;
}


function GetFilters() {
    return {
        Make: document.querySelector("select.Make").value,
        Category: document.querySelector("select.Category").value,
        Year: document.querySelector("select.Year").value,
        Price: document.querySelector("select.Price").value,
        Condition: document.querySelector("select.Condition").value
    };
}



function GetFiltersValues() {
    return {
        Make: document.querySelector("select.Make").selectedIndex === 0
            ? "All"
            : document.querySelector("select.Make").value,

        Category: document.querySelector("select.Category").selectedIndex === 0
            ? "All"
            : document.querySelector("select.Category").value,

        Year: document.querySelector("select.Year").selectedIndex === 0
            ? "All"
            : document.querySelector("select.Year").value,

        Price: document.querySelector("select.Price").selectedIndex === 0
            ? "All"
            : document.querySelector("select.Price").value.replace(/[$,]/g, ""),

        Condition: document.querySelector("select.Condition").selectedIndex === 0
            ? "All"
            : document.querySelector("select.Condition").value
    };
}



function CheckFilters() {
    let filters = GetFiltersValues();

    return filters.Make !== "All" ||
        filters.Category !== "All" ||
        filters.Year !== "All" ||
        filters.Price !== "All" ||
        filters.Condition !== "All";
}




async function GetCarsByFilters(Filter) {
    try {

        let queryString = new URLSearchParams({
            make: Filter.Make,
            category: Filter.Category,
            condition: Filter.Condition,
            price: Filter.Price,
            year: Filter.Year
        }).toString();

        let response = await fetch(`https://localhost:7235/api/AutoMall/GetAllCarsByFilters?${queryString}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching cars list:", error);
        return [];
    }

}



//Get Cars By Search bar

async function GetCarsByMake() {

    let searchBoxValue = encodeURIComponent(document.querySelector('.search-box input').value.trim());

    try {

        let response = await fetch(`https://localhost:7235/api/AutoMall/GetCarsByMake?name=${searchBoxValue}`);


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let CarsData = await response.json();

        return CarsData;

    }
    catch (error) {
        console.error("Error fetching cars list:", error);
    }

}



function isSearchBarEmpty() {
    return document.querySelector('.search-box input').value.trim() === "";
}



