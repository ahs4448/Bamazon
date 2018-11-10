var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
require('console.table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,


    user: 'root',


    password: "",
    database: "bamazon_db",

});


connection.connect(function (err) {
    if (err) throw err;

    console.log('Connected as id: ' + connection.threadId)
    displayItems();

});

function displayItems() {
    connection.query('SELECT * FROM items', function (err, results) {
        if (err) throw err;


        console.log("\n  ---------------\n");
        console.log("\n  Available Bamazon Products");
        console.log("\n  ---------------\n");

        // var Table = new Table ({
        // head: ["Item ID", "Item" ,"Category", "Price", "Stock \nQuantity"],
        // columnWidths: [13, 35, 30, 10, 10]
        // });


        for (var i = 0; i < results.length; i++) {
            console.log([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
        };

        shoppingCart(results);

    });

};

function shoppingCart(results) {
    inquirer.prompt({
        name: 'choiceId',
        type: 'input',
        message: "Select an item to order by entering the Item ID. [Exit with q]",
    }).then(function (answer) {

        console.log(answer.choiceId);
        if (answer.choiceId.toLowerCase() == "q") {
            console.log("\nThank you for visiting Bamazon.\nGoodbye!");
            process.exit();
        }


        for (var i = 0; i < results.length; i++) {



            if (results[i].item_id == answer.choiceId) {
                var item = results[i].product_name;
                var choice = answer.choiceId;
                var id = i;

                console.log("\nYou selected " + item + "\n");


                inquirer.prompt([{
                    name: "quantity",
                    type: "input",
                    message: "How many do you want to buy? [Exit with q]",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                }]).then(function (answer) {
                    var num = answer.quantity;
                    var diff = (results[id].stock_quantity - num);


                    var formatNumber = function (num) {
                        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    };




                    var totalCost = parseFloat(results[id].price * num).toFixed(2);

                    if (diff >= 0) {
                        connection.query("UPDATE items SET stock_quantity ='" + diff + "' WHERE item_id='" + choice + "'", function (err, resultsTwo) {

                            if (err) throw err;

                            makeTable(results);

                            function message() {
                                console.log("\n You have successfully purchased " + num + " of " + item);
                                console.log("\n The total of your purchase is: $" + formatNumber(totalCost) + "\n");
                            };

                            setTimeout(message, 250);
                            setTimeout(buyMore, 300);

                        })

                    } else {
                        console.log("\nInsufficiant quantity of " + product + ". Please try again./n")
                        shoppingCart(results);
                    }

                })

            }


        }

    })

}
function makeTable(results) {
    var table = new Table({
        head: ["Item ID", "Item", "Category", "Price", "Stock \nQuantity"],
        colWidths: [13, 35, 30, 10, 10]

    });

    for (var i = 0; i < results.length; i++) {
        var infoArray = [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity];
        table.push(infoArray);
    };

    console.log(table.toString());

};

function buyMore() {
    inquirer.prompt({
        name: "continue",
        type: "confirm",
        message: "Would you like to buy another item?"
    }).then(function (answer) {
        if (answer.continue == true) {
            displayItems();
        } else {
            console.log("Thanks for shopping with Bamazon.\nHave a great day.");
            process.exit();
        }
    })
}


///Thing I havent figured out:
// the error that says "cant find module 'mysql"
// finding the password for th mysql database
// how to install and use the npm inquirer package