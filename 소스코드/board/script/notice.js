import {userAuth, dataKeyObj, findObjectInLocalStorage, findArrayInLocalStorage, saveDataInLocalStorage} from "../../module/commonModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 
import { saveUser } from "../../module/userModule.js";  // 테스트용 테스트후 삭제




// 테스트용
fnTest();

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

// 글 검색
document.getElementById('searchFormButton').addEventListener('click', () => {
    
    const searchOption = document.getElementById('searchType').value;
    const searchWord   = document.getElementById('searchWord').value;

    const searchList = [];
    switch (searchOption) {
        case 'title': searchList = BOARD_MODULE.findBoardListByTitle(searchWord);
                    break;
        case 'contents': searchList = BOARD_MODULE.findBoardListByContent(searchWord); 
                    break;
        case 'createId': searchList = BOARD_MODULE.findBoardListByUserId(searchWord); 
                    break;
    }
    // 글 배치
    setBoardList(searchList);
});

function setBoardList() {

}


function fnTest() {
    localStorage.clear();

    const userObj = {
        userNo: '',         // 유저 PK 값
        userName: '이상우',       // 성함
        userId: 'okqwaszx',         // 유저 ID
        password: '123123',       // 비밀번호 (암호화)
        emailAddress: 'okqwaszx123@naver.com',   // 이메일 (암호화)
        birthday: '19920626',       // 생년월일
        telNumber: '',      // 전화번호
        phoneNumber: '01053562594',    // 핸드폰 번호
        zipCode: '12312',        // 우편 주소
        address: '우리집 어디게',        // 주소
        userAuth: userAuth.ADMIN,     // 권한
        registerDate: '',   // 가입 일자
        registerTimestamp: "", // 정렬용 일자
    };

    saveUser(userObj);
    saveDataInLocalStorage(dataKeyObj.CUR_USER, userObj);

}

function init() {
    
}