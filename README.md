# VidLet Desktop

Thin [Electron](https://electronjs.org) shell around [vidlet.app](https://vidlet.app) — free video tools that process everything locally (ffmpeg.wasm, in-browser voice cloning). The shell adds a native window, mic/camera permissions, and system screen-capture for the recorder; all features live on the site, so installers rarely need updating.

**Download:** grab `VidLet-Setup.exe` (Windows) or `VidLet.AppImage` (Linux) from the [latest release](https://github.com/muammar-yacoob/vidlet-desktop/releases/latest).

Chromium (Electron) rather than a lighter webview wrapper because ffmpeg.wasm and PocketTTS need cross-origin isolation + SharedArrayBuffer, which Linux WebKitGTK handles unreliably.

## Develop

```bash
npm install
npm start          # run the shell
npm run dist       # build installers locally
```

## Release

Bump `version` in package.json, then tag and push — CI builds and publishes both installers:

```bash
git tag v1.x.x && git push origin v1.x.x
```

Related repos: [vidlet-website](https://github.com/muammar-yacoob/vidlet-website) (the app itself) · [VidLet](https://github.com/muammar-yacoob/VidLet) (CLI/context-menu tools for Windows/WSL).

## License

AGPL-3.0
