
// 1. userModule.js에서 함수 가져오기
import { updateUserPassword } from '../../module/userModule.js';

// 2. 버튼 요소 가져오기
const btn = document.getElementById('changePwdBtn');

// 3. 클릭 이벤트 연결
btn.addEventListener('click', function(event) {
    event.preventDefault(); // 폼 전송(새로고침) 막기

    // ID 대소문자 수정됨 (current-password, new-password)
    const curPwdInput = document.getElementById('current-password');
    const newPwdInput = document.getElementById('new-password');
    const confirmPwdInput = document.getElementById('confirm-password'); // 확인용 비밀번호

    const curPwd = curPwdInput.value;
    const newPwd = newPwdInput.value;
    const confirmPwd = confirmPwdInput.value;

    // 유효성 검사 1: 빈 값 체크
    if (!curPwd || !newPwd) {
        Swal.fire({
            icon: "error",    // 에러 aler면 요거 사용
            title: "입력 오류",    // 요건 타이틀
            text: "입력하지 않은 부분이 있습니다.",  // 요게 내용
        });
        return;
    }

    // 유효성 검사 2: 새 비밀번호와 확인 비밀번호 일치 여부
    if (newPwd !== confirmPwd) {
        Swal.fire({
            icon: "error",    // 에러 aler면 요거 사용
            title: "신규 비밀번호 불일치",    // 요건 타이틀
            text: "변경 할 비빌번호를 다시 확인하세요.",  // 요게 내용
        });
        return;
    }

    // 4. 모듈 함수 실행
    const result = updateUserPassword(curPwd, newPwd);

    if (result === false) {
        alert("현재 비밀번호가 틀렸습니다.");
    } else {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        window.location.href = '../main_page.html';
    }
});