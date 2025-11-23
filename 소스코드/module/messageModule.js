import { messageDto, getMessagePk} from "../dtoScript.js";
import { dataKeyObj, findArrayInLocalStorage, saveDataInLocalStorage, findObjectInLocalStorage,  getCurDateString } from "./commonModule.js";


/*
  Message Data
*/

// 메시지 저장 후 해당 Obj 반환
export function saveMessage(messageParam) {

  // messageDto 깊은 복사
  const messageObj = JSON.parse(JSON.stringify(messageDto));

  
  for (let key in messageObj) {
      
      const paramVal = messageParam[key];

      if (paramVal != null && paramVal != undefined) {
          messageObj[key] = paramVal;
      }
  }

  // messageNo 및 일자는 별도로 저장
  messageObj.messageNo = getMessagePk();
  messageObj.insertDate = getCurDateString();
  messageObj.insertTimeStam = Date.now();

  const messageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);
  messageList.push(messageObj);

  // 다시 저장
  saveDataInLocalStorage(dataKeyObj.MESSAGE_LIST, messageList);

  return messageObj;
}

// messageNo (PK) 값으로 조회
export function findMessageByMessageNo(searchMessageNo) {
  const messageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);

  let messageObj = {};
  for (let message of messageList) {
    if (message.messageNo == searchMessageNo) {
      messageObj = message;
      break;
    }
  }

  return messageObj;
}

// 제목 검색 LIKE 검색 진행
export function findMessageListByTitle(searchTitle, isSend) {

  let searchMessageList = [];
  const messageList =  isSend ? findSendMessageList() : findRecieveMessageList();

  searchMessageList = messageList.filter((message) => {
    // 대문자 부분비교
    const messageTitle = message.title.toUpperCase();
    return (messageTitle.indexOf(searchTitle.toUpperCase()) != -1)
  }).sort((messageA, messageB) => { // 작성일 기준 내림차순
      const aDate = new Date(messageA.insertDate);
      const bDate = new Date(messageB.insertDate);
      return bDate - aDate;
  })

  return searchMessageList;
}

// 받은 메시지 목록
export function findRecieveMessageList() {
  let recevieMessageList = [];
  
  const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
  
  const messageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);
  
  recevieMessageList = messageList.filter((message) => {
    // 내가 수신자인 경우에 데이터들 가져오기
    return (message.receiveUserNo == curUser.userNo);
    
  }).sort((messageA, messageB) => {
      const aDate = new Date(messageA.insertDate);
      const bDate = new Date(messageB.insertDate);
      return bDate - aDate;
  })

  return recevieMessageList;
}

// 내가 보낸 메시지 목록
export function findSendMessageList() {
  let sendMessageList = [];

  const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
  const totalMessageList = findArrayInLocalStorage(dataKeyObj.MESSAGE_LIST);
  
  for (let message of totalMessageList) {
    if (message.sendUserNo == curUser.userNo) {
      sendMessageList.push(message);
    }
  }
  sendMessageList.sort((messageA, messageB) => {
      const aDate = new Date(messageA.insertDate);
      const bDate = new Date(messageB.insertDate);
      return bDate - aDate;
  })

  return sendMessageList;
}

export const messageCategory = {
  'MSG0001': '상담신청',
  'MSG0002': '성적관련',
  'MSG0003': '개인자료제출',
  'MSG0004': '츨결증빙자료제출',
  'MSG0005': '출결증명서신청',
  'MSG0006': '수강증명서신청',
  'MSG0099': '기타학사관련'
}