/**
 * Aim Data Classroom - Main JavaScript
 * Created by Kamil Lee
 */

(function () {
  "use strict"; 

  // ========================================
  // 사이드바 토글
  // ========================================
  const initSidebar = () => {
    const hamburgerBtn = document.getElementById("topnav-hamburger-icon");
    const headerLogo = document.querySelector("#page-topbar .logo-sm img");
    // 로고의 div('navbar-brand-box')
    const logoBox = document.querySelector(".navbar-brand-box");

    // 초기 로고 설정
    if (headerLogo) {
      if (window.innerWidth >= 992) {
        // 데스크톱: 사이드바 열린 상태이므로 logo
        headerLogo.src = "./static/img/logo.png";
      } else {
        // 모바일: 로고 삭제
        logoBox.remove();
      }
    }

    // 오버레이 생성
    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener("click", () => {
        const isSidebarEnabled = document.body.classList.toggle("sidebar-enable");

        // 헤더 로고 이미지 변경 (데스크톱에서만)
        if (headerLogo && window.innerWidth >= 992) {
          if (isSidebarEnabled) {
            // sidebar-enable = 사이드바 닫힘 → logoSmall
            headerLogo.src = "./static/img/logoSmall.png";
          } else {
            // sidebar-enable 해제 = 사이드바 열림 → logo
            headerLogo.src = "./static/img/logo.png";
          }
        }

        // 모바일에서 사이드바 표시/숨김
        const appMenu = document.querySelector(".app-menu");
        if (appMenu) {
          appMenu.classList.toggle("show");
        }

        // 오버레이 토글 (모바일/태블릿에서만)
        if (window.innerWidth < 992) {
          overlay.classList.toggle("show");
        }
      });

      // 오버레이 클릭 시 사이드바 닫기
      overlay.addEventListener("click", () => {
        document.body.classList.remove("sidebar-enable");
        const appMenu = document.querySelector(".app-menu");
        if (appMenu) {
          appMenu.classList.remove("show");
        }
        overlay.classList.remove("show");

        // 로고 복원 (데스크톱에서만) - sidebar-enable 제거 = 사이드바 열림 = logo
        if (headerLogo && window.innerWidth >= 992) {
          headerLogo.src = "./static/img/logo.png";
        }
      });
    }

    // 사이드바 외부 클릭 시 닫기
    document.addEventListener("click", e => {
      const appMenu = document.querySelector(".app-menu");

      // 데스크톱 또는 모바일에서 사이드바 외부 클릭 감지
      if (document.body.classList.contains("sidebar-enable")) {
        if (!appMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          appMenu.classList.remove("show");
          document.body.classList.remove("sidebar-enable");
          overlay.classList.remove("show");

          // 로고 원래대로 복원 (데스크톱에서만)
          if (headerLogo && window.innerWidth >= 992) {
            headerLogo.src = "./static/img/logo.png";
          }
        }
      }
    });
  };

  // ========================================
  // 메뉴 활성화
  // ========================================
  const initActiveMenu = () => {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll(".nav-link");

    menuLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href && currentPath.includes(href) && href !== "/") {
        link.classList.add("active");

        // 부모 메뉴도 활성화
        const parentCollapse = link.closest(".collapse");
        if (parentCollapse) {
          parentCollapse.classList.add("show");
          const parentLink = document.querySelector(`[data-bs-toggle="collapse"][href="#${parentCollapse.id}"]`);
          if (parentLink) {
            parentLink.classList.add("active");
            parentLink.setAttribute("aria-expanded", "true");
          }
        }
      }
    });
  };

  // ========================================
  // 드롭다운 메뉴
  // ========================================
  const initDropdownMenu = () => {
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');

    dropdownToggles.forEach(toggle => {
      // Bootstrap collapse 이벤트 리스너
      const targetId = toggle.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // collapse가 보여질 때
        target.addEventListener("show.bs.collapse", () => {
          toggle.setAttribute("aria-expanded", "true");
        });

        // collapse가 숨겨질 때
        target.addEventListener("hide.bs.collapse", () => {
          toggle.setAttribute("aria-expanded", "false");
        });
      }
    });
  };

  // ========================================
  // 페이지 이동 및 Breadcrumb 업데이트
  // ========================================
  const initBreadcrumb = () => {
    // 모든 사이드바 메뉴 링크 선택 (드롭다운 토글 제외)
    const menuLinks = document.querySelectorAll(".navbar-nav .nav-link:not(.menu-link)");

    // 사용자 드롭다운 메뉴 선택 (Logout 제외)
    const userDropdownLinks = document.querySelectorAll(".user-dropdown .dropdown-item:not(:last-child)");

    menuLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        // 메뉴 텍스트 가져오기
        const menuText = link.querySelector("span")?.textContent.trim() || link.textContent.trim();

        // 부모 메뉴가 있는지 확인
        const parentCollapse = link.closest(".menu-dropdown");
        let parentMenuText = null;

        if (parentCollapse) {
          // 부모 메뉴 찾기
          const parentLink = document.querySelector(`[href="#${parentCollapse.id}"]`);
          if (parentLink) {
            parentMenuText = parentLink.querySelector("span")?.textContent.trim();
          }
        }

        // Breadcrumb 업데이트
        updateBreadcrumb(parentMenuText, menuText);

        // 모든 메뉴에서 active 클래스 제거
        document.querySelectorAll(".navbar-nav .nav-link").forEach(l => l.classList.remove("active"));
        // 현재 클릭한 메뉴에 active 클래스 추가
        link.classList.add("active");
      });
    });

    // 사용자 프로필 드롭다운 메뉴 이벤트 리스너
    userDropdownLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        // 메뉴 텍스트 가져오기 (아이콘 제외)
        const menuText = link.textContent.trim();

        // 사용자 프로필 메뉴는 부모 메뉴 없이 직접 breadcrumb 업데이트
        updateBreadcrumb(null, menuText);

        // 사이드바 메뉴에서 active 클래스 제거
        document.querySelectorAll(".navbar-nav .nav-link").forEach(l => l.classList.remove("active"));
      });
    });
  };

  const updateBreadcrumb = (parentMenu, currentMenu) => {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (!breadcrumb) return;

    // 기존 breadcrumb 항목 모두 제거
    breadcrumb.innerHTML = "";

    // 클래스룸 항목 추가 (첫 번째 항목)
    const homeItem = document.createElement("li");
    homeItem.className = "breadcrumb-item";
    homeItem.textContent = "클래스룸";
    breadcrumb.appendChild(homeItem);

    // 부모 메뉴가 있으면 추가
    if (parentMenu) {
      const parentItem = document.createElement("li");
      parentItem.className = "breadcrumb-item";
      parentItem.textContent = parentMenu;
      breadcrumb.appendChild(parentItem);
    }

    // 현재 메뉴 추가 (active)
    if (currentMenu) {
      const currentItem = document.createElement("li");
      currentItem.className = "breadcrumb-item active";
      currentItem.textContent = currentMenu;
      breadcrumb.appendChild(currentItem);
    }
  };

  // ========================================
  // 반응형 처리
  // ========================================
  const handleResize = () => {
    const width = window.innerWidth;
    const appMenu = document.querySelector(".app-menu");
    const headerLogo = document.querySelector("#page-topbar .logo-sm img");
    const overlay = document.querySelector(".sidebar-overlay");
    const logoBox = document.querySelector(".navbar-brand-box");

    if (width >= 992) {
      // 데스크톱: 사이드바 항상 표시
      if (appMenu) {
        appMenu.classList.remove("show");
      }
      document.body.classList.remove("sidebar-enable");

      // 오버레이 닫기
      if (overlay) {
        overlay.classList.remove("show");
      }

      // 데스크톱: 로고 표시 (사이드바 열린 상태 = logo)
      if (headerLogo) {
        headerLogo.src = "./static/img/logo.png";
      }
    } else {
      // 모바일: 사이드바 숨김
      if (appMenu) {
        appMenu.classList.remove("show");
      }
      // 오버레이 닫기
      if (overlay) {
        overlay.classList.remove("show");
      }
      // 모바일: 로고 숨김
      if (headerLogo) {
        logoBox.remove();
      }
    }
  };

  // ========================================
  // 스크롤 이벤트
  // ========================================
  const initScrollEvent = () => {
    let lastScrollTop = 0;
    const topbar = document.getElementById("page-topbar");

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 헤더 그림자 효과
      if (scrollTop > 10) {
        topbar.style.boxShadow = "0 2px 8px rgba(56, 65, 74, 0.2)";
      } else {
        topbar.style.boxShadow = "0 1px 2px rgba(56, 65, 74, 0.15)";
      }

      lastScrollTop = scrollTop;
    });
  };

  // ========================================
  // 초기화
  // ========================================
  const init = () => {
    console.log("Aim Data Academy initialized");

    // 사이드바 초기화
    initSidebar();

    // 활성 메뉴 초기화
    initActiveMenu();

    // 드롭다운 메뉴 초기화
    initDropdownMenu();

    // Breadcrumb 초기화
    initBreadcrumb();

    // 스크롤 이벤트
    initScrollEvent();

    // 반응형 처리
    window.addEventListener("resize", handleResize);
    handleResize();
  };

  // DOM이 로드되면 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
