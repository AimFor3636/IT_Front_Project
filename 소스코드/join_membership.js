import { saveUser } from "./module/userModule.js";
function showMessage(title, text, icon = "info") {
  if (typeof Swal !== "undefined") {
    return Swal.fire(title, text, icon);
  } else {
    alert(title + "\n" + text);
    // Swal.fire()는 Promise를 반환하니까 형식 맞추려고
    return Promise.resolve();
  }
}

// 3) DOM 준비되면 실행
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

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

  // 숫자만 입력(핸드폰/전화) – HTML에 있던 코드도 여기로 옮겨옴
  phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  tel.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // 4) 제출 이벤트
  form.addEventListener("submit", async (event) => {
    // 기본 제출(페이지 이동) 막기
    event.preventDefault();

    // HTML에 있는 validateForm() 먼저 통과해야 저장 진행
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    // 5) userModule.saveUser 에 넘길 파라미터 만들기
    const userParam = {
      // userDto에 있는 필드명에 맞춰서 필요한 것만 채우면 됨
      birthday: birth.value,
      phoneNumber: phone.value,
      telNumber: tel.value,
      email: email.value.trim(),
      zipCode: zipcode.value.trim(),
      address: address.value.trim(),
      detail_address: detailAddress.value.trim()
      // userId, password 같은 건 다른 단계에서 받는 구조면 나중에 추가
    };

    // 실제 저장
    const newUser = saveUser(userParam);
    console.log("저장된 유저:", newUser);

    // 6) 성공 메시지 띄우고 로그인 페이지로 이동 (원하면 경로 수정)
    await showMessage("회원가입 완료", "회원가입이 완료되었습니다.", "success");
    location.href = "./login.html";
  });
});