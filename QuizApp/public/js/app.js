//Fetch all the questions from the file on load
var questionNumber = 1;
var questionObj = null;
var fiveMinutes = 60 * 5;
startTimer(fiveMinutes);

function startTimer(duration) {
    var timer = duration, minutes, seconds;
    const intervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('time').innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
        }
    }, 1000);
}

function loadQuestions() {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/fetchQuestions";
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status;
            if (status === 0 || (200 >= status && status < 400)) {
                questionObj = JSON.parse(xhr.responseText);
                initializeDummyValues();
                updateQuestions();
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("");
}

function onNextClick() {
    if (questionNumber < 10) {
        questionNumber += 1;
    } else {
        questionNumber = 1;
    }
    updateQuestions();
}

function initializeDummyValues() {
    for (i = 1; i <= 10; i++) {
        questionObj[i].selectedAnswer = "";
        questionObj[i].isMarked = false;
    }
}

function onQuestionChange() {
    //remove the answer selected
    if (questionObj[questionNumber].selectedAnswer) {
        for (i = 1; i <= 4; i++) {
            if (questionObj[questionNumber].selectedAnswer == i) {
                document.getElementById('option' + i + '_radio').checked = true;
                document.getElementById('option' + i + '_check').style.visibility = "visible";
                document.getElementById('option' + i + '_li').classList.add('answer-active');
            } else {
                document.getElementById('option' + i + '_check').style.visibility = "hidden";
                document.getElementById('option' + i + '_li').classList.remove('answer-active');
            }
        }
    } else {
        for (i = 1; i <= 4; i++) {
            document.getElementById('option' + i + '_radio').checked = false;
            document.getElementById('option' + i + '_check').style.visibility = "hidden";
            document.getElementById('option' + i + '_li').classList.remove('answer-active');
        }
    }
    //update the question number with the active question
    for (i = 1; i <= 10; i++) {
        if (i == questionNumber) {
            document.getElementById("qn_" + i).style.backgroundColor = "transparent";
            document.getElementById("qn_" + i).style.backgroundColor = "#23629F";
        } else {
            document.getElementById("qn_" + i).style.border = "";
            document.getElementById("qn_" + i).style.backgroundColor = "transparent";
            document.getElementById("qn_" + i).style.backgroundColor = "grey";
        }
    }
    //reset the flag questions icon
    document.getElementById("flagged_qn").src = "assets/flag_before_click.png";
}

function updateQuestions() {
    var questions = questionObj[questionNumber];
    document.getElementById('qn_id').innerHTML = questions.question;
    document.getElementById('option1').innerHTML = questions.option_1;
    document.getElementById('option2').innerHTML = questions.option_2;
    document.getElementById('option3').innerHTML = questions.option_3;
    document.getElementById('option4').innerHTML = questions.option_4;
    document.getElementById('current_question').innerHTML = questionNumber + "/10";
    onQuestionChange();
    if(questionObj[questionNumber].isMarked === true) {
        document.getElementById("flagged_qn").src = "assets/flag_after_click.png";
    }
}

function onPreviousClick() {
    if (questionNumber > 1) {
        questionNumber -= 1;
    } else {
        questionNumber = 10;
    }
    updateQuestions();
}

function onAnswerSelected(li_id) {
    for (i = 1; i <= 4; i++) {
        if (li_id.id == "option" + i + "_li") {
            questionObj[questionNumber].selectedAnswer = i;
            document.getElementById('option' + i + '_radio').checked = true;
            document.getElementById('option' + i + '_check').style.visibility = "visible";
            document.getElementById('option' + i + '_li').classList.add('answer-active');
        } else {
            document.getElementById('option' + i + '_check').style.visibility = "hidden";
            document.getElementById('option' + i + '_li').classList.remove('answer-active');
        }
    }
}

function onQuestionSelected(selectedButton) {
    for (i = 1; i <= 10; i++) {
        if (selectedButton.id == "qn_" + i) {
            questionNumber = i;
            updateQuestions();
            document.getElementById("qn_" + i).style.backgroundColor = "transparent";
            document.getElementById("qn_" + i).style.backgroundColor = "#23629F";
        } else {
            document.getElementById("qn_" + i).style.border = "";
            document.getElementById("qn_" + i).style.backgroundColor = "transparent";
            document.getElementById("qn_" + i).style.backgroundColor = "grey";
        }
    }
}

function onMenuClick(selectedMenu) {
    if (selectedMenu.id == "home_selection") {
        document.getElementById('home_selection').classList.add('selection_menu');
        document.getElementById('profile_selection').classList.remove('selection_menu');
    } else {
        document.getElementById('profile_selection').classList.add('selection_menu');
        document.getElementById('home_selection').classList.remove('selection_menu');
    }
}

function changeImage() {
    if (document.getElementById("flagged_qn").src.indexOf("assets/flag_before_click.png") != -1) {
        document.getElementById("flagged_qn").src = "assets/flag_after_click.png";
        questionObj[questionNumber].isMarked = true;
    } else {
        questionObj[questionNumber].isMarked = false;
        document.getElementById("flagged_qn").src = "assets/flag_before_click.png";
    }

}
