// Content script - runs in the context of web pages
console.log('Content script loaded on:', window.location.href);

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  switch (request.action) {
    case 'showAlert':
      alert(request.message);
      break;
      
    case 'contextMenuClicked':
      // Handle context menu selection
      console.log('Selected text:', request.selectionText);
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
      console.log('Unknown action:', request.action);
  }
  
  return true; // Keep message channel open for async response
});

// Example: Monitor page changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('Page navigation detected:', url);
  }
}).observe(document, { subtree: true, childList: true });