const Purchase =require("../Model/PurchaseModel");

//data display
const getAllPurchase=async(req,res,next)=>{
    
    let purchases;

    try{
        purchases=await Purchase.find();
    }catch(err){
        console.log(err);
    }

    if(!purchases){
        return res.status(404).json({message:"Purchase not found"})

    }

    return res.status(200).json({purchases});

};

//data insert

const addPurchase =async(req,res,next)=>{
    const{Supplier_id,Item_name, Purchase_date, Price}=req.body;

    let purchases;

    try{
        purchases =new Purchase({Supplier_id,Item_name, Purchase_date, Price});
        await purchases.save();

    }catch(err){
        console.log(err);
    }

    if(! purchases){
         return res.status(404).json({message:"Unable to add Purchase"});

    }
    return res.status(200).json({ purchases});
}

//get by id

const getById = async (req, res, next) => {
   const id = req.params.id;

   let purchases;

   try {
       purchases = await Purchase.findById(id);
   } catch (err) {
      console.log(err);
   }

   if (!purchases) {
      return res.status(404).json({ message: "Purchase not found" });
   }

   return res.status(200).json({ purchases });
};

//update details

const updatePurchase =async(req,res,next)=>{
     const id = req.params.id;
     const{Supplier_id,Item_name, Purchase_date, Price}=req.body;

     let purchases;

    try {
    purchases = await Purchase.findByIdAndUpdate(
      id,
      {
        $set: {
          Supplier_id,
          Item_name,
           Purchase_date,
           Price
        }
      },
      { new: true, runValidators: true }   
    );
  }catch(err)
     {
       console.log(err);
     }

     if(!purchases){
         return res.status(404).json({message:"Unable to update Purchase"});

    }
    return res.status(200).json({purchases});
}

//delete details
const deletePurchase=async(req,res,next)=>{
     const id = req.params.id;

     let purchases;

     try{
        purchases =await Purchase.findByIdAndDelete(id)
     }catch(err)
     {
        console.log(err);
     }
      if(!purchases){
         return res.status(404).json({message:"Unable to delete Purchase"});

    }
    return res.status(200).json({purchases});
}






exports.getAllPurchase=getAllPurchase;
exports.addPurchase=addPurchase;
exports.getById=getById;
exports.updatePurchase= updatePurchase;
exports.deletePurchase=deletePurchase;




