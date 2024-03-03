import express from 'express';
import { getProfile } from '../middleware/index.js';
import controller from '../controller/contract.controller.js';

const contract = express.Router();

contract.get('/contracts', getProfile, controller.getNonTerminatedContracts);
contract.get('/contracts/:id', getProfile, controller.getContract);

export default contract;
