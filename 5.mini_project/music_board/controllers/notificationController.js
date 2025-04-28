// 알림 관련 컨트롤러
const NotificationService = require('../models/notifications');

// 알림 목록 조회
async function getNotifications(req, res) {
  try {
    const userId = req.session.userId;
    const notifications = await NotificationService.getByUserId(userId);

    return res.render('notifications', {
      title: '알림',
      path: '/notifications',
      notifications,
    });
  } catch (error) {
    return handleNotificationError(
      req,
      res,
      error,
      '알림을 불러오는 중 오류가 발생했습니다.'
    );
  }
}

// 알림 읽음 처리
async function markAsRead(req, res) {
  try {
    const notificationId = req.params.id;
    await NotificationService.markAsRead(notificationId);

    return res.json({ success: true });
  } catch (error) {
    console.error('알림 읽음 처리 오류:', error);
    return res
      .status(500)
      .json({ error: '알림 읽음 처리 중 오류가 발생했습니다.' });
  }
}

// 모든 알림 읽음 처리
async function markAllAsRead(req, res) {
  try {
    const userId = req.session.userId;
    await NotificationService.markAllAsRead(userId);

    return res.json({ success: true });
  } catch (error) {
    console.error('모든 알림 읽음 처리 오류:', error);
    return res
      .status(500)
      .json({ error: '모든 알림 읽음 처리 중 오류가 발생했습니다.' });
  }
}

// ========== 헬퍼 함수 ==========

// 알림 오류 처리
function handleNotificationError(req, res, error, message) {
  console.error('알림 오류:', error);
  req.flash('error', message);
  return res.redirect('/');
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
