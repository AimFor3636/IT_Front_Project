import { updateUser} from '../../module/userModule.js';
import { dataKeyObj, findObjectInLocalStorage} from "../../module/commonModule.js";

// 1. 페이지 로딩 시: 현재 사용자 정보를 인풋창에 채워넣기
window.addEventListener('DOMContentLoaded', () => {
    const curUser = findObjectInLocalStorage(dataKeyObj.CUR_USER);

    if (curUser) {
        // (데이터가 없는 경우를 대비해 || "" 처리)
        document.getElementById('birthday').value = curUser.birthday || "";
        document.getElementById('phoneNumber').value = curUser.phoneNumber || "";
        document.getElementById('telNumber').value = curUser.telNumber || "";
        document.getElementById('emailAddress').value = curUser.email|| "";
        document.getElementById('zipCode').value = curUser.zipCode || "";
        document.getElementById('address').value = curUser.address || "";
        document.getElementById('detailAddress').value = curUser.detailAddress || "";
    }
});


// 2. 수정하기 버튼 클릭 이벤트
// [수정] HTML의 버튼 ID인 'formSubmitButton'으로 변경
const updateBtn = document.getElementById('formSubmitButton');

if (updateBtn) {
    updateBtn.addEventListener('click', function(e) {
        e.preventDefault(); // 폼의 기본 전송 기능 막기
        console.log(document.getElementById('birthday').value);
        // [수정] HTML에 있는 모든 필드 값을 객체로 만듭니다.
        // (User 객체의 속성명도 이와 같다고 가정합니다)
        const updateParam = {
            birthday: document.getElementById('birthday').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            telNumber: document.getElementById('telNumber').value,
            emailAddress: document.getElementById('emailAddress').value,
            zipCode: document.getElementById('zipCode').value,
            address: document.getElementById('address').value,
            detailAddress: document.getElementById('detailAddress').value
        };

        // 유효성 검사 (필수값 체크)
        // HTML에 (* 필수)라고 되어있는 birth, mobile, email만 체크
        if (!updateParam.birthday || !updateParam.phoneNumber || !updateParam.emailAddress) {
            Swal.fire({
                icon: "warning",
                title: "입력 오류",
                text: "필수 입력 항목(생년월일, 휴대폰, 이메일)을 확인해주세요.",
            });
            return;
        }

        // 모듈 함수 호출
        const result = updateUser(updateParam);

        if (result) {
            Swal.fire({
                icon: "success",
                title: "수정 완료",
                text: "개인정보가 성공적으로 수정되었습니다.",
                confirmButtonText: "확인"
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "수정 실패",
                text: "정보 업데이트 중 오류가 발생했습니다.",
            });
        }
    });
}