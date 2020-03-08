var questionNumber = 1;
var isRealQuiz = false;
var isPracticeQuiz = false;
var isRapidQuiz = false;
var questionsAnswered = 0;
var questionObj = null;
var minutes = 60 * 5;
var timerInterval;

//Identify the type of quiz and make changes to the screen accordingly
var urlParams = new URLSearchParams(window.location.search);
var quiz_type = urlParams.get('quiztype');
var category = urlParams.get('category');
if (quiz_type == 'real') {
    isRealQuiz = true;
} else if (quiz_type == 'practice') {
    isPracticeQuiz = true;
} else {
    isRapidQuiz = true;
}

if (isRapidQuiz) {
    //10 seconds for each question
    minutes = 10;
}
startTimer(minutes);


function startTimer(duration) {
    var timer = duration, minutes, seconds;
    var intervalId = setInterval(function () {
        timerInterval = intervalId;
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('time').innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            if (isRapidQuiz) {
                if (questionNumber != 10) {
                    if (questionNumber < 10) {
                        questionNumber += 1;
                    } else {
                        questionNumber = 1;
                    }
                    document.getElementById("myModal").style.display = 'none';
                    updateQuestions();
                    clearInterval(timerInterval);
                    startTimer(duration);
                } else {
                    document.getElementById('submit_btn').style.visibility = 'visible';
                    document.getElementById('next_btn').style.visibility = 'hidden';
                }
            }
        }
    }, 1000);
}

function loadQuestions() {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/fetchQuestions?category="+category;
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
    if (isRapidQuiz) {
        // Get the modal
        var modal = document.getElementById("myModal");
        document.getElementsByClassName('modal-header')[0].innerHTML = 'Are You sure you want to navigate to the next question..You have an unanswered question?';
        // Get the button that opens the modal
        var btn = document.getElementById("next_btn");
        if (!questionObj[questionNumber].selectedAnswer) {
            modal.style.display = "block";
        } else {
            if (questionNumber < 10) {
                questionNumber += 1;
            }
            if (questionNumber == 10) {
                document.getElementById('next_btn').style.visibility = 'hidden';
                document.getElementById('submit_btn').style.visibility = 'visible';
            }
            updateQuestions();
            clearInterval(timerInterval);
            startTimer(10);
        }
        document.getElementById('ok_btn_popup').onclick = function () {
            modal.style.display = "none";
            if (questionNumber < 10) {
                questionNumber += 1;
            } else {
                questionNumber = 1;
            }
            updateQuestions();
            clearInterval(timerInterval);
            startTimer(10);
        }
        // When the user clicks on cancel btn, close the modal
        document.getElementById('cancel_btn_popup').onclick = function () {
            modal.style.display = "none";
        }
    } else {
        if (questionNumber < 10) {
            questionNumber += 1;
        } else {
            questionNumber = 1;
        }
        updateQuestions();
    }
}

function initializeDummyValues() {
    for (i = 1; i <= 10; i++) {
        questionObj[i].selectedAnswer = "";
        questionObj[i].isMarked = false;
        //Disable the button so that navigation is not possible
        if (isRapidQuiz) {
            document.getElementById("qn_" + i).disabled = true;
        }
    }
    if (isRapidQuiz) {
        document.getElementById('prev_btn').style.visibility = 'hidden';
        document.getElementById('optional_tag').style.visibility = 'hidden';
        document.getElementById('optional_bookmark').style.visibility = 'hidden';
    }
}
function onPracticeQuizAnswerSelection(i) {
    // Check mark the correct answer
    if (i == questionObj[questionNumber].correct_answer) {
        document.getElementById('option' + i + '_check').style.visibility = "visible";
        document.getElementById('option' + i + '_li').classList.add('answer-active');
        document.getElementById('option' + i + '_error').style.visibility = "hidden";
    } else {
        // show the X mark for the wrong answers
        document.getElementById('option' + i + '_error').style.visibility = "visible";
        document.getElementById('option' + i + '_li').classList.remove('answer-active');
        document.getElementById('option' + i + '_check').style.visibility = "hidden";
    }
    //Show the correct answer section on click of the answer
    document.getElementById('correct_answer').style.visibility = "visible";
    if (questionObj[questionNumber].correct_answer == 1) {
        document.getElementById('correct_answer_sp').innerHTML = "A";
    } else if (questionObj[questionNumber].correct_answer == 2) {
        document.getElementById('correct_answer_sp').innerHTML = "B";
    } else if (questionObj[questionNumber].correct_answer == 3) {
        document.getElementById('correct_answer_sp').innerHTML = "C";
    } else {
        document.getElementById('correct_answer_sp').innerHTML = "D";
    }
}

function onQuestionChange() {
    document.getElementById('correct_answer').style.visibility = "hidden";
    //remove the answer selected
    if (questionObj[questionNumber].selectedAnswer) {
        for (j = 1; j <= 4; j++) {
            if (isPracticeQuiz) {
                document.getElementById('option' + j + '_li').classList.remove('selected-answer');
                onPracticeQuizAnswerSelection(j);
            } else {
                if (questionObj[questionNumber].selectedAnswer == j) {
                    document.getElementById('option' + j + '_check').style.visibility = "visible";
                    document.getElementById('option' + j + '_li').classList.add('answer-active');
                } else {
                    document.getElementById('option' + j + '_check').style.visibility = "hidden";
                    document.getElementById('option' + j + '_li').classList.remove('answer-active');
                    document.getElementById('option' + j + '_li').classList.remove('selected-answer');
                }
            }
        }

    } else {
        for (j = 1; j <= 4; j++) {
            document.getElementById('option' + j + '_check').style.visibility = "hidden";
            document.getElementById('option' + j + '_error').style.visibility = "hidden";
            document.getElementById('option' + j + '_li').classList.remove('answer-active');
            document.getElementById('option' + j + '_li').classList.remove('selected-answer');
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
    if (questions.is_image == 'Y') {
        document.getElementById('media').style.visibility = 'visible';
        document.getElementById("question_img").src = 'assets/' + questions.image_url;
    } else {
        document.getElementById('media').style.visibility = 'hidden';
    }
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
        //Logic for practice quiz
        if (isPracticeQuiz) {
            // Mark the selected answer
            if (li_id.id == "option" + i + "_li") {
                document.getElementById('option' + i + '_li').classList.add('selected-answer');
                questionObj[questionNumber].selectedAnswer = i;
                //update the question number with the color
                if (!questionObj[questionNumber].isMarked) {
                    document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
                    document.getElementById("qn_" + questionNumber).style.backgroundColor = "#53a66b";
                }
            } else {
                document.getElementById('option' + i + '_li').classList.remove('selected-answer');
            }
            onPracticeQuizAnswerSelection(i);
        } else {
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
    document.getElementById('correct_answer').style.visibility = "hidden";
    for (i = 1; i <= 4; i++) {
        document.getElementById('option' + i + '_check').style.visibility = "hidden";
        document.getElementById('option' + i + '_li').classList.remove('answer-active');
        document.getElementById('option' + i + '_error').style.visibility = "hidden";
        document.getElementById('option' + i + '_li').classList.remove('selected-answer');
    }

    //update the question number with the color
    document.getElementById("qn_" + questionNumber).style.backgroundColor = "transparent";
    document.getElementById("qn_" + questionNumber).style.backgroundColor = "grey";
    //change the selected answer to null
    questionObj[questionNumber].selectedAnswer = null;
    //update the percentage 
    updatePercentCompleted();
}

function onExitTest() {
    document.getElementById("myModal").style.display = 'block';
    document.getElementsByClassName('modal-header')[0].innerHTML = 'Do you want to exit the test midway?';

    document.getElementById('ok_btn_popup').onclick = function () {
        window.location.href = 'category.html';
    }
    // When the user clicks on cancel btn, close the modal
    document.getElementById('cancel_btn_popup').onclick = function () {
        document.getElementById("myModal").style.display = "none";
    }
}
