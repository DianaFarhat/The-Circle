const express= require('express');
const router = express.Router();
import {createTag} from "../controllers/tagController.js"


//TODO: Marwa's
const {
 
  listCategory,
  readCategory,
} =require("../controllers/categoryController.js");


//TODO: You need to add an authorization for logged in users only

routers.route("/create-tag").post(createTag);


//TODO: Marwa's
router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);


module.exports = router; 