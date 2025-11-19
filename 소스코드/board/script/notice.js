import {userAuth, dataKeyObj, findObjectInLocalStorage, findArrayInLocalStorage, saveDataInLocalStorage} from "../../module/commonModule.js";
import * as BOARD_MODULE from "../../module/boardModule.js"; 
import { saveUser } from "../../module/userModule.js";  // 테스트용 테스트후 삭제


// 초기 세팅
init();

// 테스트용
test();

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

// 글 검색
document.getElementById('searchFormButton').addEventListener('click', () => {
    
    const searchOption = document.getElementById('searchType').value;
    const searchWord   = document.getElementById('searchWord').value;

    const searchList = [];
    switch (searchOption) {
        case 'title': searchList = BOARD_MODULE.findBoardListByTitle(searchWord, BOARD_MODULE.categoryMapping.NOTICE);
                    break;
        case 'contents': searchList = BOARD_MODULE.findBoardListByContent(searchWord, BOARD_MODULE.categoryMapping.NOTICE); 
                    break;
        case 'createId': searchList = BOARD_MODULE.findBoardListByUserId(searchWord, BOARD_MODULE.categoryMapping.NOTICE); 
                    break;
    }
    setBoardList(searchList);
});

// 글 배치
function setBoardList(boardList) {
    
    const prevBtnTag = document.querySelector('#fixed-header_previous');
    const nextdBtnTag = document.querySelector('#fixed-header_next');

    let boardCnt = boardList.length;
    //boardCnt = 35;
    const pagingTag = document.querySelector('.paginate_button.page-item.paging');

    // 글 10개 이하면 한페이지에서 끝남 따라서 prev , next 버튼 전부 감춤
    if (boardCnt < 10) {
        // invisible 없으면 추가
        if (!prevBtnTag.className.includes('invisible')) {
            prevBtnTag.classList.toggle('invisible');
        }
        if (!nextdBtnTag.className.includes('invisible')) {
            nextdBtnTag.classList.toggle('invisible');
        }                        
    } else {   

        const pagingCnt = Math.floor(boardCnt/10);
        
        const pagingBodyTag = document.getElementById('paging-body');
        pagingBodyTag.innerHTML = '';

        pagingBodyTag.appendChild(prevBtnTag);
        for (let i = 0; i < pagingCnt; i++) {
            const nPagingTag = pagingTag.cloneNode(true);
            const nATag = nPagingTag.querySelector('.page-link');
            nATag.innerText = i+1;
            
            pagingBodyTag.appendChild(nPagingTag);
        }
        pagingBodyTag.appendChild(nextdBtnTag);

        // 1페이지로 세팅
        setPaging(boardList, 1);
    }
}

function setPaging(boardList, pageNum) {
    // 10개 단위
    const boardCnt = boardList.length;
    const prevBtnTag = document.querySelector('#fixed-header_previous');
    const nextdBtnTag = document.querySelector('#fixed-header_next');

    // 1페이지 (1 ~ 10 => 인덱스 기준 0 ~ 9)
    // 2페이지 (11 ~ 20 => 인덱스 기준 10 ~ 19)...
    const startNum = (pageNum-1)*10;
    const endNum = pageNum*10

    // 유효하지 않은 요청은 무시
    if (startNum > boardCnt) {
        return;
    }

    let isLastPag = false;
    // 마지막 페이지
    if (startNum < boardCnt && boardCnt <= endNum) {
        isLastPag = true;
    }

    // slice (시작 인덱스, 종료 인덱스) 종료 인덱스는 포함 X
    const pagingList = boardList.slice(startNum, endNum);

    // 첫번째 페이지라면 Next 만 노출
    if (pageNum == 1) {
        // invisible 없으면 추가
        if (!prevBtnTag.className.includes('invisible')) {
            prevBtnTag.classList.toggle('invisible');
        }
        // invisible 있으면 삭제
        if (nextdBtnTag.className.includes('invisible')) {
            nextdBtnTag.classList.toggle('invisible');
        }       
    } else if (isLastPag) { // Prev 만 노출
        // invisible 있으면 삭제
        if (prevBtnTag.className.includes('invisible')) {
            prevBtnTag.classList.toggle('invisible');
        }
        // invisible 없으면 추가
        if (!nextdBtnTag.className.includes('invisible')) {
            nextdBtnTag.classList.toggle('invisible');
        }  
    } else { // 버튼 둘다 노출
        // invisible 없으면 추가
        if (!prevBtnTag.className.includes('invisible')) {
            prevBtnTag.classList.toggle('invisible');
        }
        // invisible 없으면 추가
        if (!nextdBtnTag.className.includes('invisible')) {
            nextdBtnTag.classList.toggle('invisible');
        }  
    }

    // 현재 페이지만 active 처리
    const pagingTag = document.querySelectorAll('.paginate_button.page-item.paging');
    
    pagingTag.forEach((curPageTag) => {
        const aTag = curPageTag.querySelector('.page-link');
        console.log(aTag);
        if (aTag.innerText == pageNum) {
            // active 없으면 추가
            if (!curPageTag.className.includes('active')) {
                curPageTag.classList.toggle('active');
            }          
        } else {
            // active 있으면 삭제
            if (curPageTag.className.includes('active')) {
                curPageTag.classList.toggle('active');
            }          
        }
    })

}

function test() {
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
    // 최초 페이지 설정
    const searchList = BOARD_MODULE.findBoardByCategory(BOARD_MODULE.categoryMapping.NOTICE);
    setBoardList(searchList);

}

/*
  이벤트 리스너
*/

// 검색
document.getElementById('searchFormButton').addEventListener('click', () => {

}); 

// 글 작성
document.getElementById('createBoard').addEventListener('click', () => {
  
  window.location.href = `./notice_form.html?category=${BOARD_MODULE.categoryMapping.NOTICE}`;

});