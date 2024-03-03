import express from 'express';
import { getProfile } from '../middleware/index.js';
import controller from '../controller/balance.controller.js';

const balance = express.Router();

balance.post('/balances/deposit/:userId', getProfile, controller.depositBalance);

export default balance;
