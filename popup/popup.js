const button = document.getElementById("start");
const checkbox = document.getElementById("intervalCheckbox");
const select = document.getElementById("modeSelect");

chrome.storage.local.get(["interval"], (result) => {
  checkbox.checked = result.interval || false;
});

chrome.storage.local.get(["mode"], (result) => {
  select.value = result.mode || "delete";
});

button.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      document.dispatchEvent(new CustomEvent("activateElementPicker"));
    },
  });
});

checkbox.addEventListener("change", async () => {
  chrome.storage.local.set({ interval: checkbox.checked }, () => {
    console.log("Set interval mode:", checkbox.checked);
  });
});

select.addEventListener("change", async () => {
  chrome.storage.local.set({ mode: select.value }, () => {
    console.log("Set mode:", select.value);
  });
});
