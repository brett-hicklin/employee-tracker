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
       
        type:"list",
        message:"What department is that role in",
        choices:[],
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
        choices:[],
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
        choices:[],
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
            db.query(`INSERT INTO department(name) VALUES ("${data.addDepartment}")`, (err)=>{
                if(err){
                  console.log(err)
                } else {
                    console.log("Department successfully added!")
                }
            })
        });

      case "Add a role":
        // Handle add a role case
        
        db.query('SELECT * FROM department', (err, result)=>{
            if(err){
              console.log(err)
            } else {
              
              let deptArr =[];
              result.forEach(dept=>{
                deptArr.push(dept.name)
              })
              addRole[2].choices = deptArr;

              return inquirer.prompt(addRole).then((data)=>{
                let deptId;
                result.forEach(dept=>{
                    if(data.addRoleDept === dept.name){
                        deptId = dept.id
                    }
                })
                db.query(`INSERT INTO role(title,salary,department_id) VALUES ("${data.addRoleName}","${data.addRoleSalary}","${deptId}")`, (err,result)=>{
                    if(err){
                      console.log(err)
                    } else {
                        console.log("Role successfully added!")
                    }
                })
            });

            } 
            
          }) 
          break;
      case "Add an employee":
        // Handle add an employee case
          db.query('SELECT title FROM role',(err,result)=>{
            if(err){
                console.log(err)
            } else {
            let roleArr =[];
            result.forEach(role=>{
                roleArr.push(role.title)
            })
            addEmployee[2].choices = roleArr;

            db.query('SELECT * FROM employee',(err,result)=>{
                if(err){
                    console.log(err)
                } else {
                let employeeArr =[];
                result.forEach(employee=>{
                    console.log(employee)
                    employeeArr.push(`${employee.first_name} ${employee.last_name}`)
                })
                addEmployee[3].choices = employeeArr;
                console.log(employeeArr)

                return inquirer.prompt(addEmployee).then((data)=>{
                    let roleId;
                    db.query('SELECT id FROM role WHERE title = ?', data.addEmployeeRole, (err,result)=>{
                       if(err){
                        console.log(err)
                       } else {
                        console.log(result)
                        roleId = result[0].id
    
                  
                  
                        let managerId;
                        let nameArr = data.addEmployeeManager.split(" ")
                            db.query('SELECT id FROM employee WHERE first_name = ? AND last_name =?',[nameArr[0], nameArr[1]], (err,mgrResult)=>{
                               if(err){
                                console.log(err)
                               } else {
                                console.log("this is ", mgrResult)
                                managerId = mgrResult[0].id

                                console.log(managerId)
                                db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${data.addEmployeeFirstName}","${data.addEmployeeLastName}","${roleId}","${managerId}")`, (err)=>{
                                    if(err){
                                      console.log(err)
                                    } 
                                })

                               }
                            })  
                            //check line 247 query

                       }
                    })
    
                    
                });
                    
                }
              })



            }

          })
          break;

        
       
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


