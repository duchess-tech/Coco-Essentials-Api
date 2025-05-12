
const {PAYSTACK_SECRET_KEY,PAYSTACK_PUBLIC_KEY}=require("../config/env")
const axios = require('axios');
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const generateUniqueReference = () => {
  return `ref_${uuidv4()}`;
};
// console.log(PAYSTACK_SECRET_KEY)
  const createPayment=async(req, res) =>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {amount,email, firstName, lastName,address,products,phoneNumber,region}=req.body
    const reference = generateUniqueReference();
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
  })
    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            amount: amount * 100,
            email: email,
            reference,
            metadata: {
              firstName,
              lastName,
              address,
              phoneNumber,
              region,
              products,
              date:currentDate
            },
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
    
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating payment:');
        res.status(500).json({ error: 'Error creating payment' });
    }
      
      }



const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params; 
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization:`Bearer ${PAYSTACK_SECRET_KEY}`, 
        },
      }
    );
    const data = response.data;
    res.json({ data });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    
  }
};

const requestKey=async(req, res)=>{
  try{
    let public_Key= PAYSTACK_PUBLIC_KEY
res.json({ data:public_Key})
  }
  catch(err){
    res.status(500).json({ message: 'Could not get Key', error: err });
  }
}


  module.exports ={
    createPayment,
    verifyPayment,
    requestKey
  }
  