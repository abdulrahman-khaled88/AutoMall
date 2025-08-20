// Login
LoginStart();




function LoginStart() {
    EventListeners();
}



function setupMenuToggleEvent() {

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






//EventListeners
function EventListeners() {

    onSubmit_LoginForm();
    onSubmit_SignupForm();
    setupMenuToggleEvent();

}

function onSubmit_LoginForm() {
    let loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!this.checkValidity()) {
                return;
            }
            
            let UserInfo = await GetUserName();
             UpdateLoginForm(UserInfo);
        });
    }
}

function onSubmit_SignupForm() {
    let signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!this.checkValidity()) {
                return;
            }

            if (await SignUp(GetNewUserInfo())) {
                SignupSuccessUI();
            }
        });
    }
}
//End Of EventListeners



















async function GetUserName() {

    let LoginInfo = GetLoginValues();

    try {

        let url = `https://localhost:7235/api/AutoMall/GetUserInfo?email=${encodeURIComponent(LoginInfo.email)}&password=${encodeURIComponent(LoginInfo.password)}`;




        let response = await fetch(url);

        if (!response.ok) {
            return false;
        }
        else {
            let data = await response.json();
            console.log(data);
            return data;
        }




    }
    catch (error) {
        console.error("Error fetching User Name:", error);
        return false;
    }
}








function GetLoginValues() {
    return {
        email: document.querySelector('#login-email').value.trim(),
        password: document.querySelector('#login-password').value.trim(),
    };
}







function ClearElement(element) {
    element.innerHTML = '';
}






function successLoginUI(UserInfo) {

    let ErrorMessage = document.getElementById('login-error');
    let SuccessMessage = document.getElementById('login-success');

    ErrorMessage.style.display = 'none';
    SuccessMessage.style.display = 'block';

    localStorage.clear();
    localStorage.setItem("isUserLogged", 'true');
    localStorage.setItem("username", UserInfo.fullName);
    localStorage.setItem("userID", UserInfo.userID);

    setTimeout(() => {
        window.location.href = "index.html";
    }, 300);
}







function failureLoginUI() {

    let ErrorMessage = document.getElementById('login-error');

    ErrorMessage.style.display = 'block';


}






function UpdateLoginForm(UserInfo) {

    UserInfo ? successLoginUI(UserInfo) : failureLoginUI();

}

//SignUp

async function SignUp(NewUser) {
    try {
        let response = await fetch(`https://localhost:7235/api/AutoMall/AddNewUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                FullName: NewUser.fullName,
                EmailAddress: NewUser.email,
                Password: NewUser.password
            })
        });

        if (!response.ok) {
            return false;
        }

        let result = await response.json();
        return result.Status;

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

function GetNewUserInfo() {

    return {
        fullName: document.getElementById("signup-name").value,
        email: document.getElementById("signup-email").value.trim(),
        password: document.getElementById("signup-password").value.trim()
    };

}

function SignupSuccessUI() {

    document.getElementById("signup-success").style.display = "block";

    setTimeout(() => {
        window.location.reload();
    }, 800);
}