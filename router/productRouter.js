const express = require("express");
const router = express.Router();
const { check} = require("express-validator");
const { AddProduct, AllProduct, GetProduct, DeleteAllProduct, searchProduct, category, getCart, retrivCart,newArrivals, DeleteProduct} = require("../controllers/products");
const auth = require("../middleware/auth");
const { GetEditProduct, editProduct } = require("../controllers/api");
const authorizeRoles = require("../middleware/roleBased");
const validationMiddlewares=[
  check("name", "Enter Product Name").not().isEmpty(),
    check("price", " enter price").not().isEmpty(),
    check("image", "Add Image Link").not().isEmpty(),
    check("description", "Enter Product Description").not().isEmpty(),
    check("category", "Enter Product category").not().isEmpty(),
]


router.get("/allProducts",AllProduct);
router.post("/addProduct",auth,authorizeRoles("admin"), AddProduct);
router.get("/getProduct/:id",GetProduct);
router.delete("/DeleteAll",DeleteAllProduct);
router.delete("/deleteOne/:id",DeleteProduct);
router.get("/",searchProduct);
router.get("/category/:categoryName",category);
router.get("/api/cart",getCart)
router.post("/api/cart",retrivCart)
router.get('/new-arrivals',newArrivals)
router.get("/edit/:id",GetEditProduct);
router.post("/edit/:id",editProduct);
module.exports =router