const viewMenu = document.querySelector(".view-menu");
const sortMenu = document.querySelector(".sort-menu");
const newMenu = document.querySelector(".new-menu");
const alignMenu = document.querySelector(".align-menu");
const searchMenu = document.querySelector(".search-menu");
const widgetMenu = document.querySelector(".widget-menu");
const monthYear = document.querySelector(".calender-header-month-year");
const prevBtn = document.querySelector(".calender-header-prev-btn");
const nextBtn = document.querySelector(".calender-header-next-btn");
const dates = document.querySelector(".dates");
const showDate = document.querySelector(".calender-show-date");
const showCalender = document.querySelector(".taskbar-right-calander");
const calender = document.querySelector(".calender");
const showSystemSettings = document.querySelector(".taskbar-right-system-tray");
const systemSettings = document.querySelector(".system-settings-tray");
const showCurrentRunning = document.querySelector(".taskbar-right-running");
const currentRunning = document.querySelector(".system-current-running");
const showHomeFullView = document.querySelector(".taskbar-home-app");
const homeFullView = document.querySelector(".home-full-view");
const showSearchFullView = document.querySelector(".taskbar-search-app");
const searchFullView = document.querySelector(".search-full-view");
const showTaskbarWidget = document.querySelector(".taskbar-left");
const taskbarWidget = document.querySelector(".taskbar-left-widget");
const taskbarLeft = document.querySelector(".taskbar-left");
const taskbarCenter = document.querySelector(".taskbar-center");
const taskbarRight = document.querySelector(".taskbar-right");

const volumeSlider = document.getElementById("volumeSlider");
const brightnessSlider = document.getElementById("brightnessSlider");
const volumeValue = document.getElementById("volumeValue");
const brightnessValue = document.getElementById("brightnessValue");
const volumeImage = document.getElementById("volumeImage");
const sysButtons = document.querySelectorAll(".system-button");
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;
const taskbar = document.querySelector(".taskbar-center");
const explorerPath = document.getElementById("explorer-path");
const explorerList = document.getElementById("explorer-list");
const input = document.getElementById("input");
const output = document.getElementById("output");

let currentDate = new Date();
let currentOpen = null;
let contextClickInsidePopup = false;
let currentZIndex = 10;
let openCount = 0;
const maxOffset = 6;
const offsetStep = 2;
const baseTop = 2;
const baseLeft = 8;
const API_KEY = "AIzaSyClhfeeOg9VnKuUk5m5iqzyqhD3oAcWxBY"; // Replace with your API key
const CX = "1210f366cae804fb1"; // Replace with your CX
const resultsPerPage = 10;
let currentPage = 1;
let currentQuery = "";
let folderBeingRenamed = null;
let fileBeingRenamed = null;
const desktopPath = ["/", "home", "user", "desktop"];
let currentPath = ["/"];
let history = [];
let historyIndex = -1;
let notepadOpenFile = null; // { path: [...], name: "file.txt" }

function updateClock() {
	const now = new Date();

	const time = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const shortYear = (now.getFullYear() % 100).toString().padStart(2, "0");

	const date = now.toLocaleDateString("en-UK", {
		// weekday: "long",
		day: "numeric",
		month: "numeric",
		// year: "numeric",
	});

	document.querySelector(".clock").textContent = time;
	document.querySelector(".date").textContent = `${date}/${shortYear}`;
}

function updateWidgetClock() {
	const now = new Date();

	const time = now.toLocaleTimeString("default", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	// const shortYear = (now.getFullYear() % 100).toString().padStart(2, "0");

	const date = now.toLocaleDateString("default", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	document.querySelector(".taskbar-left-widget-clock").textContent = time;
	document.querySelector(".taskbar-left-widget-date").textContent = `${date}`;
}

const renderCalender = () => {
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	const firstDay = new Date(currentYear, currentMonth, 1);
	const lastDay = new Date(currentYear, currentMonth + 1, 0);
	const totalDays = lastDay.getDate();
	const firstDayIndex = firstDay.getDay();
	const lastDayIndex = lastDay.getDay();

	const monthYearString = currentDate.toLocaleString("default", {
		month: "long",
		year: "numeric",
	});

	const showDateString = currentDate.toLocaleDateString("Default", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});

	monthYear.textContent = monthYearString;

	showDate.textContent = showDateString;

	let datesHTML = "";

	for (let i = firstDayIndex; i > 0; i--) {
		const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);

		datesHTML += `<div class="calenderDate inactive"></div>`;
	}

	for (let i = 1; i <= totalDays; i++) {
		const date = new Date(currentYear, currentMonth, i);
		const activeClass =
			date.toDateString() === new Date().toDateString() ? "active" : "";

		datesHTML += `<div class="calenderDate ${activeClass}">${i}</div>`;
	}

	for (let i = 1; i <= 6 - lastDayIndex; i++) {
		const nextDate = new Date(currentYear, currentMonth + 1, i);

		datesHTML += `<div class="calenderDate inactive"></div>`;
	}

	dates.innerHTML = datesHTML;
};

prevBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	renderCalender();
});

nextBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	renderCalender();
});

const popups = [
	{
		trigger: showCalender,
		popup: calender,
		open: () => (calender.style.right = "1%"),
		close: () => (calender.style.right = "-50%"),
	},
	{
		trigger: showSystemSettings,
		popup: systemSettings,
		open: () => (systemSettings.style.bottom = "8%"),
		close: () => (systemSettings.style.bottom = "-50%"),
	},
	{
		trigger: showCurrentRunning,
		popup: currentRunning,
		open: () => (currentRunning.style.visibility = "visible"),
		close: () => (currentRunning.style.visibility = "hidden"),
	},
	{
		trigger: showHomeFullView,
		popup: homeFullView,
		open: () => (homeFullView.style.bottom = "8%"),
		close: () => (homeFullView.style.bottom = "-100%"),
	},
	{
		trigger: showSearchFullView,
		popup: searchFullView,
		open: () => (searchFullView.style.bottom = "8%"),
		close: () => (searchFullView.style.bottom = "-100%"),
	},
	{
		trigger: showTaskbarWidget,
		popup: taskbarWidget,
		open: () => (taskbarWidget.style.left = "1%"),
		close: () => (taskbarWidget.style.left = "-100%"),
	},
];

document.addEventListener("contextmenu", function (e) {
	const shouldBlockContextMenu = popups.some(
		({ popup, trigger }) =>
			popup.contains(e.target) || trigger.contains(e.target)
	);

	if (shouldBlockContextMenu) {
		e.preventDefault();
		return;
	}

	if (e.target.closest(".no-context-menu")) {
		e.preventDefault();
		return;
	}

	popups.forEach((p) => p.close());
	currentOpen = null;

	e.preventDefault();

	const menu = document.getElementById(
		e.target.closest(".taskbar") ? "custom-menu1" : "custom-menu"
	);

	const otherMenuId =
		menu.id === "custom-menu" ? "custom-menu1" : "custom-menu";
	document.getElementById(otherMenuId).style.visibility = "hidden";

	menu.style.visibility = "visible";
	menu.style.left = "-9999px";
	menu.style.top = "-9999px";

	const menuWidth = menu.offsetWidth;
	const menuHeight = menu.offsetHeight;
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	let posX = e.clientX;
	let posY = e.clientY;

	if (posX > windowWidth - menuWidth - viewMenu.offsetWidth) {
		viewMenu.style.left = "-70%";
	} else {
		viewMenu.style.left = "";
		viewMenu.style.right = "-70%";
	}

	if (posX > windowWidth - menuWidth - sortMenu.offsetWidth) {
		sortMenu.style.left = "-70%";
	} else {
		sortMenu.style.left = "";
		sortMenu.style.right = "-70%";
	}

	if (posX > windowWidth - menuWidth - newMenu.offsetWidth) {
		newMenu.style.left = "-70%";
	} else {
		newMenu.style.left = "";
		newMenu.style.right = "-70%";
	}

	if (posX > windowWidth - menuWidth - alignMenu.offsetWidth) {
		alignMenu.style.left = "-70%";
	} else {
		alignMenu.style.left = "";
		alignMenu.style.right = "-70%";
	}

	if (posX > windowWidth - menuWidth - searchMenu.offsetWidth) {
		searchMenu.style.left = "-70%";
	} else {
		searchMenu.style.left = "";
		searchMenu.style.right = "-70%";
	}

	if (posX > windowWidth - menuWidth - widgetMenu.offsetWidth) {
		widgetMenu.style.left = "-70%";
	} else {
		widgetMenu.style.left = "";
		widgetMenu.style.right = "-70%";
	}

	posX = posX > windowWidth - menuWidth ? windowWidth - menuWidth : posX;
	posY = posY > windowHeight - menuHeight ? windowHeight - menuHeight : posY;

	menu.style.left = `${posX}px`;
	menu.style.top = `${posY}px`;
});

popups.forEach(({ trigger, popup, open, close }) => {
	trigger.addEventListener("click", (e) => {
		e.stopPropagation();

		const isAlreadyOpen = currentOpen === popup;

		// Close all first
		popups.forEach((p) => p.close());
		currentOpen = null;

		// Hide both context menus on popup trigger click
		document.getElementById("custom-menu").style.visibility = "hidden";
		document.getElementById("custom-menu1").style.visibility = "hidden";

		// If it wasn't already open, open it and mark as current
		if (!isAlreadyOpen) {
			open();
			currentOpen = popup;
		}
	});

	popup.addEventListener("click", (e) => e.stopPropagation());
	popup.addEventListener("contextmenu", (e) => e.preventDefault());
});

document.addEventListener("click", () => {
	if (contextClickInsidePopup) {
		contextClickInsidePopup = false;
		return;
	}

	popups.forEach((p) => p.close());
	currentOpen = null;

	document.getElementById("custom-menu").style.visibility = "hidden";
	document.getElementById("custom-menu1").style.visibility = "hidden";
});

navigator.getBattery().then(function (battery) {
	const icon = document.getElementById("charging-icon");
	const quickIcon = document.getElementById("charging-icon-quick-settings");
	const percentageDiv = document.querySelector(
		".system-quick-charging-level"
	);

	function updateBatteryInfo() {
		// Show/hide SVG icon
		icon.style.display = battery.charging ? "inline" : "none";
		quickIcon.style.display = battery.charging ? "inline" : "none";

		// Update battery percentage text
		const percent = Math.round(battery.level * 100);
		percentageDiv.textContent = `${percent}%`;
	}

	// Initial update
	updateBatteryInfo();

	// Listen for updates
	battery.addEventListener("chargingchange", updateBatteryInfo);
	battery.addEventListener("levelchange", updateBatteryInfo);
});

volumeSlider.oninput = function () {
	const volume = parseInt(this.value);
	// volumeValue.textContent = volume + "%";

	// Optional: set volume of an actual audio element
	// document.getElementById('yourAudioElement').volume = volume / 100;

	let imageSrc = "";

	if (volume === 0) {
		imageSrc = "assets/audio0.png";
	} else if (volume <= 33) {
		imageSrc = "assets/audio1.png";
	} else if (volume <= 66) {
		imageSrc = "assets/audio2.png";
	} else {
		imageSrc = "assets/audio3.png";
	}

	volumeImage.src = imageSrc;
};

brightnessSlider.oninput = function () {
	// brightnessValue.textContent = this.value + "%";
	document.body.style.filter = "brightness(" + this.value + "%)";
};

function updateSliderFill(slider) {
	const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
	slider.style.background = `linear-gradient(to right, #4285f4 0%, #4285f4 ${val}%, #ccc ${val}%, #ccc 100%)`;
}

// Initialize fill
[brightnessSlider, volumeSlider].forEach((slider) => {
	updateSliderFill(slider);
	slider.addEventListener("input", () => updateSliderFill(slider));
});

sysButtons.forEach((button, index) => {
	const isActive = localStorage.getItem(`button-${index}`) === "true";
	if (isActive) {
		button.classList.add("active");
	}

	// Toggle logic with state saving
	button.addEventListener("click", () => {
		button.classList.toggle("active");
		const isNowActive = button.classList.contains("active");
		localStorage.setItem(`button-${index}`, isNowActive);
	});
});

themeBtn.addEventListener("click", () => {
	body.classList.toggle("dark-mode");
	themeBtn.classList.toggle("active");

	const isDark = body.classList.contains("dark-mode");
	localStorage.setItem("theme", isDark ? "dark" : "light");
});

// 🛠️ Utility functions
const getAppBtn = (app) =>
	document.querySelector(`.taskbar-center-app[data-app="${app}"]`);
const getAppWindow = (app) => document.getElementById(`window-${app}`);
const setVisible = (el, visible) =>
	(el.style.display = visible ? "block" : "none");

function createTaskbarBtn(app, icon) {
	const btn = document.createElement("div");
	btn.className = "taskbar-center-app";
	btn.dataset.app = app;
	btn.dataset.icon = icon;
	btn.innerHTML = `<img src="${icon}" />`;
	btn.addEventListener("click", () =>
		toggleAppWindow(app, getAppWindow(app))
	);
	return btn;
}

// 🚀 Launch app window
function launchAppWindow(app, win, icon) {
	if (win.style.display !== "block") {
		const index = Math.min(openCount, maxOffset);
		Object.assign(win.style, {
			top: `${baseTop + index * offsetStep}rem`,
			left: `${baseLeft + index * offsetStep}rem`,
			display: "block",
		});
		openCount++;
	}
	win.style.zIndex = ++currentZIndex;

	let btn = getAppBtn(app);
	if (!btn) {
		btn = createTaskbarBtn(app, icon);
		taskbar.appendChild(btn);
	}
	btn.classList.add("active");
}

// 🔁 Toggle visibility
function toggleAppWindow(app, win) {
	const visible = win.style.display !== "block";
	setVisible(win, visible);
	if (visible) win.style.zIndex = ++currentZIndex;
	getAppBtn(app)?.classList.toggle("active", visible);
}

// 📌 Init pinned icons
document.querySelectorAll(".taskbar-center-app[data-app]").forEach((btn) => {
	const app = btn.dataset.app;
	const win = getAppWindow(app);
	btn.classList.add("pinned");
	btn.addEventListener("click", () => toggleAppWindow(app, win));
});

// 🖱️ Init desktop icons (use double-click to open)
document.querySelectorAll(".desktop-app").forEach((icon) => {
	icon.addEventListener("dblclick", () => {
		const app = icon.dataset.app;
		const iconSrc = icon.dataset.icon;

		const win = getAppWindow(app);
		if (win) launchAppWindow(app, win, iconSrc);

		if (app === "notepad") {
			createNewTextFileAndOpenNotepad();
		} else if (win) {
			launchAppWindow(app, win, iconSrc);
		}
	});
});

// ❌ Close buttons
document.querySelectorAll(".app-window .close-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		const win = btn.closest(".app-window");
		const app = win.dataset.app;
		setVisible(win, false);

		const taskBtn = getAppBtn(app);
		if (taskBtn && !taskBtn.classList.contains("pinned")) {
			taskBtn.remove();
		} else {
			taskBtn?.classList.remove("active");
		}
	});
});

// --- Minimize Button Logic ---
document.querySelectorAll(".app-window .minimise-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		const win = btn.closest(".app-window");
		const app = win.dataset.app;

		setVisible(win, false);

		const taskBtn = getAppBtn(app);
		if (taskBtn) {
			taskBtn.classList.remove("active");
		}
	});
});

// --- Maximize/Restore Button Logic ---
document.querySelectorAll(".app-window .maximise-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		const win = btn.closest(".app-window");

		win.classList.toggle("maximized");

		const maximiseImg = btn.querySelector("img");
		if (win.classList.contains("maximized")) {
			maximiseImg.src = "assets/maximize.png";
			maximiseImg.alt = "Restore Down";
		} else {
			maximiseImg.src = "assets/maxmin.png";
			maximiseImg.alt = "Maximize";
		}
	});
});

// 🧱 Bring to front on click
document.querySelectorAll(".app-window").forEach((win) => {
	win.addEventListener(
		"mousedown",
		() => (win.style.zIndex = ++currentZIndex)
	);
});

// Browser

document.getElementById("query").addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		search();
	}
});

async function search(page = 1) {
	currentQuery = document.getElementById("query").value;
	if (!currentQuery) return;

	// localStorage.setItem("lastQuery", currentQuery);
	// localStorage.setItem("lastPage", page);

	document.getElementById("loader").style.display = "block";

	const startIndex = (page - 1) * resultsPerPage + 1;
	const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(
		currentQuery
	)}&start=${startIndex}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		const resultsDiv = document.getElementById("resultsContainer");
		resultsDiv.innerHTML = "";

		if (data.items && data.items.length > 0) {
			data.items.forEach((item) => {
				const result = document.createElement("div");
				result.className = "resultCard";

				// Optional image from pagemap
				const imageUrl = item.pagemap?.cse_image?.[0]?.src || "";

				result.innerHTML = `
	<div class="resultCardContent">
		<div class="resultText">
			<a href="#" onclick="openInIframe('${item.link.replace(
				/'/g,
				"\\'"
			)}'); return false;" class="resultTitle">
				${item.title}
			</a>
			<p class="resultSnippet">${item.snippet}</p>
			<a href="#" onclick="openInIframe('${item.link.replace(
				/'/g,
				"\\'"
			)}'); return false;" class="resultLink">
				${item.link}
			</a>
		</div>
		${
			imageUrl
				? `
			<div>
				<img src="${imageUrl}" alt="Result image" class="resultImage" />
			</div>
		`
				: ""
		}
	</div>
`;

				resultsDiv.appendChild(result);
			});

			currentPage = page;
			document.getElementById("prevBtn").disabled = currentPage === 1;
			document.getElementById("nextBtn").disabled =
				!data.queries?.nextPage;
		} else {
			resultsDiv.innerHTML = "<p>No results found.</p>";
		}
	} catch (err) {
		document.getElementById("resultsContainer").innerHTML =
			"<p>Error fetching results.</p>";
	}

	document.getElementById("loader").style.display = "none";
}

function changePage(delta) {
	const newPage = currentPage + delta;
	if (newPage < 1) return;
	search(newPage);
}

function openInIframe(link) {
	document.getElementById("mainView").style.display = "none";
	document.getElementById("iframeView").style.display = "block";
	document.getElementById("internalIframe").src = link;
}

function goBack() {
	document.getElementById("iframeView").style.display = "none";
	document.getElementById("mainView").style.display = "block";
}

// Explorer
// File Structure

let fileSystem = {
	"/": {
		home: {
			user: {
				desktop: {},
				documents: {
					"resume.docx": "file",
					"notes.txt": "Hello, world!",
					"sample.docx":
						"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", // "Hello, this is a test docx file."
					"sample.pdf":
						"JVBERi0xLjcNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhlbikgL1N0cnVjdFRyZWVSb290IDE1IDAgUi9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vTWV0YWRhdGEgMjcgMCBSL1ZpZXdlclByZWZlcmVuY2VzIDI4IDAgUj4+DQplbmRvYmoNCjIgMCBvYmoNCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWyAzIDAgUl0gPj4NCmVuZG9iag0KMyAwIG9iag0KPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFIvRjIgMTIgMCBSPj4vRXh0R1N0YXRlPDwvR1MxMCAxMCAwIFIvR1MxMSAxMSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dC9JbWFnZUIvSW1hZ2VDL0ltYWdlSV0gPj4vTWVkaWFCb3hbIDAgMCA1OTUuMzIgODQxLjkyXSAvQ29udGVudHMgNCAwIFIvR3JvdXA8PC9UeXBlL0dyb3VwL1MvVHJhbnNwYXJlbmN5L0NTL0RldmljZVJHQj4+L1RhYnMvUy9TdHJ1Y3RQYXJlbnRzIDA+Pg0KZW5kb2JqDQo0IDAgb2JqDQo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDMwOT4+DQpzdHJlYW0NCnictZJNa8MwDIbvBv8HHdtBHckfsQ3B0HyVjnUwGthh7NBD19PCPv4/zEm6doNml2a+CEm23+cVgmT7tmshy5JNsS4Bk7tde4DZvl2s7+chQF4W8M4ZCuyOc5YAwXgjlASnSXgJH3vOHm+g5SxvOEtqAiKBGpoXzrrbCARWCpQarPHCOGhe473VlhAOn/FvOAwpHdMVZ08Zok6R1DL4DMnWQWeoSh8WKnaKsq8aF1zMah3MuUnOhDQ7vUyX4RmaW86qyPbA2QReSKHQ6U8vvYNvblVhUAOP7QBMWMgYSR1jGog6+KLPT9gX6pODp0a4cXAypiPGqhqIMJ+ewJHQfnx0/2HaKWHtuOnoktx5X2Q+DECfFqtbs6mhJKEw6o8VUldJyouSflxyBvNfelBtCvgCJZbMjQ0KZW5kc3RyZWFtDQplbmRvYmoNCjUgMCBvYmoNCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUwL0Jhc2VGb250L0JDREVFRStBcHRvcy9FbmNvZGluZy9JZGVudGl0eS1IL0Rlc2NlbmRhbnRGb250cyA2IDAgUi9Ub1VuaWNvZGUgMjMgMCBSPj4NCmVuZG9iag0KNiAwIG9iag0KWyA3IDAgUl0gDQplbmRvYmoNCjcgMCBvYmoNCjw8L0Jhc2VGb250L0JDREVFRStBcHRvcy9TdWJ0eXBlL0NJREZvbnRUeXBlMi9UeXBlL0ZvbnQvQ0lEVG9HSURNYXAvSWRlbnRpdHkvRFcgMTAwMC9DSURTeXN0ZW1JbmZvIDggMCBSL0ZvbnREZXNjcmlwdG9yIDkgMCBSL1cgMjUgMCBSPj4NCmVuZG9iag0KOCAwIG9iag0KPDwvT3JkZXJpbmcoSWRlbnRpdHkpIC9SZWdpc3RyeShBZG9iZSkgL1N1cHBsZW1lbnQgMD4+DQplbmRvYmoNCjkgMCBvYmoNCjw8L1R5cGUvRm9udERlc2NyaXB0b3IvRm9udE5hbWUvQkNERUVFK0FwdG9zL0ZsYWdzIDMyL0l0YWxpY0FuZ2xlIDAvQXNjZW50IDkzOS9EZXNjZW50IC0yODIvQ2FwSGVpZ2h0IDkzOS9BdmdXaWR0aCA1NjEvTWF4V2lkdGggMTY4Mi9Gb250V2VpZ2h0IDQwMC9YSGVpZ2h0IDI1MC9TdGVtViA1Ni9Gb250QkJveFsgLTUwMCAtMjgyIDExODIgOTM5XSAvRm9udEZpbGUyIDI0IDAgUj4+DQplbmRvYmoNCjEwIDAgb2JqDQo8PC9UeXBlL0V4dEdTdGF0ZS9CTS9Ob3JtYWwvY2EgMT4+DQplbmRvYmoNCjExIDAgb2JqDQo8PC9UeXBlL0V4dEdTdGF0ZS9CTS9Ob3JtYWwvQ0EgMT4+DQplbmRvYmoNCjEyIDAgb2JqDQo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UcnVlVHlwZS9OYW1lL0YyL0Jhc2VGb250L0JDREZFRStBcHRvcy9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvRm9udERlc2NyaXB0b3IgMTMgMCBSL0ZpcnN0Q2hhciAzMi9MYXN0Q2hhciAzMi9XaWR0aHMgMjYgMCBSPj4NCmVuZG9iag0KMTMgMCBvYmoNCjw8L1R5cGUv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AfxQo6G5zNLvqBHkEIJVT/7v0ZPcq9xr3N9BfrEw7wWEuG9zLyMN90PgkUFykPsW98r/BQopF2QNCmVuZHN0cmVhbQ0KZW5kb2JqDQoyNSAwIG9iag0KWyAwWyA0NzFdICA3MFsgNzA3XSAgMjA1WyA1MzFdICAyMzhbIDU2MV0gIDI0NFsgNTI3XSAgMjY3WyAzMDFdICAyNzVbIDU1MV0gIDI3OFsgMjM5XSAgMjk5WyAyNjBdICAzMTRbIDU1Ml0gIDM0MVsgNTYxXSAgMzQ0WyAzMzRdICAzNDhbIDQ4Nl0gIDM1N1sgMzIzXSAgMzYyWyA1NTldICAzODNbIDcyMV0gIDM4OVsgNDUyXSAgOTg1WyAyMDNdICA5OTJbIDI4Nl0gIDk5NVsgODE4XSBdIA0KZW5kb2JqDQoyNiAwIG9iag0KWyAyMDNdIA0KZW5kb2JqDQoyNyAwIG9iag0KPDwvVHlwZS9NZXRhZGF0YS9TdWJ0eXBlL1hNTC9MZW5ndGggMzA2NT4+DQpzdHJlYW0NCjw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+PHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iMy4xLTcwMSI+CjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iPgo8cGRmOlByb2R1Y2VyPk1pY3Jvc29mdMKuIFdvcmQgTFRTQzwvcGRmOlByb2R1Y2VyPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KPGRjOmNyZWF0b3I+PHJkZjpTZXE+PHJkZjpsaT5QYXJkZWVwIFNoZW9yYW48L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KPHhtcDpDcmVhdG9yVG9vbD5NaWNyb3NvZnTCriBXb3JkIExUU0M8L3htcDpDcmVhdG9yVG9vbD48eG1wOkNyZWF0ZURhdGU+MjAyNS0wNy0wMVQxNzoyMDoxNyswNTozMDwveG1wOkNyZWF0ZURhdGU+PHhtcDpNb2RpZnlEYXRlPjIwMjUtMDctMDFUMTc6MjA6MTcrMDU6MzA8L3htcDpNb2RpZnlEYXRlPjwvcmRmOkRlc2NyaXB0aW9uPgo8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iPgo8eG1wTU06RG9jdW1lbnRJRD51dWlkOjYzNkQzOEY1LUYzMkUtNDA2Ni04ODNELThGMzBERDZBMkI5NzwveG1wTU06RG9jdW1lbnRJRD48eG1wTU06SW5zdGFuY2VJRD51dWlkOjYzNkQzOEY1LUYzMkUtNDA2Ni04ODNELThGMzBERDZBMkI5NzwveG1wTU06SW5zdGFuY2VJRD48L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjwvcmRmOlJERj48L3g6eG1wbWV0YT48P3hwYWNrZXQgZW5kPSJ3Ij8+DQplbmRzdHJlYW0NCmVuZG9iag0KMjggMCBvYmoNCjw8L0Rpc3BsYXlEb2NUaXRsZSB0cnVlPj4NCmVuZG9iag0KMjkgMCBvYmoNCjw8L1R5cGUvWFJlZi9TaXplIDI5L1dbIDEgNCAyXSAvUm9vdCAxIDAgUi9JbmZvIDE0IDAgUi9JRFs8RjUzODZENjMyRUYzNjY0MDg4M0Q4RjMwREQ2QTJCOTc+PEY1Mzg2RDYzMkVGMzY2NDA4ODNEOEYzMERENkEyQjk3Pl0gL0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggMTA4Pj4NCnN0cmVhbQ0KeJwtzM0NQFAQBOB5nr/gwkGiCQpQhKsWNKAhZ4WowZEGRMKRZ8Ye9kt2dxZw9TzG9Rz4mMRKzE3sKC7iF2IWGgYbCSvRCe2iHfDczxKesMIXgTDivwxdLl4YTwaSnqQ24iBNRtoeeAFG0hAsDQplbmRzdHJlYW0NCmVuZG9iag0KeHJlZg0KMCAzMA0KMDAwMDAwMDAxNSA2NTUzNSBmDQowMDAwMDAwMDE3IDAwMDAwIG4NCjAwMDAwMDAxNjMgMDAwMDAgbg0KMDAwMDAwMDIxOSAwMDAwMCBuDQowMDAwMDAwNTAzIDAwMDAwIG4NCjAwMDAwMDA4ODYgMDAwMDAgbg0KMDAwMDAwMTAxNCAwMDAwMCBuDQowMDAwMDAxMDQyIDAwMDAwIG4NCjAwMDAwMDExOTcgMDAwMDAgbg0KMDAwMDAwMTI3MCAwMDAwMCBuDQowMDAwMDAxNTA3IDAwMDAwIG4NCjAwMDAwMDE1NjEgMDAwMDAgbg0KMDAwMDAwMTYxNSAwMDAwMCBuDQowMDAwMDAxNzgyIDAwMDAwIG4NCjAwMDAwMDIwMjAgMDAwMDAgbg0KMDAwMDAwMDAxNiA2NTUzNSBmDQowMDAwMDAwMDE3IDY1NTM1IGYNCjAwMDAwMDAwMTggNjU1MzUgZg0KMDAwMDAwMDAxOSA2NTUzNSBmDQowMDAwMDAwMDIwIDY1NTM1IGYNCjAwMDAwMDAwMjEgNjU1MzUgZg0KMDAwMDAwMDAyMiA2NTUzNSBmDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDI2NjUgMDAwMDAgbg0KMDAwMDAwMzA1OSAwMDAwMCBuDQowMDAwMDExNzc3IDAwMDAwIG4NCjAwMDAwMTIwMTcgMDAwMDAgbg0KMDAwMDAxMjA0NCAwMDAwMCBuDQowMDAwMDE1MTkyIDAwMDAwIG4NCjAwMDAwMTUyMzcgMDAwMDAgbg0KdHJhaWxlcg0KPDwvU2l6ZSAzMC9Sb290IDEgMCBSL0luZm8gMTQgMCBSL0lEWzxGNTM4NkQ2MzJFRjM2NjQwODgzRDhGMzBERDZBMkI5Nz48RjUzODZENjMyRUYzNjY0MDg4M0Q4RjMwREQ2QTJCOTc+XSA+Pg0Kc3RhcnR4cmVmDQoxNTU0Ng0KJSVFT0YNCnhyZWYNCjAgMA0KdHJhaWxlcg0KPDwvU2l6ZSAzMC9Sb290IDEgMCBSL0luZm8gMTQgMCBSL0lEWzxGNTM4NkQ2MzJFRjM2NjQwODgzRDhGMzBERDZBMkI5Nz48RjUzODZENjMyRUYzNjY0MDg4M0Q4RjMwREQ2QTJCOTc+XSAvUHJldiAxNTU0Ni9YUmVmU3RtIDE1MjM3Pj4NCnN0YXJ0eHJlZg0KMTYzMDMNCiUlRU9G", // "Hello this is a pdf file."
				},
				downloads: { "setup.exe": "file" },
				pictures: { "vacation.jpg": "file" },
				videos: {},
				music: { "song.mp3": "file" },
				".recycle_bin": {}, // 👈 This is the hidden recycle bin
			},
		},
		etc: { nginx: {}, ssh: {} },
		tmp: {},
		opt: {},
	},
};

function handleSidebarClick(pathStr) {
	currentPath = pathStr.split("/").filter(Boolean);
	currentPath.unshift("/");
	renderExplorer();
}

// 2. Utility Functions
function getPathObject(pathArr) {
	let obj = fileSystem["/"];
	for (let i = 1; i < pathArr.length; i++) {
		if (obj[pathArr[i]]) {
			obj = obj[pathArr[i]];
		} else {
			obj = {};
			break;
		}
	}
	return obj;
}

function resolvePath(parts) {
	const path = [...currentPath];
	for (const part of parts) {
		if (part === "..") path.length > 1 && path.pop();
		else if (part !== "." && part) path.push(part);
	}
	return path;
}

function getNode(path, createMissing = false) {
	let node = fileSystem;
	for (const part of path) {
		if (!(part in node)) {
			if (createMissing) node[part] = {};
			else return null;
		}
		node = node[part];
		if (typeof node !== "object") return null;
	}
	return node;
}

function pathToString(path) {
	return path.join("/") || "/";
}

function appendToOutput(text) {
	const output = document.getElementById("output");
	output.innerHTML += text + "\n";
	output.scrollTop = output.scrollHeight;
}

// 3. Render Functions
function renderPath() {
	const pathEl = document.getElementById("explorer-path");
	pathEl.innerHTML = "";

	currentPath.forEach((segment, index) => {
		const span = document.createElement("span");
		span.textContent =
			segment + (index < currentPath.length - 1 ? "/" : "");
		span.style.cursor = "pointer";
		span.style.color = "lightblue";
		span.addEventListener("click", () => {
			currentPath = currentPath.slice(0, index + 1);
			renderExplorer();
		});
		pathEl.appendChild(span);
	});
}

function renderExplorer() {
	const explorerList = document.getElementById("explorer-list");
	explorerList.innerHTML = "";

	const currentDir = getPathObject(currentPath);
	Object.entries(currentDir).forEach(([name, content]) => {
		const li = document.createElement("li");
		li.style.cursor = "pointer";
		li.style.display = "flex";
		li.style.alignItems = "center";
		li.style.gap = "8px"; // spacing between icon and text

		const isFolder = typeof content === "object";

		if (
			(isFolder && name === folderBeingRenamed) ||
			(!isFolder && name === fileBeingRenamed)
		) {
			const input = document.createElement("input");
			input.type = "text";
			input.value = name;
			input.style.width = "80%";
			setTimeout(() => input.focus(), 0);

			const finishRename = () => {
				const newName = input.value.trim();
				if (
					newName &&
					newName !== name &&
					!currentDir.hasOwnProperty(newName)
				) {
					currentDir[newName] = currentDir[name];
					delete currentDir[name];
				}
				fileBeingRenamed = null;
				folderBeingRenamed = null;
				renderExplorer();
			};

			input.addEventListener("blur", finishRename);
			input.addEventListener("keydown", (e) => {
				if (e.key === "Enter") finishRename();
			});
			li.appendChild(input);
		} else {
			// 📦 Use real icon instead of emoji
			const icon = document.createElement("img");
			icon.src = isFolder ? "assets/folder.png" : "assets/file.png";
			icon.alt = isFolder ? "Folder Icon" : "File Icon";
			icon.style.width = "20px";
			icon.style.height = "20px";

			const nameSpan = document.createElement("span");
			nameSpan.textContent = name;

			li.appendChild(icon);
			li.appendChild(nameSpan);

			if (isFolder) {
				li.addEventListener("click", () => {
					currentPath.push(name);
					renderExplorer();
				});
			} else {
				li.addEventListener("dblclick", () => {
					const ext = name.split(".").pop().toLowerCase();
					if (["txt", "docx", "pdf"].includes(ext)) {
						openFileInNotepad([...currentPath], name);
					} else {
						alert(`No app to open .${ext} files.`);
					}
				});
			}
		}

		explorerList.appendChild(li);
	});

	renderPath();
}

function renderDesktopFiles() {
	const desktopApps = document.getElementById("desktop-apps");
	const desktopDir = getPathObject(desktopPath);

	const staticApps = Array.from(desktopApps.children).filter(
		(child) =>
			child.classList.contains("desktop-app") && !child.dataset.dynamic
	);
	desktopApps.innerHTML = "";
	staticApps.forEach((app) => desktopApps.appendChild(app));

	Object.entries(desktopDir).forEach(([name, content]) => {
		const item = document.createElement("div");
		item.className = "desktop-app desktop-file-item";
		item.dataset.dynamic = "true";
		item.dataset.path = pathToString([...desktopPath, name]); // Add this line

		const isFolder = typeof content === "object";
		const iconSrc = isFolder ? "assets/folder.png" : "assets/file.png";

		if (name === folderBeingRenamed || name === fileBeingRenamed) {
			const input = document.createElement("input");
			input.type = "text";
			input.value = name;
			input.className = "rename-input";
			setTimeout(() => input.focus(), 0);

			const finishRename = () => {
				const newName = input.value.trim();
				if (
					newName &&
					newName !== name &&
					!desktopDir.hasOwnProperty(newName)
				) {
					desktopDir[newName] = desktopDir[name];
					delete desktopDir[name];
				}
				folderBeingRenamed = null;
				fileBeingRenamed = null;
				renderDesktopFiles();
			};

			input.addEventListener("blur", finishRename);
			input.addEventListener(
				"keydown",
				(e) => e.key === "Enter" && finishRename()
			);
			item.appendChild(input);
		} else {
			item.innerHTML = `
		  <div class="icon">
			<img src="${iconSrc}" alt="" />
		  </div>
		  <div class="name">${name}</div>
		`;
			item.addEventListener("dblclick", () => {
				if (isFolder) {
					currentPath = [...desktopPath, name];
					renderExplorer();

					// 🔥 Show explorer and hide desktop
					const explorerSection =
						document.getElementById("window-explorer");

					if (explorerSection) {
						explorerSection.style.display = "block";
					}
				} else {
					const ext = name.split(".").pop().toLowerCase();
					if (["txt", "docx", "pdf"].includes(ext)) {
						openFileInNotepad([...desktopPath], name);
					} else {
						alert(`No app to open .${ext} files.`);
					}
				}
			});
		}
		desktopApps.appendChild(item);
	});
}

// 4. Event Listeners for New Folder/File
function handleNewFolder(dir, baseName = "New Folder") {
	let newName = baseName;
	let count = 1;
	while (dir.hasOwnProperty(newName)) {
		newName = `${baseName} (${count++})`;
	}
	dir[newName] = {};
	folderBeingRenamed = newName;
	fileBeingRenamed = null;
}

function handleNewFile(dir, baseName = "New File.txt") {
	let newName = baseName;
	let count = 1;
	while (dir.hasOwnProperty(newName)) {
		newName = `New File (${count++}).txt`;
	}
	dir[newName] = "";
	fileBeingRenamed = newName;
	folderBeingRenamed = null;
}

// 5. DOM Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("query").focus();

	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "dark") {
		body.classList.add("dark-mode");
		themeBtn.classList.add("active");
	}

	document.querySelectorAll("#quick-access li").forEach((item) => {
		item.addEventListener("click", () => {
			const targetPath = item.getAttribute("data-path");
			currentPath = targetPath.split("/").filter(Boolean);
			currentPath.unshift("/");
			renderExplorer();
		});
	});

	document
		.getElementById("desktop-new-folder")
		.addEventListener("click", () => {
			handleNewFolder(getPathObject(desktopPath));
			renderDesktopFiles();
		});

	document
		.getElementById("desktop-new-file")
		.addEventListener("click", () => {
			handleNewFile(getPathObject(desktopPath));
			renderDesktopFiles();
		});

	document.getElementById("new-folder-btn").addEventListener("click", () => {
		handleNewFolder(getPathObject(currentPath));
		renderExplorer();
	});

	document.getElementById("new-file-btn").addEventListener("click", () => {
		handleNewFile(getPathObject(currentPath));
		renderExplorer();
	});

	renderExplorer();
	renderDesktopFiles();
});

// Terminal
function handleExplorerClick(name) {
	const node = getNode(currentPath);
	if (typeof node[name] === "object") {
		// Directory: cd into it
		currentPath.push(name);
		appendToOutput(`$ cd ${name}`);
		const result = commands["cd"]([name]);
		appendToOutput(result);
		renderExplorer();
	} else {
		// File: cat it
		appendToOutput(`$ cat ${name}`);
		const result = commands["cat"]([name]);
		appendToOutput(result);
	}
}

const commands = {
	help: () => {
		const doc = {
			help: "Show this help menu",
			greet: "Print greeting",
			date: "Show current date and time",
			clear: "Clear the terminal screen",
			echo: "Print text or redirect with '> [file]'",
			add: "Add two numbers",
			reverse: "Reverse input text",
			random: "Generate a random number",
			pwd: "Print current working directory",
			ls: "List files and folders",
			cd: "Change directory",
			mkdir: "Create new folder",
			touch: "Create new file",
			cat: "Show file contents",
			rm: "Delete file or folder",
			edit: "Open file in editor",
			filesave: "Save to localStorage",
			fileload: "Load from localStorage",
		};
		return Object.entries(doc)
			.map(([cmd, desc]) => cmd.padEnd(20) + desc)
			.join("\n");
	},

	greet: () => "Hello, Welcome to Terminal.",

	date: () => new Date().toString(),

	clear: () => {
		output.innerHTML = "";
		return "";
	},

	add: (args) => {
		const [a, b] = args.map(Number);
		if (isNaN(a) || isNaN(b)) return "Usage: add x y";
		return `${a} + ${b} = ${a + b}`;
	},

	reverse: (args) => args.join(" ").split("").reverse().join(""),

	random: () => Math.floor(Math.random() * 1000),

	pwd: () => pathToString(currentPath),

	ls: () => {
		const node = getNode(currentPath);
		if (!node || typeof node !== "object") return "Invalid path.";
		const entries = Object.keys(node);
		return entries.length ? entries.join("\n") : "Directory is empty.";
	},

	cd: (args) => {
		if (!args[0]) return "Usage: cd [foldername]";
		const newPath = resolvePath(args[0].split("/"));
		console.log("Trying to cd to:", newPath);
		const target = getNode(newPath);
		if (target && typeof target === "object") {
			currentPath = newPath;
			renderExplorer();
			return `Changed directory to ${pathToString(currentPath)}`;
		}
		return `Directory "${args[0]}" not found.`;
	},

	mkdir: (args) => {
		if (!args[0]) return "Usage: mkdir [foldername]";
		const folderPath = resolvePath(args[0].split("/"));
		const parent = getNode(folderPath.slice(0, -1), true);
		const name = folderPath[folderPath.length - 1];
		if (!parent[name]) {
			parent[name] = {};
			renderExplorer?.();
			return `Folder "${args[0]}" created.`;
		}
		return `Folder "${args[0]}" already exists.`;
	},

	touch: (args) => {
		if (!args[0]) return "Usage: touch [filename]";
		const filePath = resolvePath(args[0].split("/"));
		const parent = getNode(filePath.slice(0, -1), true);
		const name = filePath[filePath.length - 1];
		if (!parent[name]) {
			parent[name] = "";
			renderExplorer();
			return `File "${args[0]}" created.`;
		}
		return `File "${args[0]}" already exists.`;
	},

	cat: (args) => {
		if (!args[0]) return "Usage: cat [filename]";
		const filePath = resolvePath(args[0].split("/"));
		const node = getNode(filePath.slice(0, -1));
		const name = filePath[filePath.length - 1];
		if (node && typeof node[name] === "string") {
			return node[name];
		}
		return `File "${args[0]}" not found or is a directory.`;
	},

	echo: (args) => {
		const redirectIndex = args.indexOf(">");
		if (redirectIndex !== -1) {
			const content = args.slice(0, redirectIndex).join(" ");
			const file = args[redirectIndex + 1];
			if (!file) return "Usage: echo [text] > [file]";
			const filePath = resolvePath(file.split("/"));
			const parent = getNode(filePath.slice(0, -1), true);
			const fileName = filePath[filePath.length - 1];
			parent[fileName] = content;
			renderExplorer();
			return "";
		}
		return args.join(" ");
	},

	rm: (args) => {
		if (!args[0]) return "Usage: rm [filename]";
		const filePath = resolvePath(args[0].split("/"));
		const parent = getNode(filePath.slice(0, -1));
		const name = filePath[filePath.length - 1];
		if (parent && parent[name] !== undefined) {
			delete parent[name];
			renderExplorer();
			return `File or folder "${args[0]}" deleted.`;
		}
		return `File "${args[0]}" not found.`;
	},

	filesave: () => {
		localStorage.setItem("terminal_fs", JSON.stringify(fileSystem));
		localStorage.setItem("terminal_pwd", JSON.stringify(currentPath));
		renderExplorer();
		return "File system saved.";
	},

	fileload: () => {
		const fs = localStorage.getItem("terminal_fs");
		const pwd = localStorage.getItem("terminal_pwd");
		if (fs) {
			fileSystem = JSON.parse(fs);
			currentPath = JSON.parse(pwd || '["/"]');
			renderExplorer();
			return "File system loaded.";
		}
		renderExplorer();
		return "No saved file system.";
	},

	edit: (args) => {
		const [filename, ...content] = args;
		if (!filename) return "Usage: edit [filename] [content]";
		const filePath = resolvePath(filename.split("/"));
		const parent = getNode(filePath.slice(0, -1), true);
		const name = filePath[filePath.length - 1];
		parent[name] = content.join(" ");
		renderExplorer();
		return `File "${filename}" updated.`;
	},
};

// // Handle user input
input.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		const inputText = input.value.trim();
		if (inputText === "") return; // Ignore empty input

		output.innerHTML += `$ ${inputText}\n`;

		history.push(inputText);
		historyIndex = history.length;

		const [cmd, ...args] = inputText.split(" ");
		if (commands[cmd]) {
			const result =
				typeof commands[cmd] === "function"
					? commands[cmd](args)
					: commands[cmd];
			if (cmd !== "clear") output.innerHTML += result + "\n";
		} else {
			output.innerHTML += `Unknown command: ${cmd}\n`;
		}

		input.value = "";
		output.scrollTop = output.scrollHeight;
	}

	// History navigation
	if (e.key === "ArrowUp") {
		if (historyIndex > 0) {
			historyIndex--;
			input.value = history[historyIndex];
		}
		e.preventDefault();
	} else if (e.key === "ArrowDown") {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			input.value = history[historyIndex];
		} else {
			input.value = "";
			historyIndex = history.length;
		}
		e.preventDefault();
	}

	// Autocomplete on Tab
	if (e.key === "Tab") {
		e.preventDefault();
		const tokens = input.value.trim().split(" ");
		const isFirstToken = tokens.length === 1;

		const possibilities = isFirstToken
			? Object.keys(commands)
			: Object.keys(getNode(currentPath) || {});

		const current = tokens[tokens.length - 1];
		const matches = possibilities.filter((p) => p.startsWith(current));

		if (matches.length === 1) {
			tokens[tokens.length - 1] = matches[0];
			input.value = tokens.join(" ");
		} else if (matches.length > 1) {
			output.innerHTML += `$ ${input.value.trim()}\n`;
			output.innerHTML += matches.join("  ") + "\n";
			output.scrollTop = output.scrollHeight;
		}
	}
});


function renderDocx(base64Docx, container) {
	const byteArray = Uint8Array.from(atob(base64Docx), (c) => c.charCodeAt(0));
	mammoth
		.convertToHtml({ arrayBuffer: byteArray })
		.then((result) => {
			container.innerHTML = result.value;
		})
		.catch((err) => {
			container.innerHTML = "Error reading .docx file.";
			console.error(err);
		});
}

function renderPDF(base64Pdf, container) {
	container.innerHTML = "";
	pdfjsLib
		.getDocument({ data: atob(base64Pdf) })
		.promise.then((pdf) => {
			for (let i = 1; i <= pdf.numPages; i++) {
				pdf.getPage(i).then((page) => {
					const canvas = document.createElement("canvas");
					container.appendChild(canvas);
					const viewport = page.getViewport({ scale: 1.2 });
					canvas.height = viewport.height;
					canvas.width = viewport.width;
					const context = canvas.getContext("2d");
					page.render({ canvasContext: context, viewport });
				});
			}
		})
		.catch((err) => {
			container.innerHTML = "Error loading PDF.";
			console.error(err);
		});
}

// 🧠 Formatting logic
document.querySelectorAll(".notepad-format-toolbar button").forEach((btn) => {
	btn.addEventListener("click", () => {
		const cmd = btn.dataset.cmd;
		const value = btn.dataset.value || null;
		document.execCommand(cmd, false, value);
	});
	// Font Size Selector
	document
		.getElementById("fontSizeSelector")
		.addEventListener("change", (e) => {
			const size = e.target.value;
			document.execCommand("fontSize", false, size);
		});

	// Text Color Picker
	document
		.getElementById("textColorPicker")
		.addEventListener("input", (e) => {
			const color = e.target.value;
			document.execCommand("foreColor", false, color);
		});
});

function openFileInNotepad(pathArray, fileName) {
	const folder = getNode(pathArray);
	const file = folder?.[fileName];

	const ext = fileName.split(".").pop().toLowerCase();
	const contentDiv = document.getElementById("notepadContent");
	if (!contentDiv) return;

	notepadOpenFile = null;

	if (ext === "txt" && typeof file === "string") {
		contentDiv.innerHTML = file;
		notepadOpenFile = { path: [...pathArray], name: fileName };
	} else if (ext === "docx") {
		renderDocx(file, contentDiv);
	} else if (ext === "pdf") {
		renderPDF(file, contentDiv);
	} else {
		alert("Unsupported file type.");
		return;
	}

	const win = getAppWindow("notepad");
	launchAppWindow("notepad", win, "assets/notepad.png");

	const fileNameDisplay = document.getElementById("notepad-filename");
	if (fileNameDisplay) fileNameDisplay.textContent = fileName;
}

document.getElementById("saveNote").addEventListener("click", () => {
	if (!notepadOpenFile) {
		alert("No file is open.");
		return;
	}
	const { path, name } = notepadOpenFile;
	const folder = getNode(path);
	if (folder && typeof folder[name] === "string") {
		const text = document.getElementById("notepadContent").innerHTML;

		folder[name] = text;
		alert(`Saved: ${name}`);
	}
});

document.getElementById("renameFile").addEventListener("click", () => {
	if (!notepadOpenFile) {
		alert("No file is open.");
		return;
	}

	const { path, name } = notepadOpenFile;
	const folder = getNode(path);
	const newName = prompt("Enter new name:", name);

	if (!newName || folder[newName]) {
		alert("Invalid or duplicate name.");
		return;
	}

	folder[newName] = folder[name];
	delete folder[name];

	notepadOpenFile.name = newName;
	renderExplorer();
	alert(`Renamed to ${newName}`);
});

document.getElementById("deleteFile").addEventListener("click", () => {
	if (!notepadOpenFile) {
		alert("No file is open.");
		return;
	}

	const { path, name } = notepadOpenFile;
	const folder = getNode(path);
	const recycle = getNode(["/", "home", "user", ".recycle_bin"]);

	if (folder && folder[name]) {
		recycle[name] = folder[name];
		delete folder[name];
		notepadOpenFile = null;
		const contentDiv = document.getElementById("notepadContent");
		if (contentDiv) contentDiv.innerHTML = "";
		alert(`Deleted "${name}" and moved to recycle bin.`);
		renderExplorer();
	}
});

document.getElementById("clearNote").addEventListener("click", () => {
	const contentDiv = document.getElementById("notepadContent");
	if (contentDiv) contentDiv.innerHTML = "";
});

function createNewTextFileAndOpenNotepad() {
	const path = ["/", "home", "user", "documents"];
	const folder = getNode(path);
	if (!folder) {
		alert("Documents folder not found.");
		return;
	}

	let baseName = "New File.txt";
	let count = 1;
	let newName = baseName;

	while (folder[newName]) {
		newName = `New File (${count++}).txt`;
	}

	folder[newName] = ""; // Create empty text file

	const contentDiv = document.getElementById("notepadContent");
	if (contentDiv) contentDiv.innerHTML = "";

	notepadOpenFile = {
		path,
		name: newName,
	};

	// Optional: Show filename somewhere
	const fileNameDisplay = document.getElementById("notepad-filename");
	if (fileNameDisplay) fileNameDisplay.textContent = newName;

	// Show Notepad window
	const win = getAppWindow("notepad");
	launchAppWindow("notepad", win, "assets/notepad.png");

	// Update Explorer in case user is inside that folder
	renderExplorer?.();
}

document.getElementById("newFile").addEventListener("click", () => {
	createNewTextFileInNotepad();
});
function createNewTextFileInNotepad() {
	const path = ["/", "home", "user", "documents"];
	const folder = getNode(path);
	if (!folder) {
		alert("Documents folder not found.");
		return;
	}

	let baseName = "New File.txt";
	let count = 1;
	let newName = baseName;

	while (folder[newName]) {
		newName = `New File (${count++}).txt`;
	}

	folder[newName] = "";

	notepadOpenFile = {
		path,
		name: newName,
	};

	// Reset textarea
	const contentDiv = document.getElementById("notepadContent");
	if (contentDiv) contentDiv.innerHTML = "";

	// Optional: update filename UI
	const fileNameDisplay = document.getElementById("notepad-filename");
	if (fileNameDisplay) fileNameDisplay.textContent = newName;

	// Keep Notepad window open — no need to relaunch
	renderExplorer?.();
}


renderCalender();

// Initial call
updateClock();

// Update every second
setInterval(updateClock, 1000);

// Initial call
updateWidgetClock();

// Update every second
setInterval(updateWidgetClock, 1000);

// renderExplorer();
// renderDesktopFiles();






