VERDICT: UNVERIFIED

No product step executed in the deterministic run — playwright install chromium, playwright smoke, behavioral E2E. Nothing here is evidence about the product; the run could not look.

--- TEST REPORT (deterministic run) ---
## Stack: web-static @ .
### playwright install chromium (exit 1)
Downloading Chrome for Testing 153.0.8010.12 (playwright chromium v1243)[2m from http://127.0.0.1:9/builds/cft/153.0.8010.12/win64/chrome-win64.zip[22m
Downloading Chrome for Testing 153.0.8010.12 (playwright chromium v1243)[2m from http://127.0.0.1:9/builds/cft/153.0.8010.12/win64/chrome-win64.zip[22m
Downloading Chrome for Testing 153.0.8010.12 (playwright chromium v1243)[2m from http://127.0.0.1:9/builds/cft/153.0.8010.12/win64/chrome-win64.zip[22m
Downloading Chrome for Testing 153.0.8010.12 (playwright chromium v1243)[2m from http://127.0.0.1:9/builds/cft/153.0.8010.12/win64/chrome-win64.zip[22m
Downloading Chrome for Testing 153.0.8010.12 (playwright chromium v1243)[2m from http://127.0.0.1:9/builds/cft/153.0.8010.12/win64/chrome-win64.zip[22m
Failed to install browsers
Error: Failed to download Chrome for Testing 153.0.8010.12 (playwright chromium v1243), caused by
Error: Download failure, code=1
    at ChildProcess.<anonymous> (C:\Users\Anwender\.cache\office-crew\worktrees\tester-gate\node_modules\playwright-core\lib\coreBundle.js:32428:32)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)

Error: connect ECONNREFUSED 127.0.0.1:9
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 9
}
Error: connect ECONNREFUSED 127.0.0.1:9
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 9
}
Error: connect ECONNREFUSED 127.0.0.1:9
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 9
}
Error: connect ECONNREFUSED 127.0.0.1:9
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 9
}
Error: connect ECONNREFUSED 127.0.0.1:9
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 9
}

### playwright smoke
[env] the browser could not be installed on this host — the browser pass never ran, so nothing below is evidence about the product.
### behavioral E2E
[skipped] no browser — the authored suite could not run.
