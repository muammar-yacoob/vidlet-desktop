/**
 * VidLet desktop - a thin Electron shell around https://vidlet.app.
 *
 * All video processing already happens client-side (ffmpeg.wasm, PocketTTS),
 * so the shell stays dumb on purpose: the site updates itself, installers
 * never need re-releasing for app features. Chromium guarantees the same
 * SharedArrayBuffer/WebGPU behavior the site is tested against (the reason
 * this is Electron and not a webview wrapper - Linux WebKitGTK is flaky on
 * cross-origin isolation).
 */
const {
	app,
	BrowserWindow,
	desktopCapturer,
	session,
	shell,
} = require("electron");
const path = require("node:path");

const APP_URL = "https://vidlet.app";

function createWindow() {
	const win = new BrowserWindow({
		width: 1440,
		height: 900,
		minWidth: 900,
		minHeight: 600,
		autoHideMenuBar: true,
		backgroundColor: "#0a0a0a",
		icon: path.join(__dirname, "build", "icon.png"),
	});
	win.loadURL(APP_URL);
	// External links (GitHub, Buy me a coffee, ...) open in the OS browser.
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});
}

app.whenReady().then(() => {
	// Mic/camera for recording and voice-clone samples; the site's own UI is
	// the consent surface (Chromium would otherwise silently deny in Electron).
	session.defaultSession.setPermissionRequestHandler(
		(_wc, permission, callback) => {
			callback(["media", "display-capture"].includes(permission));
		},
	);
	// getDisplayMedia (screen recorder): system picker where available,
	// else the primary screen. Loopback audio capture is Windows-only.
	session.defaultSession.setDisplayMediaRequestHandler(
		(_request, callback) => {
			desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
				callback({
					video: sources[0],
					...(process.platform === "win32" ? { audio: "loopback" } : {}),
				});
			});
		},
		{ useSystemPicker: true },
	);

	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
