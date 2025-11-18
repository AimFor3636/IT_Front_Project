import {userAuth, dataKeyObj, findObjectInLocalStorage, findArrayInLocalStorage, saveDataInLocalStorage} from "../../module/commonModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 
import { saveUser } from "../../module/userModule.js";


/*
  함수
*/

// 권한 체크
function checkAuthority(){

    const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
    const authCheck = [userAuth.ADMIN, userAuth.TEACHER];

    const createBtnTag = document.getElementById('createBoard');
    // 클래스 이름 전체가 나옴
    const curClass = createBtnTag.className;         
    
    // ADMIN, TEACHER 의 경우 글 생성 버튼 노출
    if (authCheck.includes(curUser.userAuth)) {
        // invisible 있으면 제거
        if (curClass.includes('invisible')) {
            createBtnTag.classList.toggle('invisible');
        } 
    } else {
        // invisible 없으면 추가
        if (!curClass.includes('invisible')) {
            createBtnTag.classList.toggle('invisible');
        } 
    }

}









/*
  이벤트 리스너
*/

// 검색
document.getElementById('searchFormButton').addEventListener('click', () => {

}); 

// 글 작성
document.getElementById('createBoard').addEventListener('click', () => {
  
  window.location.href = `./score_form.html?category=${BOARD_MODULE.categoryMapping.JP_SCORE}`;

});


