const channel = "acilione-physics-v1";
for (const frame of document.querySelectorAll("iframe[data-simulation]")) {
  const simulation = frame.dataset.simulation;
  const origin = new URL(frame.src, location.href).origin;
  const status = document.getElementById(
    frame.getAttribute("aria-describedby"),
  );
  let ready = false;
  const syncTheme = () =>
    frame.contentWindow?.postMessage(
      {
        channel,
        simulation,
        type: "theme",
        theme:
          document.documentElement.dataset.theme === "light" ? "light" : "dark",
      },
      origin,
    );
  const timeout = setTimeout(() => {
    if (!ready && status)
      status.textContent =
        "The experiment is taking longer to load. You can open the standalone version below.";
  }, 15000);
  frame.addEventListener("load", syncTheme);
  window.addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow || event.origin !== origin) return;
    const data = event.data;
    if (!data || data.channel !== channel || data.simulation !== simulation)
      return;
    if (data.type === "ready") {
      const first = !ready;
      ready = true;
      clearTimeout(timeout);
      frame.dataset.ready = "true";
      if (status) status.hidden = true;
      if (first) syncTheme();
    } else if (
      data.type === "resize" &&
      Number.isFinite(data.height) &&
      data.height >= 200 &&
      data.height <= 6000
    ) {
      frame.style.height = Math.ceil(data.height) + "px";
    } else if (data.type === "error") {
      clearTimeout(timeout);
      if (status) {
        status.hidden = false;
        status.textContent =
          "The 3D view could not start. Try the standalone version with WebGL enabled.";
      }
    }
  });
  new MutationObserver(syncTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  syncTheme();
}
