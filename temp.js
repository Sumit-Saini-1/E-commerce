// item.pid=="3ad30c19-3445-4b2c-842c-7ba81c308ce1"
// let data = [
//     {
//         "oid": "02afe849-bd07-447f-981f-8a7125db5bb9",
//         "pid": "3ad30c19-3445-4b2c-842c-7ba81c308ce1"
        
//     },
//     {
//         "oid": "31d305fd-7c86-4e72-ae98-97af4bf22c00",
//         "pid": "225bf1da-3a92-4f98-936f-1b48b1654a56"
//     },
//     {
//         "oid": "3974f897-3008-4c70-90a3-67fdcc54e559",
//         "pid": "3ad30c19-3445-4b2c-842c-7ba81c308ce1"
        
//     },
//     {
//         "oid": "592874bd-b89b-4293-a2d9-bb6318a3f80f",
//         "pid": "225bf1da-3a92-4f98-936f-1b48b1654a56"
//     },
//     {
//         "oid": "664dbf2c-f0de-42ce-9f07-0e351fc51529",
//         "pid": "04f975e5-adcf-4eab-bfc9-fdcc3b52f463"
//     },
//     {
//         "oid": "6e0282d0-1e61-45ed-b72d-64d0700c2f18",
//         "pid": "225bf1da-3a92-4f98-936f-1b48b1654a56"
//     },
//     {
//         "oid": "b9fbae8b-47db-41be-a21f-3560996570fc",
//         "pid": "04f975e5-adcf-4eab-bfc9-fdcc3b52f463"
//     },
//     {
//         "oid": "c1e0715d-c3b7-403d-a6c6-1096804cb433",
//         "pid": "04f975e5-adcf-4eab-bfc9-fdcc3b52f463"
//     },
//     {
//         "oid": "e363bbca-10d6-4d4f-9c8c-1c637dfcca78",
//         "pid": "04f975e5-adcf-4eab-bfc9-fdcc3b52f463"
//     },
//     {
//         "oid": "eb77d93c-159d-49ef-9798-ffeea593f3c5",
//         "pid": "126dc754-74d3-41c0-8b0e-154fd41d3fee"
//     },
//     {
//         "oid": "edb59274-9530-478b-8cfc-376f6695537b",
//         "pid": "2399021f-bcd1-400a-aa18-9d678bab351d"
//     }
// ]
// count(data);
// function count(data){
//     item=data[0];
//     console.log(item);
//     let c=0;
//     data=data.filter(i=>{
//         if(i.pid!=item.pid){
//             return true;
//         }
//         else{
//             c++;
//             return false;
//         }
//     });
//     console.log(c);
//     if(data[0]){
//         count(data);
//     }
// }
// data.forEach(item=>{
//     console.log(item);
//     let c=0;
//     data=data.filter(i=>{
//         if(i.pid!=item.pid){
//             return true;
//         }
//         else{
//             c++;
//             return false;
//         }
//     });
//     console.log(c);
// });
// console.log(data);

// let i=0;
// console.log(data.filter(item=>{
//     if(item.pid!="3ad30c19-3445-4b2c-842c-7ba81c308ce1"){
//         return true;
//     }
//     else{
//         i++;
//         return false;
//     }
// }));
// console.log(i);

const mysql = require('mysql');
const uuid = require("uuid");


const connection = mysql.createConnection({ host: 'localhost', // host for connection 
port: 3306, // default port for mysql is 3306 
database: 'ecommerce', // database from which we want to connect out node application 
user: 'root', // username of the mysql connection 
password: '' // password of the mysql connection 
});
connection.connect(function (err) {
    if(err){
        console.log(err);
    }
    else{
        console.log("connection created with Mysql successfully");
        let query="CREATE TABLE IF NOT EXISTS PRODUCTS(pid INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(50) NOT NULL,image VARCHAR(50) NOT NULL,description VARCHAR(300) NOT NULL,price INT NOT NULL,rating INT, stock INT NOT NULL,brand VARCHAR(30),category VARCHAR(50) NOT NULL,timeOfAdd DATETIME NOT NULL,approved VARCHAR(1) DEFAULT 'N',seller VARCHAR(36) NOT NULL,FOREIGN KEY(seller) REFERENCES sellers(sid))";
        connection.query(query,function(err,results,fields){
            if(err){
                console.log("20............",err);
            }
            console.log("22..........",results);
            console.log("23..........",fields);
        });

        fetch("https://dummyjson.com/products")
        .then(res=>res.json())
        .then(products=>{
            products.products.forEach(product => {
                const pid = uuid.v4();
                let name= product.title;
                let image=product.images[1];
                let description=product.description;
                let price=product.price;
                let rating=product.rating;
                let quantity= product.stock;
                let brand=product.brand;
                let category=product.category;
                let seller="198c6fce-c37a-45d2-9ce1-ef63a572593c";
                let query="INSERT INTO PRODUCTS(pid,name,image,description,price,rating,stock,brand,category,timeOfAdd,seller) VALUES(?,?,?,?,?,?,?,?,?,now(),?)";
                connection.query(query,[pid,name,image,description,price,rating,quantity,brand,category,seller],function(err,results,fields){
                    if(err){
                        console.log("25............",err);
                    }
                    console.log("27..........",results);
                    //console.log("28..........",fields);
                });
            });
        });
        query="SELECT * FROM PRODUCTS";
        connection.query(query,function(err,results,fields){
            if(err){
                console.log("33............",err);
            }
            console.log("35..........",results);
            // console.log("36..........",fields);
        });

    }
 });




//  let query="CREATE TABLE IF NOT EXISTS sellers(sid VARCHAR(36) PRIMARY KEY,name VARCHAR(50) NOT NULL,username VARCHAR(25) NOT NULL,password VARCHAR(20) NOT NULL,isemailverified VARCHAR(1) DEFAULT 'N',role VARCHAR(10) NOT NULL DEFAULT 'seller',buisness_name VARCHAR(30) NOT NULL,buisnesstype VARCHAR(30) NOT NULL,aadharno VARCHAR(12) NOT NULL,aadharimage VARCHAR(50) NOT NULL,allowed VARCHAR(1) DEFAULT 'N' CHECK(allowed IN('Y','N')))";
//  connection.query(query,function(err,results,fields){
//      if(err){
//          console.log("20............",err);
//      }
//      console.log("22..........",results);
//      console.log("23..........",fields);
//  });










 // connection.connect(function (err) {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("connection created with Mysql successfully");
        // let query="CREATE TABLE IF NOT EXISTS USERS(uid INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(50) NOT NULL,mobile VARCHAR(10) NOT NULL,username VARCHAR(50) NOT NULL,password VARCHAR(25) NOT NULL,isemailverified VARCHAR(1) DEFAULT 'N',role VARCHAR(15) NOT NULL)";
        // connection.query(query,function(err,results,fields){
        //     if(err){
        //         console.log("17............",err);
        //     }
        //     console.log("19..........",results);
        //     console.log("20..........",fields);
        // });
        // query="INSERT INTO USERS(name ,mobile ,username ,password ,role ) VALUES('Sumit Saini','7027057396','01sumitsaini@gmail.com','Aa@12345','seller')";
        // connection.query(query,function(err,results,fields){
        //     if(err){
        //         console.log("25............",err);
        //     }
        //     console.log("27..........",results);
        //     console.log("28..........",fields);
        // });
        
//     }
//  });





