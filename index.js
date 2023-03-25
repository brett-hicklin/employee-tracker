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
      }
    ]
const addDept = [
      {
        type:"input",
        message:"What is the name of the department you would like to add?",
        name:"addDepartment",
      }

    ]
const addRole = [
      {
        type:"input",
        message:"What is the name of the role you would like to add?",
        name:"addRoleName",
        validate: (value)=>{
            if(value.length){
                return true;
            }
        },
      },
      {
        type:"input",
        message:"What is the salary of that role?",
        name:"addRoleSalary",
        validate: (value)=>{
            if(value.length){
                return true;
            }
        },
        when:(answer)=> Boolean(answer.addRoleName)
      },
      {
        //need to make the choices dynamic and take new input from departments
        type:"list",
        message:"What department is that role in",
        choices:["finance","legal"],
        name:"addRoleDept",
        when:(answer)=> Boolean(answer.addRoleSalary)
      },
    ]

    const addEmployee = [
      {
        type:"input",
        message:"What is the first name of the employee?",
        name:"addEmployeeFirstName",
        validate: (value)=>{
            if(value.length){
                return true;
            }
        },
      },

      {
        type:"input",
        message:"What is the last name of the employee?",
        name:"addEmployeeLastName",
        when:(answer)=> Boolean(answer.addEmployeeFirstName)
      },
      
      {
        type:"list",
        message:"What is the role of the employee?",
        choices:["Salesperson","engineer"],
        name:"addEmployeeRole",
        validate: (value)=>{
            if(value.length){
                return true;
            }
        },
        when:(answer)=> Boolean(answer.addEmployeeLastName)
      },

      {
        type:"list",
        message:"Who is the employee's Manager?",
        choices:["Allen","Marcus"],
        name:"addEmployeeManager",
        validate: (value)=>{
            if(value.length){
                return true;
            }
        },
        when:(answer)=> Boolean(answer.addEmployeeRole)
      },
    ]

    const updateEmployee = [
      {
        type:"list",
        message:"Which employee would you like to update?",
        choices:["brett"],
        name:"updateEmployee",
        validate: (value)=>{
            if(value){
                return true;
            }
        },
      },
      {
        type:"list",
        message:"What is their new role?",
        choices:["cat","dog"],
        name:"updateEmployeeRole",
        when:(answer)=> answer.updateEmployee
      }

]

function startPrompt(){
return inquirer.prompt(initialQuestions).then((data)=>{
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
        return inquirer.prompt(addDept).then((data)=>{
            console.log(data)
        });

       
      case "Add a role":
        // Handle add a role case
        return inquirer.prompt(addRole).then((data)=>{
            console.log(data)
        });
       
      case "Add an employee":
        // Handle add an employee case
        return inquirer.prompt(addEmployee);
       
      case "Update an employee role":
        // Handle update an employee role case
        return inquirer.prompt(updateEmployee);
       
      default:
        console.log("Invalid selection");
    }
  })
}
startPrompt();

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


