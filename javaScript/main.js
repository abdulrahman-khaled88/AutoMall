// Run 
StartMain();




function StartMain() {
    on_ClickLogout();
    on_ClickSellYourCarNavbar();
    on_ClickSellYourCarFooter();
    MenuToggle();
    UpdateUI();
}




function on_ClickLogout() {
    if (localStorage.length > 0) {
        document.getElementById("logout-btn").addEventListener("click", () => LogOut());
    }
}

function on_ClickSellYourCarNavbar() {
    // document.querySelector(".navbar .Sell-Your-Car").addEventListener("click", function () {
    //     IsLoggedIn() ? window.location.href = "Sell-Your-Car.html" :
    //         window.location.href = "Login.html";
    // });

    document.querySelector(".navbar .Sell-Your-Car").addEventListener("click", function () {
        true ? window.location.href = "Sell-Your-Car.html" :
            window.location.href = "Login.html";
    });
}

function on_ClickSellYourCarFooter() {
    // document.querySelector(".footer-links .Sell-Your-Car").addEventListener("click", function () {
    //     IsLoggedIn() ? window.location.href = "Sell-Your-Car.html" :
    //         window.location.href = "Login.html";
    // });
    document.querySelector(".footer-links .Sell-Your-Car").addEventListener("click", function () {
        true ? window.location.href = "Sell-Your-Car.html" :
            window.location.href = "Login.html";
    });
}


function MenuToggle() {
    // Menu Toggle Functionality with Accessibility
    let menuIcon = document.getElementById('menu-icon');
    let navbar = document.querySelector('.navbar');
    let userActions = document.querySelector('.user-actions');

    menuIcon.setAttribute('aria-expanded', 'false');
    menuIcon.setAttribute('aria-controls', 'navbar user-actions');

    menuIcon.addEventListener('click', () => {
        let isExpanded = menuIcon.getAttribute('aria-expanded') === 'true';
        navbar.classList.toggle('active');
        userActions.classList.toggle('active');
        menuIcon.classList.toggle('active');
        menuIcon.setAttribute('aria-expanded', !isExpanded);
    });
}


//Change UI if user login

function IsLoggedIn() {
    return localStorage.getItem('isUserLogged') === "true";
}





function GetUserName() {
    return localStorage.getItem('username');
}





function LoggedInUI() {

    let LoginBtn = document.getElementById('Login-btn');

    if (LoginBtn) {
        LoginBtn.style.display = "none";
    }

    document.querySelector('.user-actions').style.display = 'none';

    document.querySelector('.user-actions-signed-In').style.display = 'block';

    // document.querySelector('.user-actions-signed-In span.username').innerHTML = GetUserName();
    document.querySelector('.user-actions-signed-In span.username').innerHTML = 'Abdo Khaled';
}





function UpdateUI() {
    // if (IsLoggedIn()) {
    //     LoggedInUI();
    // }
    if (true) {
        LoggedInUI();
    }
}


function LogOut() {
    localStorage.setItem("isUserLogged", "false");

    localStorage.removeItem("username");

    localStorage.removeItem("userID");

    localStorage.removeItem("selectedCar");

    window.location.href = "index.html";
}




