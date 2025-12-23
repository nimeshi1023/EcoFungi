const Product = require("../Model/ProductModel");

const getAllProducts = async (req,res,next) => {
   let  Products;

   try{
    Products= await Product.find();
   }catch (err) {
        console.log(err);
   }
   //not found
   if (!Product){
        return res.status(404).json({message:"Product not found"});
   }
   //display
   return res.status(200).json({Products})

};

//insert
const addProducts = async (req,res,next) => {


    const {ProductName,MushroomType,UnitPrice,Status} = req.body;

    let Products;

    try{
        Products = new Product({ProductName,MushroomType,UnitPrice,Status});
        await Products.save();
    }catch (err) {
        console.log(err);
    }
    //not insert Products
     if (!Products){
        return res.status(404).json({message:"unable to add Products"});
   }
   return res.status(200).json({ Products});
    
};

//get by id

const getById = async (req, res, next) => {
    const productId = parseInt(req.params.id); // convert string to number
    let product;

    try {
        product = await Product.findOne({ ProductId: productId }); // query by ProductId
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
};


//update
const updateproduct = async (req,res,next)=> {

    const id = req.params.id;
    const {ProductName,MushroomType,UnitPrice,Status} = req.body;

    let Products;

    try{
        Products = await Product.findOneAndUpdate({ProductId: parseInt(id)},{ProductName:ProductName,MushroomType:MushroomType,UnitPrice:UnitPrice,Status:Status}
           , { new: true }
        );
        Products = await Products.save();
    }catch (err) {
        console.log(err);
    }
     //not found Products
     if (!Products){
        return res.status(404).json({message:"Unable to update Product details"});
   }
   return res.status(200).json({ Products});

}

//delete

const deleteproduct = async (req,res,next)=> {

    const id = req.params.id;
   
    let Products;

    try{
    Products = await Product.findOneAndDelete(id);
    }catch (err) {
        console.log(err);
    }
     //not available Products
     if (!Products){
        return res.status(404).json({message:"Unable to delete Product details"});
   }
   return res.status(200).json({ Products});

}

exports.getAllProducts = getAllProducts
exports.addProducts = addProducts;
exports.getById = getById;
exports.updateproduct = updateproduct;
exports.deleteproduct = deleteproduct;

