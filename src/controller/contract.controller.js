import ContractService from '../service/contract.service.js';

/**
 * @returns contract by id
 */
const getContract = async (req, res, next) => {
  try {
    const { id: contractId } = req.params;
    const profileId = req.profile.id;

    const contract = await ContractService.getContractById(contractId, profileId);

    return contract ? res.json(contract) : res.status(404).end();
  } catch (err) {
    return next(err);
  }
};

/**
 * @returns all user contracts which are not terminated
 */
const getNonTerminatedContracts = async (req, res, next) => {
  try {
    const profileId = req.profile.id;

    const contracts = await ContractService.getNonTerminatedContracts(profileId);

    return res.json(contracts);
  } catch (err) {
    return next(err);
  }
};

export default {
  getContract,
  getNonTerminatedContracts,
};
