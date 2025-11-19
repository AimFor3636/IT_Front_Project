import { boardDto, getBoardPk} from "../dtoScript.js";
import { findArrayInLocalStorage, findObjectInLocalStorage, saveDataInLocalStorage, getCurDateString, dataKeyObj } from "./commonModule.js";


/*
  Board Data
*/

// 게시글 저장 후 해당 Obj 반환
export function saveBoard(boardParam) {
  
  // userDto 깊은 복사
  const boardObj = JSON.parse(JSON.stringify(boardDto));

  // userParam 에 있는 값만 저장
  for (let key in boardObj) {
      
      const paramVal = boardParam.key;

      if (paramVal != null && paramVal != undefined) {
          boardObj.key = paramVal;
      }
  }

  // boardNo, 생성, 조회일자 별도로 입력
  boardObj.boardNo = getBoardPk();
  boardObj.insertDate = getCurDateString();
  boardObj.updateDate = getCurDateString();
  boardObj.insertTimeStamp = Date.now();
  boardObj.updateTimeStamp = Date.now();

  const boardList = localStorage.getItem(dataKeyObj.BOARD_LIST);
  boardList.push(boardObj);

  // 다시 저장
  saveDataInLocalStorage(dataKeyObj.BOARD_LIST, boardList);

  return boardObj;
} 

// 게시글 수정 ( 제목, 내용, 수정일자 update)
export function updateBoard(updateParam) {

  const boardObj = getBoardByBoardNo(updateParam.boardNo);

  if (boardObj == null || boardObj == undefined) {
    return false;
  }
  boardObj.title = updateParam.title;
  boardObj.content = updateParam.content
  boardObj.updateDate = getCurDateString();
  boardObj.updateTimeStamp = Date.now();

  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  for (let idx in boardList) {
    if (boardList[idx].boardNo == boardObj.boardNo) {
      boardList[idx] = boardObj;
    }
  }
  saveDataInLocalStorage(dataKeyObj.BOARD_LIST, boardList);
  return true;
}

// boardNo (pk) 값으로 조회
export function findBoardByBoardNo(boardNo) {
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  let boardObj = {};

  for (let board of boardList) {
    if (board.boardNo == boardNo) {
      boardObj = board;
      break;
    } 
  }
  return boardObj;
}

export function findBoardByCategory(category) {
  
  let searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);
  
  searchBoardList = boardList.filter((board) => {
    return board.categoryNo == category; 
  }).sort((boardA, boardB) => { // 작성일 기준 내림차순
    return boardB.registerTimestamp - boardA.registerTimestamp;
  })

  return searchBoardList;
}

// 게시글 제목 조회 LIKE 검색
export function findBoardListByTitle(searchTitle, category) {

  let searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  searchBoardList = boardList.filter((board) => {
    // 대문자로 LIKE 검색
    const boardTitle = board.title.toUpperCase();
    return (boardTitle.indexOf(searchTitle.toUpperCase()) != -1 && board.categoryNo == category)
  }).sort((boardA, boardB) => { // 작성일 기준 내림차순
    return boardB.registerTimestamp - boardA.registerTimestamp;
  })


  return searchBoardList;
}

// 게시글 내용 조회 LIKE 검색
export function findBoardListByContent(searchContent, category) {

  let searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  searchBoardList = boardList.filter((board) => {
    // 대문자로 LIKE 검색
    const boardContent = board.content.toUpperCase();
    return (boardContent.indexOf(searchContent.toUpperCase()) != -1 && board.categoryNo == category)
  }).sort((boardA, boardB) => { // 작성일 기준 내림차순
    return boardB.registerTimestamp - boardA.registerTimestamp;
  })


  return searchBoardList;
}

// 게시글 userId 조회 일치하는 경우에만 검색
export function findBoardListByUserId(searchUserId, category) {

  let searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  searchBoardList = boardList.filter((board) => {
    
    // userId 일치하는 경우만 
    return (board.userId == searchUserId  && board.categoryNo == category);
  }).sort((boardA, boardB) => { // 작성일 기준 내림차순
    return boardB.registerTimestamp - boardA.registerTimestamp;
  })



  return searchBoardList;
}

export const categoryMapping = {
  NOTICE: 'board01',
  IT_NOTICE: 'board02',
  IT_SCORE: 'board03',
  JP_NOTICE: 'board04',
  JP_SCORE: 'board05'
}

export const boardCategory = {
  'board01': '공지사항',
  'board02': 'IT 게시판',
  'board03': 'IT 평가/과제 게시판',
  'board04': '일본어 게시판',
  'board05': '일본어 평가/과제 게시판'
}