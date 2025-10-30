chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  switch (request.action) {
    case 'showAlert':
      alert(request.message);
      break;
      
    case 'contextMenuClicked':
      // Handle context menu selection
      // You could highlight the text, process it, etc.
      break;
      
    case 'getPageInfo':
      // Return page information
      sendResponse({
        title: document.title,
        url: window.location.href,
        textContent: document.body.innerText.substring(0, 100) + '...'
      });
      break;
      
    default:
      // Unknown action
  }
  
  return true; // Keep message channel open for async response
});

// Example: Monitor page changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Page navigation detected
  }
}).observe(document, { subtree: true, childList: true });