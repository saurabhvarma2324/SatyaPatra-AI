const store = require('../services/store');

const getDashboardStats = async (req, res) => {
  try {
    const stats = store.getDashboardStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
