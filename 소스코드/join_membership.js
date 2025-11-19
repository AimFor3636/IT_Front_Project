// join_membership.js
import { saveUser, findUserByUserId } from "./module/userModule.js";
import { dataKeyObj } from "./module/commonModule.js";

// SweetAlert 래퍼
function showMessage(title, text, icon = "info") {
  if (typeof Swal !== "undefined") {
    return Swal.fire(title, text, icon);
  } else {
    alert(title + "\n" + text);
    return Promise.resolve();
  }
}

// 에러 표시/삭제 함수 (Bootstrap용)
function showError(input, message) {
  if (!input) return;
  input.classList.add("is-invalid");
  const feedback = input.nextElementSibling;
  if (feedback && feedback.classList.contains("invalid-feedback")) {
    feedback.textContent = message;
  }
}

function clearError(input) {
  if (!input) return;
  input.classList.remove("is-invalid");
}

// 실제 검증 로직
function validateForm({
  userId,
  userIdConfirm,
  password,
  birth,
  phone,
  tel,
  email,
  zipcode,
}) {
  let valid = true;

  // ✅ 아이디 (영문/숫자 4~20)
  const idRegex = /^[a-zA-Z0-9_]{4,20}$/;
  if (!userId.value.trim()) {
    showError(userId, "아이디를 입력하세요.");
    valid = false;
  } else if (!idRegex.test(userId.value.trim())) {
    showError(userId, "아이디는 영문/숫자 4~20자리로 입력하세요.");
    valid = false;
  } else {
    clearError(userId);
  }

  // ✅ 아이디 확인 (동일 여부)
  if (!userIdConfirm.value.trim()) {
    showError(userIdConfirm, "아이디를 한 번 더 입력하세요.");
    valid = false;
  } else if (userId.value.trim() !== userIdConfirm.value.trim()) {
    showError(userIdConfirm, "아이디가 일치하지 않습니다.");
    valid = false;
  } else {
    clearError(userIdConfirm);
  }

  // ✅ 비밀번호 (6자리 이상)
  if (!password.value) {
    showError(password, "비밀번호를 입력하세요.");
    valid = false;
  } else if (password.value.length < 6) {
    showError(password, "비밀번호는 6자리 이상으로 입력하세요.");
    valid = false;
  } else {
    clearError(password);
  }

  // ✅ 생년월일
  if (!birth.value) {
    showError(birth, "생년월일은 필수 입력 항목입니다.");
    valid = false;
  } else {
    const birthDate = new Date(birth.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(birthDate.getTime())) {
      showError(birth, "올바른 생년월일을 선택하세요.");
      valid = false;
    } else if (birthDate > today) {
      showError(birth, "생년월일은 오늘 이후일 수 없습니다.");
      valid = false;
    } else {
      clearError(birth);
    }
  }

  // ✅ 휴대폰 번호 (필수, 숫자 10~11자리)
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phone.value) {
    showError(phone, "휴대폰 번호는 필수입니다.");
    valid = false;
  } else if (!phoneRegex.test(phone.value)) {
    showError(phone, "휴대폰 번호는 숫자 10~11자리여야 합니다.");
    valid = false;
  } else {
    clearError(phone);
  }

  // 🔹 전화번호 (선택)
  const telRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
  if (tel.value && !telRegex.test(tel.value)) {
    showError(tel, "전화번호는 000-0000-0000 형식입니다.");
    valid = false;
  } else {
    clearError(tel);
  }

  // ✅ 이메일 (필수)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    showError(email, "이메일은 필수 입력 항목입니다.");
    valid = false;
  } else if (!emailRegex.test(email.value)) {
    showError(email, "올바른 이메일 주소를 입력하세요.");
    valid = false;
  } else {
    clearError(email);
  }

  // 🔹 우편번호 (선택)
  const zipRegex = /^[0-9]{5}$/;
  if (zipcode.value && !zipRegex.test(zipcode.value)) {
    showError(zipcode, "우편번호는 숫자 5자리입니다.");
    valid = false;
  } else {
    clearError(zipcode);
  }

  return valid;
}

// DOM 준비 후 실행
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("joinForm");

  const userId = document.getElementById("userId");
  const userIdConfirm = document.getElementById("userIdConfirm");
  const password = document.getElementById("userPassword");

  const birth = document.getElementById("birthday");
  const phone = document.getElementById("phoneNumber");
  const tel = document.getElementById("telNumber");
  const email = document.getElementById("emailAddress");
  const zipcode = document.getElementById("zipCode");
  const address = document.getElementById("address");
  const detailAddress = document.getElementById("detail_address");

  if (!form) {
    console.error("form을 찾을 수 없습니다.");
    return;
  }

  // USER_LIST 배열 보정 (없으면 [])
  (function ensureUserListArray() {
    const key = dataKeyObj.USER_LIST;
    const raw = localStorage.getItem(key);

    if (!raw) {
      localStorage.setItem(key, JSON.stringify([]));
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    } catch (e) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  })();

  // 숫자만 입력 가능 (핸드폰/전화)
  phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  tel.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // 제출 이벤트
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = validateForm({
      userId,
      userIdConfirm,
      password,
      birth,
      phone,
      tel,
      email,
      zipcode,
    });
    if (!isValid) return;

    // ✅ 아이디 중복 체크
    const enteredId = userId.value.trim();
    const existUser = findUserByUserId(enteredId);
    if (existUser && existUser.userId) {
      showError(userId, "이미 사용 중인 아이디입니다.");
      await showMessage("회원가입 실패", "이미 존재하는 아이디입니다.", "error");
      return;
    }

    // saveUser에 넘길 데이터 세팅
    const userParam = {
      userId: enteredId,
      password: password.value,
      emailAddress: email.value.trim(),
      birthday: birth.value,
      phoneNumber: phone.value,
      telNumber: tel.value,
      zipCode: zipcode.value.trim(),
      address: address.value.trim(),
      // detail_address 는 지금 dto에 없으니 필요하면 dto 쪽에 필드 추가
    };

    const newUser = saveUser(userParam);
    console.log("저장된 유저:", newUser);

    await showMessage("회원가입 완료", "회원가입이 완료되었습니다.", "success");
    location.href = "./login.html";
  });
});