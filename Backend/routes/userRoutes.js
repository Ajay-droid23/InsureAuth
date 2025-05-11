const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/user/:email', authenticateJWT, userController.getUser);
router.put('/user/:email', authenticateJWT, upload.single('profilePicture'), userController.updateUser);
router.put('/user/:email/change-password', authenticateJWT, userController.changePassword);

module.exports = router;