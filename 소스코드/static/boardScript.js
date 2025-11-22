/**
 * Aim Data Academy - Board Script - 동적 게시판 시스템
 * Created by Kamil Lee
 */

// ========================================
// 전역 변수
// ========================================

let boardData = []; // > 게시판 데이터를 저장할 배열
let userData = []; // > 유저 데이터를 저장할 배열

// ========================================
// 함수 정의
// ========================================

/*
@description initData.json 로드 및 로컬스토리지 초기화
@returns {Promise<void>}
*/
async function loadBoardData() {
  try {
    // 1. 로컬스토리지에서 데이터 확인
    const storedBoardList = localStorage.getItem("board-list"); // > 게시판 데이터를 로컬스토리지에서 가져옴
    const storedUserList = localStorage.getItem("user-list"); // > 유저 데이터를 로컬스토리지에서 가져옴

    let needFetch = true; // > Fetch 필요 여부 확인(기본값: true)

    if (storedBoardList && storedUserList) {
      // > 데이터가 이미 있으면 로드
      boardData = JSON.parse(storedBoardList); // > JSON 데이터를 JavaScript 객체로 변환
      userData = JSON.parse(storedUserList); // > JSON 데이터를 JavaScript 객체로 변환

      // 데이터가 비어있지 않은 경우에만 로드 성공으로 처리
      if (boardData.length > 0 && userData.length > 0) {
        needFetch = false; // > Fetch 필요 없음
        console.log("✅ Loaded data from LocalStorage");
      }
    }

    if (needFetch) {
      // > Fetch가 필요한 경우
      // > (로컬 스토리지의 board-list 및 user-list가 가 없으면), initData.json에서 로드하여 저장
      const response = await fetch("./static/initData.json"); // > initData.json 파일을 가져옴
      if (!response.ok) {
        // > 요청이 실패하면 에러를 발생시킴
        throw new Error("Failed to load board data");
      }
      const data = await response.json(); // > JSON 데이터를 JavaScript 객체로 변환

      // boardData 초기화
      boardData = data.board || []; // > 게시판 데이터를 boardData에 저장
      userData = data.users || []; // > 유저 데이터를 userData에 저장

      for (let user of userData) {
          user.password = CryptoJS.SHA256(user.password).toString();
      }

      // 로컬스토리지에 저장
      localStorage.setItem("board-list", JSON.stringify(boardData));
      console.log("✅ Initialized board-list in LocalStorage");

      localStorage.setItem("user-list", JSON.stringify(userData));
      console.log("✅ Initialized user-list in LocalStorage");


    }

    console.log("✅ Board data loaded:", boardData.length, "items");
    renderAllBoards(); // > 모든 게시판 렌더링
  } catch (error) {
    console.error("❌ Error loading board data:", error);
  }
}

/*
@description 게시판별로 데이터 필터링
@params {string} index - 게시판 인덱스
@params {number} limit - 게시글 제한(기본값: 10)
@returns {Array} 필터링된 게시글 데이터
*/
function filterBoardData(index, limit = 10) {
  return boardData.filter((post) => post.index === index).slice(0, limit);
}

/*
@description 게시글 클릭 이벤트 생성
@params {Object} post - 게시글 데이터
@returns {Function} 클릭 이벤트 핸들러
*/
function createBoardRowClickHandler(post) {
  return function (e) {
    e.preventDefault(); // > 기본 동작 방지

    // category에 따라 리디렉트 URL 결정
    let redirectUrl = "";

    // 게시글 번호
    let boardNo = post.boardNo;

    if (post.index === "IT Test" || post.index === "Japanese Test") {
      // IT 혹은 일본어 평가/과제 게시판
      redirectUrl = `./board/score_detail.html?boardNo=${boardNo || 1}`; // > boardNo가 없으면 1로 설정
    } else {
      // 일반 게시판(IT, 일본어, 공지사항)
      redirectUrl = `./board/notice_detail.html?boardNo=${boardNo || 1}`; // > boardNo가 없으면 1로 설정
    }

    console.log("📌 Redirecting to:", redirectUrl);
    window.location.href = redirectUrl; // > URL로 이동
  };
}

/*
@description 게시글 행 HTML 생성
@params {Object} post - 게시글 데이터
@returns {HTMLElement} HTML 요소
*/
function createBoardRow(post) {
  // 게시글 행 div 생성
  const row = document.createElement("div"); // > 게시글 행을 나타내는 div 요소 생성
  row.className = "board-row";
  row.style.cursor = "pointer"; // > 마우스 커서를 포인터로 변경 (클릭 가능 표시)

  // 클릭 이벤트 추가 - 게시글 상세 페이지로 이동
  row.addEventListener("click", createBoardRowClickHandler(post)); // > 행 클릭 시 상세 페이지로 이동하는 이벤트 리스너 등록

  // TITLE 컬럼 - 제목, New 배지, 본문 미리보기를 포함하는 컬럼
  const titleCol = document.createElement("div"); // > 제목 컬럼 최상위 div 요소 생성
  titleCol.className = "board-col-title";

  // 제목 + New 배지를 감싸는 Wrapper (같은 줄에 표시하기 위함)
  const titleWrapper = document.createElement("div"); // > 제목과 배지를 감싸는 wrapper div 생성
  titleWrapper.className = "d-flex align-items-center";

  // 제목 링크 생성
  const titleLink = document.createElement("a"); // > 제목을 클릭할 수 있는 링크(a) 요소 생성
  titleLink.href = "#"; // > 링크 URL을 "#"로 설정 (페이지 이동 없음)
  titleLink.className = "mb-0 text-decoration-none";

  // 제목 텍스트 설정 (20자 제한)
  const titleText = post.title.substring(0, 20); // > 제목을 최대 20자까지만 가져오기
  titleLink.textContent = titleText + (post.title.length > 20 ? " ..." : ""); // > 20자 초과 시 "..." 추가
  titleLink.addEventListener("click", (e) => e.preventDefault()); // > 링크 클릭 시 기본 동작 방지 (행 클릭 이벤트 사용)
  titleWrapper.appendChild(titleLink); // > wrapper에 제목 링크 추가

  // 오늘 날짜인지 확인하여 New 라벨 추가
  const today = new Date(); // > 현재 날짜 객체 생성
  const postDateStr = post.insertDate.split(" ")[0]; // > 게시글 날짜 문자열에서 날짜 부분만 추출 (예: "25.11.18")
  const [year, month, day] = postDateStr.split("-"); // > 날짜 문자열을 년, 월, 일로 분리
  const postDate = new Date( // > 게시글 날짜 객체 생성
    parseInt(year), // > 년도: "2025"
    parseInt(month) - 1, // > 월: JavaScript Date는 0부터 시작하므로 -1
    parseInt(day) // > 일
  );

  // 오늘 날짜와 게시글 날짜 비교
  const isToday = // > 오늘 날짜인지 확인하는 boolean 변수
    today.getFullYear() === postDate.getFullYear() && // > 년도가 같은지 확인
    today.getMonth() === postDate.getMonth() && // > 월이 같은지 확인
    today.getDate() === postDate.getDate(); // > 일이 같은지 확인

  if (isToday) {
    // > 오늘 작성된 게시글인 경우
    const newTag = document.createElement("span"); // > "New" 배지 span 요소 생성
    newTag.className = "ms-2 badge bg-danger-subtle text-danger";
    newTag.textContent = "New";
    titleWrapper.appendChild(newTag); // > wrapper에 New 배지 추가 (제목 오른쪽에 위치)
  }

  titleCol.appendChild(titleWrapper); // > 제목 컬럼에 wrapper 추가 (제목 + New 배지)

  // 본문 미리보기 추가 (게시글 내용의 일부를 표시)
  if (post.content) {
    // > 본문 내용이 있는 경우에만 미리보기 표시
    const contentPreview = document.createElement("p"); // > 본문 미리보기를 위한 p 요소 생성
    contentPreview.className = "mb-0 text-muted"; // > 하단 마진 제거, 회색 텍스트 스타일 적용
    const previewText = post.content.substring(0, 20); // > 본문을 최대 20자까지만 가져오기
    contentPreview.textContent = // > 본문 미리보기 텍스트 설정
      previewText + (post.content.length > 20 ? " ..." : ""); // > 20자 초과 시 "..." 추가
    titleCol.appendChild(contentPreview); // > 제목 컬럼에 본문 미리보기 추가
  }

  // ID 컬럼 - 게시글 작성자 표시
  const idCol = document.createElement("div"); // > ID 컬럼 div 요소 생성
  idCol.className = "board-col-id";

  // userNo로 유저 이름 찾기
  const user = userData.find(u => u.userNo == post.userNo);
  idCol.textContent = user ? user.userName : post.userId; // > 작성자 이름을 텍스트로 설정

  // DATE 컬럼 - 게시글 작성일 표시
  const dateCol = document.createElement("div"); // > 날짜 컬럼 div 요소 생성
  dateCol.className = "board-col-date";
  const dateOnly = post.insertDate.split(" ")[0]; // > 날짜 포맷 변경: "25.11.14 12:53" -> "25.11.14"
  dateCol.textContent = dateOnly; // > 날짜를 텍스트로 설정

  // 게시글 행에 각 컬럼 추가 (TITLE, ID, DATE 순서)
  row.appendChild(titleCol); // > 제목 컬럼을 행에 추가
  row.appendChild(idCol); // > ID 컬럼을 행에 추가
  row.appendChild(dateCol); // > 날짜 컬럼을 행에 추가

  return row;
}

/*
@description 빈 상태 HTML 생성
@returns {HTMLElement} HTML 요소
*/
function createEmptyState() {
  const emptyDiv = document.createElement("div"); // > 빈 상태를 나타내는 div 요소 생성
  emptyDiv.className = "board-empty";

  const message = document.createElement("p"); // > 메시지 텍스트를 위한 p 요소 생성
  message.className = "text-muted mb-0";
  message.textContent = "게시글이 없습니다."; // > 텍스트 내용 설정

  emptyDiv.appendChild(message); // > 메시지 텍스트를 빈 상태 div에 추가
  return emptyDiv;
}

/*
@description 개별 게시판 렌더링
@params {string} containerSelector - 게시판 컨테이너 선택자
@params {string} index - 게시판 인덱스
@params {number} limit - 게시글 제한(기본값: 5)
@returns {void}
*/
function renderBoard(containerSelector, index, limit = 5) {
  const container = document.querySelector(containerSelector); // > 게시판 컨테이너 요소 선택
  if (!container) {
    console.warn(`⚠️ Board container not found: ${containerSelector}`);
    return;
  }

  const tableBody = container.querySelector(".board-table-body"); // > 게시글 테이블 body 요소 선택
  if (!tableBody) {
    console.warn(`⚠️ Board table body not found in: ${containerSelector}`);
    return;
  }

  // 기존 내용 제거
  tableBody.innerHTML = "";

  // 데이터 필터링
  const posts = filterBoardData(index, limit);

  if (posts.length === 0) {
    // > 게시글이 없을 경우
    // 빈 상태 표시
    tableBody.appendChild(createEmptyState());
  } else {
    // > 게시글이 있을 경우
    // 게시글 렌더링
    posts.forEach((post) => {
      tableBody.appendChild(createBoardRow(post));
    });
  }

  console.log(`✅ Rendered ${posts.length} posts for ${index}`);
}

/*
@description 모든 게시판 렌더링
@returns {void}
*/
function renderAllBoards() {
  // IT 게시판
  renderBoard(".board-container > .card:nth-child(1)", "IT", 5);

  // IT 평가/과제 게시판
  renderBoard(".board-container > .card:nth-child(2)", "IT Test", 5);

  // 일본어 게시판
  renderBoard(".board-container > .card:nth-child(3)", "Japanese", 5);

  // 일본어 평가/과제 게시판
  renderBoard(".board-container > .card:nth-child(4)", "Japanese Test", 5);

  // 공지사항
  renderBoard(".board-container > .card:nth-child(5)", "Notice", 5);
}

/*
@description 페이지 로드 시 초기화
@returns {void}
*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("📋 Board script initialized");
  loadBoardData();
});
