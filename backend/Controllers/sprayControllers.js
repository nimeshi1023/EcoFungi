const Spray =require("../Model/sprayModel");

const getAllSprays = async (req,res,next)=>{
    let sprays;
    //get all 
    try{
        sprays =await Spray.find();
    }catch (err){
        console.log(err);
    }

    //spray not found
if(!sprays){
    return res.status(404).json({message:"spray not found"});
}

//display all spray
return res.status(200).json({sprays});
}

//data Insert to datbase
const addspray = async (req, res) => {
    const { batchid, day, stime, endtime } = req.body;

    let sprays; //variable

    try {
        sprays = new Spray({ batchid, day, stime, endtime });
        await sprays.save();
    } catch (err) {
        console.log(err);

    }

    //not isert sprays
    if (!sprays) {
        return res.status(400).jsond({ message: "unable to add sprays" });

    }
    return res.status(200).json({ sprays })

}


//get by id

const getbyId=async (req,res,next) => {
    const id = req.params.id; //used to route
    let spray;
    try{
        spray =await Spray.findById(id);
    }catch (err){
        console.log(err);
    }

 //not available sprays
    if(!spray){
        return res.status(404).json({message:"spray not avable"});

    }
    return res.status(200).json({spray})    

};


//update data
const updateSpray=async  (req,res,next) =>{
      const id = req.params.id; //used to route
      const{day,stime,endtime}=req.body;

      let sprays;//variablle

      try{
        sprays = await Spray.findByIdAndUpdate(id,{day:day,stime:stime,endtime:endtime});
        sprays= await sprays.save();
      }catch (err){
         console.log(err);

      }

       if(!sprays){
        return res.status(404).json({message:"Unabel to update data"});

    }
    return res.status(200).json({sprays})    






};
//Delete Spray details
const deletespray =async  (req,res,next) =>{
    const id=req.params.id;

    let spray;//variable
    try{
        spray=await Spray.findByIdAndDelete(id);
    }catch(err){
         console.log(err);
    }
       if(!spray){
        return res.status(404).json({message:"Unabel to Delete data"});

    }
    return res.status(200).json({spray})    


}





exports.getAllSprays=getAllSprays;
exports.addspray=addspray;
exports.getbyId=getbyId;
exports.updateSpray=updateSpray;  
exports.deletespray=deletespray;  