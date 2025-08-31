function createCounter(){
    let count = 0;
    function counter(){
        count ++;
        return count;
    }

    // to Reset the counter;
    counter.reset = function () {
        count = 0;
    }
    return counter;
}

let myCount = createCounter();
console.log(myCount());
console.log(myCount());
// console.log(myCount.reset())