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
function goToMain() {
	document.getElementById("page-loader").style.display = "flex";
	gsap.fromTo("#page-loader", { opacity: 0 }, { opacity: 1, duration: 0.4 });
	gsap.to("body", {
		opacity: 0.3,
		duration: 0.3,
		ease: "power2.inOut",
		onComplete: () => {
			window.location.href = "main.html";
		},
	});
}
