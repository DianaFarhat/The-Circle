const express= require('express')
const router=express.Router();
const {signup,login,logout,googleLogin,loginWithGoogle, getCurrentUserProfile, updateCurrentUserProfile } = require('../controllers/userController');
const {authenticate}= require('../middlewares/authMiddleware')

// User Authentication Routes
router.post('/signup', signup); 
router.post('/login', login); 
router.post('/logout', logout); 
router.post("/google-login", googleLogin); 
router.post("/loginWithGoogle", loginWithGoogle); 

//Other Routes
router.get('/profile', authenticate, getCurrentUserProfile);
router.put('/profile', authenticate, updateCurrentUserProfile);
 
module.exports = router; 