// 관리자 컨트롤러
const User = require('../models/users');
const Comment = require('../models/comments');

// 사용자 목록 조회
function listUsers(req, res) {
  try {
    // 모델 메서드 사용하여 사용자 목록 조회
    const users = User.getAllUsers();

    res.render('admin/users', {
      title: '회원 관리',
      users,
      path: req.path,
    });
  } catch (err) {
    console.error('사용자 목록 조회 오류:', err.message);
    req.flash('error', '사용자 목록을 불러오는 중 오류가 발생했습니다.');
    res.redirect('/');
  }
}

// 사용자 삭제
function deleteUser(req, res) {
  const { id } = req.params;

  try {
    // 관리자는 삭제할 수 없음
    const user = User.findById(id);

    if (user && user.is_admin) {
      req.flash('error', '관리자 계정은 삭제할 수 없습니다.');
      return res.redirect('/admin/users');
    }

    // 모델 메서드를 사용하여 사용자 삭제
    const success = User.deleteUser(id);

    if (success) {
      req.flash('success', '사용자가 삭제되었습니다.');
    } else {
      req.flash('error', '사용자를 찾을 수 없습니다.');
    }
    return res.redirect('/admin/users');
  } catch (err) {
    console.error('사용자 삭제 오류:', err.message);
    req.flash('error', '사용자 삭제 중 오류가 발생했습니다.');
    return res.redirect('/admin/users');
  }
}

// 댓글 목록 조회
function listComments(req, res) {
  try {
    // 모델 메서드를 사용하여 댓글 목록 조회
    const comments = Comment.getAllCommentsWithDetails();

    res.render('admin/comments', {
      title: '댓글 관리',
      comments,
      path: req.path,
    });
  } catch (err) {
    console.error('댓글 목록 조회 오류:', err.message);
    req.flash('error', '댓글 목록을 불러오는 중 오류가 발생했습니다.');
    res.redirect('/');
  }
}

// 댓글 삭제
function deleteComment(req, res) {
  const { id } = req.params;

  try {
    // 모델 메서드를 사용하여 댓글 삭제
    const success = Comment.delete(id);

    if (success) {
      req.flash('success', '댓글이 삭제되었습니다.');
    } else {
      req.flash('error', '댓글을 찾을 수 없습니다.');
    }
    return res.redirect('/admin/comments');
  } catch (err) {
    console.error('댓글 삭제 오류:', err.message);
    req.flash('error', '댓글 삭제 중 오류가 발생했습니다.');
    return res.redirect('/admin/comments');
  }
}

// 모듈 내보내기
module.exports = {
  listUsers,
  deleteUser,
  listComments,
  deleteComment,
};
