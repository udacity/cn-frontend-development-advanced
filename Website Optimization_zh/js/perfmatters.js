// 使用Navigation Timing测量关键渲染路径
// https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp

function logCRP() {
  var timing = window.performance.timing,
    domContentLoadedDuration = timing.domContentLoadedEventStart - timing.domLoading,
    domCompleteDuration = timing.domComplete - timing.domLoading;
  var stats = document.getElementById("crp-stats");
  stats.textContent = 'DOMContentLoaded: ' + domContentLoadedDuration + 'ms, onload: ' + domCompleteDuration + 'ms';
}

window.addEventListener("load", function(event) {
  logCRP();
});
