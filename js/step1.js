function updateTime() {
	const now = new Date();

	const time = now.toLocaleTimeString("default", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const date = now.toLocaleDateString("default", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});

	document.querySelector(".clock").textContent = time;
	document.querySelector(".date").textContent = `${date}`;
}




setInterval(updateTime, 1000);


// function unlock() {
// 	gsap.to("body", {
// 		opacity: 0,
// 		scale: 1.2,
// 		y: -100,
// 		duration: 0.8,
// 		ease: "power2.inOut",
// 		onComplete: () => {
// 			window.location.href = "step2.html";
// 		},
// 	});
// }

// // Animate in
// gsap.from("body", {
// 	opacity: 0,
// 	scale: 0.9,
// 	duration: 0.8,
// 	ease: "power2.out",
// });


window.addEventListener("DOMContentLoaded", () => {
	gsap.to("body", {
		opacity: 1,
		duration: 0.4,
		ease: "power2.out",
	});

	gsap.to("#page-loader", {
		opacity: 0,
		duration: 0.6,
		delay: 0.3,
		onComplete: () => {
			document.getElementById("page-loader").style.display = "none";
		},
	});
});

// Animate OUT, then go to next page
function goToPage() {
	document.getElementById("page-loader").style.display = "flex";
	gsap.fromTo("#page-loader", { opacity: 0 }, { opacity: 1, duration: 0.4 });
	gsap.to("body", {
		opacity: 0.3,
		duration: 0.3,
		ease: "power2.inOut",
		onComplete: () => {
			window.location.href = "step2.html";
		},
	});
}