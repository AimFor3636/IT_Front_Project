import { boardDto, getBoardPk} from "../dtoScript.js";
import { findArrayInLocalStorage, findObjectInLocalStorage,  getCurDateString, dataKeyObj } from "./commonModule.js";


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

      if (paramVal != null || paramVal != undefined) {
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
  localStorage.setItem(dataKeyObj.BOARD_LIST, boardList);

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
  localStorage.setItem(dataKeyObj.BOARD_LIST, boardList);
  
  return true;
}

// boardNo (pk) 값으로 조회
export function getBoardByBoardNo(boardNo) {
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

// 게시글 제목 조회 LIKE 검색
export function getBoardListByTitle(searchTitle) {

  const searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  for (let board of boardList) {

    // 대문자 부분비교
    const boardTitle = board.title.toUpperCase();
     
    // indexOf 있으면 첫번째 발견위치,  없으면 -1 반환
    if (boardTitle.indexOf(searchTitle.toUpperCase()) != -1) {
      searchBoardList.push(board);
    }
  }
  return searchBoardList;
}

// 게시글 내용 조회 LIKE 검색
export function getBoardListByTitle(searchContent) {

  const searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  for (let board of boardList) {

    // 대문자 부분비교
    const boardContent = board.content.toUpperCase();
     
    // indexOf 있으면 첫번째 발견위치,  없으면 -1 반환
    if (boardContent.indexOf(searchContent.toUpperCase()) != -1) {
      searchBoardList.push(board);
    }
  }
  return searchBoardList;
}

// 게시글 userId 조회 일치하는 경우에만 검색
export function getBoardListByTitle(searchUserId) {

  const searchBoardList = [];
  const boardList = findArrayInLocalStorage(dataKeyObj.BOARD_LIST);

  for (let board of boardList) {

    // userId 일치하는 경우만 
    if (board.userId == searchUserId) {
      searchBoardList.push(board);
    }
  }
  return searchBoardList;
}

