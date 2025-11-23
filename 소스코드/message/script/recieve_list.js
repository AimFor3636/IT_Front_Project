import { findUserByUserNo } from "../../module/userModule.js";
import * as MESSAGE_MODULE from "../../module/messageModule.js"; 

init();

/*
    함수
*/
// 현재 수신함은 Admin만 조회 가능
function setMessageList(messageList) {

    const prevBtnTag = document.querySelector('#fixed-header_previous');
    const nextdBtnTag = document.querySelector('#fixed-header_next');

    let messageCnt = messageList.length;
    const pagingTag = document.querySelector('.paginate_button.page-item.paging');

    let pagingCnt = Math.floor(messageCnt/10);
    if (messageCnt%10) {
        pagingCnt++;
    }

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

    // 글 10개 이하면 한페이지에서 끝남 따라서 prev , next 버튼 전부 감춤
    if (messageCnt < 10) {
        // invisible 없으면 추가
        if (!prevBtnTag.className.includes('invisible')) {
            prevBtnTag.classList.toggle('invisible');
        }
        if (!nextdBtnTag.className.includes('invisible')) {
            nextdBtnTag.classList.toggle('invisible');
        }
    }
    // 기본은 1페이지로 세팅
    setPaging(messageList, 1);

}

function setPaging(messageList, pageNum) {
    // 10개 단위
    const messageCnt = messageList.length;
    const prevBtnTag = document.querySelector('#fixed-header_previous');
    const nextdBtnTag = document.querySelector('#fixed-header_next');

    // 1페이지 (1 ~ 10 => 인덱스 기준 0 ~ 9)
    // 2페이지 (11 ~ 20 => 인덱스 기준 10 ~ 19)...
    const startNum = (pageNum-1)*10;
    const endNum = pageNum*10

    // 유효하지 않은 요청은 무시
    if (startNum > messageCnt) {
        return;
    }

    let isLastPage = false;
    // 마지막 페이지
    if (startNum <= messageCnt && messageCnt <= endNum) {
        isLastPage = true;
    }
    // 마지막페이지가 아니고, 첫번째 페이지라면 Next 만 노출
    if (pageNum == 1 && !isLastPage) {
        // invisible 없으면 추가
        if (!prevBtnTag.className.includes('invisible')) {
            prevBtnTag.classList.toggle('invisible');
        }
        // invisible 있으면 삭제
        if (nextdBtnTag.className.includes('invisible')) {
            nextdBtnTag.classList.toggle('invisible');
        }       
    } else if (pageNum != 1 && isLastPage) { // Prev 만 노출
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

    const dataBodyTag = document.getElementById('data-body');
    // slice (시작 인덱스, 종료 인덱스) 종료 인덱스는 포함 X
    const pagingmessageList = messageList.slice(startNum, endNum);
    dataBodyTag.innerHTML = '';

    // 데이터 세팅하여 추가
    let idx = 1;
    for (const message of pagingmessageList) {

        const curDataTag = document.createElement('tr');
        curDataTag.innerHTML = '';

        // 카테고리
        const categoryTag = document.createElement('td');
        categoryTag.innerText = MESSAGE_MODULE.messageCategory[message.categoryNo];

        // 제목
        const titleTag = document.createElement('td');
        const linkTag = document.createElement('a');
        linkTag.innerText = message.title;
        linkTag.href = `./recieve_detail.html?messageNo=${message.messageNo}`;
        titleTag.appendChild(linkTag);        

        // 발신자
        const sendNameTag = document.createElement('td');
        const sendUserObj = findUserByUserNo(message.sendUserNo); 
        sendNameTag.innerText = sendUserObj.userName;

        // 발신 일자
        const sendTimeTag = document.createElement('td');
        sendTimeTag.innerText = message.insertDate;
        
        curDataTag.appendChild(categoryTag);
        curDataTag.appendChild(titleTag);
        curDataTag.appendChild(sendNameTag);
        curDataTag.appendChild(sendTimeTag);

        curDataTag.id = `data-form-${idx}`;
        idx++;

        dataBodyTag.appendChild(curDataTag);
    }

    // 페이징 버튼 이벤트 세팅 페이징 버튼 동적생성되므로 다 생성 되고나서 부착
    setPagingBtn(messageList);
}

function setPagingBtn(messageList) {
    if (messageList.length == 0){
        return;
    }
    const pagingBtnList = document.querySelectorAll('.paginate_button.page-item.paging');
    
    // 페이징에 따른 이벤트 장착
    pagingBtnList.forEach((pagingBtn) => {
        const aTag = pagingBtn.querySelector('.page-link');
        const pagingNum = aTag.innerText;
        pagingBtn.addEventListener('click', () => {
            setPaging(messageList, pagingNum)
        })
    });

    const prevBtnTag = document.querySelector('#fixed-header_previous');
    const nextBtnTag = document.querySelector('#fixed-header_next');
    let pagingCnt = Math.floor(messageList.length/10);
    if (messageList.length%10) {
        pagingCnt++;
    }
    let curPagingNo = document.querySelector('.paging.active').querySelector('.page-link').innerText;
    curPagingNo = Number(curPagingNo);

    prevBtnTag.addEventListener('click', () => {
        if (curPagingNo > 1) {
            setPaging(messageList, curPagingNo-1);
        }
    })
    nextBtnTag.addEventListener('click', () => {
        if (curPagingNo < pagingCnt) {
            setPaging(messageList, curPagingNo+1);
        }
    })
}



function init() {
    // 최초 페이지 설정
    const searchList = MESSAGE_MODULE.findRecieveMessageList();
    // 데이터 세팅
    setMessageList(searchList);
}


/*
  이벤트 리스너
*/
// 글 검색
document.getElementById('searchFormButton').addEventListener('click', () => {
    
    const searchWord   = document.getElementById('searchWord').value;
    const searchList = MESSAGE_MODULE.findMessageListByTitle(searchWord, false);

    setMessageList(searchList);
});

document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
})