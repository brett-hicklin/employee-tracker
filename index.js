const inquirer = require ('inquirer');
const mysql = require('mysql2')
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'bootcamp',
      database: 'employee_db'
    },
    console.log(`Connected to the courses_db database.`)
  );

const initialQuestions = [

    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"],
        name: "selection",
       // when: (answer) => answer.addEmployee === true
      },
]

// const viewDepartment = [

//     {


//     }
// ]

inquirer.prompt(initialQuestions).then((data)=>{

if (data.selection === "View all departments"){
    db.query('SELECT * FROM department', (err, result)=>{
      if(err){
        console.log(err)
      } else {
        console.table(result)
      }
    })
}
})

//if view all departments then db.query('SELECT * FROM department')
//if view all roles then db.query('SELECT * FROM role')
//if view all employees then db.query('') join role and employee
//if add department then db.query('INSERT INTO department (name) VALUES "${user input}')
//if add a role then prompt to ask for name, salary, and dept. db.query('INSERT INTO role (title, salary')
//if add employee then prompt to ask first name, last name, role, and manager db.query('')
//if update an employee then display list of employees



// {
//     type: "list",
//     message: "What would you like to do?",
//     choices: ["View all departments", "View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"],
//     name: "selection",
//    // when: (answer) => answer.addEmployee === true
//   },
//   {
//     type: "list",
//     message: "What would you like to do?",
//     choices: ["View all departments", "View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"],
//     name: "selection",
//    // when: (answer) => answer.addEmployee === true
//   },
//   {
//     type: "list",
//     message: "What would you like to do?",
//     choices: ["View all departments", "View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"],
//     name: "selection",
//    // when: (answer) => answer.addEmployee === true
//   },


