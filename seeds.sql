INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Sales"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", "85000","3"),
       ("Lead Engineer", "150000", "1"),
       ("Software Engineer", "125000","1"),
       ("Accountant Manager", "180000","2"),
       ("Accountant", "110000","2"),
       ("Legal Team Lead", "225000","4"),
       ("Lawyer","165000","4");

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith","2");
       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brett", "Hicklin","3","1");
    
      
  
