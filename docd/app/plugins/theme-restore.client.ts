export default defineNuxtPlugin(() => {
  const theme = localStorage.getItem("docs-color-theme");
  const radius = localStorage.getItem("docs-radius");

  if (theme) document.documentElement.classList.add(theme);
  if (radius) document.documentElement.style.setProperty("--radius", radius);
});
