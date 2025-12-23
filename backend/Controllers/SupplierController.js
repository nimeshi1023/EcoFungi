const Supplier =require("../Model/SupplierModel");

//data display
const getAllSupplier=async(req,res,next)=>{
    
    let suppliers;

    try{
        suppliers=await Supplier.find();
    }catch(err){
        console.log(err);
    }

    if(!suppliers){
        return res.status(404).json({message:"Supplier not found"})

    }

    return res.status(200).json({suppliers});

};

//data insert

const addSupplier =async(req,res,next)=>{
    const{Supplier_name, Phone_number, Email, Address}=req.body;

    let suppliers;

    try{
        suppliers =new Supplier({Supplier_name, Phone_number, Email, Address});
        await suppliers.save();

    }catch(err){
        console.log(err);
    }

    if(! suppliers){
         return res.status(404).json({message:"Unable to add supplier"});

    }
    return res.status(200).json({ suppliers});
}

//get by id

const getById = async (req, res, next) => {
   const id = req.params.id;

   let suppliers;

   try {
       suppliers = await Supplier.findById(id);
   } catch (err) {
      console.log(err);
   }

   if (!suppliers) {
      return res.status(404).json({ message: "Supplier not found" });
   }

   return res.status(200).json({ suppliers });
};

//update details

const updateSupplier =async(req,res,next)=>{
     const id = req.params.id;
     const{Supplier_name, Phone_number, Email, Address}=req.body;

     let suppliers;

    try {
    suppliers = await Supplier.findByIdAndUpdate(
      id,
      {
        $set: {
      
          Supplier_name,
           Phone_number,
            Email,
             Address
        }
      },
      { new: true, runValidators: true }   
    );
  }catch(err)
     {
       console.log(err);
     }

     if(!suppliers){
         return res.status(404).json({message:"Unable to update suppliers"});

    }
    return res.status(200).json({suppliers});
}

//delete details
const deleteSupplier=async(req,res,next)=>{
     const id = req.params.id;

     let suppliers;

     try{
        suppliers =await Supplier.findByIdAndDelete(id)
     }catch(err)
     {
        console.log(err);
     }
      if(!suppliers){
         return res.status(404).json({message:"Unable to delete suppliers"});

    }
    return res.status(200).json({suppliers});
}






exports.getAllSupplier=getAllSupplier;
exports.addSupplier=addSupplier;
exports.getById=getById;
exports.updateSupplier= updateSupplier;
exports.deleteSupplier=deleteSupplier;




