import { findUserByUserNo } from "../../module/userModule.js";
import * as MESSAGE_MODULE from "../../module/messageModule.js"; 



// 공통 값 세팅
const urlParams = new URLSearchParams(window.location.search);
// 안들어오면 null
const messageNo = urlParams.get('messageNo');

// 배치하고 끝
setMessage();

function setMessage() {

    if (messageNo == null || messageNo ==  '') {
        return;
    }

    const messageObj = MESSAGE_MODULE.findMessageByMessageNo(messageNo);
    const recieveUser = findUserByUserNo(messageObj.receiveUserNo);

    // 수신자
    document.getElementById('userId').innerText = recieveUser.userId;
    document.getElementById('userName').innerText = recieveUser.userName;

    // 발신일
    document.getElementById('insertDate').innerText = messageObj.insertDate;
    // 제목
    document.getElementById('title').innerText = messageObj.title;
    // 내용
    document.getElementById('contents').innerHTML = messageObj.content;

}
