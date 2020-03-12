
const fs = require('fs');
const express = require('express');
const app = express();

app.use('/', express.static('public'));

//Service to add the new user to the json file
//input needed is the username and password 
app.post('/saveLogin', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) {
      fs.writeFileSync('users.json', "");
    } else {
      let usersObj = JSON.parse(data);
      // New User
      req.query["scores"] = [];
      usersObj.users.push(req.query);
      let usersStr = JSON.stringify(usersObj);
      fs.writeFileSync('users.json', usersStr);

      res.end(usersStr);
    }
  });
});

app.get('/fetchUserScoreDetails', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    var scoreDetails = {};
    if (err) {
      fs.writeFileSync('users.json', "");
    } else {
      let usersObj = JSON.parse(data);
      let username = req.query.username;
      for (var key in usersObj.users) {
        if (JSON.stringify(usersObj.users[key].username) === JSON.stringify(username)) {
          scoreDetails = usersObj.users[key].scores;
        }
      }
      res.end(JSON.stringify(scoreDetails));
    }
  });
});

//Fetches all score details for both rapid and real
app.get('/fetchOverallScoreDetails', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    var overallScoreDetails = {};
    var rapidUsersScore = [];
    var realUsersScore = [];
    if (err) {
      fs.writeFileSync('users.json', "");
    } else {
      let usersObj = JSON.parse(data);
      for (var key in usersObj.users) {
        if (usersObj.users[key].scores) {
          for (i = 0; i < usersObj.users[key].scores.length; i++) {
            if (usersObj.users[key].scores[i].quiztype == 'rapid') {
              var userDetails = {};
              userDetails.username = usersObj.users[key].username;
              userDetails.score = usersObj.users[key].scores[i].score;
              rapidUsersScore.push(userDetails);
            } else if (usersObj.users[key].scores[i].quiztype == 'real') {
              var userDetails = {};
              userDetails.username = usersObj.users[key].username;
              userDetails.score = usersObj.users[key].scores[i].score;
              realUsersScore.push(userDetails);
            }
          }
        }
      }
      overallScoreDetails.rapidUsersScore = rapidUsersScore;
      overallScoreDetails.realUsersScore = realUsersScore;
      res.end(JSON.stringify(overallScoreDetails));
    }
  });
});

//Service to save the score with date in the json file
//input needed name and the score details
app.post('/saveScore', (req, res) => {
  var isSaved = false;
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    var scoreObj = {};
    let requestObj = req.query;
    let usersObj = JSON.parse(data);
    scoreObj.score = requestObj.score;
    scoreObj.quiztype = requestObj.quiz_type;
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date();
    scoreObj.scoreDate = today.toLocaleDateString("en-US", options);
    for (var key in usersObj.users) {
      if (JSON.stringify(usersObj.users[key].username) === JSON.stringify(requestObj.username)) {
        isSaved = true;
        usersObj.users[key].scores.push(scoreObj);
      }
    }
    res.end('output is ' + isSaved);
    let usersStr = JSON.stringify(usersObj);
    fs.writeFileSync('users.json', usersStr);
  });
});

//Service to check if the user already exists and if so return the JSON data of the user
// input needed is name
app.get('/checkUserExists', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    var foundUserObj = null;
    let userNameObj = req.query;
    if (err) throw err;
    let usersObj = JSON.parse(data);
    // check user exists
    for (var key in usersObj.users) {
      if (JSON.stringify(usersObj.users[key].username) === JSON.stringify(userNameObj.username)
        && JSON.stringify(usersObj.users[key].password) === JSON.stringify(userNameObj.password)) {
        foundUserObj = usersObj.users[key];
      }
    }
    if (foundUserObj == null) {
      res.end(null);
    } else {
      res.end(JSON.stringify(foundUserObj));
    }
  });
});
app.listen(8000);

app.get('/fetchQuestions', (req, res) => {
  let query = req.query;
  fs.readFile(query.category + '.json', (err, data) => {
    var randomQuestions = {};
    let questionsObj = JSON.parse(data);
    //random question logic
    var arr = [];
    while (arr.length < 11) {
      var r = Math.floor(Math.random() * 20) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    for (i = 0; i < 11; i++) {
      randomQuestions[i] = questionsObj[arr[i]];
    }
    res.end(JSON.stringify(randomQuestions));
  });
});

//random questions from all the categories
app.get('/fetchRapidQuizQuestions', (req, res) => {
  var overallQnsArr = [];
  var randomQuestions = {};
  fs.readFile('verbal.json', (err, data) => {
    let questionsObj = JSON.parse(data);
    //random question logic
    var arr = [];
    while (arr.length < 11) {
      var r = Math.floor(Math.random() * 20) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    for (i = 0; i < 3; i++) {
      randomQuestions[i] = questionsObj[arr[i]];
    }
    fs.readFile('numerical.json', (err, data) => {
      let questionsObj = JSON.parse(data);
      //random question logic
      var arr = [];
      while (arr.length < 11) {
        var r = Math.floor(Math.random() * 20) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
      }
      for (i = 3; i < 6; i++) {
        randomQuestions[i] = questionsObj[arr[i]];
      }
      fs.readFile('grammar.json', (err, data) => {
        let questionsObj = JSON.parse(data);
        //random question logic
        var arr = [];
        while (arr.length < 11) {
          var r = Math.floor(Math.random() * 20) + 1;
          if (arr.indexOf(r) === -1) arr.push(r);
        }
        for (i = 6; i < 9; i++) {
          randomQuestions[i] = questionsObj[arr[i]];
        }
        fs.readFile('logical.json', (err, data) => {
          let questionsObj = JSON.parse(data);
          //random question logic
          var arr = [];
          while (arr.length < 11) {
            var r = Math.floor(Math.random() * 20) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
          }
          for (i = 9; i < 11; i++) {
            randomQuestions[i] = questionsObj[arr[i]];
          }
          res.end(JSON.stringify(randomQuestions));
        });
      });
    });

  });
});

app.get('/checkUsernameSignup', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    var foundUserObj = null;
    let userNameObj = req.query;
    if (err) throw err;
    let usersObj = JSON.parse(data);
    // check user exists
    for (var key in usersObj.users) {
      if (JSON.stringify(usersObj.users[key].username) === JSON.stringify(userNameObj.username)) {
        foundUserObj = usersObj.users[key];
      }
    }
    if (foundUserObj == null) {
      res.end(null);
    } else {
      res.end(JSON.stringify(foundUserObj));
    }
  })
});
