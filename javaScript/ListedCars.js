//Run
ListedCarsStart();

async function ListedCarsStart() {
    // AddCarsToGrid(await GetListedCars());
    setupDeleteButtons();
    setupEditButtons();
}

async function GetListedCars() {
    const UserID = localStorage.getItem("userID");

    try {
        const response = await fetch(`https://localhost:7235/api/AutoMall/GetUserListedCars?userID=${decodeURIComponent(UserID)}`);

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return false;
        }

        const data = await response.json();
        console.log("Listed Cars:", data);
        return data;

    } catch (error) {
        console.error("Error fetching Listed Cars:", error);
        return false;
    }
}

function CreateCarCard(car) {
    const carCard = document.createElement("div");
    carCard.classList.add("car-card");

    carCard.innerHTML = `
        <div class="car-image">
            <img src="${car.imagePath}" alt="${car.year} ${car.make} ${car.model}">
            <span class="status-tag featured-tag-${car.status}">${car.status}</span>
        </div>
        <div class="car-details">
            <h3>${car.make} ${car.model} ${car.year}</h3>
            <div class="car-specs">
                <span><i class="fas fa-tachometer-alt"></i> ${car.mileage} mi</span>
                <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                <span><i class="fas fa-car"></i> ${car.category}</span>
            </div>
            <div class="car-price">
                <span>$${car.price.toLocaleString()}</span>
            </div>
            <div class="car-actions">
                ${car.status === 'Available' ? `<button class="btn btn-edit"><i class="fas fa-edit"></i> Edit</button>` : ''}
                <button class="btn btn-delete"><i class="fas fa-trash"></i> Delete</button>
            </div>
            <div class="car-id" style="display: none;">${car.carID}</div>
        </div>
    `;

    return carCard;
}

function AddCarsToGrid(cars) {
    let carGrid = document.querySelector(".car-grid");
    carGrid.innerHTML = '';

    if (!cars || cars.length === 0) {
        return;
    } else {
        cars.forEach(car => {
            let carCard = CreateCarCard(car);
            carGrid.appendChild(carCard);
        });
    }
}

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            handleDelete(this);
        });
    });
}

async function handleDelete(button) {
    const carCard = button.closest('.car-card');
    const carID = carCard.querySelector('.car-id').textContent;
    let result = await DeleteCar(carID);

    if (result) {
        carCard.style.opacity = '0';
        setTimeout(() => {
            carCard.remove();
        }, 300);
    } else {
        console.error("Error deleting Car");
    }
}

async function DeleteCar(CarID) {
    try {
        let url = `https://localhost:7235/api/AutoMall/DeleteCar?CarID=${encodeURIComponent(CarID)}`;
        let response = await fetch(url, {
            method: "DELETE",
        });

        return response.ok;
    } catch (error) {
        console.error("Error deleting car:", error);
        return false;
    }
}

function setupEditButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const carCard = this.closest('.car-card');
            handleEdit(carCard);
        });
    });
}

function ExtractCarInfo(carCard) {
    return {
        make: carCard.querySelector('.car-details h3').textContent.split(' ')[0],
        model: carCard.querySelector('.car-details h3').textContent.split(' ')[1],
        year: carCard.querySelector('.car-details h3').textContent.split(' ')[2],
        price: parseFloat(carCard.querySelector('.car-price span').textContent.replace('$', '').replace(/,/g, '')),
        mileage: parseInt(carCard.querySelector('.car-specs span:nth-child(1)').textContent.replace(' mi', '').replace(/,/g, '')),
        fuelType: carCard.querySelector('.car-specs span:nth-child(2)').textContent,
        category: carCard.querySelector('.car-specs span:nth-child(3)').textContent,
        status: carCard.querySelector('.status-tag').textContent,
        carID: carCard.querySelector('.car-id').textContent
    };
}

function handleEdit(carCard) {
    const car = ExtractCarInfo(carCard);
    const { modal, modalContent } = CreateModal(car);

    AddEffectsToButtons(modalContent);
    SetupFormSubmission(modalContent, modal);
    AddFocusStylesToForm(modalContent);
}

function CreateModal(car) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '30px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';

    modalContent.innerHTML = `
        <h2 style="margin: 0 0 20px 0; color: var(--secondary-color);">Edit Car Details</h2>
        <form id="editCarForm" novalidate>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Make</label>
                <input type="text" name="make" value="${car.make}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition);" required>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please enter the car make</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Model</label>
                <input type="text" name="model" value="${car.model}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition);" required>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please enter the car model</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Year</label>
                <input type="number" name="year" value="${car.year}" min="1900" max="${new Date().getFullYear() + 1}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition);" required>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please enter a valid year (1900-${new Date().getFullYear() + 1})</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Price ($)</label>
                <input type="number" name="price" value="${car.price}" min="0" step="0.01" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition);" required>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please enter a valid price</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Mileage</label>
                <input type="number" name="mileage" value="${car.mileage}" min="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition);" required>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please enter a valid mileage</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Fuel Type</label>
                <select name="fuelType" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition); cursor: pointer;" required>
                    <option value="">Select fuel type</option>
                    <option value="Gasoline" ${car.fuelType === 'Gasoline' ? 'selected' : ''}>Gasoline</option>
                    <option value="Diesel" ${car.fuelType === 'Diesel' ? 'selected' : ''}>Diesel</option>
                    <option value="Electric" ${car.fuelType === 'Electric' ? 'selected' : ''}>Electric</option>
                    <option value="Hybrid" ${car.fuelType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                </select>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please select a fuel type</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--secondary-color);">Category</label>
                <select name="category" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; transition: var(--transition); cursor: pointer;" required>
                    <option value="">Select category</option>
                    <option value="Sedan" ${car.category === 'Sedan' ? 'selected' : ''}>Sedan</option>
                    <option value="SUV" ${car.category === 'SUV' ? 'selected' : ''}>SUV</option>
                    <option value="Truck" ${car.category === 'Truck' ? 'selected' : ''}>Truck</option>
                    <option value="Coupe" ${car.category === 'Coupe' ? 'selected' : ''}>Coupe</option>
                    <option value="Convertible" ${car.category === 'Convertible' ? 'selected' : ''}>Convertible</option>
                </select>
                <div class="error-message" style="color: var(--error-color); font-size: 0.8rem; margin-top: 5px; display: none;">Please select a category</div>
            </div>
            
            <input type="hidden" name="carID" value="${car.carID}">
            
            <div style="display: flex; justify-content: space-between; gap: 15px; margin-top: 25px;">
                <button type="button" id="cancelEdit" style="padding: 12px 25px; background-color: #f8f9fa; color: var(--error-color); border: none; border-radius: 5px; cursor: pointer; font-weight: 500; transition: var(--transition); flex: 1;">
                    Cancel
                </button>
                <button type="submit" style="padding: 12px 25px; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500; transition: var(--transition); flex: 1;">
                    Save Changes
                </button>
            </div>
        </form>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add validation handling
    const form = modalContent.querySelector('#editCarForm');
    const inputs = modalContent.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            const errorMessage = input.parentElement.querySelector('.error-message');
            input.style.borderColor = 'var(--error-color)';
            errorMessage.style.display = 'block';
        });

        input.addEventListener('input', () => {
            const errorMessage = input.parentElement.querySelector('.error-message');
            input.style.borderColor = '#ddd';
            errorMessage.style.display = 'none';
        });
    });

    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    const errorMessage = input.parentElement.querySelector('.error-message');
                    input.style.borderColor = 'var(--error-color)';
                    errorMessage.style.display = 'block';
                }
            });
        }
    });

    return { modal, modalContent };
}

function AddEffectsToButtons(modalContent) {
    const cancelBtn = modalContent.querySelector('#cancelEdit');
    const saveBtn = modalContent.querySelector('button[type="submit"]');

    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        cancelBtn.style.transform = 'translateY(-2px)';
    });

    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.backgroundColor = '#f8f9fa';
        cancelBtn.style.transform = 'translateY(0)';
    });

    saveBtn.addEventListener('mouseenter', () => {
        saveBtn.style.backgroundColor = '#1a7ae6';
        saveBtn.style.transform = 'translateY(-2px)';
        saveBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });

    saveBtn.addEventListener('mouseleave', () => {
        saveBtn.style.backgroundColor = 'var(--primary-color)';
        saveBtn.style.transform = 'translateY(0)';
        saveBtn.style.boxShadow = 'none';
    });
}

function SetupFormSubmission(modalContent, modal) {
    const form = modalContent.querySelector('#editCarForm');
    const cancelBtn = modalContent.querySelector('#cancelEdit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if form is valid
        if (!form.checkValidity()) {
            // Show validation errors
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.style.borderColor = 'var(--error-color)';
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.style.display = 'block';
                    }
                }
            });
            return; // Stop if invalid
        }

        // If valid, proceed with update
        const updatedCar = GetUpdatedCarInfo(form);
        const success = await updateCar(updatedCar);

        if (success) {
            modal.remove();
            ListedCarsStart();
        } else {
            alert("Update failed");
        }
    });

    // Clear errors when user types
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '#ddd';
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.style.display = 'none';
            }
        });
    });

    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });
}

function GetUpdatedCarInfo(form) {
    const formData = new FormData(form);
    return {
        carID: formData.get('carID'),
        make: formData.get('make'),
        model: formData.get('model'),
        year: parseInt(formData.get('year')),
        price: parseFloat(formData.get('price')),
        mileage: parseInt(formData.get('mileage')),
        fuelType: formData.get('fuelType'),
        category: formData.get('category'),
        status: 'Null',
        imagePath: 'Null'
    };
}

function AddFocusStylesToForm(modalContent) {
    const inputs = modalContent.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary-color)';
            input.style.boxShadow = '0 0 0 3px rgba(34, 136, 255, 0.2)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        });
    });
}

async function updateCar(car) {
    try {
        const response = await fetch('https://localhost:7235/api/AutoMall/UpdateListedCarInfo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car)
        });

        if (!response.ok) {
            return false;
        }

        return true;

    } catch (error) {
        console.error('Error updating car:', error);
        return false;
    }
}