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


const corsOptions = {
  
    origin: [
      "https://api.paystack.co",
      "https://coco-essentials.vercel.app",
      'http://localhost:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true, 
  };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyparser.json())
app.use(cookiesparser())

  
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
