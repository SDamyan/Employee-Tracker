const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_DB"
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
    ])
    .then(answers => {
      // query the database for user's selected table
      connection.query(`SELECT * FROM ${answers.viewDeptRoleEmploy}`, function(err, results) {
      if (err) throw err;
      console.table(`SELECT * FROM ${answers.viewDeptRoleEmploy}`);
      start();
      });
    });
  };
    
 
function addFunc() {
// prompt the user for which table they would like to add to.
    inquirer
      .prompt([
        {
          name: "addChoice",
          type: "list",
          message: "Which table would you like to add to?",
          choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        },
      ])
      .then(function(answer) {
        // get the information of the chosen item
        
        /* var chosenTable;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenTable = results[i];
          } */
        
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        `INSERT INTO  ${answers.addChoice} table?`,
       /*  {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        }, */
        function(err) {
          if (err) throw err;
          console.log("Your item was added successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};

  
function updateFunc() {
// prompt the user for which table they would like to update.
    inquirer
    .prompt([
      {
        name: "updateChoice",
        type: "list",
        message: "Which table would you like to add to?",
        choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
      },
    ])
    .then(function(answer) {
      // get the information of the chosen item
      connection.query(
          `UPDATE ${answers.updateChoice} table SET ? WHERE ?`,
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
            console.log("Table updated successfully!");
            start();
          }
        )