import express from 'express';
import { getProfile } from '../middleware/index.js';
import controller from '../controller/admin.controller.js';

const admin = express.Router();

admin.get('/admin/best-profession', getProfile, controller.getBestProfession);
admin.get('/admin/best-clients', getProfile, controller.getBestClients);

export default admin;
