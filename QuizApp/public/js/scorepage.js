// Load google charts
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

var userObj = JSON.parse(sessionStorage.getItem('userObj'));

if(!userObj) {
    window.location.href = 'index.html';
}

// Draw the chart and set the chart values
function drawChart() {
    var scoreDetails = JSON.parse(sessionStorage.getItem('userScore'));
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Score'],
        ['Correct Answers', scoreDetails.correct_answer],
        ['Wrong Answers', scoreDetails.wrong_answer],
        ['Unanswered', scoreDetails.unanswered]
    ]);
    if (scoreDetails.correct_answer > 0) {
        document.getElementById('score_percent').innerHTML = scoreDetails.correct_answer + '0%';
        document.getElementById('correct_answer').innerHTML = scoreDetails.correct_answer;
        document.getElementById('wrong_answer').innerHTML = scoreDetails.wrong_answer;
        document.getElementById('unanswered').innerHTML = scoreDetails.unanswered;
    } else {
        document.getElementById('correct_answer').innerHTML = scoreDetails.correct_answer;
        document.getElementById('wrong_answer').innerHTML = scoreDetails.wrong_answer;
        document.getElementById('unanswered').innerHTML = scoreDetails.unanswered;
    }
    if(scoreDetails.correct_answer >= 8) {
        document.getElementById('appreciation').innerHTML = 'Congratulations';
        document.getElementById('final_content').innerHTML = 'You have successfully cleared the Quiz, you can now download the certificate from below';
        document.getElementById('certificate').disabled = false;
        document.getElementById('smiley').innerHTML = '&#128578;';
    } else {
        document.getElementById('appreciation').innerHTML = 'FAILED';
        document.getElementById('final_content').innerHTML = 'Unfortunately you did not clear the test try again to score more than 80% to clear the test';
        document.getElementById('certificate').disabled = true;
        document.getElementById('smiley').innerHTML = '&#128542;';
    }

    // Optional; add a title and set the width and height of the chart
    var options = { 'title': 'Scoring Chart', 'width': 850, 'height': 450, };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}

async function downloadCertificate() {
    const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib
    // Fetch an existing PDF document
    const url = 'assets/certificate.pdf'
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    // Draw a string of text diagonally across the first page
    firstPage.drawText(userObj.first_name.toUpperCase() +' '+userObj.last_name.toUpperCase(), {
        x: 326,
        y: 267,
        size: 22,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
    })

    firstPage.drawText(scoreDetails.correct_answer+'/10', {
        x: 515,
        y: 196,
        size: 22,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
    })

    firstPage.drawText('8th', {
        x: 284,
        y: 128,
        size: 20,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
    })

    firstPage.drawText('March', {
        x: 392,
        y: 128,
        size: 20,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
    })

    firstPage.drawText('20', {
        x: 522,
        y: 128,
        size: 18,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // Trigger the browser to download the PDF document
    download(pdfBytes, "certificate.pdf", "application/pdf");
}

function onRetakeQuiz () {
    var scoreDetails = JSON.parse(sessionStorage.getItem('userScore'));
    window.location.href = 'quizpage.html?quiztype='+scoreDetails.quiz_type+'&category='+scoreDetails.category;
}