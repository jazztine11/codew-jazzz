let userAccount = {
 username:"jazz",
 password:"nigga",
 name:"jazz",
 balance:"5000000",

};



function login(){

    let user =
    document.getElementById("username").value;

    let pass =
    document.getElementById("password").value;



    if(user == userAccount.username &&
       pass == userAccount.password){


        document.getElementById("loginBox").style.display="none";

        document.getElementById("bankBox").style.display="block";

        document.getElementById("user").innerHTML =
        userAccount.name;


        updateBalance();


    }else{

        document.getElementById("message").innerHTML =
        "Wrong username or password";

    }

}



function deposit(){

    let amount =
    Number(document.getElementById("amount").value);


    if(amount > 0){

        userAccount.balance += amount;

        updateBalance();

        document.getElementById("status").innerHTML =
        "Deposit successful";

    }

}



function withdraw(){

    let amount =
    Number(document.getElementById("amount").value);



    if(amount <= userAccount.balance && amount > 0){


        userAccount.balance -= amount;

        updateBalance();


        document.getElementById("status").innerHTML =
        "Withdrawal successful";


    }else{


        document.getElementById("status").innerHTML =
        "Insufficient balance";


    }

}



function updateBalance(){

    document.getElementById("balance").innerHTML =
    userAccount.balance;

}



function logout(){

    document.getElementById("loginBox").style.display="block";

    document.getElementById("bankBox").style.display="none";


}