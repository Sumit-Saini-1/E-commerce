
// jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzJiNGFjZC1kNDY4LTQ0ODgtODA3Mi05ZTAwNTk5MGIyNGQiLCJpYXQiOjE3MDE1MTYwODAsImV4cCI6MTcwMTUxNjY4MH0.m_oT0UDlmKIkHCmsCOFtVpUsJPizpFt41oOqTgVFAUY";
// bufferObj = Buffer.from(jwt, "utf8");
// const base64String = bufferObj.toString("base64");
// console.log("The encoded base64 string is:", base64String);

// bufferObj = Buffer.from(base64String, "base64");

// // Encode the Buffer as a utf8 string
// let decodedString = bufferObj.toString("utf8");
// console.log("The decoded string:", decodedString); 

const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "e-commerce"
});
const uuid = require("uuid");
const id = uuid.v4();

let query ="insert into addresses values(?,?,?,?,?,?,?)";
let data=[id,'Vill Jhinwarheri, PO Hassanpur, Dist Kurukshetra','India','Haryana','Kurukshetra','136119','614634ef-7aa3-47e8-8212-f4630a6cef08']
// let query ="insert into buisnessses values(?,?,?,?,?,?,?)";
// let data=[id,'The Classico','Tech Gadget','101010101010','3f442a6c9b8fd2ed7eba95b80825afd3','Y','198c6fce-c37a-45d2-9ce1-ef63a572593c']

// let query = "insert into users values(?,?,?,?,?,?,?)";
// const data = ['198c6fce-c37a-45d2-9ce1-ef63a572593c','Sumit Saini','7027057396','sumitsaini@gmail.com','Aa@12345','Y','seller'];
connection.query(query, data, function (err, results, fields) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(results);
});

