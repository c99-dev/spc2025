const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const sqlite = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

const db = new sqlite.Database('cart.db');

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// 관리자 인증 미들웨어
const adminAuth = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 일반 사용자 로그인
app.post('/login', (req, res) => {
  if (req.session.user) {
    return res.status(401).json({ message: '이미 로그인 되어 있습니다.' });
  }

  const { name, password } = req.body;
  db.get(
    'SELECT * FROM users WHERE name = ? AND password = ?',
    [name, password],
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
      }
      if (!user) {
        return res.status(401).json({ message: '로그인 실패!' });
      }
      req.session.user = { name: user.name, password: user.password };
      res.status(200).json({ message: `로그인 성공!` });
    }
  );
});

// 관리자 로그인
app.post('/admin/login', (req, res) => {
  if (req.session.admin) {
    return res
      .status(401)
      .json({ message: '이미 관리자로 로그인 되어 있습니다.' });
  }

  const { name, password } = req.body;

  // 관리자 계정 확인 (id: admin, pw: admin)
  if (name === 'admin' && password === 'admin') {
    req.session.admin = { name: 'admin' };
    return res.status(200).json({ message: '관리자 로그인 성공!' });
  }

  res.status(401).json({ message: '관리자 로그인 실패!' });
});

app.get('/user', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: '로그인 필요' });
  }
  const { name } = user;
  res.status(200).json({ name });
});

// 관리자 체크
app.get('/admin/check', (req, res) => {
  if (req.session.admin) {
    return res.status(200).json({ admin: true });
  }
  res.status(200).json({ admin: false });
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

// 관리자 페이지 접근
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 관리자 상품 관리 페이지
app.get('/admin/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-products.html'));
});

app.get('/products-list', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: '서버 오류' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// 상품 추가 (관리자)
app.post('/admin/products', adminAuth, (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: '상품명과 가격을 입력해주세요.' });
  }

  db.run(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
      }

      res.status(201).json({
        id: this.lastID,
        name,
        price,
        message: '상품이 추가되었습니다.',
      });
    }
  );
});

// 상품 수정 (관리자)
app.put('/admin/products/:id', adminAuth, (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: '상품명과 가격을 입력해주세요.' });
  }

  db.run(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [name, price, productId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
      }

      res.status(200).json({
        id: productId,
        name,
        price,
        message: '상품이 수정되었습니다.',
      });
    }
  );
});

// 상품 삭제 (관리자)
app.delete('/admin/products/:id', adminAuth, (req, res) => {
  const productId = req.params.id;

  db.run('DELETE FROM products WHERE id = ?', [productId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '상품이 삭제되었습니다.' });
  });
});

app.post('/products/:id/cart', (req, res) => {
  const productId = req.params.id;
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: '로그인 필요' });
  }
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: '서버 오류' });
    }
    if (row) {
      const cart = req.session.cart || {};
      const { name, price } = row;
      cart[productId] = cart[productId] || { name, price, count: 0 };
      cart[productId].count += 1;
      req.session.cart = cart;
      res.status(200).json({
        message: `장바구니에 ${row.name}이(가) 추가되었습니다.`,
      });
      console.log('장바구니:', req.session.cart);
    } else {
      res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
  });
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/cart-list', (req, res) => {
  const cart = req.session.cart || {};
  const cartList = Object.entries(cart).map((item) => {
    const productId = item[0];
    const product = item[1];
    const { name, price, count } = product;
    return {
      id: productId,
      name: name,
      price: price,
      count: count,
    };
  });
  res.status(200).json(cartList);
});

// 장바구니 상품 수량 업데이트
app.post('/cart/:id/update', (req, res) => {
  const productId = req.params.id;
  const { count } = req.body; // 변경할 수량
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: '로그인 필요' });
  }
  if (!req.session.cart || !req.session.cart[productId]) {
    return res.status(404).json({ message: '장바구니에 없는 상품입니다.' });
  }
  if (typeof count !== 'number' || count < 1) {
    // 수량은 1 이상이어야 함
    return res.status(400).json({ message: '잘못된 수량입니다.' });
  }

  req.session.cart[productId].count = count;
  res.status(200).json({ message: '수량이 업데이트되었습니다.' });
  console.log('장바구니 업데이트:', req.session.cart);
});

// 장바구니 상품 삭제
app.delete('/cart/:id/delete', (req, res) => {
  const productId = req.params.id;
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: '로그인 필요' });
  }
  if (!req.session.cart || !req.session.cart[productId]) {
    return res.status(404).json({ message: '장바구니에 없는 상품입니다.' });
  }

  delete req.session.cart[productId]; // 해당 상품 삭제
  res.status(200).json({ message: '상품이 장바구니에서 삭제되었습니다.' });
  console.log('장바구니 삭제 후:', req.session.cart);
});

// 일반 사용자 로그아웃
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: '로그아웃 성공!' });
  });
});

// 관리자 로그아웃
app.get('/admin/logout', (req, res) => {
  req.session.admin = null;
  res.json({ message: '관리자 로그아웃 성공!' });
});

app.listen(PORT, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${PORT}`);
});
