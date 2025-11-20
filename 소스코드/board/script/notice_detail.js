import {userAuth, dataKeyObj, findObjectInLocalStorage, findArrayInLocalStorage, saveDataInLocalStorage} from "../../module/commonModule.js";
import { findUserByUserNo } from "../../module/userModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 


// 공통 값 세팅
const urlParams = new URLSearchParams(window.location.search);
const boardNo = urlParams.get('boardNo');
const boardObj = BOARD_MODULE.findBoardByBoardNo(boardNo);

setBoardDetail();

/* 
    함수
*/
// 현재 글 세팅
function setBoardDetail() {

    if (boardNo == null || boardNo == undefined) {
        return;
    }
    const userObj = findUserByUserNo(boardObj.userNo);
    const boardCount = boardObj.boardCount;
    const categoryText = BOARD_MODULE.boardCategory[boardObj.categoryNo];

    // 글 배치
    document.getElementById('boardTitle').innerText = boardObj.title;
    document.getElementById('category').innerText = categoryText;
    document.getElementById('userName').innerText = userObj.userName;
    document.getElementById('userId').innerText = userObj.userId;
    document.getElementById('insertDate').innerText = boardObj.insertDate;
    document.getElementById('boardCount').innerText = boardCount+1;
    document.getElementById('contents').innerHTML = boardObj.content;   

    // 카운팅
    BOARD_MODULE.addBoardCount(boardObj);

    // 존재하면 권한 세팅 및 내부 정보 세팅
    checkAuthority(boardObj);
    
}


// 권한 체크
// 본인 글일 때만 수정, 삭제 가능
function checkAuthority(boardObj) {
    
    // boardObj 비어있으면 그냥 버튼 가리고 종료
    if (!boardObj) {
        // 없으면 추가
        if (!btnGroup.className.includes('invisible')) {
            btnGroup.classList.toggle('invisible');
        }
        return;        
    }

    const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
    const btnGroup = document.getElementById('detailBtnGroup');
    
    // 작성자 본인일때만 버튼 노출
    if (curUser.userNo = boardObj.userNo) {
        // 있으면 제거
        if (btnGroup.className.includes('invisible')) {
            btnGroup.classList.toggle('invisible');
        }
    } else {
        // 없으면 추가
        if (!btnGroup.className.includes('invisible')) {
            btnGroup.classList.toggle('invisible');
        }  
    }
}

function routingPage() {
    let locationPath = '';
    if (!boardObj) {
        locationPath = '../main_page.html';
    } else {
        const category = boardObj.categoryNo;
        
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
    }
    window.location.href = locationPath;    
}



/* 
   이벤트 리스너
*/

// 수정
document.getElementById('updateBoard').addEventListener('click', () => {
    
    if (!boardObj) {
        return;
    }
    const category = boardObj.categoryNo;

    // form 페이지로 전환
    window.location.href = `./notice_form.html?category=${category}&boardNo=${boardNo}`

})

// 삭제
document.getElementById('deleteBoard').addEventListener('click', () => {

    Swal.fire({
        title: '삭제 확인',
        text: '해당 글을 삭제하시겠습니까?',
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: '삭제'
    }).then((result) => {
        if (result.isDenied) {
            BOARD_MODULE.deleteBoard(boardObj);
            Swal.fire('성공적으로 삭제되었습니다.', '', 'success').then((result) => {
                // 페이지 이동
                routingPage();
            });
        }
    });
})