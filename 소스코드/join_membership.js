// join_membership.js
import { saveUser, findUserByUserId } from "./module/userModule.js";

// 공통 알림
function showMessage(title, text, icon = "info") {
  if (typeof Swal !== "undefined") {
    return Swal.fire(title, text, icon);
  } else {
    alert(title + "\n" + text);
    return Promise.resolve();
  }
}

// 에러 표시/삭제
function showError(input, message) {
  if (!input) return;
  input.classList.add("is-invalid");

  // input 바로 옆이나 부모 안에서 invalid-feedback 찾기
  let feedback = input.nextElementSibling;
  if (!feedback || !feedback.classList.contains("invalid-feedback")) {
    const parent = input.parentElement;
    if (parent) {
      feedback = parent.querySelector(".invalid-feedback");
    }
  }
  if (feedback) {
    feedback.textContent = message;
  }
}

function clearError(input) {
  if (!input) return;
  input.classList.remove("is-invalid");
}

// 아이디 정규식 (영문/숫자/언더바 4~20자)
const ID_REGEX = /^[a-zA-Z0-9_]{4,20}$/;

// 중복확인 상태 플래그
let isIdChecked = false;     // 중복확인 버튼을 눌렀는지
let isIdAvailable = false;   // 실제로 사용 가능한 아이디인지

// 실제 검증 로직
function validateForm({ userId, password, birth, phone, tel, email, zipcode }) {
  let valid = true;

  const idVal = userId.value.trim();

  // ✅ 아이디 형식
  if (!idVal) {
    showError(userId, "아이디를 입력하세요.");
    valid = false;
  } else if (!ID_REGEX.test(idVal)) {
    showError(userId, "아이디는 영문/숫자 4~20자리로 입력하세요.");
    valid = false;
  } else {
    clearError(userId);
  }

  // ✅ 중복확인 여부
  if (!isIdChecked) {
    showError(userId, "아이디 중복 확인 버튼을 눌러주세요.");
    valid = false;
  } else if (!isIdAvailable) {
    showError(userId, "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.");
    valid = false;
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
  if (!form) {
    console.error("joinForm을 찾을 수 없습니다.");
    return;
  }

  const userId = document.getElementById("userId");
  const checkUserIdBtn = document.getElementById("checkIdBtn"); // ★ 버튼 id
  const password = document.getElementById("userPassword");

  const birth = document.getElementById("birthday");
  const phone = document.getElementById("phoneNumber");
  const tel = document.getElementById("telNumber");
  const email = document.getElementById("emailAddress");
  const zipcode = document.getElementById("zipCode");
  const address = document.getElementById("address");
  const detailAddress = document.getElementById("detail_address");

  // 아이디가 바뀌면 중복확인 다시 하도록 플래그 리셋
  userId.addEventListener("input", () => {
    isIdChecked = false;
    isIdAvailable = false;
    clearError(userId);
  });

  // 숫자만 입력 가능 (핸드폰/전화)
  phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  tel.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // ✅ 중복확인 버튼 클릭
  if (checkUserIdBtn) {
    checkUserIdBtn.addEventListener("click", async () => {
      const enteredId = userId.value.trim();

      if (!enteredId) {
        showError(userId, "아이디를 입력하세요.");
        await showMessage("중복확인", "아이디를 먼저 입력하세요.", "warning");
        return;
      }

      if (!ID_REGEX.test(enteredId)) {
        showError(userId, "아이디는 영문/숫자 4~20자리로 입력하세요.");
        await showMessage("중복확인", "아이디 형식을 다시 확인해주세요.", "warning");
        return;
      }

      const existUser = findUserByUserId(enteredId);

      isIdChecked = true;

      if (existUser && existUser.userId) {
        // 이미 있는 아이디
        isIdAvailable = false;
        showError(userId, "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.");
        await showMessage("중복확인", "이미 존재하는 아이디입니다.", "error");
      } else {
        // 사용 가능
        isIdAvailable = true;
        clearError(userId);
        await showMessage("중복확인", "사용 가능한 아이디입니다.", "success");
      }
    });
  } else {
    console.warn("checkIdBtn 버튼을 찾을 수 없습니다.");
  }

  // 제출 이벤트
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = validateForm({
      userId,
      password,
      birth,
      phone,
      tel,
      email,
      zipcode,
    });
    if (!isValid) return;

    // 혹시 모를 최종 중복 체크 (로컬이라 거의 의미는 없지만 안전용)
    const finalId = userId.value.trim();
    const existsAtSubmit = findUserByUserId(finalId);
    if (existsAtSubmit && existsAtSubmit.userId) {
      isIdAvailable = false;
      showError(userId, "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.");
      await showMessage("회원가입 실패", "이미 존재하는 아이디입니다.", "error");
      return;
    }

    // saveUser에 넘길 데이터 세팅 (userDto 필드 이름에 맞춤)
    const userParam = {
      userId: finalId,
      password: password.value,          // userModule에서 SHA256 암호화
      emailAddress: email.value.trim(),  // dto: emailAddress
      birthday: birth.value,
      phoneNumber: phone.value,
      telNumber: tel.value,
      zipCode: zipcode.value.trim(),
      address: address.value.trim(),
      // detailAddress 는 dto에 없으면 걍 무시
    };

    const newUser = saveUser(userParam);
    console.log("저장된 유저:", newUser);

    await showMessage("회원가입 완료", "회원가입이 완료되었습니다.", "success");
    location.href = "./login.html";
  });
});