(function () {
  const root = document.documentElement;
  root.classList.add("js");
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Theme toggle: follows the system until the visitor picks one. */
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.getElementById("theme").addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Nav border once scrolled. */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Highlight the nav link for the section in view. */
  const links = [...document.querySelectorAll(".nav__links a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) spy.observe(target);
  });

  /* Reveal content as it scrolls in. */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        reveal.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
    reveal.observe(el);
  });

  /* Copy email. */
  const toast = document.getElementById("toast");
  let timer;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("is-on"), 2200);
  };
  document.getElementById("copy").addEventListener("click", async (e) => {
    const email = e.currentTarget.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      say("Email copied");
    } catch (err) {
      say(email);
    }
  });
})();
