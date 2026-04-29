(() => {
  const ACCOUNT_RE = /\b(?:[a-z0-9]+[a-z0-9_-]*\.)+[a-z0-9][a-z0-9_-]*\b/g;
  const matches = document.body && document.body.innerText ? document.body.innerText.match(ACCOUNT_RE) : [];
  if (matches && matches.length) {
    try {
      const maybePromise = chrome.runtime.sendMessage({ type: 'near-account-candidates', count: matches.length });
      if (maybePromise && typeof maybePromise.catch === 'function') maybePromise.catch(() => {});
    } catch (_) {
      // Optional telemetry hint only; never disturb the page.
    }
  }
})();
