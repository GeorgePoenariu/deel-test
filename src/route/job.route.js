import express from 'express';
import { getProfile } from '../middleware/index.js';
import controller from '../controller/job.controller.js';

const job = express.Router();

job.get('/jobs/unpaid', getProfile, controller.getUnpaidJobs);
job.post('/jobs/:job_id/pay', getProfile, controller.payJob);

export default job;
