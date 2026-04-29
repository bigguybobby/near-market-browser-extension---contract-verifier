(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NearContractVerifierRpc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const RPC_URLS = {
    mainnet: 'https://rpc.mainnet.near.org',
    testnet: 'https://rpc.testnet.near.org'
  };

  async function rpcQuery(body, rpcUrl, fetchImpl) {
    const fetcher = fetchImpl || fetch;
    const response = await fetcher(rpcUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'near-contract-verifier', ...body })
    });
    const payload = await response.json();
    if (payload.error) {
      const message = payload.error.cause && payload.error.cause.info && payload.error.cause.info.error_message
        ? payload.error.cause.info.error_message
        : payload.error.message || 'NEAR RPC error';
      throw new Error(message);
    }
    return payload.result;
  }

  async function sha256Base64(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function viewAccount(accountId, network, fetchImpl) {
    return rpcQuery({
      method: 'query',
      params: { request_type: 'view_account', finality: 'final', account_id: accountId }
    }, RPC_URLS[network], fetchImpl);
  }

  async function viewCode(accountId, network, fetchImpl) {
    return rpcQuery({
      method: 'query',
      params: { request_type: 'view_code', finality: 'final', account_id: accountId }
    }, RPC_URLS[network], fetchImpl);
  }

  async function verifyContract(accountId, network, fetchImpl) {
    const account = await viewAccount(accountId, network, fetchImpl);
    let contract = { present: false };
    try {
      const code = await viewCode(accountId, network, fetchImpl);
      const codeBase64 = code.code_base64 || '';
      contract = {
        present: Boolean(codeBase64),
        codeSize: codeBase64 ? Math.floor((codeBase64.length * 3) / 4) : 0,
        nearCodeHash: code.hash || null,
        sha256: codeBase64 ? await sha256Base64(codeBase64) : null,
        blockHeight: code.block_height || null
      };
    } catch (error) {
      contract = { present: false, reason: error.message };
    }
    return { accountId, network, account, contract, checkedAt: new Date().toISOString() };
  }

  return { RPC_URLS, rpcQuery, viewAccount, viewCode, verifyContract };
});
