
function readData() {
    var mydata = JSON.parse(data);
    console.log(mydata);
}

function sendData() {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:8000/saveLogin?name=gato&pwd=32dw";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("");
}