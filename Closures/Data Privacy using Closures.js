function createCounter(){
    let count = 0;
    return {
        increment : () =>{
            count++;
            return count;
        },
        getCount : () =>{
            return count;
        }
    }
};

let counter = createCounter();
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.getCount())