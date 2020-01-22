const mysql = require("mysql");
const inquirer = require("inquirer");


// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "greatBay_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "ViewAddorUp",
      type: "list",
      message: "What would you like to use your database for?",
      choices: ["VIEW", "ADD", "UPDATE"]
    })
    .then(function(answer) {
      // based on their answer, will call the view, add, or update funtions
      if (answer.ViewAddorUp === "VIEW") {
        viewFunc();
      }
      else if(answer.ViewAddorUp === "ADD") {
        addFunc();
      }  
      else if(answer.ViewAddorUp === "UPDATE") {
        updateFunc();
      
      } else{
        connection.end();
      }
    });
}

// function to handle viewing tables
function viewFunc() {
  // prompt for knowing which table the user would like to view.
  inquirer
    .prompt([
      {
        name: "viewDeptRoleEmploy",
        type: "list",
        message: "What table would you like to view?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
      },

// query the database for user's selected table
  connection.query(`SELECT * FROM ${answer.list}`, function(err, results) {
    if (err) throw err;
    
    
/* 
function addFunc() {
// once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }





      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};
  
function updateFunc() {
    // determine if bid was high enough
            if (chosenItem.highest_bid < parseInt(answer.bid)) {
              // bid was high enough, so update db, let the user know, and start over
              connection.query(
                "UPDATE auctions SET ? WHERE ?",
                [
                  {
                    highest_bid: answer.bid
                  },
                  {
                    id: chosenItem.id
                  }
                ],
                function(error) {
                  if (error) throw err;
                  console.log("Bid placed successfully!");
                  start();
                }
              );
            }
            else {
              // bid wasn't high enough, so apologize and start over
              console.log("Your bid was too low. Try again...");
              start();
            }
          });
      });
    }
    
}
         */