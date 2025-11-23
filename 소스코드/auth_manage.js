import {findUserAll, setUserAutor} from "./module/userModule.js";
import {dataKeyObj, userAuthMap, findObjectInLocalStorage} from "./module/commonModule.js";

// 권한 체크
fnCheckAuth();

// 권한 체크
function fnCheckAuth() {

    const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);

    // curUser 비어있거나,  admin 아니면 전부 권한없음으로 돌리기
    if (Object.keys(curUser).length == 0 || curUser.userAuth != userAuthMap.ADMIN) {
        window.location.href = './board/exception.html?reason=auth';
        return;
    }
    // 유저 리스트 세팅
    setUserList();

    // 버튼 태그 이벤트
    setBtnTagEvent();
}

// 유저 리스트 세팅
function setUserList() {

    const dataBodyTag = document.getElementById('data-body');

    dataBodyTag.innerHTML = '';

    const userList = findUserAll();

    userList.forEach((user) => {
        const trTag = document.createElement('tr');

        const noTag = document.createElement('td');
        const idTag = document.createElement('td');
        const nameTag = document.createElement('td');
        const mailTag = document.createElement('td');
        const authTag = document.createElement('td');
        const btnTag = document.createElement('td');

        noTag.innerText = user.userNo;
        idTag.innerText = user.userId;
        nameTag.innerText = user.userName;
        mailTag.innerText = user.emailAddress;

        const authOptions = [{auth: 'teacher', text: '교사'}, {auth: 'student', text: '학생'}];

        const optionTags = authOptions.map((option) => {
            const isSelect = user.userAuth == option.auth ? 'selected' : '';
            return `<option value="${option.auth}" ${isSelect}>${option.text}</option>`;
        });
        authTag.innerHTML = `<select name="userAuth" class="form-select">
                                ${optionTags}
                            </select>`
        btnTag.innerHTML = `<button type="button" class="btn btn-primary auth-change" style="background-color: #405189;">수정</button>`

        trTag.appendChild(noTag);
        trTag.appendChild(idTag);
        trTag.appendChild(nameTag);
        trTag.appendChild(mailTag);
        trTag.appendChild(authTag);
        trTag.appendChild(btnTag);

        dataBodyTag.appendChild(trTag);
    });
}

function setBtnTagEvent() {
    // 버튼 태그 이벤트
    const btnTagList = document.querySelectorAll('.auth-change');
    btnTagList.forEach((btnTag) => {
        btnTag.addEventListener('click', (e) => {
            const trTag = e.currentTarget.closest('tr');

            if (trTag) {
                const userNoTag = trTag.querySelector('td:first-child');
                const authTag = trTag.querySelector('[name="userAuth"]');

                const userNo = userNoTag.innerText;
                const userAuth = authTag.value;

                if (setUserAutor(userNo, userAuth)) {
                    Swal.fire({
                        title: "성공적으로 수정되었습니다.",
                        icon: "success",
                    }).then((result) => {
                        window.location.href = './auth_manage.html';
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "권한 수정 오류",
                        text: "오류가 발생하였습니다. 다시 시도해 주세요",
                    });
                }

            }
        })
    })
}

