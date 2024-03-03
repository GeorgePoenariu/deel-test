import DepositService from '../service/balance.service.js';

/**
 * @returns the profile with the added deposit
 */
const depositBalance = async (req, res, next) => {
  try {
    const { userId: profileId } = req.params;
    const depositAmount = req.body.depositAmount;
    if (!depositAmount) {
      throw new Error('Missing depositAmount');
    }

    const profile = await DepositService.depositBalance(profileId, depositAmount);

    return res.json(profile);
  } catch (err) {
    return next(err);
  }
};

export default {
  depositBalance,
};
