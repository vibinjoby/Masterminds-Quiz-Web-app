
    var speed = 20,
    var moveBy = 5;
    function moveBoxBottom() {
        var el = document.getElementById('box');
        var top = el.offsetTop;

        el.style.top = top + moveBy + 'px';

    }

    timer = setInterval(function() {
        moveBoxBottom();  // to change direction
    }, speed);
    
    moveBox = function(moveBy) {
      var el = document.getElementById('box'),
      left = el.offsetLeft;
      
      if ( (moveBy > 0 && left > window.screen.width - 100) || (moveBy < 0 && left < 51) ) {
        clearTimeout(timer);
        timer = setInterval(function() {
          moveBox(moveBy * -1);  // to change direction
        }, speed);
      }
      
      el.style.left = left + moveBy + 'px';

    };
  
var timer = setInterval(
  function() { 
    moveBoxBottom(); 
  }
  , speed);