const triangle = {
  leftAsc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log('*'.repeat(i));
    }
  },

  leftDesc: function (rows = 5) {
    for (let i = rows; i >= 1; i--) {
      console.log('*'.repeat(i));
    }
  },

  rightAsc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(rows - i) + '*'.repeat(i));
    }
  },

  rightDesc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(i - 1) + '*'.repeat(rows - i + 1));
    }
  },

  isoscelesAsc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(rows - i) + '*'.repeat(2 * i - 1));
    }
  },

  isoscelesDesc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(i - 1) + '*'.repeat(2 * (rows - i) + 1));
    }
  },

  printAll: function (rows = 5) {
    this.leftAsc(rows);
    console.log('');
    this.leftDesc(rows);
    console.log('');
    this.rightAsc(rows);
    console.log('');
    this.rightDesc(rows);
    console.log('');
    this.isoscelesAsc(rows);
    console.log('');
    this.isoscelesDesc(rows);
  },
};

const rows = 5;
triangle.printAll(rows);
