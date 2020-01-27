const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const figlet = require('figlet');


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
 /*  figlet('Employee Tracker', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
}); */
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
      console.log(answer);
      // query the database for user's selected table
      connection.query(`SELECT * FROM ${answer.viewDeptRoleEmploy.toLowerCase()}`, function(err, results) {
      if (err) throw err;
      console.table(results)
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "list",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.wishContinue === "yes") {
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
          };
          
        });
    }    
 //function to add to department table
 function addDepFunc() {
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
        `INSERT INTO department (name) VALUES (?)`, [ [ answer.addDepName ] ], 
        function(err) {
          if (err) throw err;
          console.log("Your item was added successfully!");
      
      // re-prompt the user for if they want to change other tables
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "list",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.wishContinue === "yes") {
          start();
        } else{
          connection.end();
        }
      });
        }
      );
    });
 };

function addRoleFunc() {
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
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
        type: "rawlist",

        choices: function() {
          let choiceArray = [];
          console.log(results);

          for (var i = 0; i < results.length; i++) {
            choiceArray.push({ name: results[i].title, value: results[i].department_id });
          }
          return choiceArray;
        },

        message: "What department ID would you like to add to this role?",
      }

    
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO role(title,salary,department_id) VALUES (?)",
        [ [
            answer.roleTitleAdd,
            answer.roleSalaryAdd,
            answer.roleDeptIDAdd
        ] ],
        function(err) {
          if (err) throw err;
          console.log("Your role was created successfully!");
          
// see if they want to continue or not
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "list",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.wishContinue === "yes") {
          start();
        } else{
          connection.end();
        }
      });

        }
      );
    });
});
};




function addEmployeeFunc() {
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
    .prompt([
      {
        name: "employeeFirstAdd",
        type: "input",
        message: "What is the first name of the employee that you would like to add?"
      },
      {
        name: "employeeLastAdd",
        type: "input",
        message: "What is the last name of the employee that you would like to add?"
      },
      {
        name: "employeeRoleIDAdd",
        type: "rawlist",

        choices: function() {
          let choiceArray = [];
          console.log(results);

          for (var i = 0; i < results.length; i++) {
            choiceArray.push({ name: results[i].title, value: results[i].role_id});
          }
          return choiceArray;
        },
        message: "What role ID would you like to add to this employee?",
      },

      {
        name: "employeeManagerIDAdd",
        type: "rawlist",

        choices: function() {
          let choiceArray2 = [];
          console.log(results);

          for (var i = 0; i < results.length; i++) {
            choiceArray2.push({ name: results[i].title, value: results[i].manager_id});
          }
          return choiceArray2;
        },
        message: "What manager ID would you like to add to this employee?",
      } 

    ])

    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)",
        [ [
            answer.employeeFirstAdd,
            answer.employeeLastAdd,
            answer.employeeRoleIDAdd,
            answer.employeeManagerIDAdd
        ] ],
        function(err) {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          
// see if they want to continue or not
      inquirer
      .prompt([
        {
          name: "wishContinue",
          type: "list",
          message: "Would you like to continue?",
          choices: ["yes", "no"]
        },
      ])
      .then(answer => { 
        if (answer.wishContinue === "yes") {
          start();
        } else{
          connection.end();
        }
      });

        }
      );
    });
});
};
 


/* 
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
            ], 
            function(error) {
              if (error) throw err;
              console.log("Table updated successfully!");
              start();
            }
          ) */