// join_membership.js
import { saveUser, findUserByUserId } from "./module/userModule.js";
import { findArrayInLocalStorage, dataKeyObj } from "./module/commonModule.js";

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
let isIdChecked = false;     // 버튼 눌렀는지
let isIdAvailable = false;   // 실제 사용 가능 상태인지
let lastCheckedId = "";      // 마지막으로 체크한 아이디

// 폼 전체 검증
function validateForm({ userId, password, birth, phone, tel, email, zipcode, name }) {
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

  // ✅ 중복확인 여부 (다른 아이디로 바꿨는데 체크 안 했으면 막기)
  if (!isIdChecked || idVal !== lastCheckedId) {
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

  // ✅ 이름 (필수)  ← ★ 추가
  if (!name.value.trim()) {
    showError(name, "이름은 필수 입력 항목입니다.");
    valid = false;
  } else {
    clearError(name);
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

  // 🔹 전화번호 (선택, 000-0000-0000)
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

  // 🔹 우편번호 (선택, 5자리 숫자)
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
  const checkUserIdBtn = document.getElementById("checkIdBtn");
  const password = document.getElementById("userPassword");

  const birth = document.getElementById("birthday");
  const phone = document.getElementById("phoneNumber");
  const tel = document.getElementById("telNumber");
  const email = document.getElementById("emailAddress");
  const zipcode = document.getElementById("zipCode");
  const address = document.getElementById("address");
  const detailAddress = document.getElementById("detail_address");

  const nameInput = document.getElementById("userName");  // ← ★ 이름 요소 추가

  // 아이디가 바뀌면 중복확인 다시 하도록 플래그 리셋
  userId.addEventListener("input", () => {
    isIdChecked = false;
    isIdAvailable = false;
    lastCheckedId = "";
    clearError(userId);
  });

  // 숫자만 입력 가능 (핸드폰)
  phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // 전화번호는 숫자/하이픈 허용
  tel.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9-]/g, "");
  });

  // ✅ 중복확인 버튼 클릭
  if (checkUserIdBtn) {
    checkUserIdBtn.addEventListener("click", async () => {
      const enteredId = userId.value.trim();
      console.log("[중복확인] 입력 아이디:", enteredId);

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
      console.log("[중복확인] findUserByUserId 결과:", existUser);

      isIdChecked = true;
      lastCheckedId = enteredId;

      if (existUser && existUser.userId) {
        isIdAvailable = false;
        showError(userId, "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.");
        await showMessage("중복확인", "이미 존재하는 아이디입니다.", "error");
      } else {
        isIdAvailable = true;
        clearError(userId);
        await showMessage("중복확인", "사용 가능한 아이디입니다.", "success");
      }
    });
  } else {
    console.warn("checkIdBtn 버튼을 찾을 수 없습니다.");
  }

  // ✅ 가입하기 버튼(폼 제출)
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("[회원가입] 제출 버튼 클릭");

    const isValid = validateForm({
      userId,
      password,
      birth,
      phone,
      tel,
      email,
      zipcode,
      name: nameInput,   // ← ★ 이름도 검증에 포함
    });
    if (!isValid) {
      console.log("[회원가입] 유효성 검사 실패");
      return;
    }

    // ===== 이메일 / 휴대폰 중복 방지 =====
    const emailVal = email.value.trim();
    const phoneVal = phone.value.trim();
    const phonePure = phoneVal.replace(/[^0-9]/g, "");

    const userList = findArrayInLocalStorage(dataKeyObj.USER_LIST);
    console.log("[회원가입] 현재 USER_LIST:", userList);

    const emailDup = userList.find(
      (u) => u.emailAddress === emailVal || u.email === emailVal
    );

    const phoneDup = userList.find((u) => {
      const storedPhonePure = (u.phoneNumber || "").replace(/[^0-9]/g, "");
      return phonePure && storedPhonePure === phonePure;
    });

    if (emailDup || phoneDup) {
      if (emailDup) {
        showError(email, "이미 사용 중인 이메일입니다.");
      }
      if (phoneDup) {
        showError(phone, "이미 사용 중인 휴대폰 번호입니다.");
      }
      await showMessage(
        "회원가입 실패",
        "이미 등록된 이메일 또는 휴대폰 번호입니다.",
        "error"
      );
      return;
    }
    // ===== 추가 부분 끝 =====

    // 최종 아이디 값
    const finalId = userId.value.trim();

    // 혹시 모를 최종 아이디 중복 체크
    const existsAtSubmit = findUserByUserId(finalId);
    console.log("[회원가입] 최종 중복 체크 결과:", existsAtSubmit);

    if (existsAtSubmit && existsAtSubmit.userId) {
      isIdAvailable = false;
      showError(userId, "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.");
      await showMessage("회원가입 실패", "이미 존재하는 아이디입니다.", "error");
      return;
    }

    const userParam = {
      userId: finalId,
      password: password.value,
      userName: nameInput.value.trim(),   // ← ★ 이름 저장
      emailAddress: emailVal,
      birthday: birth.value,
      phoneNumber: phoneVal,
      telNumber: tel.value,
      zipCode: zipcode.value.trim(),
      address: address.value.trim(),
      // detailAddress 는 dto에 없으면 무시
    };

    const newUser = saveUser(userParam);
    console.log("[회원가입] 저장된 유저:", newUser);

    await showMessage("회원가입 완료", "회원가입이 완료되었습니다.", "success");
    location.href = "./login.html";
  });
});