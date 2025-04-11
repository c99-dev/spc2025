const Parent = require('./Parent');
const Child = require('./Child');
const Sedan = require('./Sedan');

// 부모와 자녀 객체 생성
const dad = new Parent('철수', 45, '남성', '회사원');
const daughter = new Child('지연', 10, '여성', '초등학교 4학년');
const son = new Child('민수', 8, '남성', '초등학교 2학년');

// 가족 차량 생성
const familyCar = new Sedan('현대', '그랜저', '검정', 500);

// 시나리오 실행
familyCar.start();
dad.getInCar(familyCar);
dad.driveCar(familyCar);
daughter.getInCar(familyCar);
son.getInCar(familyCar);
daughter.playInCar();
son.playInCar();
familyCar.stop();

// 현대 그랜저가 시동을 걸었습니다.
// Sedan { brand: '현대', model: '그랜저', color: '검정', trunkSize: 500 }
// 철수이(가) 현대 그랜저에 탑승했습니다.
// 철수이(가) 현대 그랜저를 운전하고 있습니다.
// Sedan { brand: '현대', model: '그랜저', color: '검정', trunkSize: 500 }
// 지연이(가) 현대 그랜저에 탑승했습니다.
// Sedan { brand: '현대', model: '그랜저', color: '검정', trunkSize: 500 }
// 민수이(가) 현대 그랜저에 탑승했습니다.
// 지연이(가) 차 안에서 장난을 치고 있습니다.
// 민수이(가) 차 안에서 장난을 치고 있습니다.
// 현대 그랜저가 멈췄습니다.
