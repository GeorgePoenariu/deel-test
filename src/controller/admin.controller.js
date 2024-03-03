import AdminService from '../service/admin.service.js';

/**
 * @returns best profession in interval
 */
const getBestProfession = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      throw new Error('Missing date interval!');
    }
    const bestProfession = await AdminService.getBestProfession(start, end);
    return res.json(bestProfession);
  } catch (err) {
    return next(err);
  }
};

/**
 * @returns best clients in interval
 */
const getBestClients = async (req, res, next) => {
  try {
    const { start, end, limit } = req.query;
    if (!start || !end) {
      throw new Error('Missing date interval!');
    }
    const bestProfession = await AdminService.getBestClients(start, end, limit);

    return res.json(bestProfession);
  } catch (err) {
    return next(err);
  }
};

export default {
  getBestProfession,
  getBestClients,
};
