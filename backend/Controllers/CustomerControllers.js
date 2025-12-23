const Customer = require("../Model/CustomerModel");

const getAllCustomers = async (req,res,next) => {
   let  Customers;

   try{
    Customers= await Customer.find();
   }catch (err) {
        console.log(err);
   }
   //not found
   if (!Customer){
        return res.status(404).json({message:"Customer not found"});
   }
   //display
   return res.status(200).json({Customers})

};

//insert
const addCustomers = async (req,res,next) => {


    const {ShopName,OwnerName,Email,PhoneNo,City,Status} = req.body;

    let Customers;

    try{
        Customers = new Customer({ShopName,OwnerName,Email,PhoneNo,City,Status});
        await Customers.save();
    }catch (err) {
        console.log(err);
    }
    //not insert customers
     if (!Customers){
        return res.status(404).json({message:"unable to add customers"});
   }
   return res.status(200).json({ Customers});
    
};

//get by id

const getById = async (req, res, next) => {
    const customerId = parseInt(req.params.id); // convert string to number
    let customer;

    try {
        customer = await Customer.findOne({ CustomerId: customerId }); // query by CustomerId
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ customer });
};


//update
const updatecustomer = async (req,res,next)=> {

    const id = req.params.id;
    const {ShopName,OwnerName,Email,PhoneNo,City,Status} = req.body;

    let Customers;

    try{
        Customers = await Customer.findOneAndUpdate({CustomerId: parseInt(id)},{ShopName:ShopName,OwnerName:OwnerName,Email:Email,PhoneNo:PhoneNo,City:City,Status:Status}
           , { new: true }
        );
        Customers = await Customers.save();
    }catch (err) {
        console.log(err);
    }
     //not customer customers
     if (!Customers){
        return res.status(404).json({message:"Unable to update customer details"});
   }
   return res.status(200).json({ Customers});

}

//delete

const deletecustomer = async (req,res,next)=> {

    const id = req.params.id;
   
    let Customers;

    try{
    Customers = await Customer.findOneAndDelete(id);
    }catch (err) {
        console.log(err);
    }
     //not available customers
     if (!Customers){
        return res.status(404).json({message:"Unable to delete customer details"});
   }
   return res.status(200).json({ Customers});

}

exports.getAllCustomers = getAllCustomers
exports.addCustomers = addCustomers;
exports.getById = getById;
exports.updatecustomer = updatecustomer;
exports.deletecustomer = deletecustomer;