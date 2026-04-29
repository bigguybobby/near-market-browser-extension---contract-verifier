chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'verify-near-contract',
    title: 'Verify NEAR contract for "%s"',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== 'verify-near-contract' || !info.selectionText) return;
  const account = encodeURIComponent(info.selectionText.trim().toLowerCase());
  chrome.windows.create({ url: chrome.runtime.getURL(`popup.html?account=${account}`), type: 'popup', width: 420, height: 520 });
});
