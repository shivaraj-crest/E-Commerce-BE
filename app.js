
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Router = require("./routes/index");
const cookieParser = require("cookie-parser");




const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

//for parsing data in form data use this 
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
app.use(cors());

app.use('/api',Router);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
