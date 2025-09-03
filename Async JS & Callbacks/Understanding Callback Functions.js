function taskOne(){
    console.log("Task 1")
};
taskTwo = (taskOne) =>{
    console.log("Task 2")
    taskOne();
}

taskTwo(taskOne)