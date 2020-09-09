function Stopwatch() {
    var $watch = document.getElementById('watch');
    var $startStopBtn = document.getElementById('start_stop_button');
    var $helpBlock = document.getElementsByClassName('help-block');
    var started = false;
    var timer;
    var startTime;

    this.updateTime = function (currentTime) {
        var currTime = Date.now();
        var timeGap = currTime - startTime;
        timeGap = new Date(timeGap);

        var minutes = timeGap.getMinutes() - 30; //IST Timezone
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if(minutes > 59) {
            $($helpBlock).removeClass('hide');
            this.startStopWatch(); //to stop the clock
        } else {
            var seconds = timeGap.getSeconds();
            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            var milliseconds = timeGap.getMilliseconds();
            if (milliseconds < 10) {
                milliseconds = '00' + milliseconds;
            } else if (milliseconds < 100) {
                milliseconds = '0' + milliseconds;
            }
            $watch.innerText = minutes + ' : ' + seconds + ' : ' + milliseconds;
        }
    }

    this.startStopWatch = function () {
        var that = this;
        started = !started;
        startTime = Date.now();
        var currentTime = $watch.innerText;
        if(started) {
            $startStopBtn.innerText = 'Stop';
            timer = setInterval( function() {
                currentTime = $watch.innerText;
                that.updateTime(currentTime);
            }, 1);
        } else {
            $startStopBtn.innerText = 'Start';
            clearInterval(timer);
        }
    }

    this.resetWatch = function() {
        $watch.innerText = '00:00:000';
        $($helpBlock).addClass('hide');
    }
}