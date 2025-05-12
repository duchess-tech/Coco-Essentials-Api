const productsModel=require("../models/productsModel")
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const { CloudApi_key, CloudApi_secret, Cloud_name } = require("../config/env");
const { editProduct } = require("./api");

cloudinary.config({
  cloud_name: Cloud_name,
  api_key: CloudApi_key,
  api_secret: CloudApi_secret
})


const AddProduct=async(req,res)=>{   
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {
        try {
          if (err) {
            return res.status(500).json({ error: 'Error uploading file' });
          }
          const name = fields.name[0];
          const price = fields.price[0];
          const description = fields.description[0]
          const noofitem = fields.noofitem[0]
          const category = fields.category[0]
          const image = files.image[0].filepath;

          const foldername = "Radiantwhhispersstoreimages"
            const cloudinaryUploadResult = await cloudinary.uploader.upload(image, { folder:foldername  });

            const newProduct = new productsModel({
                name,
                price,
                image: cloudinaryUploadResult.secure_url, 
                description,
                category,
                noofitem
            });
           

            const findoneProduct = await productsModel.findOne({ name })
            if (findoneProduct) {
                return res.json({ message: "Product already exists", error_type: 1, created: false });
            }

            newProduct.save().then((prod) => {
                const id = prod._id;
                res.status(201).json({ prod, created: true, status: 1, message: "Product added" });
            });
        } catch (error) {
            console.error('Error uploading file or saving product:', error);
            res.status(500).json({ error: 'Error uploading file or saving product', created: false });
        }
  })

}





const DeleteProduct=async(req,res)=>{
const id = req.params.id;
    try {
        await productsModel.deleteOne({_id:id});
        res.status(200).json({ message: 'product deleted successfully.',created:true });
    } catch (error) {
        console.error('Error deleting documents:', error);
        res.status(500).json({ error: 'Internal Server Error',created:false });
    }
}



const DeleteAllProduct=async(req,res)=>{
      try {
          await productsModel.deleteMany({});
          res.status(200).json({ message: 'product deleted successfully.' });
      } catch (error) {
          console.error('Error deleting documents:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
// const AllProduct=async(req,res)=>{
//   console.log('Headers:', req.headers);
//   console.log('Query:', req.query);
//   console.log('Body:', req.body);
//   const search = req.query.search;
//   if (!search) {
//     return res.status(400).json({ error: "Missing search query parameter" });
//   }
//     try {
//     const products = await productsModel.find({});
//     res.json({ products: products });
   
// }

// catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Internal server error" });
// }
   
// }
const AllProduct = async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);

  const search = req.query.search;

  try {
    let products;

    if (search) {
      // If a search query is provided, filter products based on the search term
      products = await productsModel.find({ name: { $regex: search, $options: 'i' } });
    } else {
      // If no search query is provided, return all products
      products = await productsModel.find({});
    }

    res.json({ products: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const GetProduct=async(req,res)=>{
const { id } = req.params
try{
  const product=await productsModel.findById(id)
if(!product){
    res.json({message:"Product not found", status:0})
    return
}
if(product){
res.json({message:'Product  found' ,product})
}
}catch{
res.status(500).json({message:'Internal server error'})

}
}

const searchProduct=async(req,res)=>{
    const searchQuery = req.query.search;
  if (!searchQuery) {
    res.status(400).json({ error: 'Missing search query parameter' });
    return;
  }
  try {
    const products = await productsModel.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


const category= async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const products = await productsModel.find({ category: categoryName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



const newArrivals=async (req, res) => {
  try {
    const newProducts = await  productsModel.find().sort({ createdAt: -1 }).limit(10); 
    res.json(newProducts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

let cart = {
  items: [],
  totalPrice: 0
};


const getCart =(req, res) => {
  res.json(cart.items.length);
};

const retrivCart= (req, res) => {
 const cart = req.body;
  res.json(cart);
}



module.exports = {
    AllProduct,
    GetProduct,
    AddProduct,
    DeleteAllProduct,
    searchProduct,
    category,
    getCart ,
    retrivCart,
    newArrivals, 
    DeleteProduct, 
  };
  