import { Op } from 'sequelize';
import { sequelize } from '../model/model.js';
import { Job, Contract, Profile } from '../model/model.js';

const depositBalance = async (profileId, depositAmount) =>
  sequelize.transaction(async (transaction) => {
    const clientProfile = await Profile.findOne({
      where: {
        id: profileId,
        type: 'client',
      },
      lock: true,
      transaction,
    });

    if (!clientProfile) {
      throw new Error('You can deposit only in client accounts');
    }

    const jobToPay = await Job.findAll({
      attributes: {
        include: [[sequelize.fn('SUM', sequelize.col('price')), 'totalToPay']],
      },
      include: {
        model: Contract,
        where: {
          status: 'in_progress',
          ClientId: profileId,
        },
      },
      where: {
        [Op.or]: [{ paid: false }, { paid: null }],
      },
      transaction,
    });
    const totalToPay = jobToPay[0].toJSON().totalToPay;
    if (depositAmount > totalToPay * 0.25) {
      throw new Error(`Deposit amount cannot be more than: ${totalToPay * 0.25}`);
    }

    clientProfile.balance = clientProfile.balance + depositAmount;
    return clientProfile.save({ transaction });
  });

export default {
  depositBalance,
};
