/**
 * Aim Data Academy - Calendar Script - 동적 캘린더 시스템
 * Created by Kamil Lee
 */

// ========================================
// 전역 변수
// ========================================

let scheduleData = []; // > 캘린더 일정 데이터를 저장할 배열
let currentYear = new Date().getFullYear(); // > 현재 표시 중인 년도
let currentMonth = new Date().getMonth(); // > 현재 표시 중인 월 (0-11)
let currentView = "month"; // > 현재 뷰 모드 ('month', 'week', 'day', 'list')
let activeFilters = []; // > 활성화된 Index 필터 배열

// Index와 CSS 클래스 매핑
const indexClassMap = {
  // > 일정 종류별 CSS 클래스 매핑 객체
  수업: "event-class",
  "휴강/공휴일": "event-holiday",
  시험: "event-test",
  "특강/행사": "event-lecture",
  잡페어: "event-jobfair",
  기타: "event-etc",
};

// 요일 배열
const daysOfWeek = [
  // > 요일 이름 배열 (0: Sunday, 6: Saturday)
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ========================================
// 함수 정의
// ========================================

/*
@description initData.json에서 캘린더 일정 데이터 로드
@returns {Promise<void>}
*/
async function loadScheduleData() {
  try {
    const response = await fetch("./static/initData.json"); // > initData.json 파일을 가져옴
    if (!response.ok) {
      // > 응답이 성공적이지 않은 경우
      throw new Error("Failed to load schedule data"); // > 에러 발생
    }
    const data = await response.json(); // > 응답 데이터를 JSON으로 파싱
    scheduleData = data.calendar || []; // > calendar 속성에서 일정 데이터 추출 (없으면 빈 배열)

    console.log("✅ Schedule data loaded:", scheduleData.length, "items");
    renderCalendar(); // > 초기 캘린더 렌더링
  } catch (error) {
    console.error("❌ Failed to load schedule data:", error);
  }
}

/*
@description 날짜 문자열을 파싱하여 시작일과 종료일 객체 반환
@param {string} dateStr - 날짜 문자열 (예: "2025-01-01" 또는 "2025-01-01~2025-01-31")
@returns {Object} { start: Date, end: Date, isRange: boolean }
*/
function parseDateRange(dateStr) {
  if (dateStr.includes("~")) {
    // > 날짜 범위인 경우 ("~" 포함)
    const [start, end] = dateStr.split("~").map((d) => d.trim()); // > 시작일과 종료일 분리 및 공백 제거
    return {
      start: new Date(start), // > 시작일 Date 객체 생성
      end: new Date(end), // > 종료일 Date 객체 생성
      isRange: true, // > 날짜 범위 플래그
    };
  }
  const date = new Date(dateStr); // > 단일 날짜인 경우 Date 객체 생성
  return {
    start: date, // > 시작일과 종료일이 동일
    end: date,
    isRange: false, // > 단일 날짜 플래그
  };
}

/*
@description 특정 날짜에 해당하는 일정 이벤트 필터링
@param {number} year - 년도
@param {number} month - 월 (0-11)
@param {number} day - 일
@returns {Array} 해당 날짜의 일정 배열
*/
function getEventsForDate(year, month, day) {
  const targetDate = new Date(year, month, day); // > 대상 날짜 객체 생성
  const dayOfWeek = targetDate.getDay(); // > 요일 가져오기 (0=일요일, 6=토요일)

  // 해당 날짜의 모든 이벤트 먼저 가져오기
  const allEvents = scheduleData.filter((schedule) => {
    // > scheduleData에서 해당 날짜 이벤트 필터링
    const { start, end } = parseDateRange(schedule.date); // > 일정의 시작일과 종료일 파싱

    // 날짜 비교 (시간 제외)
    const targetTime = new Date(year, month, day).setHours(0, 0, 0, 0); // > 대상 날짜의 시간을 00:00:00으로 설정
    const startTime = new Date(start).setHours(0, 0, 0, 0); // > 시작일의 시간을 00:00:00으로 설정
    const endTime = new Date(end).setHours(0, 0, 0, 0); // > 종료일의 시간을 00:00:00으로 설정

    return targetTime >= startTime && targetTime <= endTime; // > 대상 날짜가 일정 범위 내에 있는지 확인
  });

  // 시험이 있는지 체크
  const hasJapanTest = allEvents.some(
    (event) => event.domain === "일본어" && event.index === "시험"
  ); // > 일본어 시험 여부
  const hasItTest = allEvents.some(
    (event) => event.domain === "IT" && event.index === "시험"
  ); // > IT 시험 여부
  const hasItTotalTest = allEvents.some(
    (event) => event.name === "IT 종합역량평가"
  ); // > IT 종합역량평가 여부
  const hasJapanPrTest = allEvents.some(
    (event) => event.name === "프레젠테이션 평가" && event.domain === "IT"
  ); // > 프레젠테이션 평가 여부

  // 휴강/공휴일이 있는지 체크
  const hasHoliday = allEvents.some((event) => event.index === "휴강/공휴일"); // > 휴강/공휴일 여부

  // 특강/행사가 있는지 체크
  const hasLecture = allEvents.some((event) => event.index === "특강/행사"); // > 특강/행사 여부

  // 최종 필터링
  return allEvents.filter((schedule) => {
    // > 필터링 조건에 따라 이벤트 걸러내기
    // 필터가 활성화되어 있고, 해당 Index가 필터에 없으면 제외
    if (activeFilters.length > 0 && !activeFilters.includes(schedule.index)) {
      // > Index 필터가 활성화되어 있고 해당 Index가 없으면
      return false; // > 제외
    }

    // 수업 관련 이벤트인 경우
    if (schedule.index === "수업") {
      // 주말(토요일=6, 일요일=0)이면 제외
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }

      // 특수 일정 처리: 팀 프로젝트 / 취업전략 단독 진행일
      // 2026-02-05~06, 12~13, 19~20, 26~27, 2026-03-05~06
      if (year === 2026) {
        const isFeb = month === 1; // 0: Jan, 1: Feb, 2: Mar
        const isMar = month === 2;

        const teamOnlyDaysInFeb = [5, 12, 19, 26];
        const careerOnlyDaysInFeb = [6, 13, 20, 27];

        const isTeamProject = schedule.name === "팀 프로젝트";
        const isCareerStrategy = schedule.name === "취업전략";

        if (isFeb) {
          if (teamOnlyDaysInFeb.includes(day)) {
            // 이 날에는 팀 프로젝트만 표시
            if (!isTeamProject) {
              return false;
            }
          } else if (careerOnlyDaysInFeb.includes(day)) {
            // 이 날에는 취업전략만 표시
            if (!isCareerStrategy) {
              return false;
            }
          }
        } else if (isMar) {
          if (day === 5) {
            // 03-05: 팀 프로젝트만 진행
            if (!isTeamProject) {
              return false;
            }
          } else if (day === 6) {
            // 03-06: 취업전략만 진행
            if (!isCareerStrategy) {
              return false;
            }
          }
        }
      }

      // 휴강/공휴일이 있으면 제외
      if (hasHoliday) {
        return false;
      }

      // 특강/행사가 있으면 제외
      if (hasLecture) {
        return false;
      }

      // IT 종합역량평가가 있는 경우 제외
      if (hasItTotalTest) {
        return false;
      }

      // 프레젠테이션 평가가 있는 경우 제외
      if (hasJapanPrTest) {
        return false;
      }

      // 시험이 있는 경우 처리
      if (hasJapanTest && schedule.domain === "일본어") {
        // 일본어 시험이 있는데 일본어 수업이면 제외
        return false;
      }

      if (hasItTest && schedule.domain === "IT") {
        // IT 시험이 있는데 IT 수업이면 제외
        return false;
      }
    }

    return true; // > 조건을 통과한 일정 포함
  });
}

/*
@description 일정 상세 정보 모달 표시
@param {Object} event - 일정 객체
@param {number} year - 년도
@param {number} month - 월 (0-11)
@param {number} day - 일
@returns {void}
*/
function showEventModal(event, year, month, day) {
  // 모달 요소 가져오기
  const modal = document.getElementById("eventModal"); // > 모달 요소 가져오기
  if (!modal) return; // > 모달이 없으면 종료

  // 모달 내용 업데이트
  const modalTitle = document.getElementById("eventModalLabel"); // > 모달 제목 요소
  const eventDate = document.getElementById("eventDate"); // > 날짜 표시 요소
  const eventTime = document.getElementById("eventTime"); // > 시간 표시 요소
  const eventDomain = document.getElementById("eventDomain"); // > 도메인 표시 요소
  const eventDescription = document.getElementById("eventDescription"); // > 설명 표시 요소

  if (modalTitle) modalTitle.textContent = event.name; // > 일정 이름 설정
  if (eventDate)
    // > 날짜가 있으면
    eventDate.textContent = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`; // > YYYY-MM-DD 형식으로 설정
  if (eventTime) eventTime.textContent = event.time || "시간 정보 없음"; // > 시간 설정 (없으면 기본값)
  if (eventDomain) eventDomain.textContent = event.domain || "도메인 정보 없음"; // > 도메인 설정 (없으면 기본값)
  if (eventDescription)
    eventDescription.textContent = event.description || "설명 없음"; // > 설명 설정 (없으면 기본값)

  // Bootstrap 모달 표시
  const bsModal = new bootstrap.Modal(modal); // > Bootstrap 모달 객체 생성
  bsModal.show(); // > 모달 표시
}

/*
@description 캘린더 Month 뷰 렌더링 - 월 단위 달력 표시
@returns {void}
*/
function renderMonthView() {
  const calendarBody = document.querySelector(".calendar-body"); // > 캘린더 body 요소 가져오기
  if (!calendarBody) return; // > 요소가 없으면 종료

  // 기존 내용 제거
  calendarBody.innerHTML = ""; // > 기존 내용 초기화

  // 월의 첫 날과 마지막 날
  const firstDay = new Date(currentYear, currentMonth, 1); // > 현재 월의 첫 날
  const lastDay = new Date(currentYear, currentMonth + 1, 0); // > 현재 월의 마지막 날
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0); // > 이전 월의 마지막 날

  // 캘린더 그리드 생성
  const startDayOfWeek = firstDay.getDay(); // > 첫 날의 요일 (0-6)
  const daysInMonth = lastDay.getDate(); // > 현재 월의 총 일수
  const prevMonthDays = prevMonthLastDay.getDate(); // > 이전 월의 총 일수

  // 총 셀 개수 (5주 = 35셀 또는 6주 = 42셀)
  const totalCells = startDayOfWeek + daysInMonth;
  const numWeeks = Math.ceil(totalCells / 7);
  const totalSlots = numWeeks * 7;

  // 셀 생성
  for (let i = 0; i < totalSlots; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";

    let day, month, year, isCurrentMonth;

    if (i < startDayOfWeek) {
      // 이전 달
      day = prevMonthDays - (startDayOfWeek - i - 1);
      month = currentMonth - 1;
      year = currentYear;
      if (month < 0) {
        month = 11;
        year--;
      }
      isCurrentMonth = false;
      cell.classList.add("calendar-disabled");
    } else if (i < startDayOfWeek + daysInMonth) {
      // 현재 달
      day = i - startDayOfWeek + 1;
      month = currentMonth;
      year = currentYear;
      isCurrentMonth = true;

      // 오늘 날짜 체크
      const today = new Date();
      if (
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate()
      ) {
        cell.classList.add("calendar-today");
      }
    } else {
      // 다음 달
      day = i - (startDayOfWeek + daysInMonth) + 1;
      month = currentMonth + 1;
      year = currentYear;
      if (month > 11) {
        month = 0;
        year++;
      }
      isCurrentMonth = false;
      cell.classList.add("calendar-disabled");
    }

    // 날짜 번호
    const dateSpan = document.createElement("span");
    dateSpan.className = "calendar-date";
    dateSpan.textContent = day;
    cell.appendChild(dateSpan);

    // 현재 달의 이벤트만 표시
    if (isCurrentMonth) {
      const events = getEventsForDate(year, month, day);

      // 시간 순으로 정렬 (오전 → 오후)
      events.sort((a, b) => {
        if (!a.time || !b.time) return 0;
        const timeA = a.time.split(" ~ ")[0].replace(":", "");
        const timeB = b.time.split(" ~ ")[0].replace(":", "");
        return timeA.localeCompare(timeB);
      });

      events.forEach((event) => {
        const eventDiv = document.createElement("div");
        eventDiv.className = `calendar-event ${
          indexClassMap[event.index] || "event-etc"
        }`;
        eventDiv.textContent = event.name;
        eventDiv.title = `${event.name}`;

        // 이벤트 클릭 시 모달 표시
        eventDiv.style.cursor = "pointer";
        eventDiv.addEventListener("click", () => {
          showEventModal(event, year, month, day);
        });

        cell.appendChild(eventDiv);
      });
    }

    calendarBody.appendChild(cell); // > 생성한 셀을 캘린더 body에 추가
  }
}

/*
@description 캘린더 List 뷰 렌더링 - 일정 목록 형태로 표시
@returns {void}
*/
function renderListView() {
  const calendarBody = document.querySelector(".calendar-body"); // > 캘린더 body 요소 가져오기
  if (!calendarBody) return; // > 요소가 없으면 종료

  // Month 뷰 숨기고 List 뷰 컨테이너 생성
  const listContainer = document.createElement("div"); // > List 뷰 컨테이너 div 생성
  listContainer.className = "list-view"; // > List 뷰 스타일 클래스 적용
  listContainer.innerHTML = ""; // > 초기 내용 비우기

  // 현재 달의 모든 날짜 순회
  const lastDay = new Date(currentYear, currentMonth + 1, 0); // > 현재 월의 마지막 날
  const daysInMonth = lastDay.getDate(); // > 현재 월의 총 일수

  for (let day = 1; day <= daysInMonth; day++) {
    const events = getEventsForDate(currentYear, currentMonth, day);

    if (events.length === 0) continue; // 이벤트 없으면 스킵

    // 시간 순으로 정렬 (오전 → 오후)
    events.sort((a, b) => {
      if (!a.time || !b.time) return 0;
      const timeA = a.time.split(" ~ ")[0].replace(":", "");
      const timeB = b.time.split(" ~ ")[0].replace(":", "");
      return timeA.localeCompare(timeB);
    });

    // 날짜 헤더
    const date = new Date(currentYear, currentMonth, day);
    const dateHeader = document.createElement("div");
    dateHeader.className = "list-date-header";

    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const dateText = document.createElement("span");
    dateText.className = "list-date";
    dateText.textContent = `${monthName} ${day}, ${currentYear}`;

    const dayText = document.createElement("span");
    dayText.className = "list-day";
    dayText.textContent = daysOfWeek[date.getDay()];

    dateHeader.appendChild(dateText);
    dateHeader.appendChild(dayText);
    listContainer.appendChild(dateHeader);

    // 이벤트 목록
    events.forEach((event) => {
      const eventItem = document.createElement("div");
      eventItem.className = "list-event";

      // Index 필터 적용 (indexClassMap 활용)
      eventItem.classList.add(indexClassMap[event.index] || "event-etc");

      // 커서를 포인터로 변경
      eventItem.style.cursor = "pointer";

      const timeSpan = document.createElement("span");
      timeSpan.className = "list-time";

      // Index 필터 적용 (indexClassMap 활용)
      timeSpan.classList.add(indexClassMap[event.index] || "event-etc");
      timeSpan.textContent = event.time;

      // Index 색상 점
      const dotSpan = document.createElement("span");
      dotSpan.className = `list-dot ${
        indexClassMap[event.index] || "event-etc"
      }`;

      // 이벤트 이름
      const nameSpan = document.createElement("span");
      nameSpan.className = "list-event-name";

      // Index 필터 적용 (indexClassMap 활용)
      nameSpan.classList.add(indexClassMap[event.index] || "event-etc");
      nameSpan.textContent = event.name;

      // 이벤트 클릭 시 모달 표시
      eventItem.addEventListener("click", () => {
        showEventModal(event, currentYear, currentMonth, day);
      });

      eventItem.appendChild(timeSpan);
      eventItem.appendChild(dotSpan);
      eventItem.appendChild(nameSpan);
      listContainer.appendChild(eventItem);
    });
  }

  // 기존 내용 제거 후 List 뷰 삽입
  calendarBody.style.display = "none";
  const parent = calendarBody.parentElement;

  // 기존 List 뷰 제거
  const existingListView = parent.querySelector(".list-view");
  if (existingListView) {
    existingListView.remove();
  }

  parent.appendChild(listContainer); // > List 뷰를 parent에 추가
}

/*
@description 현재 뷰 모드에 따라 캘린더 렌더링
@returns {void}
*/
function renderCalendar() {
  // 월/년도 제목 업데이트
  updateMonthTitle(); // > 캘린더 제목 업데이트 함수 호출

  // 뷰 모드에 따라 렌더링
  if (currentView === "month") {
    // > Month 뷰인 경우
    // List 뷰 숨기고 Month 뷰 표시
    const listView = document.querySelector(".list-view"); // > List 뷰 요소 가져오기
    if (listView) {
      // > List 뷰가 있으면
      listView.style.display = "none"; // > 숨기기
    }
    const calendarBody = document.querySelector(".calendar-body"); // > 캘린더 body 요소 가져오기
    if (calendarBody) {
      // > 캘린더 body가 있으면
      calendarBody.style.display = "grid"; // > Grid 디스플레이로 표시
    }
    renderMonthView(); // > Month 뷰 렌더링
  } else if (currentView === "list") {
    // > List 뷰인 경우
    renderListView(); // > List 뷰 렌더링
  }
}

/*
@description 캘린더 제목 업데이트 (월/년도 표시)
@returns {void}
*/
function updateMonthTitle() {
  const titleElement = document.querySelector(".calendar-title"); // > 캘린더 제목 요소 가져오기
  if (!titleElement) return; // > 요소가 없으면 종료

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  titleElement.textContent = `${monthNames[
    currentMonth
  ].toUpperCase()} ${currentYear}`; // > "JANUARY 2025" 형식으로 설정
}

/*
@description 캘린더 관련 이벤트 리스너 초기화
@returns {void}
*/
function initEventListeners() {
  // 이전 달 버튼 (캘린더 컨테이너 내에서만 선택)
  const prevBtn = document.querySelector(
    ".calendar-container .bi-chevron-left"
  )?.parentElement; // > 이전 달 버튼 요소
  if (prevBtn) {
    // > 버튼이 있으면
    prevBtn.addEventListener("click", () => {
      // > 클릭 이벤트 리스너 등록
      currentMonth--; // > 월 감소
      if (currentMonth < 0) {
        // > 1월에서 이전 달로 가면
        currentMonth = 11; // > 12월로 설정
        currentYear--; // > 년도 감소
      }
      renderCalendar(); // > 캘린더 다시 렌더링
    });
  }

  // 다음 달 버튼 (캘린더 컨테이너 내에서만 선택)
  const nextBtn = document.querySelector(
    ".calendar-container .bi-chevron-right"
  )?.parentElement; // > 다음 달 버튼 요소
  if (nextBtn) {
    // > 버튼이 있으면
    nextBtn.addEventListener("click", () => {
      // > 클릭 이벤트 리스너 등록
      currentMonth++; // > 월 증가
      if (currentMonth > 11) {
        // > 12월에서 다음 달로 가면
        currentMonth = 0; // > 1월로 설정
        currentYear++; // > 년도 증가
      }
      renderCalendar(); // > 캘린더 다시 렌더링
    });
  }

  // Today 버튼 (캘린더 컨테이너 내에서만 선택)
  const todayBtn = document.querySelector(
    ".calendar-container .btn-primary.btn-sm"
  ); // > Today 버튼 요소
  if (todayBtn) {
    // > 버튼이 있으면
    todayBtn.addEventListener("click", () => {
      // > 클릭 이벤트 리스너 등록
      const today = new Date(); // > 오늘 날짜 객체 생성
      currentYear = today.getFullYear(); // > 현재 년도를 오늘 년도로 설정
      currentMonth = today.getMonth(); // > 현재 월을 오늘 월로 설정
      renderCalendar(); // > 캘린더 다시 렌더링
    });
  }

  // 뷰 모드 버튼들 (캘린더 컨테이너 내에서만 선택)
  const viewButtons = document.querySelectorAll(
    ".calendar-container .btn-group button"
  ); // > 뷰 모드 버튼 모두 선택
  viewButtons.forEach((btn, index) => {
    // > 각 버튼에 대해 반복
    btn.addEventListener("click", () => {
      // > 클릭 이벤트 리스너 등록
      // 모든 버튼 비활성화
      viewButtons.forEach((b) => {
        // > 모든 버튼에 대해
        b.classList.remove("btn-primary"); // > Primary 클래스 제거
        b.classList.add("btn-outline-primary"); // > Outline Primary 클래스 추가
      });

      // 클릭된 버튼 활성화
      btn.classList.remove("btn-outline-primary"); // > Outline Primary 클래스 제거
      btn.classList.add("btn-primary"); // > Primary 클래스 추가

      // 뷰 모드 전환
      if (index === 0) {
        // > 첨 번째 버튼 (Month)
        currentView = "month"; // > Month 뷰로 설정
        renderCalendar(); // > 캘린더 렌더링
      } else if (index === 1) {
        // > 두 번째 버튼 (Week)
        Swal.fire({
          // > SweetAlert 모달 표시
          title: "WIP",
          text: "Week 뷰는 준비 중입니다.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (index === 2) {
        // > 세 번째 버튼 (Day)
        Swal.fire({
          // > SweetAlert 모달 표시
          title: "WIP",
          text: "Day 뷰는 준비 중입니다.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (index === 3) {
        // > 네 번째 버튼 (List)
        currentView = "list"; // > List 뷰로 설정
        renderCalendar(); // > 캘린더 렌더링
      }
    });
  });

  // Index 필터링 (캘린더 컨테이너 내에서만 선택)
  const indexItems = document.querySelectorAll(
    ".calendar-container .index-item"
  ); // > Index 필터 항목 모두 선택
  indexItems.forEach((item) => {
    // > 각 Index 항목에 대해 반복
    item.addEventListener("click", () => {
      // > 클릭 이벤트 리스너 등록
      const indexText = item
        .querySelector("span:last-child")
        .textContent.trim(); // > Index 텍스트 추출 (예: "수업")

      // 토글
      if (activeFilters.includes(indexText)) {
        // > 해당 Index가 이미 필터에 포함되어 있으면
        activeFilters = activeFilters.filter((f) => f !== indexText); // > 필터에서 제거
        item.classList.remove("index-active"); // > 활성 클래스 제거
      } else {
        // > 포함되어 있지 않으면
        activeFilters.push(indexText); // > 필터에 추가
        item.classList.add("index-active"); // > 활성 클래스 추가
      }

      // 재렌더링
      renderCalendar(); // > 필터 변경 사항 반영하여 다시 렌더링
    });
  });
}

/*
@description 캘린더 시스템 초기화 - 데이터 로드 및 이벤트 리스너 등록
@returns {void}
*/
function init() {
  console.log("📅 Calendar initialized"); // > 캘린더 초기화 로그 출력
  loadScheduleData(); // > 일정 데이터 로드
  initEventListeners(); // > 이벤트 리스너 초기화
}

// ========================================
// 초기화 실행
// ========================================

// > DOM이 완전히 로드된 후 초기화 함수 실행
if (document.readyState === "loading") {
  // > 문서가 아직 로드 중인 경우
  document.addEventListener("DOMContentLoaded", init); // > DOMContentLoaded 이벤트 리스너 등록
} else {
  // > 문서가 이미 로드된 경우
  init(); // > 즉시 초기화 실행
}
