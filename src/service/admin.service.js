import { sequelize } from '../model/model.js';
import { Op } from 'sequelize';
import { Profile, Job, Contract } from '../model/model.js';

const getBestProfession = async (start, end) => {
  const bestProfession = await Job.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'earnedAmount']],
    include: {
      model: Contract,
      required: true,
      include: {
        model: Profile,
        as: 'Contractor',
        required: true,
        where: {
          type: 'contractor',
        },
      },
    },
    where: {
      paid: true,
      paymentDate: {
        [Op.gte]: start,
        [Op.lte]: end,
      },
    },
    group: ['Contract.ContractorId'],
    order: [[sequelize.col('earnedAmount'), 'DESC']],
  });

  return bestProfession[0].Contract.Contractor.profession;
};

const getBestClients = async (start, end, limit) => {
  const queryLimit = limit || 2;
  const bestClients = await Job.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'paidAmount']],
    include: {
      model: Contract,
      required: true,
      include: {
        model: Profile,
        as: 'Client',
        required: true,
        where: {
          type: 'client',
        },
      },
    },
    where: {
      paid: true,
      paymentDate: {
        [Op.gte]: start,
        [Op.lte]: end,
      },
    },
    group: ['Contract.ClientId'],
    order: [[sequelize.col('paidAmount'), 'DESC']],
    limit: queryLimit,
  });

  return bestClients.map((bestClient) => {
    const parsedClient = bestClient.toJSON();

    return {
      id: parsedClient.Contract.Client.id,
      paid: parsedClient.paidAmount,
      fullName: `${parsedClient.Contract.Client.firstName} ${parsedClient.Contract.Client.lastName}`,
    };
  });
};

export default {
  getBestProfession,
  getBestClients,
};
