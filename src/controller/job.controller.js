import JobService from '../service/job.service.js';

/**
 * @returns all unpaid jobs
 */
const getUnpaidJobs = async (req, res, next) => {
  try {
    const profileId = req.profile.id;

    const unpaidJobs = await JobService.getUnpaidJobs(profileId);

    return res.json(unpaidJobs);
  } catch (err) {
    return next(err);
  }
};

/**
 * @returns the paid job
 */
const payJob = async (req, res, next) => {
  try {
    const { job_id: jobId } = req.params;
    const profile = req.profile;

    const paidJob = await JobService.payJob(profile, jobId);
    return res.json(paidJob);
  } catch (err) {
    return next(err);
  }
};

export default {
  getUnpaidJobs,
  payJob,
};
