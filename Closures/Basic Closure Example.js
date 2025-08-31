function outerFunction(){
    let message = "Hello i am From Closure...!";
    return function outerFun(){
        console.log(message);
    }
};

let myClosure = outerFunction();
myClosure()