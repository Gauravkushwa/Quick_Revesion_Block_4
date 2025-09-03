
console.log("Begin");
// this Begin is syncronouse code that's why they are run first
 setTimeout(() => { console.log("Timeout Task"); }, 0);
 // Timeout is the asyncronouse code so this will run after the promise 
  Promise.resolve().then(() => { console.log("Promise Task"); }); 
  // promise is the asyncronouse code but this is micro task that's why before the setTimeout this will run
  console.log("End");
  // this End is also a syncronouse code after the Begin this End will run;