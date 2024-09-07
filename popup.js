// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const maxSpeedSlider = document.getElementById('maxSpeed');
    const speedValue = document.getElementById('speedValue');
    const skipAdsCheckbox = document.getElementById('skipAds');
    const saveButton = document.getElementById('save');
  
    // Load saved settings
    chrome.storage.sync.get(['maxSpeed', 'skipAds'], function(result) {
      maxSpeedSlider.value = result.maxSpeed || 16;
      speedValue.textContent = maxSpeedSlider.value;
      skipAdsCheckbox.checked = result.skipAds !== false; // Default to true if not set
    });
  
    maxSpeedSlider.addEventListener('input', function() {
      speedValue.textContent = this.value;
    });
  
    saveButton.addEventListener('click', function() {
      const settings = {
        maxSpeed: parseInt(maxSpeedSlider.value),
        skipAds: skipAdsCheckbox.checked
      };
  
      chrome.storage.sync.set(settings, function() {
        console.log('Settings saved', settings);
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "updateSettings", settings: settings});
        });
      });
    });
  });