chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  switch (request.action) {
    case 'showAlert':
      alert(request.message);
      break;
      
    case 'contextMenuClicked':
      break;
      
    case 'getPageInfo':
      sendResponse({
        title: document.title,
        url: window.location.href,
        textContent: document.body.innerText.substring(0, 100) + '...'
      });
      break;
      
    default:
  }
  
  return true;
});

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
  }
}).observe(document, { subtree: true, childList: true });