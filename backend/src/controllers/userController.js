const store = require('../services/store');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const users = store.getAllUsers();
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, badge } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = store.createUser({
      name,
      email,
      passwordHash,
      role: role || 'INVESTIGATOR',
      badge: badge || 'SOC Investigator L1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ success: true, data: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status (ACTIVE or INACTIVE) is required.' });
    }

    const updated = store.updateUserStatus(userId, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { passwordHash: _, ...safeUser } = updated;
    return res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUserStatus };
