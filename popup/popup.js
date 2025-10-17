document.getElementById("start").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            document.dispatchEvent(new CustomEvent("activateElementPicker"));
        }
    });
});
