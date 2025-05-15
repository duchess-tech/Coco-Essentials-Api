const express=require("express")
const bodyparser=require("body-parser")
const cookiesparser=require("cookie-parser")
const userRouter=require("./router/userRouter")
const adminRouter=require("./router/adminRoute")
const productRouter=require("./router/productRouter")
const paystackRouter=require("./router/paymentRoute")
const cartRouter=require("./router/cartRouter")
const wishListRouter=require("./router/wishlistRouter")
const {PORT}=require("./config/env")
const cors=require("cors")
const connect=require("./db/connection")
const app=express()



app.use((req, res, next) => {
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
 
const corsOptions = {
  
    origin: [
      "https://api.paystack.co",
      "https://coco-essentials.vercel.app",
      "https://e7d4-197-211-59-94.ngrok-free.app",
      'http://localhost:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'ngrok-skip-browser-warning'],
    credentials: true, 
  };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyparser.json())
app.use(cookiesparser())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
    // console.log(`${req.method} ${req.url}`);
    // console.log('Headers:', req.headers);
    next();
  });
  
app.use("/api/user",userRouter)
app.use("/api",userRouter)
app.use("/api",cartRouter)
app.use("/api/wishlists",wishListRouter)
app.use("/api/products",productRouter)
app.use("/api/product",productRouter)
app.use("/user",userRouter)
app.use("/api/paystack",paystackRouter)
app.use("/admin",adminRouter)

connect.then((res)=>{
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT} `)
    })
}).catch((err)=>{
    console.log(`Database err : ${err}`)
})
