function logMessage(count) {
    console.log(`Countdown at ${count}`);
  }
  
  function countDown(num) {
    if (num < 0) return;
    logMessage(num);
    countDown(num - 1);
  }
  
  countDown(3);
  