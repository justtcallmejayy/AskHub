let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");

const toggleDarkMode = () => {
  const isDark = document.body.classList.toggle("darkmode");
  console.log("Dark Mode Toggled:", isDark);
  localStorage.setItem("darkmode", isDark ? "active" : null);
};

if (darkmode === "active") {
  console.log("Dark mode is active");
  document.body.classList.add("darkmode");
} else {
  console.log("Dark mode is inactive");
}

if (themeSwitch) {
  themeSwitch.addEventListener("click", toggleDarkMode);
} else {
  console.error("Theme switch button not found");
}