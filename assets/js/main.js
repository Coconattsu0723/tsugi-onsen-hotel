(() => {
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-site-menu]");
  const closeButton = menu?.querySelector("[data-menu-close]");
  const desktopQuery = window.matchMedia("(min-width: 1366px)");

  if (!menuButton || !menu || !closeButton) return;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  let isOpen = false;

  const getFocusableElements = () =>
    [...menu.querySelectorAll(focusableSelector)].filter(
      (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
    );

  const openMenu = () => {
    isOpen = true;
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "メニューを閉じる");
    document.body.classList.add("is-menu-open");
    getFocusableElements()[0]?.focus();
  };

  const closeMenu = ({ returnFocus = true } = {}) => {
    if (!isOpen && menu.hidden) return;

    isOpen = false;
    menu.hidden = true;
    menu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    document.body.classList.remove("is-menu-open");

    if (returnFocus) menuButton.focus();
  };

  const trapFocus = (event) => {
    if (!isOpen || event.key !== "Tab") return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  menuButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", () => closeMenu());

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) closeMenu({ returnFocus: false });
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    trapFocus(event);
  });

  const resetMenuAtDesktop = (event) => {
    if (event.matches) closeMenu({ returnFocus: false });
  };

  desktopQuery.addEventListener("change", resetMenuAtDesktop);
})();

(() => {
  const faq = document.querySelector("#faq");

  if (!faq) return;

  const buttons = [...faq.querySelectorAll(".faq-item__button")];

  buttons.forEach((button) => {
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;

    if (!answer) return;

    button.setAttribute("aria-expanded", "false");
    answer.hidden = true;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));
      answer.hidden = isExpanded;
    });
  });
})();
