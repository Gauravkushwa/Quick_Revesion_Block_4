function outerFunction(){
    var fun = "i am from outer Function..!"

    function innerFunction(){
        console.log(fun)
    }
    innerFunction();
}
outerFunction();