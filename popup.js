const fmt = self.NearContractVerifierFormat;
const rpc = self.NearContractVerifierRpc;
const accountInput = document.getElementById('account');
const networkInput = document.getElementById('network');
const result = document.getElementById('result');
const explorer = document.getElementById('explorer');

async function loadSelectionHint() {
  const params = new URLSearchParams(location.search);
  const selected = params.get('account');
  if (selected) accountInput.value = selected;
  const saved = await chrome.storage.local.get({ network: 'mainnet' });
  networkInput.value = saved.network;
}

async function verify() {
  const accountId = accountInput.value.trim().toLowerCase();
  const network = networkInput.value;
  await chrome.storage.local.set({ network });
  explorer.href = fmt.nearblocksUrl(accountId || 'near', network);
  if (!fmt.isNearAccountId(accountId)) {
    result.className = 'error';
    result.textContent = 'Invalid NEAR account ID. Use a named account like wrap.near or a 64-char implicit account.';
    return;
  }
  result.className = '';
  result.textContent = 'Checking NEAR RPC…';
  try {
    const verification = await rpc.verifyContract(accountId, network);
    result.textContent = fmt.renderSummary(verification);
    explorer.href = fmt.nearblocksUrl(accountId, network);
  } catch (error) {
    result.className = 'error';
    result.textContent = `Verification failed: ${error.message}`;
  }
}

document.getElementById('verify').addEventListener('click', verify);
accountInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') verify(); });
loadSelectionHint();
