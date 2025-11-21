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
    const sendUser = findUserByUserNo(messageObj.sendUserNo);

    // 발신자
    document.getElementById('userId').innerText = sendUser.userId;
    document.getElementById('userName').innerText = sendUser.userName;

    // 발신일
    document.getElementById('insertDate').innerText = messageObj.insertDate;
    // 제목
    document.getElementById('title').innerText = messageObj.title;
    // 내용
    document.getElementById('contents').innerHTML = messageObj.content;

}


/*
    이벤트 리스너
*/
document.getElementById('replyBtn').addEventListener('click', () => {
    window.location.href = `./message_form.html?messageNo=${messageNo}`;
})