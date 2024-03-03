import { Op } from 'sequelize';
import { Contract } from '../model/model.js';

const getContractById = async (contractId, profileId) =>
  Contract.findOne({
    where: { id: contractId, [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] },
  });

const getNonTerminatedContracts = async (profileId) =>
  Contract.findAll({
    where: {
      status: { [Op.ne]: 'terminated' },
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });

export default {
  getContractById,
  getNonTerminatedContracts,
};
