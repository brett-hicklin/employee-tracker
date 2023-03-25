const inquirer = require ('inquirer');
const mysql = require('mysql2')
const cTable = require('console.table');
const { validateHeaderValue } = require('http');

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

      {
        type:"input",
        message:"What is the name of the department you would like to add?",
        name:"addDepartment",
        when:(answer)=> answer.selection === "Add a department"
      },

      {
        type:"input",
        message:"What is the name of the role you would like to add?",
        name:"addRole",
        when:(answer)=> answer.selection === "Add a role"
      },

      {
        type:"input",
        message:"What is the first name of the employee?",
        name:"addEmployeeFirstName",
        validate: (value)=>{
            if(value.length){
                return true;
            }
        },
        when:(answer)=> answer.selection === "Add an employee"
      },

      {
        type:"input",
        message:"What is the last name of the employee?",
        name:"addEmployeeLastName",
        when:(answer)=> Boolean(answer.addEmployeeFirstName)
      },

      {
        type:"input",
        message:"What is the name of the department you would like to add?",
        name:"addDepartment",
        when:(answer)=> answer.selection === "Add a department"
      },

]


inquirer.prompt(initialQuestions).then((data)=>{
    switch (data.selection) {
      case "View all departments":
        db.query('SELECT * FROM department', (err, result)=>{
          if(err){
            console.log(err)
          } else {
            console.table(result)
          }
        })
        break;
      case "View all roles":
        db.query('SELECT * FROM role', (err, result)=>{
          if(err){
            console.log(err)
          } else {
            console.table(result)
          }
        })
        break;
      case "View all employees":
        // Handle view all employees case need to add salary and department. join?
        db.query('SELECT * FROM employee', (err, result)=>{
            if(err){
              console.log(err)
            } else {
              console.table(result)
            }
        })
        break;
      case "Add a department":
        // Handle add a department case

        break;
      case "Add a role":
        // Handle add a role case
        break;
      case "Add an employee":
        // Handle add an employee case
        break;
      case "Update an employee role":
        // Handle update an employee role case
        break;
      default:
        console.log("Invalid selection");
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


