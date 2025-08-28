document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
  
    const form = document.getElementById("oumukanisettingsform") as HTMLFormElement;
    const apikeyInput = document.getElementById("wanikaniApiKeyInput") as HTMLInputElement;
  
    if (!form || !apikeyInput) {
      console.error("Form or input field not found");
      return;
    }
  
    // Load saved API key on page load
    chrome.storage.sync.get(["wanikaniApiKey"], (result) => {
      if (result.wanikaniApiKey) {
        apikeyInput.value = result.wanikaniApiKey;
        console.log("Loaded saved API key.");
      }
    });
  
    // Save API key on form submit
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form reload
  
      const apiKey = apikeyInput.value;
      chrome.storage.sync.set({ wanikaniApiKey: apiKey }, () => {
        console.log("API key saved.");
        form.style.backgroundColor = "lightgreen";
      });
    });
  });