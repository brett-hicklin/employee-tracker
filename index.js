const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "bootcamp",
    database: "employee_db",
  },
  console.log(`Connected to the courses_db database.`)
);

const initialQuestions = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
    name: "selection",
    // when: (answer) => answer.addEmployee === true
  },
];
const addDept = [
  {
    type: "input",
    message: "What is the name of the department you would like to add?",
    name: "addDepartment",
  },
];
const addRole = [
  {
    type: "input",
    message: "What is the name of the role you would like to add?",
    name: "addRoleName",
    validate: (value) => {
      if (value.length) {
        return true;
      }
    },
  },
  {
    type: "input",
    message: "What is the salary of that role?",
    name: "addRoleSalary",
    validate: (value) => {
      if (value.length) {
        return true;
      }
    },
    when: (answer) => Boolean(answer.addRoleName),
  },
  {
    type: "list",
    message: "What department is that role in",
    choices: [],
    name: "addRoleDept",
    when: (answer) => Boolean(answer.addRoleSalary),
  },
];

const addEmployee = [
  {
    type: "input",
    message: "What is the first name of the employee?",
    name: "addEmployeeFirstName",
    validate: (value) => {
      if (value.length) {
        return true;
      }
    },
  },

  {
    type: "input",
    message: "What is the last name of the employee?",
    name: "addEmployeeLastName",
    when: (answer) => Boolean(answer.addEmployeeFirstName),
  },

  {
    type: "list",
    message: "What is the role of the employee?",
    choices: [],
    name: "addEmployeeRole",
    validate: (value) => {
      if (value.length) {
        return true;
      }
    },
    when: (answer) => Boolean(answer.addEmployeeLastName),
  },

  {
    type: "list",
    message: "Who is the employee's Manager?",
    choices: [],
    name: "addEmployeeManager",
    validate: (value) => {
      if (value.length) {
        return true;
      }
    },
    when: (answer) => Boolean(answer.addEmployeeRole),
  },
];

const updateEmployee = [
  {
    type: "list",
    message: "Which employee would you like to update?",
    choices: [],
    name: "updateEmployee",
    validate: (value) => {
      if (value) {
        return true;
      }
    },
  },
  {
    type: "list",
    message: "What is their new role?",
    choices: [],
    name: "updateEmployeeRole",
    when: (answer) => answer.updateEmployee,
  },
];

async function getAllEmployees() {
  return db.promise().query("SELECT * FROM employee");
}

async function getAllRoles() {
  return db.promise().query("SELECT * FROM role");
}

function getEmployeeNameList(employees) {
  let employeeArr = [];
  employees[0].forEach((employee) => {
    employeeArr.push(`${employee.first_name} ${employee.last_name}`);
  });
  return employeeArr;
}

function getRoleTitleList(roleList) {
  let roleArr = [];
  roleList[0].forEach((role) => {
    roleArr.push(role.title);
  });
  return roleArr;
}

async function getEmployeeIdByName(name) {
  const nameArr = name.split(" ");
  return db
    .promise()
    .query("SELECT id FROM employee WHERE first_name = ? AND last_name =?", [
      nameArr[0],
      nameArr[1],
    ]);
}

async function getEmployeeRoleId(roleTitle) {
  const roleIdResult = await db
    .promise()
    .query("SELECT id FROM role WHERE title = ?", roleTitle);
  return roleIdResult[0][0].id;
}

async function viewAllEmployeeData() {
  const response = await db
    .promise()
    .query(
      "SELECT employee.id,employee.first_name,employee.last_name, role.title, department.name AS department, role.salary,CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee e2 ON employee.manager_id = e2.id;"
    );

  console.table(response[0]);
}

async function viewAllEmployeeRoles() {
  const response = await db
    .promise()
    .query(
      "SELECT role.id,role.title,role.salary,department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id"
    );

  console.table(response[0]);
}

function startPrompt() {
  return inquirer.prompt(initialQuestions).then(async (data) => {
    switch (data.selection) {
      case "View all departments":
        const allDepts = await db.promise().query("SELECT * FROM department");

        console.table(allDepts[0]);
        return startPrompt();

      case "View all roles":
        await viewAllEmployeeRoles();

        return startPrompt();

      case "View all employees":
        // Handle view all employees case need to add salary and department.
        await viewAllEmployeeData();

        return startPrompt();

      case "Add a department":
        // Handle add a department case
        const deptQuestionResponse = await inquirer.prompt(addDept);

        await db
          .promise()
          .query(
            `INSERT INTO department(name) VALUES (?)`,
            deptQuestionResponse.addDepartment
          );
        console.log("Department successfully added!");
        return startPrompt();

      case "Add a role":
        // Handle add a role case

        let res = await db.promise().query("SELECT * FROM department");
        let deptArr = [];

        res[0].forEach((dept) => {
          deptArr.push(dept.name);
        });
        addRole[2].choices = deptArr;

        const roleQuestionResponse = await inquirer.prompt(addRole);
        let deptId;
        res[0].forEach((dept) => {
          if (roleQuestionResponse.addRoleDept === dept.name) {
            deptId = dept.id;
          }
        });

        await db
          .promise()
          .query(
            `INSERT INTO role(title,salary,department_id) VALUES (?,?,?)`,
            [
              roleQuestionResponse.addRoleName,
              roleQuestionResponse.addRoleSalary,
              deptId,
            ]
          );
        console.log("a new role has been successfully added!");

        return startPrompt();

      case "Add an employee":
        // Handle add an employee case
        const roleList = await getAllRoles();
        const roleArr = getRoleTitleList(roleList);
        addEmployee[2].choices = roleArr;

        const employees = await getAllEmployees();
        const employeeArr = getEmployeeNameList(employees);
        employeeArr.push("None")
        addEmployee[3].choices = employeeArr;

        const addEmployeeResponse = await inquirer.prompt(addEmployee);
        const roleId = await getEmployeeRoleId(
          addEmployeeResponse.addEmployeeRole
        );
        let managerId;

            if(addEmployeeResponse.addEmployeeManager === "None"){
                managerId = null;
            } else {
       
        const mgrResult = await getEmployeeIdByName(addEmployeeResponse.addEmployeeManager);

        managerId = mgrResult[0][0].id;
            }
        await db
          .promise()
          .query(
            `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,[addEmployeeResponse.addEmployeeFirstName,addEmployeeResponse.addEmployeeLastName,roleId,managerId]

            

            

          );
        console.log("You've successfully added a new employee!");

        return startPrompt();

      case "Update an employee role":
        // Handle update an employee role case
        const employeeList = await getAllEmployees();
        const roles = await getAllRoles();
        updateEmployee[0].choices = getEmployeeNameList(employeeList);
        updateEmployee[1].choices = getRoleTitleList(roles);

        const addUpdateEmployeeResponse = await inquirer.prompt(updateEmployee);

        const updatedEmployee = await getEmployeeIdByName(
          addUpdateEmployeeResponse.updateEmployee
        );

        const updatedRole = await getEmployeeRoleId(
          addUpdateEmployeeResponse.updateEmployeeRole
        );

        await db
          .promise()
          .query("UPDATE employee SET role_id = ? WHERE id = ?", [
            updatedRole,
            updatedEmployee[0][0].id,
          ]);

        console.log("You've successfully changed roles!");

        return startPrompt();

      case "Exit":
        process.exit();

      default:
        console.log("Invalid selection");
    }
  });
}
startPrompt().then(() => {
  startPrompt();
});

