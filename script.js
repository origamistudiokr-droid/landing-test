const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const amountChips = document.querySelectorAll(".amount-chip");
const entryAmount = document.querySelector("#entryAmount");
const spentAmount = document.querySelector("#spentAmount");
const leftAmount = document.querySelector("#leftAmount");
const countAmount = document.querySelector("#countAmount");
const rateAmount = document.querySelector("#rateAmount");
const statusPill = document.querySelector("#statusPill");
const demoRing = document.querySelector("#demoRing");
const demoList = document.querySelector("#demoList");
const signupForm = document.querySelector("#signupForm");
const emailInput = document.querySelector("#email");
const formMessage = document.querySelector("#formMessage");

const formatter = new Intl.NumberFormat("ko-KR");
const dailyGoal = 50000;
const baseSpent = 18700;

const categories = {
  "아메리카노": { className: "coffee", name: "커피" },
  "점심 식사": { className: "snack", name: "식사" },
  "택시": { className: "taxi", name: "교통" },
};

function formatWon(value) {
  return `${formatter.format(value)}원`;
}

function updateDemo(button) {
  const amount = Number(button.dataset.amount);
  const label = button.dataset.label;
  const total = baseSpent + amount;
  const left = Math.max(dailyGoal - total, 0);
  const rate = Math.min(Math.round((total / dailyGoal) * 100), 100);
  const category = categories[label] || categories["아메리카노"];

  amountChips.forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");

  entryAmount.textContent = formatWon(amount);
  spentAmount.textContent = formatWon(total);
  leftAmount.textContent = `남은 금액 ${formatWon(left)}`;
  countAmount.textContent = "5회";
  rateAmount.textContent = `${rate}%`;
  demoRing.style.setProperty("--progress", rate);

  statusPill.classList.remove("warning", "danger");
  if (rate >= 85) {
    demoRing.style.setProperty("--ring-color", "var(--red)");
    statusPill.classList.add("danger");
    statusPill.textContent = "잠깐. 오늘은 멈춤 신호야";
  } else if (rate >= 65) {
    demoRing.style.setProperty("--ring-color", "var(--orange)");
    statusPill.classList.add("warning");
    statusPill.textContent = "괜찮아. 이제 조금만 조심";
  } else {
    demoRing.style.setProperty("--ring-color", "var(--green)");
    statusPill.textContent = "좋아. 아직 안전해";
  }

  const firstItem = demoList.firstElementChild;
  firstItem.querySelector(".list-icon").className = `list-icon ${category.className}`;
  firstItem.querySelector("p").innerHTML = `${label}<small>방금 전</small>`;
  firstItem.querySelector("strong").textContent = formatWon(amount);

  document.querySelectorAll(".category-row span").forEach((item) => {
    item.classList.toggle("selected", item.textContent === category.name);
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

amountChips.forEach((button) => {
  button.addEventListener("click", () => updateDemo(button));
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  formMessage.classList.remove("error");

  if (!isValid) {
    formMessage.textContent = "알림을 받을 이메일을 정확히 입력해주세요.";
    formMessage.classList.add("error");
    emailInput.focus();
    return;
  }

  localStorage.setItem("haru-goal-waitlist-email", email);
  formMessage.textContent = "좋아요. 베타 오픈 소식을 가장 먼저 알려드릴게요.";
  signupForm.reset();
});
