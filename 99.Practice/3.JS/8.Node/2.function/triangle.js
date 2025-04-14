/**
 * 다양한 삼각형 패턴을 출력하는 함수 모음
 */
const triangle = {
  /**
   * 왼쪽 정렬 오름차순 삼각형 (*)
   * @param {number} rows 삼각형의 행 수
   */
  leftAsc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log('*'.repeat(i));
    }
  },

  /**
   * 왼쪽 정렬 내림차순 삼각형 (*)
   * @param {number} rows 삼각형의 행 수
   */
  leftDesc: function (rows = 5) {
    for (let i = rows; i >= 1; i--) {
      console.log('*'.repeat(i));
    }
  },

  /**
   * 오른쪽 정렬 오름차순 삼각형 (*)
   * @param {number} rows 삼각형의 행 수
   */
  rightAsc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(rows - i) + '*'.repeat(i));
    }
  },

  /**
   * 오른쪽 정렬 내림차순 삼각형 (*)
   * @param {number} rows 삼각형의 행 수
   */
  rightDesc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(i - 1) + '*'.repeat(rows - i + 1));
    }
  },

  /**
   * 이등변 오름차순 삼각형 (*)
   * @param {number} rows 삼각형의 행 수
   */
  isoscelesAsc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(rows - i) + '*'.repeat(2 * i - 1));
    }
  },

  /**
   * 이등변 내림차순 삼각형 (*)
   * @param {number} rows 삼각형의 행 수
   */
  isoscelesDesc: function (rows = 5) {
    for (let i = 1; i <= rows; i++) {
      console.log(' '.repeat(i - 1) + '*'.repeat(2 * (rows - i) + 1));
    }
  },

  /**
   * 모든 삼각형 패턴을 연속해서 출력
   * @param {number} rows 삼각형의 행 수
   */
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

// 기본값으로 모든 삼각형 패턴 출력
const rows = 5;
triangle.printAll(rows);
