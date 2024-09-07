// content.js
(function() {
    let settings = {
      maxSpeed: 16,
      skipAds: true
    };
  
    // Load initial settings
    chrome.storage.sync.get(['maxSpeed', 'skipAds'], function(result) {
      updateSettings(result);
    });
  
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === "updateSettings") {
        updateSettings(request.settings);
      }
    });
  
    function updateSettings(newSettings) {
      settings = {...settings, ...newSettings};
      console.log('Settings updated:', settings);
    }
  
    function isAdPlaying() {
      return !!document.querySelector('.ad-showing');
    }
  
    function speedUpAd(video) {
      if (isAdPlaying() && video.playbackRate < settings.maxSpeed) {
        video.playbackRate = Math.min(video.playbackRate * 2, settings.maxSpeed);
      } else if (!isAdPlaying() && video.playbackRate !== 1) {
        video.playbackRate = 1;
      }
    }
  
    function clickSkipButton() {
      if (!settings.skipAds) return false;
      
      const skipButtons = document.querySelectorAll('.ytp-ad-skip-button');
      for (const button of skipButtons) {
        button.click();
        return true;
      }
      return false;
    }
  
    function handleAds() {
      if (isAdPlaying()) {
        const video = document.querySelector('video');
        if (video) {
          speedUpAd(video);
        }
        
        clickSkipButton();
      }
    }
  
    // Run handleAds every second
    setInterval(handleAds, 1000);
  })();