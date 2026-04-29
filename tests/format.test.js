const test = require('node:test');
const assert = require('node:assert/strict');
const fmt = require('../src/format.js');

test('validates named and implicit NEAR accounts', () => {
  assert.equal(fmt.isNearAccountId('wrap.near'), true);
  assert.equal(fmt.isNearAccountId('aurora.pool.near'), true);
  assert.equal(fmt.isNearAccountId('a'.repeat(64)), true);
  assert.equal(fmt.isNearAccountId('Bad.NEAR'), false);
  assert.equal(fmt.isNearAccountId('no spaces.near'), false);
});

test('formats yoctoNEAR balances', () => {
  assert.equal(fmt.formatYoctoNear('1000000000000000000000000'), '1 NEAR');
  assert.equal(fmt.formatYoctoNear('10000000000000000000000'), '0.01 NEAR');
});

test('renders deployed contract summary', () => {
  const text = fmt.renderSummary({
    accountId: 'wrap.near',
    network: 'mainnet',
    account: { amount: '1000000000000000000000000', storage_usage: 12345 },
    contract: { present: true, codeSize: 4567, sha256: '1234567890abcdef1234567890abcdef' }
  });
  assert.match(text, /Contract: deployed/);
  assert.match(text, /Balance: 1 NEAR/);
});
