import express from 'express';
import BankAccount from '../models/bankaccount.model.js';
import authenticateToken from '../middlewares/auth.middleware.js';  // Import the authentication middleware

const router = express.Router();

// Admin middleware to check if the user is an admin
const adminAuth = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// Get all users' bank accounts (Admin Only)
router.get('/all-bank-accounts', authenticateToken, adminAuth, async (req, res) => {
  try {
    const allBankAccounts = await BankAccount.find().populate('user', 'username email');
    res.status(200).json(allBankAccounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bank accounts' });
  }
});

export default router;
