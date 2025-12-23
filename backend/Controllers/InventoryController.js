const Inventory =require("../Model/InventoryModel");

//data display
const getAllInventory=async(req,res,next)=>{
    
    let items;

    try{
        items=await Inventory.find();
    }catch(err){
        console.log(err);
    }

    if(!items){
        return res.status(404).json({message:"Items not found"})

    }

    return res.status(200).json({items});

};

//data insert

const addInventory =async(req,res,next)=>{
    const{Category,Item_name,Quantity,Unit,Received_date,Expired_date,Reorder_level,Description,Purchase_id}=req.body;

    let items;

    try{
        items =new Inventory({Category,Item_name,Quantity,Unit,Received_date, Expired_date,Reorder_level,Description,Purchase_id});
        await items.save();

    }catch(err){
        console.log(err);
    }

    if(!items){
         return res.status(404).json({message:"Unable to add items"});

    }
    return res.status(200).json({items});
}

//get by id

const getById = async (req, res, next) => {
   const id = req.params.id;

   let items;

   try {
      items = await Inventory.findById(id);
   } catch (err) {
      console.log(err);
   }

   if (!items) {
      return res.status(404).json({ message: "Item not found" });
   }

   return res.status(200).json({ items });
};

//update details

const updateInventory =async(req,res,next)=>{
     const id = req.params.id;
     const{Category,Item_name,Quantity,Unit,Received_date,Expired_date,Reorder_level,Description,Purchase_id}=req.body;

     let items;

    try {
    items = await Inventory.findByIdAndUpdate(
      id,
      {
        $set: {
    
          Category,
          Item_name,
          Quantity,
          Unit,
          Received_date,
          Expired_date,
          Reorder_level,
          Description,
          Purchase_id
        }
      },
      { new: true, runValidators: true }   
    );
  }catch(err)
     {
       console.log(err);
     }

     if(!items){
         return res.status(404).json({message:"Unable to update items"});

    }
    return res.status(200).json({items});
}

//delete details
const deleteInventory =async(req,res,next)=>{
     const id = req.params.id;

     let items;

     try{
        items =await Inventory.findByIdAndDelete(id)
     }catch(err)
     {
        console.log(err);
     }
      if(!items){
         return res.status(404).json({message:"Unable to delete items"});

    }
    return res.status(200).json({items});
}






exports.getAllInventory=getAllInventory;
exports.addInventory=addInventory;
exports.getById=getById;
exports.updateInventory= updateInventory;
exports.deleteInventory=deleteInventory;




