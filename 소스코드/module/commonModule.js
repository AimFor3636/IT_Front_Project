/*
  Common

*/

// 로컬스토리지에 있는 데이터 오브젝트 찾아서 파싱후 반환
export function findObjectInLocalStorage(dataKey) {
  
  const tmpJson = localStorage.getItem(dataKey);
  let dataObj = {};

  // 조회되는게 없으면 그냥 빈 오브젝트 반환
  if (tmpJson != undefined && tmpJson != null) {
    dataObj = JSON.parse(tmpJson);
  }
  return dataObj;
}



// 로컬스토리지에 있는 데이터 배열 찾아서 파싱후 반환
export function findArrayInLocalStorage(dataKey) {
  
  const tmpJson = localStorage.getItem(dataKey);
  let dataList = [];

  // 조회되는게 없으면 빈 배열 반환
  if (tmpJson != undefined && tmpJson != null) {
    dataList = JSON.parse(tmpJson);
  }

  return dataList;
}

// 현재 일자 yyyy-mm-dd hh:mm 형태로 반환
export function getCurDateString() {
  const today = new Date();
  const month = today.getMonth() < 10 ? `0${today.getMonth()}` : today.getMonth();
  const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();

  return `${today.getFullYear()}-${month}-${date} ${today.getHours()}:${today.getMinutes()}`;
}

// 유저 권한
export const dataKeyObj = {
  CUR_USER     : 'cur-user',       // 현재 로그인 유저
  CACHED_ID    : 'cached-id',      // 캐시에서 저장중인 ID
  ADMIN_USER   : 'admin-user',     // 학사 관리자
  USER_LIST    : 'user-list',      // 전체 유저 목록
  BOARD_LIST   : 'board-list',     // 전체 글 목록
  MESSAGE_LIST : 'message-list' // 전체 메시지 목록
}
