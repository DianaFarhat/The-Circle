const express= require('express')
const router=express.Router();
const {signup,login,logout,googleLogin,loginWithGoogle } = require('../controllers/userController');
const {authenticate, authorizeAdmin}= require('../middlewares/authMiddleware')

// User Authentication Routes
router.post('/signup', signup); 
router.post('/login', login); 
router.post('/logout', logout); 
router.post("/google-login", googleLogin); 
router.post("/loginWithGoogle", loginWithGoogle); 

 
module.exports = router; 