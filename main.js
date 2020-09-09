var $startStopBtn = document.getElementById('start_stop_button');
var $resetBtn = document.getElementById('reset_button');
var stopwatch = new Stopwatch();

$($startStopBtn).on('click', function() {
    stopwatch.startStopWatch();
});

$($resetBtn).on('click', function() {
    stopwatch.resetWatch();
});