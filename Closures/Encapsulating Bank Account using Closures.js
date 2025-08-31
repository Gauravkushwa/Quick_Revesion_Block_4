function createBackAccount(initialAmount){
    let balance = initialAmount;
    return {
        deposit : (amount) =>{
            return balance += amount
        },
        withdraw : (amount) =>{
            return balance -= amount
        },
        getBalance : () =>{
            return balance
        }
    }
};

const account = createBackAccount(1000);
console.log(account.deposit(100));
console.log(account.withdraw(50));
console.log(account.getBalance())