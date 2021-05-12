const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const employees = [];

function team() {
  runpage();
  teammate();
}

function teammate() {
  inquirer
    .prompt([
      {
        message: "Enter a name:",
        name: "name",
      },
      {
        type: "list",
        message: "Select a role",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
      },
      {
        message: `Enter the id:`,
        name: "id",
      },
      {
        message: `Enter the email address:`,
        name: "email",
      },
    ])
    .then(function ({ name, role, id, email }) {
      let roleInfo = "";
      if (role === "Engineer") {
        roleInfo = "GitHub";
      } else if (role === "Intern") {
        roleInfo = "school name";
      } else {
        roleInfo = "phone number";
      }
      inquirer
        .prompt([
          {
            message: `Enter ${name}'s ${roleInfo}:`,
            name: "roleInfo",
          },
          {
            type: "list",
            message: "Would you like to add more team members?",
            choices: ["yes", "no"],
            name: "moreMembers",
          },
        ])
        .then(function ({ roleInfo, moreMembers }) {
          let newMember;
          if (role === "Engineer") {
            newMember = new Engineer(name, id, email, roleInfo);
          } else if (role === "Intern") {
            newMember = new Intern(name, id, email, roleInfo);
          } else {
            newMember = new Manager(name, id, email, roleInfo);
          }
          employees.push(newMember);
          addHtml(newMember).then(function () {
            if (moreMembers === "yes") {
              teammate();
            } else {
              finishpage();
            }
          });
        });
    });
}

function runpage() {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="../style.css">
        <title>My Team</title>
    </head>
    <body>
        <nav class="navbar navbar-dark bg-primary mb-5">
            <span class="navbar-brand mb-0 h1 w-100 text-center">My Team</span>
        </nav>
        <div class="container">
          <div class="row">`;
  fs.writeFile("./dist/Myteam.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function addHtml(member) {
  return new Promise(function (resolve, reject) {
    const name = member.getName();
    const role = member.getRole();
    const id = member.getId();
    const email = member.getEmail();
    let data = "";
    if (role === "Engineer") {
      const github = member.getGithub();
      data = `
            <div class="col-4">
              <div class="card mx-auto bg-primary mb-3" style="width: 18rem">
                <h5 class="card-header">${name}<br /><br />Engineer</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">ID: ${id}</li>
                  <li class="list-group-item">Email Address:<a href="mailto:${email}"> ${email}</a></li>
                  <li class="list-group-item">GitHub: <a href="https://github.com/${github}">${github}</a></li>
                </ul>
              </div>
            </div>`;
    } else if (role === "Intern") {
      const school = member.getSchool();
      data = `
              <div class="col-4">
                <div class="card mx-auto bg-primary mb-3" style="width: 18rem">
                  <h5 class="card-header">${name}<br /><br />Intern</h5>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">ID: ${id}</li>
                    <li class="list-group-item">Email Address:<a href="mailto:${email}"> ${email}</a></li>
                    <li class="list-group-item">School: ${school}</li>
                  </ul>
                </div>
              </div>`;
    } else {
      const officePhone = member.getOfficeNumber();
      data = `
                <div class="col-4">
                  <div class="card mx-auto bg-primary mb-3" style="width: 18rem">
                    <h5 class="card-header">${name}<br /><br />Manager</h5>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">ID: ${id}</li>
                      <li class="list-group-item">Email Address: <a href="mailto:${email}"> ${email}</a></li>
                      <li class="list-group-item">Office Phone: ${officePhone}</li>
                    </ul>
                  </div>
                </div>`;
    }
    fs.appendFile("./dist/Myteam.html", data, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function finishpage() {
  const html = ` 
      </div>
    </div>
    
  </body>
</html>`;

  fs.appendFile("./dist/Myteam.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("Team successfully generated!");
}

team();
