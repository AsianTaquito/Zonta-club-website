/*
	Escape Velocity by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			alignment: 'center',
			detach: false
		});
			
	// Header image carousel
	document.addEventListener("DOMContentLoaded", function () {
		const header = document.getElementById("header");
		const captionBox = document.getElementById("header-caption");
		if (!header) return;

		// Get the current page filename
		const path = window.location.pathname;
		const page = path.substring(path.lastIndexOf("/") + 1) || "index.html";

		// Define images for each page (use objects with src and caption)
		const imageSets = {
			"index.html": [
				{ src: "images/Header images/IndexHeader.JPG", caption: "" },
				{ src: "images/Header images/IndexHeader01.JPG", caption: "" },
				{ src: "images/Header images/IndexHeader02.jpg", caption: "" },
				{ src: "images/Header images/IndexHeader03.JPG", caption: "" },
				{ src: "images/Header images/IndexHeader04.JPG", caption: "" },
				{ src: "images/Header images/IndexHeader05.JPG", caption: "" },
				{ src: "images/Header images/Zonta Club Naples.jpeg", caption: "" }
			],
			"left-sidebar.html": [
				{ src: "images/Header images/LeftHeader01.jpg", caption: "" },
				{ src: "images/Header images/LeftHeader02.jpg", caption: "" },
				{ src: "images/Header images/LeftHeader03.jpg", caption: "" },
				{ src: "images/Header images/LeftHeader04.jpg", caption: "" },
				{ src: "images/Header images/LeftHeader05.jpg", caption: "" }
			],
			"right-sidebar.html": [
				{ src: "images/Header images/ScholarshipBanner01.jpeg", caption: "Memorial Scholarship Endowment Fund" },
				{ src: "images/Header images/Scholarshipbanner02.jpeg", caption: "" },
				{ src: "images/Header images/ScholarshipBanner03.webp", caption: "" }
			]
		};

		// Fallback images if page not found
		const defaultImages = [
			{ src: "images/Header images/Zonta logo-cropped Jpeg.jpg", caption: "" }
		];

		// Pick the correct images for the current page
		let images = imageSets[page] || defaultImages;

		if (images.length === 0) {
			images = defaultImages;
		}

		let index = 0;

		function changeBackground() {
			header.style.backgroundImage = `url('${images[index].src}')`;
			if (captionBox) {
				captionBox.textContent = images[index].caption || "";
			}

			index++;
			if (index >= images.length) {
				index = 0; 
			}
		}

		// Initial image
		changeBackground();

		// Change background every 5 seconds
		setInterval(changeBackground, 5000);
	});


	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
					'<span class="title">' + $('#logo h1').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);