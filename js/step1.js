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


function unlock() {
	gsap.to("body", {
		opacity: 0,
		scale: 1.2,
		y: -100,
		duration: 0.8,
		ease: "power2.inOut",
		onComplete: () => {
			window.location.href = "step2.html";
		},
	});
}

// Animate in
gsap.from("body", {
	opacity: 0,
	scale: 0.9,
	duration: 0.8,
	ease: "power2.out",
});