/*
  Common

*/
// 로컬스토리지에 있는 데이터 배열 찾아서 파싱후 반환
export function findArrayInLocalStorage(dataKey) {
  
  const tmpJson = localStorage.getItem(dataKey);
  let dataList = [];

  if (tmpJson != undefined && tmpJson != null) {
    dataList = JSON.parse(tmpJson);
  }

  return dataList;
}
