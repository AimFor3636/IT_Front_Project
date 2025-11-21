import {userAuth, dataKeyObj, findObjectInLocalStorage} from "../../module/commonModule.js";
import { findUserByUserId } from "../../module/userModule.js";
import * as MESSAGE_MODULE from "../../module/messageModule.js"; 


/*

    함수
    
*/
let curUser = '';
let sendUserNo = '';
let adminUser = '';
let receiveUserNo = '';

// 공통 값 세팅
const urlParams = new URLSearchParams(window.location.search);
// messageNo 가 인자로 들어오면 답장인것
const messageNo = urlParams.get('messageNo');

init();

// 권한 체크
// Admin 수신자 설정 가능
function checkAuth() {

    const recieveTag = document.getElementById('recieve-row');
    // d-none 없으면 추가
    if (!recieveTag.className.includes('d-none')) {
        recieveTag.classList.toggle('d-none');
    }

    if (curUser && curUser.userAuth == userAuth.ADMIN) {

        // 최초 메시지면 수신자 설정
        if (messageNo == null || messageNo == undefined || messageNo == '') {
            // d-none 있으면 삭제
            if (recieveTag.className.includes('d-none')) {
                recieveTag.classList.toggle('d-none');
            }
        } else {
            // 답장이면 수신자 설정버튼 없애고, 수신자 설정
            // d-none 없으면 추가
            if (!recieveTag.className.includes('d-none')) {
                recieveTag.classList.toggle('d-none');
            }
            
            const messageObj = MESSAGE_MODULE.findMessageByMessageNo(messageNo);

            receiveUserNo = messageObj.receiveUserNo;
            
        }

    }
}


function searchRecieveUser() {
    
    const searchText = document.getElementById('searchText').value.trim();

    const userObj = findUserByUserId(searchText);

    if (userObj) {
        Swal.fire({
        icon: "success",
        title: "조회 성공"
        });
        // 수신자 수정
        receiveUserNo = userObj.userNo;

    } else {
        Swal.fire({
        icon: "warning",
        title: "조회 실패",
        text: "해당 ID로 조회되는 유저가 없습니다.",
        });
        receiveUserNo = '';
    }

}

function init() { 
    curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);
    if (curUser) {
        sendUserNo = curUser.userNo;  // 현재 접속자
    }
    adminUser = findObjectInLocalStorage(dataKeyObj.ADMIN_USER);
    if (adminUser) {
        receiveUserNo = adminUser.userNo;     // 관리자만 수신자 설정 가능, 나머지는 고정
    }
    //  권한 체크
    checkAuth();

    const messageTitleTag = document.getElementById('messageTitle');
    // 답장이라면 답장으로 변경
    if (messageNo != null && messageNo != '') {
        messageTitleTag.innerText = '답장 보내기';
    } else {
        messageTitleTag.innerText = '메시지 보내기';
    }
}

function saveMessage() {

    // 유효성 체크
    if (!checkValid()) {
        return;
    }

    const messageType = document.getElementById('receiveUserNo').value;
    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;

    const messageParam = {};
    messageParam.title = title;
    messageParam.contents = contents;
    messageParam.categoryNo = messageType;
    messageParam.sendUserNo = sendUserNo;
    messageParam.receiveUserNo = receiveUserNo;

    const result = MESSAGE_MODULE.saveMessage(messageParam);

    // 성공
    if (result) {
        Swal.fire({
        title: "성공적으로 작성되었습니다.",
        icon: "success",
        }).then((result) => {
            window.location.href = './send_list.html';
        });
    } else {    // 실패
        Swal.fire({
        icon: "error",
        title: "게시글 작성 오류",
        text: "작성 과정에 오류가 발생하였습니다. 다시 시도해 주세요",
        });
    }

}


function checkValid() {
    const messageType = document.getElementById('receiveUserNo').value;
    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;

    if (messageType == null || messageType == '') {
        Swal.fire({
        icon: "warning",
        title: "메시지 종류 미선택",
        text: "메시지 종류를 선택해 주세요.",
        });
        return false;
    }

    if (title == null || title.trim() == '') {
        Swal.fire({
        icon: "warning",
        title: "제목 미입력",
        text: "메시지 제목을 입력해 주세요",
        });
        return false;
    }
 
    if (contents == null || contents.trim() == '') {
        Swal.fire({
        icon: "warning",
        title: "내용 미입력",
        text: "메시지 내용을 입력해 주세요.",
        });
        return false;
    }
    
    if (receiveUserNo == null || receiveUserNo == '') {
        Swal.fire({
        icon: "warning",
        title: "수신인 누락",
        text: "수신인이 누락되어있습니다. 확인해 주세요.",
        });
        return false;
    }    

    return true;

}
 
/*

 이벤트 리스너

*/

document.getElementById('searchUser').addEventListener('click', () => {
    searchRecieveUser();
})

document.getElementById('sendMessage').addEventListener('click', () => {
    saveMessage();
}) 