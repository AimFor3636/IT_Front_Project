
import { findArrayInLocalStorage, saveDataInLocalStorage, dataKeyObj } from "./module/commonModule.js";

// SweetAlert 래퍼
function showMessage(title, text, icon = "info") {
  if (typeof Swal !== "undefined") {
    return Swal.fire(title, text, icon);
  } else {
    alert(title + "\n" + text);
    return Promise.resolve();
  }
}

// localStorage 에서 USER_LIST 안전하게 읽기
function loadUserList() {
  const key = dataKeyObj.USER_LIST;
  const raw = localStorage.getItem(key);

  if (!raw) {
    console.warn("USER_LIST 없음, 빈 배열 반환");
    return [];
  }

  // 1차: 일반적인 JSON 배열 형태인 경우
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // 2차: 문자열 안에 한 번 더 JSON 이 들어있는 경우
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
  const form = document.querySelector("form");
  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("checkbox");

  if (!form) {
    console.error("로그인 form을 찾을 수 없습니다.");
    return;
  }

  const REMEMBER_KEY = "rememberUserId";

  // ✅ 페이지 들어올 때: 저장된 아이디 있으면 자동 채우기
  const savedId = localStorage.getItem(REMEMBER_KEY);
  if (savedId) {
    userIdInput.value = savedId;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }

  // ✅ 로그인 폼 제출 이벤트
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = userIdInput.value.trim();
    const password = passwordInput.value;

    if (!userId) {
      await showMessage("로그인 실패", "아이디를 입력하세요.", "error");
      userIdInput.focus();
      return;
    }
    if (!password) {
      await showMessage("로그인 실패", "비밀번호를 입력하세요.", "error");
      passwordInput.focus();
      return;
    }

    // 1) localStorage에서 유저 목록 읽기
    const userList = loadUserList();
    console.log("현재 USER_LIST:", userList);

    // 2) 입력한 아이디와 일치하는 유저 찾기
    const user = userList.find((u) => u.userId === userId);

    if (!user) {
      await showMessage("로그인 실패", "존재하지 않는 아이디입니다.", "error");
      return;
    }

    // 3) 비밀번호 비교 (SHA256)
    const passwordEnc = CryptoJS.SHA256(password).toString();
    console.log("입력한 비번 해시:", passwordEnc);
    console.log("저장된 해시:", user.password);

    if (user.password !== passwordEnc) {
      await showMessage(
        "로그인 실패",
        "아이디 또는 비밀번호가 일치하지 않습니다.",
        "error"
      );
      return;
    }

    // 4) 현재 로그인한 유저 정보 저장 (CUR_USER)
    saveDataInLocalStorage(dataKeyObj.CUR_USER, user);

    // 5) 'id 기억하기' 체크 처리
    if (rememberCheckbox && rememberCheckbox.checked) {
      localStorage.setItem(REMEMBER_KEY, userId);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    // 6) 로그인 성공 → main.html 로 이동
    location.href = "./main_page.html";
  });
});