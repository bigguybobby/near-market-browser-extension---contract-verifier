(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NearContractVerifierFormat = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const YOCTO = 10n ** 24n;
  const NAMED_ACCOUNT_RE = /^(?=.{2,64}$)([a-z0-9]+[a-z0-9_-]*\.)+[a-z0-9][a-z0-9_-]*$/;
  const IMPLICIT_ACCOUNT_RE = /^[a-f0-9]{64}$/;

  function isNearAccountId(value) {
    const text = String(value || '').trim();
    return NAMED_ACCOUNT_RE.test(text) || IMPLICIT_ACCOUNT_RE.test(text);
  }

  function formatYoctoNear(value) {
    const yocto = BigInt(String(value || '0'));
    const whole = yocto / YOCTO;
    const fractional = yocto % YOCTO;
    const decimals = fractional.toString().padStart(24, '0').slice(0, 5).replace(/0+$/, '');
    return `${whole.toString()}${decimals ? `.${decimals}` : ''} NEAR`;
  }

  function shortHash(hash) {
    const text = String(hash || '');
    return text.length > 18 ? `${text.slice(0, 10)}…${text.slice(-8)}` : text;
  }

  function nearblocksUrl(accountId, network) {
    const prefix = network === 'testnet' ? 'https://testnet.nearblocks.io' : 'https://nearblocks.io';
    return `${prefix}/address/${encodeURIComponent(accountId)}`;
  }

  function renderSummary(result) {
    if (!result || result.error) return `Unable to verify: ${result ? result.error : 'unknown error'}`;
    const lines = [
      `${result.accountId} on ${result.network}`,
      `Balance: ${formatYoctoNear(result.account.amount || '0')}`,
      `Storage used: ${result.account.storage_usage || 0} bytes`,
      result.contract && result.contract.present
        ? `Contract: deployed (${result.contract.codeSize} bytes, sha256 ${shortHash(result.contract.sha256)})`
        : 'Contract: no deployed WASM code found'
    ];
    if (result.account.locked && result.account.locked !== '0') lines.push(`Locked: ${formatYoctoNear(result.account.locked)}`);
    return lines.join('\n');
  }

  return { isNearAccountId, formatYoctoNear, shortHash, nearblocksUrl, renderSummary };
});
