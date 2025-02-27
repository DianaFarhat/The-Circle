const express= require('express');
const router = express.Router();
const {
 
  listCategory,
  readCategory,
} =require("../controllers/categoryController.js");


router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);


module.exports = router; 