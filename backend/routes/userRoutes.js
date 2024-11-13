const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// for registering the user and getting all the users
// for get request -> go to protect middleware first to check if the user is authenticated or not then go to allUsers controller
router.route("/").post(registerUser).get(protect, allUsers);

// for login to the app
router.post("/login", authUser)

module.exports=router;