/**
 * Aim Data Academy - Calendar Script - 동적 캘린더 시스템
 * Created by Kamil Lee
 */

(function () {
  "use strict";

  // ========================================
  // 전역 변수
  // ========================================
  let scheduleData = []; // JSON 데이터
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // 0-11
  let currentView = "month"; // 'month', 'week', 'day', 'list'
  let activeFilters = []; // 활성화된 Index 필터

  // Index 매핑
  const indexClassMap = {
    수업: "event-class",
    "휴강/공휴일": "event-holiday",
    시험: "event-test",
    "특강/행사": "event-lecture",
    잡페어: "event-jobfair",
    기타: "event-etc",
  };

  // 요일 배열
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // ========================================
  // 1. JSON 데이터 로드
  // ========================================
  const loadScheduleData = async () => {
    try {
      const response = await fetch("./static/initData.json");
      scheduleData = await response.json();
      console.log("✅ Schedule data loaded:", scheduleData.length, "items");

      // 초기 렌더링
      renderCalendar();
    } catch (error) {
      console.error("❌ Failed to load schedule data:", error);
    }
  };

  // ========================================
  // 날짜 파싱 함수
  // ========================================
  const parseDateRange = dateStr => {
    if (dateStr.includes("~")) {
      const [start, end] = dateStr.split("~").map(d => d.trim());
      return {
        start: new Date(start),
        end: new Date(end),
        isRange: true,
      };
    }
    const date = new Date(dateStr);
    return {
      start: date,
      end: date,
      isRange: false,
    };
  };

  // ========================================
  // 특정 날짜에 해당하는 이벤트 필터링
  // ========================================
  const getEventsForDate = (year, month, day) => {
    const targetDate = new Date(year, month, day);
    const dayOfWeek = targetDate.getDay(); // 0=일요일, 6=토요일

    // 해당 날짜의 모든 이벤트 먼저 가져오기
    const allEvents = scheduleData.filter(schedule => {
      const { start, end } = parseDateRange(schedule.date);

      // 날짜 비교 (시간 제외)
      const targetTime = new Date(year, month, day).setHours(0, 0, 0, 0);
      const startTime = new Date(start).setHours(0, 0, 0, 0);
      const endTime = new Date(end).setHours(0, 0, 0, 0);

      return targetTime >= startTime && targetTime <= endTime;
    });

    // 시험이 있는지 체크
    const hasJapanTest = allEvents.some(event => event.domain === "일본어" && event.index === "시험");
    const hasItTest = allEvents.some(event => event.domain === "IT" && event.index === "시험");
    const hasItTotalTest = allEvents.some(event => event.name === "IT 종합역량평가");
    const hasJapanPrTest = allEvents.some(event => event.name === "프레젠테이션 평가" && event.domain === "IT");

    // 휴강/공휴일이 있는지 체크
    const hasHoliday = allEvents.some(event => event.index === "휴강/공휴일");

    // 특강/행사가 있는지 체크
    const hasLecture = allEvents.some(event => event.index === "특강/행사");

    // 최종 필터링
    return allEvents.filter(schedule => {
      // 필터가 활성화되어 있고, 해당 Index가 필터에 없으면 제외
      if (activeFilters.length > 0 && !activeFilters.includes(schedule.index)) {
        return false;
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

      return true;
    });
  };

  // ========================================
  // 모달 표시 함수
  // ========================================
  const showEventModal = (event, year, month, day) => {
    // 모달 요소 가져오기
    const modal = document.getElementById("eventModal");
    if (!modal) return;

    // 모달 내용 업데이트
    const modalTitle = document.getElementById("eventModalLabel");
    const eventDate = document.getElementById("eventDate");
    const eventTime = document.getElementById("eventTime");
    const eventDomain = document.getElementById("eventDomain");
    const eventDescription = document.getElementById("eventDescription");

    if (modalTitle) modalTitle.textContent = event.name;
    if (eventDate)
      eventDate.textContent = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (eventTime) eventTime.textContent = event.time || "시간 정보 없음";
    if (eventDomain) eventDomain.textContent = event.domain || "도메인 정보 없음";
    if (eventDescription) eventDescription.textContent = event.description || "설명 없음";

    // Bootstrap 모달 표시
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  };

  // ========================================
  // 2. Month 뷰 렌더링
  // ========================================
  const renderMonthView = () => {
    const calendarBody = document.querySelector(".calendar-body");
    if (!calendarBody) return;

    // 기존 내용 제거
    calendarBody.innerHTML = "";

    // 월의 첫 날과 마지막 날
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0);

    // 캘린더 그리드 생성
    const startDayOfWeek = firstDay.getDay(); // 0-6
    const daysInMonth = lastDay.getDate();
    const prevMonthDays = prevMonthLastDay.getDate();

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
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
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

        events.forEach(event => {
          const eventDiv = document.createElement("div");
          eventDiv.className = `calendar-event ${indexClassMap[event.index] || "event-etc"}`;
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

      calendarBody.appendChild(cell);
    }
  };

  // ========================================
  // 3. List 뷰 렌더링
  // ========================================
  const renderListView = () => {
    const calendarBody = document.querySelector(".calendar-body");
    if (!calendarBody) return;

    // Month 뷰 숨기고 List 뷰 컨테이너 생성
    const listContainer = document.createElement("div");
    listContainer.className = "list-view";
    listContainer.innerHTML = "";

    // 현재 달의 모든 날짜 순회
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

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
      events.forEach(event => {
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
        dotSpan.className = `list-dot ${indexClassMap[event.index] || "event-etc"}`;

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

    parent.appendChild(listContainer);
  };

  // ========================================
  // 캘린더 렌더링 (뷰 모드에 따라)
  // ========================================
  const renderCalendar = () => {
    // 월/년도 제목 업데이트
    updateMonthTitle();

    // 뷰 모드에 따라 렌더링
    if (currentView === "month") {
      // List 뷰 숨기고 Month 뷰 표시
      const listView = document.querySelector(".list-view");
      if (listView) {
        listView.style.display = "none";
      }
      const calendarBody = document.querySelector(".calendar-body");
      if (calendarBody) {
        calendarBody.style.display = "grid";
      }
      renderMonthView();
    } else if (currentView === "list") {
      renderListView();
    }
  };

  // ========================================
  // 월/년도 제목 업데이트
  // ========================================
  const updateMonthTitle = () => {
    const titleElement = document.querySelector(".calendar-title");
    if (!titleElement) return;

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

    titleElement.textContent = `${monthNames[currentMonth].toUpperCase()} ${currentYear}`;
  };

  // ========================================
  // 4. 이벤트 리스너 등록
  // ========================================
  const initEventListeners = () => {
    // 이전 달 버튼 (캘린더 컨테이너 내에서만 선택)
    const prevBtn = document.querySelector(".calendar-container .bi-chevron-left")?.parentElement;
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar();
      });
    }

    // 다음 달 버튼 (캘린더 컨테이너 내에서만 선택)
    const nextBtn = document.querySelector(".calendar-container .bi-chevron-right")?.parentElement;
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar();
      });
    }

    // Today 버튼 (캘린더 컨테이너 내에서만 선택)
    const todayBtn = document.querySelector(".calendar-container .btn-primary.btn-sm");
    if (todayBtn) {
      todayBtn.addEventListener("click", () => {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        renderCalendar();
      });
    }

    // 뷰 모드 버튼들 (캘린더 컨테이너 내에서만 선택)
    const viewButtons = document.querySelectorAll(".calendar-container .btn-group button");
    viewButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // 모든 버튼 비활성화
        viewButtons.forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline-primary");
        });

        // 클릭된 버튼 활성화
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-primary");

        // 뷰 모드 전환
        if (index === 0) {
          currentView = "month";
          renderCalendar();
        } else if (index === 1) {
          Swal.fire({
            title: "WIP",
            text: "Week 뷰는 준비 중입니다.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (index === 2) {
          Swal.fire({
            title: "WIP",
            text: "Day 뷰는 준비 중입니다.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (index === 3) {
          currentView = "list";
          renderCalendar();
        }
      });
    });

    // Index 필터링 (캘린더 컨테이너 내에서만 선택)
    const indexItems = document.querySelectorAll(".calendar-container .index-item");
    indexItems.forEach(item => {
      item.addEventListener("click", () => {
        const indexText = item.querySelector("span:last-child").textContent.trim();

        // 토글
        if (activeFilters.includes(indexText)) {
          activeFilters = activeFilters.filter(f => f !== indexText);
          item.classList.remove("index-active");
        } else {
          activeFilters.push(indexText);
          item.classList.add("index-active");
        }

        // 재렌더링
        renderCalendar();
      });
    });
  };

  // ========================================
  // 초기화
  // ========================================
  const init = () => {
    console.log("📅 Calendar initialized");
    loadScheduleData();
    initEventListeners();
  };

  // DOM 로드 후 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
