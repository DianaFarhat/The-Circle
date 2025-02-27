import { asyncHandler } from "../middlewares/asyncHandler";

//Import Tag Model
const Tag = require("../models/tagModel");


const createTag= asyncHandler(async (req, res)=> {
  try{

  }catch(error){
    
  }
})



exports.listCategory = (async (req, res, next) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

exports.readCategory = (async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});
