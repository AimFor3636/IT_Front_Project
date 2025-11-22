
import { dataKeyObj } from "./module/commonModule.js";

// 공통 알림 함수: Swal 있으면 Swal, 없으면 alert
function showMessage(title, text, icon) {
  if (typeof Swal !== "undefined") {
    return Swal.fire(title, text, icon);
  } else {
    alert(title + "\n" + text);
  }
}

// USER_LIST 읽는 헬퍼 (login.js와 비슷하게)
function loadUserList() {
  const key = dataKeyObj.USER_LIST;
  const raw = localStorage.getItem(key);

  if (!raw) {
    console.warn("USER_LIST 없음, 빈 배열 반환");
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (typeof parsed === "string") {
      const parsed2 = JSON.parse(parsed);
      if (Array.isArray(parsed2)) {
        return parsed2;
      }
    }
  } catch (e) {
    console.error("USER_LIST 파싱 에러:", e, raw);
  }

  console.warn("USER_LIST 형식 이상함, 빈 배열로 처리");
  return [];
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("findIdForm");

  if (!form) {
    console.error("findIdForm을 찾을 수 없습니다.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // 새로고침 막기

    // HTML에서 id="userId"지만 실제로는 'email'로 사용 중
    const email = document.getElementById("userId").value.trim();
    const phoneInput = document.getElementById("phoneNumber").value.trim();

    if (!email || !phoneInput) {
      showMessage("입력 오류", "이메일과 전화번호를 모두 입력하세요.", "warning");
      return;
    }

    // 숫자만 추출 (010-1234-5678, 공백 등 방지)
    const phone = phoneInput.replace(/[^0-9]/g, "");

    // USER_LIST 에서 email + phoneNumber 로 검색
    const userList = loadUserList();
    console.log("현재 USER_LIST:", userList);

    const user = userList.find(
      (u) =>
        (u.emailAddress === email || u.email === email) && // emailAddress 또는 email 둘 다 대응
        (u.phoneNumber === phone ||
          (u.telNumber && u.telNumber.replace(/[^0-9]/g, "") === phone))
    );

    console.log("조회 결과:", user);

    if (!user || !user.userId) {
      showMessage("조회 실패", "일치하는 계정을 찾을 수 없습니다.", "error");
      return;
    }

    showMessage(
      "아이디 찾기 결과",
      `회원님의 아이디는 "${user.userId}" 입니다.`,
      "success"
    );
  });
});