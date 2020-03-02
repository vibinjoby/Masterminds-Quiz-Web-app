//Fetch all the questions from the file on load
var questionNumber = 1;
var questionObj = null;
function loadQuestions() {
    console.log(questionNumber);
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/fetchQuestions";
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
          var status = xhr.status;
          if (status === 0 || (200 >= status && status < 400)) {
            questionObj = JSON.parse(xhr.responseText);
            updateQuestions();
          }
        }
      };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("");
}
function onNextClick() {
    if(questionNumber < 10) {
        questionNumber += 1;
    } else {
        questionNumber = 1;
    }
    updateQuestions();
}
function onQuestionChange() {
    //remove the answer selected
    for(i=1;i<=4;i++) {
        document.getElementById('option'+i+'_radio').checked = false;
        document.getElementById('option'+i+'_check').style.visibility = "hidden";
        document.getElementById('option'+i+'_li').classList.remove('answer-active');
    }
    //update the question number with the active question
    for(i=1;i<=10;i++) {
        if(i == questionNumber) {
            document.getElementById("qn_"+i).style.backgroundColor = "transparent";
            document.getElementById("qn_"+i).style.backgroundColor = "#23629F";
        } else {
            document.getElementById("qn_"+i).style.border = "";
            document.getElementById("qn_"+i).style.backgroundColor = "transparent";
            document.getElementById("qn_"+i).style.backgroundColor = "grey";
        }
    }
}
function updateQuestions() {
    var questions = questionObj[questionNumber];
    document.getElementById('qn_id').innerHTML = questions.question;
    document.getElementById('option1').innerHTML = questions.option_1;
    document.getElementById('option2').innerHTML = questions.option_2;
    document.getElementById('option3').innerHTML = questions.option_3;
    document.getElementById('option4').innerHTML = questions.option_4;
    onQuestionChange(); 
}

function onPreviousClick() {
    if(questionNumber > 1) {
        questionNumber -= 1;
    } else {
        questionNumber = 10;
    }
    updateQuestions();
}
function onAnswerSelected(li_id) {
    for(i=1;i<=4;i++) {
        if(li_id.id == "option"+i+"_li") {
            document.getElementById('option'+i+'_radio').checked = true;
            document.getElementById('option'+i+'_check').style.visibility = "visible";
            document.getElementById('option'+i+'_li').classList.add('answer-active');
        } else {
            document.getElementById('option'+i+'_check').style.visibility = "hidden";
            document.getElementById('option'+i+'_li').classList.remove('answer-active');
        }
    }
}

function onQuestionSelected (selectedButton) {
    for(i=1;i<=10;i++) {
        if(selectedButton.id == "qn_"+i) {
            document.getElementById("qn_"+i).style.backgroundColor = "transparent";
            document.getElementById("qn_"+i).style.backgroundColor = "#23629F";
        } else {
            document.getElementById("qn_"+i).style.border = "";
            document.getElementById("qn_"+i).style.backgroundColor = "transparent";
            document.getElementById("qn_"+i).style.backgroundColor = "grey";
        }
    }
}

function onMenuClick(selectedMenu) {
    if(selectedMenu.id == "home_selection") {
        document.getElementById('home_selection').classList.add('selection_menu');
        document.getElementById('profile_selection').classList.remove('selection_menu');
    } else {
        document.getElementById('profile_selection').classList.add('selection_menu');
        document.getElementById('home_selection').classList.remove('selection_menu');
    }
}

