chrome.runtime.onInstalled.addListener((details) => {
  
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      settings: {
        enableNotifications: true,
        theme: 'light',
        apiKey: ''
      }
    });
  }

  try {
    chrome.contextMenus.create({
      id: 'myExtensionMenu',
      title: 'My Extension Action',
      contexts: ['selection']
    });
  } catch (error) {
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  switch (request.action) {
    case 'getData':
      sendResponse({ data: 'Hello from background!' });
      break;
      
    case 'updateBadge':
      chrome.action.setBadgeText({
        text: request.text || '',
        tabId: sender.tab?.id
      });
      sendResponse({ success: true });
      break;
      
    default:
  }
  
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myExtensionMenu') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'contextMenuClicked',
      selectionText: info.selectionText
    });
  }
});