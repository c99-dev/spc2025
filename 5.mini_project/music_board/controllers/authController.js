// 인증 관련 컨트롤러
const UserService = require('../models/usersModel');

// 로그인 페이지 표시
function showLoginPage(req, res) {
  return res.render('login', {
    error: req.flash('error'),
    success: req.flash('success'),
  });
}

// 로그인 처리
async function processLogin(req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserService.authenticate(username, password);

    if (user) {
      return handleSuccessfulLogin(req, res, user);
    } else {
      return handleFailedLogin(req, res);
    }
  } catch (error) {
    return handleLoginError(req, res, error);
  }
}

// 회원가입 페이지 표시
function showRegisterPage(req, res) {
  return res.render('register', {
    error: req.flash('error'),
  });
}

// 회원가입 처리
async function processRegister(req, res) {
  const { username, password, name } = req.body;

  try {
    // 입력값 유효성 검사
    if (!isValidRegistrationInput(username, password, name)) {
      req.flash('error', '모든 항목을 입력해주세요.');
      return res.redirect('/auth/register');
    }

    // 아이디 중복 확인
    if (await isUsernameTaken(username)) {
      req.flash('error', '이미 사용 중인 아이디입니다.');
      return res.redirect('/auth/register');
    }

    // 사용자 생성
    await UserService.create(username, password, name);
    req.flash('success', '회원가입이 완료되었습니다. 로그인해주세요.');
    return res.redirect('/auth/login');
  } catch (error) {
    return handleRegistrationError(req, res, error);
  }
}

// 로그아웃 처리
function processLogout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error('로그아웃 오류:', error);
    }
    return res.redirect('/');
  });
}

// ========== 헬퍼 함수 ==========

// 로그인 성공 처리
function handleSuccessfulLogin(req, res, user) {
  req.session.userId = user.id;
  return saveSessionAndRedirect(req, res, '로그인에 성공했습니다.', '/');
}

// 로그인 실패 처리
function handleFailedLogin(req, res) {
  req.flash('error', '아이디 또는 비밀번호가 올바르지 않습니다.');
  return saveSessionAndRedirect(req, res, null, '/auth/login');
}

// 로그인 오류 처리
function handleLoginError(req, res, error) {
  console.error('로그인 오류:', error);
  req.flash('error', '로그인 중 오류가 발생했습니다.');
  return saveSessionAndRedirect(req, res, null, '/auth/login');
}

// 회원가입 오류 처리
function handleRegistrationError(req, res, error) {
  console.error('회원가입 오류:', error);
  req.flash('error', '회원가입 중 오류가 발생했습니다.');
  return res.redirect('/auth/register');
}

// 세션 저장 및 리디렉션
function saveSessionAndRedirect(req, res, successMessage, redirectUrl) {
  if (successMessage) {
    req.flash('success', successMessage);
  }

  return req.session.save((err) => {
    if (err) {
      console.error('세션 저장 오류:', err);
    }
    return res.redirect(redirectUrl);
  });
}

// 회원가입 입력값 유효성 검사
function isValidRegistrationInput(username, password, name) {
  return Boolean(username && password && name);
}

// 아이디 중복 확인
async function isUsernameTaken(username) {
  const existingUser = await UserService.findByUsername(username);
  return Boolean(existingUser);
}

module.exports = {
  showLoginPage,
  processLogin,
  showRegisterPage,
  processRegister,
  processLogout,
};
