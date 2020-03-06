//Fetch all the questions from the file on load
var questionNumber = 1;
var questionsAnswered = 0;
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
        for (j = 1; j <= 4; j++) {
            if (questionObj[questionNumber].selectedAnswer == j) {
                document.getElementById('option' + j + '_check').style.visibility = "visible";
                document.getElementById('option' + j + '_li').classList.add('answer-active');
            } else {
                document.getElementById('option' + j + '_check').style.visibility = "hidden";
                document.getElementById('option' + j + '_li').classList.remove('answer-active');
            }
        }
    } else {
        for (j = 1; j <= 4; j++) {
            document.getElementById('option' + j + '_check').style.visibility = "hidden";
            document.getElementById('option' + j + '_li').classList.remove('answer-active');
        }
    }
    //update the question number with the active question
    try {
        for (k = 1; k <= 10; k++) {
            if (k == questionNumber) {
                document.getElementById("qn_" + k).style.borderColor = "transparent";
                document.getElementById("qn_" + k).style.border = "2px solid crimson";
            } else {
                document.getElementById("qn_" + k).style.borderColor = "transparent";
                document.getElementById("qn_" + k).style.borderColor = "white";
            }
        }
        //reset the flag questions icon
        document.getElementById("flagged_qn").src = "assets/flag_before_click.png";
    } catch (err) {
        console.log(err);
    }

}

function updateQuestions() {
    var questions = questionObj[questionNumber];
    document.getElementById('qn_id').innerHTML = questions.question;
    document.getElementById('option1').innerHTML = questions.option_1;
    document.getElementById('option2').innerHTML = questions.option_2;
    document.getElementById('option3').innerHTML = questions.option_3;
    document.getElementById('option4').innerHTML = questions.option_4;
    document.getElementsByClassName("current_question")[0].innerHTML = questionNumber + "/10";
    document.getElementsByClassName("current_question")[1].innerHTML = questionNumber + "/10";

    onQuestionChange();
    if (questionObj[questionNumber].isMarked === true) {
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
            document.getElementById('option' + i + '_check').style.visibility = "visible";
            document.getElementById('option' + i + '_li').classList.add('answer-active');

            //update the question number with the color
            if (!questionObj[questionNumber].isMarked) {
                document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
                document.getElementById("qn_" + questionNumber).style.backgroundColor = "#53a66b";
            }
        } else {
            document.getElementById('option' + i + '_check').style.visibility = "hidden";
            document.getElementById('option' + i + '_li').classList.remove('answer-active');
        }
    }
    updatePercentCompleted();
}

function onQuestionSelected(selectedButton) {
    for (i = 1; i <= 10; i++) {
        if (selectedButton.id == "qn_" + i) {
            questionNumber = i;
            updateQuestions();
            break;
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
        //update the question number with the color
        document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
        document.getElementById("qn_" + questionNumber).style.backgroundColor = "#23629F";
    } else {
        questionObj[questionNumber].isMarked = false;
        document.getElementById("flagged_qn").src = "assets/flag_before_click.png";

        //If the answer is previously selected for the question then change the color back to green or grey
        if (questionObj[questionNumber].selectedAnswer) {
            document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
            document.getElementById("qn_" + questionNumber).style.backgroundColor = "#53a66b";
        } else {
            document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
            document.getElementById("qn_" + questionNumber).style.backgroundColor = "grey";
        }

    }

}

function updatePercentCompleted() {
    var count = 0;
    for (i = 1; i <= 10; i++) {
        if (questionObj[i].selectedAnswer) {
            count += 10;
        }
    }
    document.getElementById('percent_data').innerHTML = count + "% completed";
    document.getElementById('progress_percent').value = count;
}

function onClearClick() {
    for (i = 1; i <= 4; i++) {
        document.getElementById('option' + i + '_check').style.visibility = "hidden";
        document.getElementById('option' + i + '_li').classList.remove('answer-active');
    }
    //update the question number with the color
    document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
    document.getElementById("qn_" + questionNumber).style.backgroundColor = "grey";
    //change the selected answer to null
    questionObj[questionNumber].selectedAnswer = null;
    //update the percentage 
    updatePercentCompleted();
}
