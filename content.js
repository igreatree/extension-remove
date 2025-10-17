(function () {
    let selecting = false;
    let highlightedElement = null;
    let interval = null;

    const style = document.createElement("style");
    style.textContent = `
    ._highlighted-element {
      outline: 2px solid red !important;
      cursor: crosshair !important;
      background-color: brown;
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
            if (highlightedElement) highlightedElement.classList.remove("_highlighted-element");
            if (interval) clearInterval(interval);
        }
    });

    document.addEventListener("mouseover", (e) => {
        if (!selecting) return;
        if (highlightedElement) highlightedElement.classList.remove("_highlighted-element");
        highlightedElement = e.target;
        highlightedElement.classList.add("_highlighted-element");
    });

    document.addEventListener("mouseout", (e) => {
        if (!selecting) return;
        if (e.target.classList.contains("_highlighted-element")) {
            e.target.classList.remove("_highlighted-element");
        }
    });

    document.addEventListener("click", (e) => {
        if (!selecting) return;
        e.preventDefault();
        e.stopPropagation();
        selecting = false;
        document.body.style.cursor = "default";
        e.target.remove();
        if (e.target.classList[0]) {
            console.log("The element with the class - " + e.target.classList[0] + " is removed");
            interval = setInterval(() => {
                document.body.querySelector(`.${e.target.classList[0]}`)?.remove();
            }, 10);
        }
    });
})();
