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
    .then(answer => {
      // query the database for user's selected table
      connection.query(`SELECT * FROM ${answer.viewDeptRoleEmploy}`, function(err, results) {
      if (err) throw err;
      console.table(results)
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "choice",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.choice === "yes") {
          start();
        } else{
          connection.end();
        }
      });
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
            if (answer.addChoice === "DEPARTMENT") {
              addDepFunc();
            }
            else if(answer.addChoice === "ROLE") {
              addRoleFunc();
            }  
            else if(answer.addChoice === "EMPLOYEE") {
              addEmployeeFunc();
            
            } else{
              connection.end();
          }
          
        });
    };    
 //function to add to department table
 addDepFunc() {
    inquirer
    .prompt([
      {
        name: "addDepName",
        type: "input",
        message: "What is the name of the department that you would like to add?",
      },
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        `INSERT INTO  department (name)
        VALUES ?`,
         {
          name: answer.addDepName
        }, 
        function(err) {
          if (err) throw err;
          console.log("Your item was added successfully!");
      
      // re-prompt the user for if they want to change other tables
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "choice",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.choice === "yes") {
          start();
        } else{
          connection.end();
        }
      });
        }
      );
    });
 };

addRoleFunc() {
    inquirer
    .prompt([
      {
        name: "roleTitleAdd",
        type: "input",
        message: "What is the title of the role you would like to add?"
      },
      {
        name: "roleSalaryAdd",
        type: "input",
        message: "What is the salary of this role that you would like to add?"
      },
      {
        name: "roleDeptIDAdd",
        type: "list",
        message: "What department ID would you like to add this role to?",
        //todo add dynamically choices in some kind of for loop
        //todo to show choices already entered in the dept table
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.roleTitleAdd,
          salary: answer.roleSalaryAdd,
          department_id: answer.roleDeptIDAdd
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          
// see if they want to continue or not
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "choice",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.choice === "yes") {
          start();
        } else{
          connection.end();
        }
      });

        }
      );
    });
};

addEmployeeFunc() {
   
} 



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
          `UPDATE ${answer.updateChoice} table SET ? WHERE ?`,
          /* [
            {
              highest_bid: answer.bid
            },
            {
              id: chosenItem.id
            }
          ], */
          function(error) {
            if (error) throw err;
            console.log("Table updated successfully!");
            start();
          }
        )