import express from 'express';
import contract from './contract.route.js';
import job from './job.route.js';
import balance from './balance.route.js';
import admin from './admin.route.js';

const router = express.Router();
router.use('/', contract);
router.use('/', job);
router.use('/', balance);
router.use('/', admin);

export default router;
