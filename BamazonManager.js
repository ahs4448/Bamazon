var MySQL = require('mysql');
var inquirer = require("inquirer");
var table = require('cli-table');

var connection = MySQL.createConnection({
    host: "localhost",
    port: 3306,


    user: "root",


    password: "",
    database: "bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;

    console.log("Connected as id: " + connection.threadId);
    promptAction();

});

function promptAction() {
    inquirer.prompt({
   name: "action",
   type: "list",
   message: "What would you like to do?",
   choices: [
       "View Items for Sale",
       "View Low Inventory",
       "Add to Inventory",
       "Add a New Product",
       "Exit"
   ]
    }).then(function(answer){
    switch (answer.action) {

        case "View Items for Sale":
        displayItems();
        break;


        case "View Low Inventory":
        addtoInv();
        break;

        case "Add a new Item":

        addItem();
        break;

        case "Exit":

        exit();
    }
    });

};


function makeTable(results) {
    var Table = new Table ({
head: ["Item Id", "Item","Category","Price", "Stock\nQuantity"],
colWidths: [13,35,30,10,10]
    });

    for (var i =0; i < results.length; i++) {
        var infoArray = [results[i].item_id, results[i].product_name, results[i].category_name, results[i].price, results[i].stock_quantity];
        Table.push(infoArray);
    };

    console.log(Table.toString());
};


function Continue() {
    inquirer.prompt({
        name: "continue",
        type: "confirm",
        message: "Return to main menu?"
}).then(function(answer){
    if (answer.continue == true){
        promptAction();
    } else {
        console.log ("\nNow exiting Bamazon Manager.\n Have a good day");
        process.exit();
    }
})
};


function notValid() {
console.log("Not a valid number. Try again.");
process.exit();

};

function displayItems() {
    connection.query("SELECT * FROM products", function(err, results){
        if(err) throw err;

        console.log("\n  ----------------\n");
        console.log("    Available Bamazon Products");
        console.log("\n  ----------------\n");

        makeTable(results);
        Continue();
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM items WHERE stock_quantity < 6" , function(err, resultsTable){
        if(err) throw err;

        console.log("\n  ----------------\n");
        console.log("    Low Inventory");
        console.log("\n  ----------------\n");

        makeTable(resultsTable);
        Continue();
    });
};

function addInventory() {
    connection.query("SELECT * FROM items", function  (err, resultsAdd){
        if (err) throw err;

        makeTable(resultsAdd);
    
inquirer.prompt([
    {
        name: "addId",
        type: "input",
        message: "What is the Id of the item you want to add to?",

        validate: function(value){
            if(isNaN(value) === false) {
                return true;
            } else {
                console.log("\nNot a valid Id. Please try again.");
                process.exit();
            }
        }
    }

]).then(function(answer){
    for(var i = 0; i < resultsAdd.length; i++) {
if (resultsAdd[i].item_id == answer.addID) {
    var choice = answer.addID;
    var id = i;

    inquirer.prompt([{
name: "addQuant",
type: "input",
message: "How many do you want to add?",
validate: function(value) {
    if (isNaN(value) === false) {
        return true;
    } else {
        notValid(;)
    }
}

}]).then(function(answer){

var num = answer.addQuant;
var updateQuantity = (parseInt(resultsAdd[id].stock_quantity) + parseInt(num));


var query = "SELECT * FROM items WHERE ?;"

connection.query(query, {item_id: choice}, function (err, resultsQuant){
    if(err) throw err;

    var queryTwo = "UPDATE products SET ? WHERE ?";

    connection.query(queryTwo, [{stock_quantity: updateQuantity},  {item_id: choice}], function(err, resultsInvtAdd) {
        if (err) throw err;

        console.log("\nYou have successfully added " + num + " " + resultsAdd[id].item_name + "\n");

        Continue();
    })
})

})

}

    }

})

    });

};

function addItem (){
inquirer.prompt([
    {
        name: "product",
        type: "input",
        message: "Whats the name of the product that you want to add?"
    },
    {
        name:"category",
        type:"input",
        message:"What is the cost per unit for this product?",
        validate: function(value) {
       if(isNaN(value) === false) {
           return true;
       } else{
           notValid();

       }
        }

},

{
    name:"quantity",
  type: "input",
  message:"How manu units will you be adding to your inventory?",
  validate: function(value) {
      if (isNaN(value) === false) {
          return true;
      } else{
          notValid();

      }
  }
}
]).then(function(answer) {
    var query = "INSERT INTO items SET ?";
}

connection.query(query,
{
    item_name: answer.item,
    category_name: answer.category,
    price: answer.price,
    stock_quantity: answer.quantity
},

function(err) {
    if (err) throw err;

    console.log(answer.quantity + " of " + answer.product + " were successfully added.")
    Continue();
}

);

});

};

function exit() {
    console.log("\nNow exiting Bamazon Manager, GoodBye.");
    process.exit();
};
        //line 256