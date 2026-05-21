const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const briefController = require('../controllers/briefController');

const router = express.Router();

router.use(authenticateToken);

router.get('/summary', briefController.getSummary);
router.get('/', briefController.listBriefs);
router.post('/', briefController.createBrief);
router.get('/:id', briefController.getBrief);
router.put('/:id', briefController.updateBrief);
router.delete('/:id', briefController.deleteBrief);

module.exports = router;
