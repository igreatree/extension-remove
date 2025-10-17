(function () {
  let selecting = false;
  let highlightedElement = null;
  let intervalId = null;

  const style = document.createElement("style");
  style.textContent = `
    ._highlighted-element {
      outline: 2px solid red !important;
      cursor: crosshair !important;
      background-color: brown;
    }
    ._invisible {
        visibility: hidden !important;
    }
    ._display_none {
        display: none !important;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener("activateElementPicker", () => {
    selecting = !selecting;
    if (selecting) {
      document.body.style.cursor = "crosshair";
      alert("Select mode enabled - point and click to delete.");
    } else {
      document.body.style.cursor = "default";
      if (highlightedElement)
        highlightedElement.classList.remove("_highlighted-element");
      if (intervalId) clearInterval(intervalId);
    }
  });

  document.addEventListener("mouseover", (e) => {
    if (!selecting) return;
    if (highlightedElement)
      highlightedElement.classList.remove("_highlighted-element");
    highlightedElement = e.target;
    highlightedElement.classList.add("_highlighted-element");
  });

  document.addEventListener("mouseout", (e) => {
    if (!selecting) return;
    if (e.target.classList.contains("_highlighted-element")) {
      e.target.classList.remove("_highlighted-element");
    }
  });

  document.addEventListener("click", async (e) => {
    if (!selecting) return;
    e.preventDefault();
    e.stopPropagation();
    selecting = false;
    document.body.style.cursor = "default";
    e.target.classList.remove("_highlighted-element");
    const { interval } = await chrome.storage.local.get(["interval"]);
    const { mode } = await chrome.storage.local.get(["mode"]);
    console.log("CONFIG", {
      interval,
      mode,
    });
    switch (mode) {
      case "delete":
        e.target.remove();
        break;
      case "invisible":
        e.target.classList.add("_invisible");
        break;
      case "display_none":
        e.target.classList.add("_display_none");
        break;
    }
    if (interval && e.target.classList[0]) {
      switch (mode) {
        case "delete":
          intervalId = setInterval(() => {
            document.body.querySelector(`.${e.target.classList[0]}`)?.remove();
          }, 10);
          break;
        case "invisible":
          intervalId = setInterval(() => {
            document.body
              .querySelector(`.${e.target.classList[0]}`)
              ?.classList?.add("_invisible");
          }, 10);
          break;
        case "display_none":
          intervalId = setInterval(() => {
            document.body
              .querySelector(`.${e.target.classList[0]}`)
              ?.classList?.add("_display_none");
          }, 10);
          break;
      }
    }
  });
})();
