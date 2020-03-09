function onSigninUpToggle(isSignin) {
    if(isSignin) {
        document.getElementById('sign_in_btn').classList.remove('inactive');
        document.getElementById('sign_in_btn').classList.add('active');
        document.getElementById('signup_btn').classList.remove('active');
        document.getElementById('login_form').style.display = 'block';
        document.getElementById('signUp_form').style.display = 'none';
    } else {
        document.getElementById('signup_btn').classList.remove('inactive');
        document.getElementById('signup_btn').classList.add('active');
        document.getElementById('sign_in_btn').classList.remove('active');
        document.getElementById('login_form').style.display = 'none';
        document.getElementById('signUp_form').style.display = 'block';
    }
}

function onSignInClick() {
    var xhr = new XMLHttpRequest();
    var username = document.getElementById('signin_username').value;
    var password = document.getElementById('signin_pwd').value;
    var url = 'http://localhost:8000/checkUserExists?username='+username+'&password='+password;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status;
            if (status === 0 || (200 >= status && status < 400)) {
                if(xhr.responseText) {
                    var userObj = JSON.parse(xhr.responseText);
                    sessionStorage.setItem('userObj', JSON.stringify(userObj));
                    window.location.href="category.html";
                } else {
                    console.log('incorrect user id and password');
                }
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("");
}

function onSignOut() {
    document.getElementById("myModal").style.display = 'block';
    document.getElementsByClassName('modal-header')[0].innerHTML = 'Are You sure you want to sign out??';

    document.getElementById('ok_btn_popup').onclick = function () {
        //clear the session storage
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
    // When the user clicks on cancel btn, close the modal
    document.getElementById('cancel_btn_popup').onclick = function () {
        document.getElementById("myModal").style.display = "none";
    }
}

function onCategorySelection(categoryName) {
    window.location.href = 'quiztype.html?category='+categoryName;
}

function onQuizTypeSelection (quizType) {
    const urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get('category');
    window.location.href = 'instructions.html?quiztype='+quizType+'&category='+category;
}

function initializeUserName() {
    var userObj = JSON.parse(sessionStorage.getItem('userObj'));
    document.getElementById('username').innerHTML = userObj.username.toUpperCase();
}