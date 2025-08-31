function bankAccount(initialBalance = 0) {
    let balance = initialBalance; 

    return {
        deposit: function (amount) {
            if (amount > 0) {
                balance += amount;
                return `Deposited: ${amount}, New Balance: ${balance}`;
            }
            return "Deposit amount must be greater than 0.";
        },

        withdraw: function (amount) {
            if (amount > balance) {
                return "Insufficient funds!";
            }
            if (amount > 0) {
                balance -= amount;
                return `Withdrawn: ${amount}, New Balance: ${balance}`;
            }
            return "Withdrawal amount must be greater than 0.";
        },

        getBalance: function () {
            return `Current Balance: ${balance}`;
        },

        reset: function () {
            balance = 0;
            return "Account reset to 0.";
        }
    };
}


const account = bankAccount(1000);

console.log(account.getBalance());   // Current Balance: 1000
console.log(account.deposit(500));  
console.log(account.withdraw(200));  
console.log(account.withdraw(2000)); 
console.log(account.reset());        
console.log(account.getBalance());   
