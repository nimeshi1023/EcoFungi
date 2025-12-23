const Stock = require("../Model/StockModel");

const getAllStocks = async (req,res,next) => {
   let  Stocks;

   try{
    Stocks= await Stock.find();
   }catch (err) {
        console.log(err);
   }
   //not found
   if (!Stock){
        return res.status(404).json({message:"Stock not found"});
   }
   //display
   return res.status(200).json({Stocks})

};

//insert
const addStocks = async (req,res,next) => {


    const {ManufactureDate,MushroomType,ExpireDate,Unit} = req.body;

    let Stocks;

    try{
        Stocks = new Stock({ManufactureDate,MushroomType,ExpireDate,Unit});
        await Stocks.save();
    }catch (err) {
        console.log(err);
    }
    //not insert Stocks
     if (!Stocks){
        return res.status(404).json({message:"unable to add Stocks"});
   }
   return res.status(200).json({ Stocks});
    
};

//get by id

const getById = async (req, res, next) => {
    const stockId = parseInt(req.params.id); // convert string to number
    let stock;

    try {
        stock = await Stock.findOne({ StockId: stockId }); // query by StockId
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
    }

    return res.status(200).json({ stock });
};


//update
const updatestock = async (req,res,next)=> {

    const id = req.params.id;
    const {ManufactureDate,MushroomType,ExpireDate,Unit} = req.body;

    let Stocks;

    try{
        Stocks = await Stock.findOneAndUpdate({StockId: parseInt(id)},{ManufactureDate:ManufactureDate,MushroomType:MushroomType,ExpireDate:ExpireDate,Unit:Unit}
           , { new: true }
        );
        Stocks = await Stocks.save();
    }catch (err) {
        console.log(err);
    }
     //not found Stocks
     if (!Stocks){
        return res.status(404).json({message:"Unable to update Stocks details"});
   }
   return res.status(200).json({ Stocks});

}

//delete

const deletestock = async (req,res,next)=> {

    const id = req.params.id;
   
    let Stocks;

    try{
    Stocks = await Stock.findOneAndDelete(id);
    }catch (err) {
        console.log(err);
    }
     //not available Stocks
     if (!Stocks){
        return res.status(404).json({message:"Unable to delete Stocks details"});
   }
   return res.status(200).json({ Stocks});

}

exports.getAllStocks = getAllStocks
exports.addStocks = addStocks;
exports.getById = getById;
exports.updatestock = updatestock;
exports.deletestock = deletestock;

