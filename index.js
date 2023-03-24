const inquirer = require ('inquirer');
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




