const store = require('../services/store');

const getNotifications = async (req, res) => {
  try {
    const notifs = store.getNotifications();
    return res.status(200).json({ success: true, count: notifs.length, data: notifs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notif = store.markNotificationRead(id);
    return res.status(200).json({ success: true, data: notif });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    store.markAllNotificationsRead();
    return res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
