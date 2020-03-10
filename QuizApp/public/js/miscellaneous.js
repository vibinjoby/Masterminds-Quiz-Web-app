var scoreDetails = {};
var isHighScorePage = false;
var urlParams = new URLSearchParams(window.location.search);
var profilepage = urlParams.get('profilepage');

function onSigninUpToggle(isSignin) {
    if (isSignin) {
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
    var url = 'http://localhost:8000/checkUserExists?username=' + username + '&password=' + password;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status;
            if (status === 0 || (200 >= status && status < 400)) {
                if (xhr.responseText) {
                    var userObj = JSON.parse(xhr.responseText);
                    sessionStorage.setItem('userObj', JSON.stringify(userObj));
                    window.location.href = "quiztype.html";
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
    var urlParams = new URLSearchParams(window.location.search);
    var quiztype = urlParams.get('quiztype');
    window.location.href = 'instructions.html?category=' + categoryName + '&quiztype=' + quiztype;
}

function onQuizTypeSelection(quizType) {
    window.location.href = 'category.html?quiztype=' + quizType;
}

function initializeUserName() {
    var userObj = JSON.parse(sessionStorage.getItem('userObj'));
    if (userObj) {
        document.getElementById('username').innerHTML = userObj.username.toUpperCase();
    } else {
        window.location.href = 'index.html';
    }

    if (profilepage && profilepage == 'highscore') {
        document.getElementById('myScoreLink').classList.remove('active-nav-bar');
        document.getElementById('highScoreLink').classList.add('active-nav-bar');
    } else if (profilepage && profilepage == 'myscore') {
        document.getElementById('highScoreLink').classList.remove('active-nav-bar');
        document.getElementById('myScoreLink').classList.add('active-nav-bar');
    }
}

function getRapidQuizScore() {
    if (isHighScorePage) {
        document.getElementById("overall-real-score-table").style.display = 'none';
        document.getElementById("overall-rapid-score-table").style.display = 'table';
        document.getElementById('rapid_quiz').classList.add('active-quiz-type');
        document.getElementById('real_quiz').classList.remove('active-quiz-type');
    } else {
        document.getElementById("user-real-score-table").style.display = 'none';
        document.getElementById("user-rapid-score-table").style.display = 'table';
        document.getElementById('rapid_quiz').classList.add('active-quiz-type');
        document.getElementById('real_quiz').classList.remove('active-quiz-type');
    }
}

function getRealQuizScore() {
    if (isHighScorePage) {
        document.getElementById("overall-rapid-score-table").style.display = 'none';
        document.getElementById("overall-real-score-table").style.display = 'table';
        document.getElementById('real_quiz').classList.add('active-quiz-type');
        document.getElementById('rapid_quiz').classList.remove('active-quiz-type');
        //navigation links

    } else {
        document.getElementById("user-rapid-score-table").style.display = 'none';
        document.getElementById("user-real-score-table").style.display = 'table';
        document.getElementById('real_quiz').classList.add('active-quiz-type');
        document.getElementById('rapid_quiz').classList.remove('active-quiz-type');
        //navigation links
        document.getElementById('myScoreLink').classList.add('active-nav-bar');
        document.getElementById('highScoreLink').classList.remove('active-nav-bar');
    }

}

function populateOverallScoreDetails(quizType, overallScoreDetails) {
    var table = null;
    if (quizType == 'rapid') {
        table = document.getElementById("overall-rapid-score-table");
    } else {
        table = document.getElementById("overall-real-score-table");
    }

    // helper function        
    function addCell(tr, text) {
        var td = tr.insertCell();
        td.textContent = text;
        return td;
    }

    // create header 
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var headerRow = thead.insertRow();
    addCell(headerRow, 'RANK');
    addCell(headerRow, 'NAME');
    addCell(headerRow, 'SCORE');

    // insert data
    var i = 1;
    overallScoreDetails.forEach(function (score) {
        var row = tbody.insertRow();
        addCell(row, i++);
        addCell(row, score.username.toUpperCase());
        addCell(row, score.score + '/10');
    });
}

function populateUserScoreDetails(quizType) {
    var table = null;
    if (quizType == 'rapid') {
        table = document.getElementById("user-rapid-score-table");
    } else {
        table = document.getElementById("user-real-score-table");
    }

    // helper function        
    function addCell(tr, text) {
        var td = tr.insertCell();
        td.textContent = text;
        return td;
    }

    // create header 
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var headerRow = thead.insertRow();
    addCell(headerRow, 'S.NO');
    addCell(headerRow, 'SCORE');
    addCell(headerRow, 'DATE');

    // insert data
    var i = 1;
    scoreDetails.forEach(function (score) {
        if (score.quiztype == quizType) {
            var row = tbody.insertRow();
            addCell(row, i++);
            addCell(row, score.score + '/10');
            addCell(row, score.scoreDate);
        }
    });
}

function onFetchUserScoreDetails() {
    var urlParams = new URLSearchParams(window.location.search);
    var profilepage = urlParams.get('profilepage');
    if (profilepage == 'myscore') {
        document.getElementById('overall-score').style.display = 'none';
        document.getElementById('user-score').style.display = 'table';
    } else if (profilepage == 'highscore') {
        document.getElementById('overall-score').style.display = 'table';
        document.getElementById('user-score').style.display = 'none';
    } else {
        // if the url is manipulated redirect to category page
        window.location.href = 'category.html';
    }
    var xhr = new XMLHttpRequest();
    var userObj = JSON.parse(sessionStorage.getItem('userObj'));
    if (userObj) {
        if (profilepage == 'myscore') {
            isHighScorePage = false;
            var url = 'http://localhost:8000/fetchUserScoreDetails?username=' + userObj.username;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status === 0 || (200 >= status && status < 400)) {
                        if (xhr.responseText) {
                            scoreDetails = JSON.parse(xhr.responseText);
                            populateUserScoreDetails('rapid');
                            populateUserScoreDetails('real');
                            getRapidQuizScore();
                        }
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send("");
        } else {
            isHighScorePage = true;
            var url = 'http://localhost:8000/fetchOverallScoreDetails';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status === 0 || (200 >= status && status < 400)) {
                        if (xhr.responseText) {
                            var overallScoreDetails = JSON.parse(xhr.responseText);
                            var rapidUsersScore = overallScoreDetails.rapidUsersScore;
                            rapidUsersScore.sort(GetSortOrder("score"));
                            var realUsersScore = overallScoreDetails.realUsersScore;
                            realUsersScore.sort(GetSortOrder("score"));
                            populateOverallScoreDetails('rapid', rapidUsersScore);
                            populateOverallScoreDetails('real', realUsersScore);
                            getRapidQuizScore();
                        }
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send("");
        }

        initializeUserName();
    } else {
        window.location.href = 'index.html';
    }
}

//Comparer Function  
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;
        }
        return 0;
    }
}