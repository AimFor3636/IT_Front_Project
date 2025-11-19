import {userAuth, dataKeyObj, findObjectInLocalStorage, findArrayInLocalStorage, saveDataInLocalStorage} from "../../module/commonModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 


setBoardDetail();

/* 
    함수
*/
// 현재 글 세팅
function setBoardDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const boardNo = urlParams.get('boardNo');

    if (boardNo == null || boardNo == undefined) {
        return;
    }

    const boardObj = BOARD_MODULE.findBoardByBoardNo(boardNo);

    // 글 배치
    


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





/* 
   이벤트 리스너
*/