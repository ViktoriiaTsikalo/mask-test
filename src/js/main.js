const burger = document.querySelector(".burger");
const nav = document.querySelector("#nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    const opened = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!opened));
    nav.hidden = opened;
  });
}
