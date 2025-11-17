import { findUserByUserId } from "./module/userModule.js";

// 공통 알림 함수: Swal 있으면 Swal, 없으면 alert
function showMessage(title, text, icon) {
  if (typeof Swal !== "undefined") {
    Swal.fire(title, text, icon);
  } else {
    alert(title + "\n" + text);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("findIdForm");

  if (!form) {
    console.error("findIdForm을 찾을 수 없습니다.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // 새로고침 막기

    const email = document.getElementById("userId").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim(); // 필요하면 사용

    if (!email || !phone) {
      showMessage("입력 오류", "이메일과 전화번호를 모두 입력하세요.", "warning");
      return;
    }

    // 여기서 userModule.js의 함수 호출
    const user = findUserByUserId(email);

    console.log("조회 결과:", user); // 콘솔 확인용

    if (!user || !user.userId) {
      showMessage("조회 실패", "일치하는 계정을 찾을 수 없습니다.", "error");
      return;
    }

    showMessage("아이디 찾기 결과", `당신의 아이디는 ${user.userId} 입니다.`, "success");
  });
});