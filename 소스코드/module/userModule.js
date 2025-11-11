import { userDto, getUserPk} from "../dtoScript.js";
import { findArrayInLocalStorage } from "./commonModule.js";


saveUser({userNo: '1', zipCode: '2'});
/*
  User Data
*/
// create user
export function saveUser(userParam) {
  
  // userDto 깊은 복사
  const userObj = JSON.parse(JSON.stringify(userDto));

  // userParam 에 있는 값만 저장
  for (let key in userObj) {
      
      const paramVal = userParam[key];

      if (paramVal != null || paramVal != null) {
          userObj[key] = paramVal;
      }
  }
  // userNo (PK) 값 및 registerDate는 별도로 저장
  
} 

// userNo (PK) 로 유저 정보 조회
export function findUserByUserNo(userNo) {

    // 로컬 스토리지에서 user-list 값 가져오기
    const userList = findArrayInLocalStorage("user-list");
    
    let userObj = {};
    
    for (let user of userList) {
      if (user.userNo == userNo) {
          userObj = user;
          break;
      } 
    }
    return userObj;

}
// userId로 조회
export function findUserByUserId(userId) {

    // 로컬 스토리지에서 user-list 값 가져오기
    const userList = findArrayInLocalStorage("user-list");
    
    let userObj = {};
    
    for (let user of userList) {
      if (user.userId == userId) {
          userObj = user;
          break;
      } 
    }
    return userObj;
}

// user 정보 업데이트
export function updateUser(updateObj, userId) {
  
    const userObj = findUserByUserId(userId);
    
}

// user Info Check
// 로그인시에 입력한 id, password가 전부 동일한 데이터가 있는지 체크해서 true/false 반환
export function isPossibleToLogin(id, password) {

  const userObj = findUserByUserId(id);

  // 입력받은 비밀번호 SHA256 암호화 한후 비교
  const passwordEnc = CryptoJS.SHA256(password).toString();

  if (userObj != null && userObj != undefined) {
    if (userObj.password == passwordEnc) {
      return true;
    }
  }
  return false;
}