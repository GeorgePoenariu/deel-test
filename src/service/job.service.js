import { Op } from 'sequelize';
import { sequelize } from '../model/model.js';
import { Job, Contract, Profile } from '../model/model.js';

const getUnpaidJobs = async (profileId) => {
  const jobs = await Job.findAll({
    include: {
      model: Contract,
      where: {
        status: 'in_progress',
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    },
    where: {
      [Op.or]: [{ paid: false }, { paid: null }],
    },
  });

  return jobs.map((job) => job.toJSON()).map(({ Contract, ...job }) => job);
};

const getJobToPay = async (profileId, jobId, transaction) =>
  Job.findOne({
    include: {
      model: Contract,
      where: {
        ClientId: profileId,
        status: 'in_progress',
      },
    },
    where: { id: jobId, [Op.or]: [{ paid: false }, { paid: null }] },
    lock: true,
    transaction,
  });

const payJob = async (profile, jobId) =>
  sequelize.transaction(async (transaction) => {
    const clientProfile = await Profile.findOne({
      where: {
        id: profile.id,
        type: 'client',
      },
      lock: true,
      transaction,
    });

    if (!clientProfile) {
      throw new Error('User must be a client to pay a job!');
    }

    const job = await getJobToPay(clientProfile.id, jobId, transaction);
    if (!job) {
      throw new Error('Invalid request!');
    }

    if (clientProfile.balance < job.price) {
      throw new Error('Insufficient balance!');
    }

    clientProfile.balance = clientProfile.balance - job.price;
    await clientProfile.save({ transaction });

    await Profile.update(
      {
        balance: sequelize.literal(`'balance + ${job.price}'`),
      },
      {
        where: {
          id: job.Contract.ContractorId,
        },
        transaction,
      },
    );
    job.paid = true;
    job.paymentDate = new Date();
    const updatedFullJob = await job.save({ transaction });
    const { Contract, ...updatedJob } = updatedFullJob.toJSON();
    return updatedJob;
  });

export default {
  getUnpaidJobs,
  payJob,
};
