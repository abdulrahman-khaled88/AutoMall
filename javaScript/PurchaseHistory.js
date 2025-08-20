//Run
PurchaseHistoryStart();








async function PurchaseHistoryStart() {
    let items = await GetPurchaseHistory();
    AddItemsToPurchaseGrid(items);
}

// function AddItemsToPurchaseGrid(items) {
//     let PurchaseGrid = document.querySelector(".purchase-grid");

//     PurchaseGrid.innerHTML = '';

//     if (items === false) {
//         document.querySelector(".no-purchases").style.display = 'block';
//     } else {
//         items.forEach(item => {
//             let purchaseItem = CreatePurchaseItem(item);
//             PurchaseGrid.appendChild(purchaseItem);
//         });

//         setupViewDetailsButtons();
//     }


// }

function CreatePurchaseItem(item) {
    const purchaseItem = document.createElement("div");
    purchaseItem.classList.add("purchase-item");

    purchaseItem.innerHTML = `
        <div class="purchase-image">
            <img src="${item.imagePath}" alt="${item.year} ${item.make} ${item.model}">
            <span class="purchase-badge badge-delivered">Delivered</span>
            
        </div>
        <div class="purchase-details">
            <div class="purchase-header">
                <span class="purchase-id">Order #AM-${item.soldDate.split("-")[0]}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</span>
                <span class="purchase-date">${item.soldDate}</span>
            </div>
            <h3 class="purchase-title">${item.year} ${item.make} ${item.model}</h3>
            <div class="purchase-specs">
                <span><i class="fas fa-tachometer-alt"></i> ${item.mileage} miles</span>
                <span><i class="fas fa-gas-pump"></i> ${item.fuelType}</span>
                <span><i class="fas fa-car"></i> ${item.category}</span>
                <div id="card-holder-name" style="display: none;">${item.cardHolderName}</div>
                <div id="card-number" style="display: none;">${item.cardNumber}</div>
            </div>
            <div class="purchase-price">$${item.price.toLocaleString()}</div>
            <div class="purchase-actions">
                <a href="#" class="purchase-btn btn-details">View Details</a>
            </div>
        </div>
    `;

    return purchaseItem;
}



async function GetPurchaseHistory() {


    UserID = localStorage.getItem("userID");



    try {
        const response = await fetch(`https://localhost:7235/api/AutoMall/GetUserPurchaseHistory?userID=${decodeURIComponent(UserID)}`);


        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return false;
        }

        const data = await response.json();

        console.log("Purchase History:", data);

        return data;

    } catch (error) {
        console.error("Error fetching purchase history:", error);
        return false;
    }



}





function setupViewDetailsButtons() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-details')) {
            e.preventDefault();
            const purchaseItem = e.target.closest('.purchase-item');
            const carTitle = purchaseItem.querySelector('.purchase-title').textContent;
            const orderId = purchaseItem.querySelector('.purchase-id').textContent;
            const purchaseDate = purchaseItem.querySelector('.purchase-date').textContent;
            const price = purchaseItem.querySelector('.purchase-price').textContent;
            const CardHolderName = purchaseItem.querySelector('#card-holder-name').textContent;
            const CardNumber = purchaseItem.querySelector('#card-number').textContent;
            const maskedCard = CardNumber.slice(-4).padStart(CardNumber.length, '*');


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


            modal.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="font-size: 1.8rem; color: #192f6a; margin: 0;">Order Details</h2>
                        <button id="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-size: 1.5rem; color: #192f6a; margin-bottom: 10px;">${carTitle}</h3>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Order ID:</strong> ${orderId}</p>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Purchase Date:</strong> ${purchaseDate}</p>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Price:</strong> ${price}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 1.2rem; color: #192f6a; margin-bottom: 10px;">Delivery Information</h4>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Status:</strong> Delivered</p>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Delivery Date:</strong> ${calculateDeliveryDate(purchaseDate)}</p>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Delivery Address:</strong> 123 Main St, City, State ZIP</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 1.2rem; color: #192f6a; margin-bottom: 10px;">Payment Information</h4>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Card Holder Name:</strong> ${CardHolderName}</p>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Payment Method:</strong> Credit Card (${maskedCard})</p>
                        <p style="color: #6c757d; margin-bottom: 5px;"><strong>Transaction ID:</strong> TXN-${Math.random().toString(36).substr(2, 10).toUpperCase()}</p>
                    </div>
                    
                    
                </div>
            `;

            document.body.appendChild(modal);


            modal.querySelector('#close-modal').addEventListener('click', function () {
                document.body.removeChild(modal);
            });


            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        }
    });
}




function calculateDeliveryDate(purchaseDate) {
    let date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + 6);
    return date.toISOString().split('T')[0];
}



