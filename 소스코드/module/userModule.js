import { userDto, getUserPk} from "../dtoScript.js";
import { findArrayInLocalStorage } from "./commonModule.js";



/*
  User Data
*/
// create user
export function saveUser(userObj) {

} 

// Find user by userNo (PK)
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
// Find user by userId
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

// user Info Update
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


/*
  Board Data
*/



/*
  Message Data
*/