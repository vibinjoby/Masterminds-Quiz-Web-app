
const fs = require('fs');
const express = require('express');
const app = express();

app.use('/', express.static('public'));

//Service to add the new user to the json file
//input needed is the username and password 
app.post('/saveLogin', (req, res) => { 
  fs.readFile('users.json', (err, data) => {
    if (err){
      fs.writeFileSync('users.json', "");
    } else {
      let usersObj = JSON.parse(data);
      // New User
      req.query["scores"] = [];
      usersObj.users.push(req.query);
      console.log(usersObj);
      let usersStr = JSON.stringify(usersObj);
      fs.writeFileSync('users.json', usersStr);
    }
});
});

//Service to save the score with date in the json file
//input needed name and the score details
app.post('/saveScore', (req, res) => { 
  fs.readFile('users.json', (err, data) => {
    if (err) throw err;
    let scoreDetails = req.query;
    let usersObj = JSON.parse(data);
    for (var key in usersObj.users) {
      if(JSON.stringify(usersObj.users[key].name)===JSON.stringify(scoreDetails.name)){
        usersObj.users[key].score.push(scoreDetails.score);
      }
    }
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
      if(JSON.stringify(usersObj.users[key].username)===JSON.stringify(userNameObj.username)
      && JSON.stringify(usersObj.users[key].password)===JSON.stringify(userNameObj.password)){
        foundUserObj = usersObj.users[key];
      }
    }
    if(foundUserObj == null) {
      res.end(null);
    } else {
      res.end(JSON.stringify(foundUserObj));
    }
  });
});
app.listen(8000);

app.get('/fetchQuestions',(req,res) => {
  let query = req.query;
  fs.readFile(query.category+'.json', (err, data) => {
    let questionsObj = JSON.parse(data);
    res.end(JSON.stringify(questionsObj));
  });
});
  