import express from 'express';
import jwt from 'jsonwebtoken';
import BankAccount from '../models/bankaccount.model.js';

const router = express.Router();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Add Bank Account
router.post('/add', authenticateToken, async (req, res) => {
  const { ifscCode, branchName, bankName, accountNumber, accountHolderName } = req.body;

  try {
    const bankAccount = new BankAccount({
      user: req.user.id,
      ifscCode,
      branchName,
      bankName,
      accountNumber,
      accountHolderName,
    });

    await bankAccount.save();
    res.status(201).json(bankAccount);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bank account' });
  }
});

// Get User's Bank Accounts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({ user: req.user.id });
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bank accounts' });
  }
});

export default router;
