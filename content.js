(function () {
    let highlightedElement = null;
    let intervalId = null;

    const style = document.createElement("style");
    style.textContent = `
    ._highlighted-element-delete {
      outline: 2px solid #e73c7e !important;
      cursor: crosshair !important;
      background-color: #e73c7e;
    }
    ._highlighted-element-invisible {
      outline: 2px solid #23d5ab !important;
      cursor: crosshair !important;
      background-color: #23d5ab;
    }
    ._highlighted-element-display_none {
      outline: 2px solid #7a00ff !important;
      cursor: crosshair !important;
      background-color: #7a00ff;
    }
    ._invisible {
        visibility: hidden !important;
        pointer-events: none !important;
    }
    ._display_none {
        display: none !important;
    }
  `;
    document.head.appendChild(style);

    document.addEventListener("activateElementPicker", async () => {
        const { selecting } = await chrome.storage.local.get(["selecting"]);
        if (selecting) {
            document.body.style.cursor = "crosshair";
        } else {
            document.body.style.cursor = "default";
            if (highlightedElement)
                highlightedElement.classList.remove("_highlighted-element");
            if (intervalId) clearInterval(intervalId);
        }
    });

    document.addEventListener("mouseover", async (e) => {
        const { selecting } = await chrome.storage.local.get(["selecting"]);
        if (!selecting) return;
        const { mode } = await chrome.storage.local.get(["mode"]);
        if (highlightedElement) {
            highlightedElement.classList.remove("_highlighted-element-" + mode);
        }
        highlightedElement = e.target;
        highlightedElement.classList.add("_highlighted-element-" + mode);
    });

    document.addEventListener("mouseout", async (e) => {
        const { selecting } = await chrome.storage.local.get(["selecting"]);
        if (!selecting) return;
        const { mode } = await chrome.storage.local.get(["mode"]);
        if (e.target.classList.contains("_highlighted-element-" + mode)) {
            e.target.classList.remove("_highlighted-element-" + mode);
        }
    });

    document.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { selecting } = await chrome.storage.local.get(["selecting"]);
        if (!selecting) return;

        await chrome.storage.local.set({ selecting: false });
        const { interval } = await chrome.storage.local.get(["interval"]);
        const { mode } = await chrome.storage.local.get(["mode"]);
        document.body.style.cursor = "default";
        e.target.classList.remove("_highlighted-element-" + mode);

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
