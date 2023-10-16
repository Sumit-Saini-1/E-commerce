const mysql=require("mysql");
const connection=mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"ecommerce"
});
module.exports={
    connection
}



// const mongoose=require("mongoose");
// module.exports.init=async function(){
//     await mongoose.connect("mongodb+srv://ecomerce:ccpTBIREzkIzcdJI@cluster0.h1usxsj.mongodb.net/ecommerce?retryWrites=true&w=majority");
// }