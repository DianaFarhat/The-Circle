// Imports
const express= require('express');
const { connectToDatabase } = require('./database');
const app= express();
const DB= require('./database').connectToDatabase;
/* const userRouter=require("./routes/userRouter") */
const cors = require('cors');
const cookieParser = require("cookie-parser");
/* const categoryRouter=require("./routes/categoryRouter")
const productRouter=require("./routes/productRouter")
const orderRoutes= require('./routes/orderRouter') */

// Set up the database
const dotenv=require("dotenv"); 
/*     
const BundlesRoutes=require('./routes/bundleRouter') */
dotenv.config();

// Run the database connection
connectToDatabase();

//Add necessary middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
    origin: "http://localhost:3001", // Allow your frontend domain
    credentials: true, // Allow credentials like cookies
}));
app.options('*', cors());


 app.use("/api/users", userRouter)
 /*
app.use("/api/category", categoryRouter)
app.use("/api/products", productRouter) 
app.use("/api/orders", orderRoutes)
app.use("/api/bundles", BundlesRoutes)
 */




app.get("/", (req,res)=>{res.send("hello")})

app.get("/api/config/paypal", (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

//Set up port
app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})