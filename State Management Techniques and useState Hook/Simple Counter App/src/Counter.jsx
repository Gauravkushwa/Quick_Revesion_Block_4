import { useState } from "react"

const Counter = () =>{
    const [count, setCount] = useState(0);

    function increment (){
        setCount(count + 1)
    };

    function decrement () {
        setCount(count - 1)
    }

    function reset(){
        setCount(0)
    }
    return (
        <>
         <h2>Count: {count}</h2>
         <button onClick={increment}>Increment </button>
         <button onClick={decrement}>Decrement </button>
         <button onClick={reset}>Reset </button>
        </>
    )
}

export default Counter;