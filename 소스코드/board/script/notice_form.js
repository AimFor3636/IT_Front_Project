import {dataKeyObj, findObjectInLocalStorage} from "../../module/commonModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 


// 공통 값 세팅
const urlParams = new URLSearchParams(window.location.search);
// 안들어오면 null
const category = urlParams.get('category');
const boardNo = urlParams.get('boardNo');

// 초기 세팅
init();

function setBoardInfo() {
    
    const boardObj = BOARD_MODULE.findBoardByBoardNo(boardNo);
    
    // 존재하는 경우에만 세팅
    if (Object.keys(boardObj).length > 0) {
        // 글 배치
        document.getElementById('boardTitle').innerText = '게시글 수정';
        document.getElementById('title').value = boardObj.title;
        document.getElementById('contents').innerHTML = boardObj.content;
        document.getElementById('createBoard').innerText = '수정';
    }

}



function init() {

    document.getElementById('boardTitle').innerText = '게시글 작성';
    document.getElementById('createBoard').innerText = '작성';
    const categoryText = BOARD_MODULE.boardCategory[category];
    document.getElementById('category').innerText = categoryText;
    // category 도 없으면 그냥 무시
    if (category == null || category == undefined || category == '') {
        return;
    }

    // boardNo 들어오면 수정임, 없으면 신규 등록, 버튼 변경
    if (boardNo != null && boardNo != undefined) {
        setBoardInfo();
    }
}

// 신규 작성
function saveBoard() {

    // 유효성 체크
    if (!checkValid()) {
        return;
    }

    const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);

    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;

    // param 배치
    const boardParam = {};
    boardParam.title = title;
    boardParam.content = contents;
    boardParam.categoryNo = category;
    boardParam.userNo = curUser.userNo;

    const result = BOARD_MODULE.saveBoard(boardParam);

    // 성공
    if (result) {
        Swal.fire({
        title: "성공적으로 작성되었습니다.",
        icon: "success",
        }).then((result) => {
            routingPage();
        });
    } else {    // 실패
        Swal.fire({
        icon: "error",
        title: "게시글 작성 오류",
        text: "작성 과정에 오류가 발생하였습니다. 다시 시도해 주세요",
        });
    }
}

// 수정
function updateBoard() {

    // 유효성 체크
    if (!checkValid()) {
        return;
    }
    const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;

    // param 배치
    const boardParam = {};
    boardParam.title = title;
    boardParam.content = contents;
    boardParam.userNo = curUser.userNo;

    const result = BOARD_MODULE.updateBoard(boardParam);

    // 성공
    if (result) {
        Swal.fire({
        title: "성공적으로 수정되었습니다.",
        icon: "success",
        }).then((result) => {
            routingPage();
        });
    } else {  // 실패
        Swal.fire({
        icon: "error",
        title: "게시글 수정 오류",
        text: "수정 과정에 오류가 발생하였습니다. 다시 시도해 주세요",
        });
    }
}


// 유효성 검사
// 제목, 내용 빈칸 확인
function checkValid() {

    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;

    if (title == null || title.trim() == '') {
        
        Swal.fire({
        icon: "warning",
        title: "제목이 비어있습니다.",
        text: "제목에 내용을 입력해 주세요",
        });
        return false;
    }

    if (contents == null || contents.trim() == '') {
        Swal.fire({
        icon: "warning",
        title: "본문이 비어있습니다.",
        text: "본문에 내용을 입력해 주세요",
        });
        return false;
    }

    return true;
}

function routingPage() {

    let locationPath = '';

    switch(category) {
        case BOARD_MODULE.categoryMapping.NOTICE: 
            locationPath = './notice.html';
            break;
        case BOARD_MODULE.categoryMapping.IT_NOTICE:
            locationPath = './it_notice.html';
            break;
        case BOARD_MODULE.categoryMapping.IT_SCORE:
            locationPath = './it_score.html';
            break;
        case BOARD_MODULE.categoryMapping.JP_NOTICE:
            locationPath = './japanese_notice.html';
            break;
        case BOARD_MODULE.categoryMapping.JP_SCORE: 
            locationPath = './japanese_score.html';
            break;
        default: 
            locationPath = '../main_page.html';
    }
    window.location.href = locationPath;    
}



/*
    이벤트 리스너
 */

// 작성 or 수정 boardNo 존재여부로 판단
document.getElementById('createBoard').addEventListener('click', () => {
    
    // boardNo 없는 경우 신규 작성
    if (boardNo == null || boardNo == undefined) {
        saveBoard();
    } else { // 아니면 수정
        updateBoard();
    }

});


// 돌아가기
document.getElementById('goToList').addEventListener('click', () => {
    routingPage();
})