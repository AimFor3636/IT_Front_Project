import { messageDto, getMessagePk} from "../dtoScript.js";
import { dataKeyObj, findArrayInLocalStorage, findObjectInLocalStorage,  getCurDateString } from "./commonModule.js";


/*
  Message Data
*/

// 메시지 저장 후 해당 Obj 반환
export function saveMessage(messageParam) {

  // messageDto 깊은 복사
  const messageObj = JSON.parse(JSON.stringify(messageDto));

  
  for (let key in messageObj) {
      
      const paramVal = messageParam[key];

      if (paramVal != null || paramVal != undefined) {
          messageParam.key = paramVal;
      }
  }

  // messageNo 및 일자는 별도로 저장
  messageObj.messageNo = getMessagePk();
  messageObj.insertDate = getCurDateString();
  messageObj.insertTimeStamp = Date.now();

  const messageList = localStorage.getItem(dataKeyObj.MESSAGE_LIST);
  messageList.push(messageObj);

  // 다시 저장
  localStorage.setItem(dataKeyObj.MESSAGE_LIST, messageObj);

  return messageObj;
}

// messageNo (PK) 값으로 조회
export function getMessageByMessageNo(messageNo) {
  const messageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);

  let messageObj = {};
  for (let message of messageList) {
    if (message.messageNo == messageNo) {
      messageObj = message;
    }
  }

  return messageObj;
}

// 제목 검색 LIKE 검색 진행
export function getMessageListByTitle(searchTitle) {

  const searchMessageList = [];
  const messageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);

  for (let message of messageList) {

    // 대문자 부분비교
    const messageTitle = message.title.toUpperCase();
     
    // indexOf 있으면 첫번째 발견위치,  없으면 -1 반환
    if (messageTitle.indexOf(searchTitle.toUpperCase()) != -1) {
      searchMessageList.push(message);
    }
  }
  return searchMessageList;
}

// 받은 메시지 목록 ( 이 사이트는 수신인이 학사 관리인으로 정해져 있음 따라서 admin 인경우만 리스트 반환)
export function getRecieveMessageList() {
  const recevieMessageList = [];
  
  const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
  const adminUser = findObjectInLocalStorage(dataKeyObj.ADMIN_USER);

  // 둘이 같은경우만 message 반환 ( Admin 이 유일한 수신자이므로 그냥 전체 반환 )
  if (curUser.userNo == adminUser.userNo) {
    recevieMessageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);
  }
  return recevieMessageList;
}

// 내가 보낸 메시지 목록
export function getSendMessageList() {
  const sendMessageList = [];

  const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
  const totalMessageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);
  
  for (let message of totalMessageList) {
    if (message.sendUserNo == curUser.userNo) {
      sendMessageList.push(message);
    }
  }

  return sendMessageList;
}