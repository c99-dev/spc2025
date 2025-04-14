import Parent from './Parent.js';
import Child from './Child.js';
import Sedan from './Sedan.js';
import SUV from './SUV.js';

// 인스턴스 생성
const dad = new Parent('철수', 45, '남성', '회사원');
const mom = new Parent('영희', 42, '여성', '교사');
const daughter = new Child('지연', 10, '여성', '초등학교 4학년');
const son = new Child('민수', 8, '남성', '초등학교 2학년');
const uncle = new Parent('상철', 47, '남성', '의사');
const aunt = new Parent('미영', 40, '여성', '변호사');

const familySedan = new Sedan('현대', '그랜저', '검정', 500);
const familySUV = new SUV('기아', '쏘렌토', '흰색', 700);

// 세단
familySedan.drive(); // 시동 없이 운전
familySedan.start();

son.getInCar(familySedan);
son.driveCar(familySedan); // 어린이 운전

mom.getInCar(familySedan);
daughter.getInCar(familySedan);
dad.getInCar(familySedan);
dad.driveCar(familySedan); // 운전 시작

uncle.getInCar(familySedan); // 주행 중 탑승

familySedan.stop();
aunt.getInCar(familySedan); // 5인승 초과

// SUV
familySUV.start();
dad.driveCar(familySUV); // 탑승 안 한 상태에서 운전

dad.getInCar(familySUV);
mom.getInCar(familySUV);
daughter.getInCar(familySUV);
son.getInCar(familySUV);
uncle.getInCar(familySUV);
aunt.getInCar(familySUV);

dad.driveCar(familySUV);
familySUV.removePassenger(uncle); // 운전 중 하차

familySUV.stop();
