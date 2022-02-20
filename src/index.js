const { app, BrowserWindow } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		simpleFullscreen: true,
		skipTaskbar: true,
		acceptFirstMouse: true,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: true,
			allowRunningInsecureContent: false,
		},
		center: true,
		visualEffectState: "followSystem",
		vibrancy: "none",
		modal: true,
		resizable: true,
		roundedCorners: true,
		titleBarOverlay: true,
		titleBarStyle: "customButtonsOnHover",
		frame: false,
		disableAutoHideCursor: false,
		type: "window",
		tabbingIdentifier: "nothings",
	});

	// make the app is good
	mainWindow.setMenu(null);

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	// when the window is open log the time of the app
	mainWindow.on("ready-to-show", () => {
		console.log(new Date());
	});

	// log all app info
	console.log(
		`name: ${app.getName()} \n 
    version: ${app.getVersion()} \n
    path: ${app.getPath("exe")} \n
    UserCurrentLocation: ${app.getLocaleCountryCode()} \n
    UserCurrentLanguage: ${app.getLocaleCountryCode()} \n
    UserCurrentRegion: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZone: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneOffset: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneName: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneAbbreviation: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneDST: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneDSTOffset: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneDSTName: ${app.getLocaleCountryCode()} \n
    UserCurrentTimeZoneDSTAbbreviation: ${app.getLocaleCountryCode()} \n
    your time: ${new Date()} \n
    current time: (minutes: ${new Date()
			.getMinutes()
			.toLocaleString()} / hours: ${new Date()
			.getHours()
			.toLocaleString()} seconds: ${new Date()
			.getSeconds()
			.toLocaleString()}) \n`
	);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async (e) => {
	console.log("APP IS READY");
	await createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	console.log("window is quit");
	app.quit();
});

app.on("activate", () => {
	// if the window was more than 1 close the other 1
	if (BrowserWindow.getAllWindows().length === 0) {
		console.log("no windows");
		createWindow();
	} else {
		BrowserWindow.getAllWindows()[0].show();
		console.log("window is already open");
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here
