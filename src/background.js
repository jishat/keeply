// Background script (Service Worker)

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  
  if (details.reason === 'install') {
    // Set default settings on first install
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
    // Context menu already exists
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  switch (request.action) {
    case 'getData':
      sendResponse({ data: 'Hello from background!' });
      break;
      
    case 'updateBadge':
      // Update extension badge
      chrome.action.setBadgeText({
        text: request.text || '',
        tabId: sender.tab?.id
      });
      sendResponse({ success: true });
      break;
      
    default:
      // Unknown action
  }
  
  return true; // Keep message channel open for async response
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'myExtensionMenu') {
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'contextMenuClicked',
      selectionText: info.selectionText
    });
  }
});