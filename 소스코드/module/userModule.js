import { userDto, getUserPk} from "../dtoScript.js";
import { findArrayInLocalStorage, findObjectInLocalStorage, saveDataInLocalStorage, getCurDateString, dataKeyObj } from "./commonModule.js";


//saveUser({userNo: '1', zipCode: '2'});
/*
  User Data
*/
// 유저 저장 후 해당 Obj 반환
export function saveUser(userParam) {
  
  // userDto 깊은 복사
  const userObj = JSON.parse(JSON.stringify(userDto));

  // userParam 에 있는 값만 저장
  for (let key in userObj) {
      
      const paramVal = userParam.key;

      if (paramVal != null || paramVal != undefined) {
          userObj.key = paramVal;
      }
  }
  // userNo (PK) 값, password 및 일자 별도로 저장
  userObj.userNo = getUserPk();
  // 암호화하여 저장
  userObj.password = CryptoJS.SHA256(userParam.password).toString();
  userObj.registerDate = getCurDateString();
  userObj.registerTimestamp = Date.now();

  // 현재 userList 에 저장
  const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);
  userList.push(userObj);

  // 다시 저장
  saveDataInLocalStorage(dataKeyObj.USER_LIST, JSON.stringify(userList));

  // 추후에 필수값 여부 체크하는 로직 추가
  return userObj;
} 

// userNo (PK) 로 유저 정보 조회
export function findUserByUserNo(userNo) {

    // 로컬 스토리지에서 user-list 값 가져오기
    const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);
    
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
    const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);
    
    let userObj = {};
    
    for (let user of userList) {
      if (user.userId == userId) {
          userObj = user;
          break;
      } 
    }
    return userObj;
}

// ID 찾기
export function findUserId(email, telNumber) {

  const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);
  
  let userObj = {}
  for (let user of userList) {

    // 전화번호는 - 제외하고 비교
    // 첫번째 찾아지면 그냥 반환
    if (user.email == email && user.telNumber.replace("-", "") == telNumber.replace("-", "")) {
      userObj = user;
      break;
    } 
  }

  return userObj;
}

// user 정보 업데이트
export function updateUser(updateParam) {
  
  // 현재 접속중인 user 체크
  const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
    
  // userParam 에 있는 값만 저장
  for (let key in updateParam) {
      
      const paramVal = updateParam.key;

      if (paramVal != null || paramVal != undefined) {
          curUser.key = paramVal;
      }
  }  
  // user-list 해당 위치에 교체
  const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);

  let isSuccess = false;
  for (let idx in userList) {
    if (userList[idx].userNo == curUser.userNo) {
      userList[idx] = curUser;
      isSuccess = true;
    }
  }
  
  // 현재 접속중 상태도 같이 변경
  saveDataInLocalStorage(dataKeyObj.USER_LIST, userList);
  saveDataInLocalStorage(dataKeyObj.CUR_USER, curUser);

  return isSuccess;
} 

// 패스워드 변경 현재 비밀번호 다르면 false 반환
export function updateUserPassword(curPassword, newPassword) {

  const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
  
  if (curUser.password != CryptoJS.SHA256(curPassword).toString()) {
    return false;
  }

  // 비밀번호 일치하면 새로운 비밀번호로 업데이트
  curUser.password = CryptoJS.SHA256(newPassword).toString();

  const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);

  for (let idx in userList) {
    if (userList[idx].userNo == curUser.userNo) {
      userList[idx] = curUser;
      break;
    }
  }
  // 다시 저장
  saveDataInLocalStorage(dataKeyObj.USER_LIST, userList);
  saveDataInLocalStorage(dataKeyObj.CUR_USER, curUser);

  return true;
}

// user Info Check
// 로그인시에 입력한 id, password 를 이용하여 체크
// 유효한 데이터 있는경우는 localStorage에 현재 userDto 값 저장 후 true 반환
export function login(id, password) {

  const userObj = findUserByUserId(id);

  // 입력받은 비밀번호 SHA256 암호화 한후 비교
  const passwordEnc = CryptoJS.SHA256(password).toString();

  if (userObj != null && userObj != undefined) {
    // password 동일여부 비교
    if (userObj.password == passwordEnc) {
      // true 반환 후 localStrage에 현재 로그인한 유저정보 저장
      saveDataInLocalStorage(dataKeyObj.CUR_USER, userObj);
      return true;
    }
  }
  return false;
}

// 로그아웃처리 그냥 localStorage에 현재 유저정보 삭제
export function logout() {
  localStorage.removeItem(dataKeyObj.CUR_USER);
}

// 권한 설정 ( ADMIN 에게만 권한 부여 됨)
// 'admin' : 학사관리인 / 'teacher' : 교수 / 'student' : 학생
export function setUserAutor(userNo, author) {

  const targetUser = findUserByUserNo(userNo);

  if (targetUser != null && targetUser != undefined) {
    targetUser.userAuth = author
    return true;
  }
  // 조회 안되면 false 반환 예외처리 해야함
  return false;
}