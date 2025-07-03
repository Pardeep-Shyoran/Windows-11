function goToMain() {
	gsap.to("body", {
		opacity: 0,
		y: -100,
		duration: 0.8,
		ease: "power2.inOut",
		onComplete: () => {
			window.location.href = "main.html";
		},
	});
}

// Animate in
gsap.from("body", {
	opacity: 0,
	y: 50,
	duration: 0.8,
	ease: "power2.out",
});
