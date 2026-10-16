(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll(".nav-toggle a").forEach((link) => {
    link.addEventListener("click", () => {
      const menu = link.closest(".nav-toggle");
      if (menu) menu.removeAttribute("open");
    });
  });

  const accentInputs = Array.from(document.querySelectorAll('input[name="accent"]'));
  const applyAccent = (name) => {
    root.dataset.accent = name;
    accentInputs.forEach((input) => {
      input.checked = input.value === name;
    });
    try {
      localStorage.setItem("my-first-accent", name);
    } catch (e) {}
  };

  applyAccent(root.dataset.accent || "amber");
  accentInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) applyAccent(input.value);
    });
  });

  const spotlight = document.getElementById("spotlight");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (spotlight && finePointer && !reduced) {
    let tx = window.innerWidth * 0.28;
    let ty = window.innerHeight * 0.18;
    let cx = tx;
    let cy = ty;
    let running = false;

    const place = () => {
      spotlight.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      place();
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        tx = event.clientX;
        ty = event.clientY;
        spotlight.classList.add("is-on");
        if (!running) {
          running = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true }
    );
  }

  const rows = Array.from(document.querySelectorAll("#log li"));
  const log = document.getElementById("log");
  const scripts = [
    [
      ["repo", "SeldonEVOHub/my-first"],
      ["branch", "cursor/landing-showcase"],
      ["commit", "Compose the first landing page"],
      ["verify", "open index.html"],
      ["status", "pull request ready"],
    ],
    [
      ["intent", "a page you can open"],
      ["stack", "html · css · javascript"],
      ["motion", "type, then rest"],
      ["tone", "amber · celadon · iris"],
      ["result", "one reviewable change"],
    ],
  ];

  let paused = false;
  if (finePointer && log) {
    log.addEventListener("pointerenter", () => {
      paused = true;
    });
    log.addEventListener("pointerleave", () => {
      paused = false;
    });
  }

  const wait = (ms) =>
    new Promise((resolve) => {
      let remaining = ms;
      let last = performance.now();
      const frame = (now) => {
        const delta = now - last;
        last = now;
        if (!paused) remaining -= delta;
        if (remaining <= 0) resolve();
        else requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });

  const clearRowState = () => {
    rows.forEach((row) => {
      row.classList.remove("is-active", "is-typing", "is-ready");
      row.querySelector(".v").textContent = "";
    });
  };

  const writeKeys = (script) => {
    rows.forEach((row, index) => {
      const pair = script[index];
      row.querySelector(".k").textContent = pair ? pair[0] : "";
    });
  };

  async function play(script) {
    clearRowState();
    writeKeys(script);
    if (reduced) {
      rows.forEach((row, index) => {
        row.querySelector(".v").textContent = script[index][1];
      });
      rows[rows.length - 1].classList.add("is-ready");
      return;
    }

    for (let i = 0; i < script.length; i += 1) {
      rows.forEach((row, index) => {
        row.classList.toggle("is-typing", index === i);
        row.classList.toggle("is-active", index < i);
      });
      const text = script[i][1];
      const value = rows[i].querySelector(".v");
      for (let c = 1; c <= text.length; c += 1) {
        value.textContent = text.slice(0, c);
        await wait(text.length > 28 ? 16 : 24);
      }
      await wait(140);
    }
    rows.forEach((row) => row.classList.remove("is-typing", "is-active"));
    rows[rows.length - 1].classList.add("is-ready");
    await wait(2300);
  }

  async function loop() {
    let index = 0;
    while (true) {
      await play(scripts[index % scripts.length]);
      if (reduced) return;
      log.classList.add("is-fading");
      await wait(380);
      log.classList.remove("is-fading");
      index += 1;
    }
  }

  if (rows.length && log) loop();

  if (!reduced && !CSS.supports("animation-timeline", "view()")) {
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      reveals.forEach((node) => observer.observe(node));
    } else {
      reveals.forEach((node) => node.classList.add("is-in"));
    }
  }
})();
