const express = require("express");
const router =express.Router();
//Insert Model
const spray = require("../Model/sprayModel");
//Insert spray Controller
const sprayControllers = require("../Controllers/sprayControllers");

router.get("/",sprayControllers.getAllSprays);
router.post("/",sprayControllers.addspray);
router.get("/:id",sprayControllers.getbyId);
router.put("/:id",sprayControllers.updateSpray);
router.delete("/:id",sprayControllers.deletespray);

//export
module.exports=router;
