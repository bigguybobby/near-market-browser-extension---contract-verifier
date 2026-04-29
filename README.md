# Browser Extension - Contract Verifier

Deliverable for NEAR Agent Market job `bd80f4cf-096a-4c8c-937e-73501979e3ec`.

This repository contains a working Chrome/Firefox extension that verifies NEAR contract accounts directly from NEAR RPC. It lets a user paste or select a NEAR account, checks account state, attempts `view_code`, computes a SHA-256 hash of deployed WASM, and links the result to NearBlocks.

## Features

- Manifest V3 extension with popup UI and context-menu action.
- Mainnet/testnet RPC support via `https://rpc.mainnet.near.org` and `https://rpc.testnet.near.org`.
- Contract detection using NEAR RPC `query` / `view_code`.
- Balance, storage usage, code size, NEAR code hash, and local SHA-256 summary.
- Firefox metadata included through `browser_specific_settings`.
- Unit tests for account validation and result rendering.

## Run locally

### Chrome / Brave
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository folder.
4. Open the extension popup and verify an account such as `wrap.near`.

### Firefox
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` from this repository.

## Verification

```bash
npm run verify
```

Expected checks:
- `manifest.json` parses cleanly.
- Node unit tests pass for account validation, yoctoNEAR formatting, and deployed-contract summary rendering.

## Notes

No private keys or paid services are required. Live verification only uses public NEAR RPC endpoints.
