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

document.addEventListener("DOMContentLoaded", () => {

    // NavBar Cart counter
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);

        const badge = document.getElementById("cart-count");
        if (!badge) return;

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = "inline-block";
        } else {
            badge.style.display = "none";
        }
    }
    updateCartCount();



    // Shop Page Buttons
    function addItemToCart(productSection, productId) {
        const productName = productSection.querySelector("h3").textContent.trim();
        const productPrice = parseFloat(productSection.querySelector("p").getAttribute("data-price"));
        const id = productId || productName;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name: productName, price: productPrice, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    // Purchase now
    document.querySelectorAll(".purchase-button").forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();
            const section = button.closest("section.highlight");
            addItemToCart(section, button.dataset.id);
            window.location.href = "checkout.html";
        });
    });

    // Add to cart
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();
            const section = button.closest("section.highlight");
            addItemToCart(section, button.dataset.id);
            alert("Item added to cart!");
        });
    });



    // Cart Page  
    if (document.getElementById("cart-body")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function renderCart() {
            const tbody = document.getElementById("cart-body");
            tbody.innerHTML = "";

            let subtotal = 0;

            cart.forEach((item, index) => {
                const total = item.price * item.quantity;
                subtotal += total;

                tbody.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>
                            <button class="qty-btn" data-index="${index}" data-change="-1">-</button>
                            ${item.quantity}
                            <button class="qty-btn" data-index="${index}" data-change="1">+</button>
                        </td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${total.toFixed(2)}</td>
                        <td><button class="remove-btn" data-index="${index}">X</button></td>
                    </tr>
                `;
            });

            document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        }

        document.addEventListener("click", e => {
            if (e.target.classList.contains("qty-btn")) {
                const i = e.target.dataset.index;
                cart[i].quantity += parseInt(e.target.dataset.change);
                if (cart[i].quantity <= 0) cart.splice(i, 1);
                renderCart();
            }
            if (e.target.classList.contains("remove-btn")) {
                cart.splice(e.target.dataset.index, 1);
                renderCart();
            }
        });

        renderCart();
    }

    // Checkout Page
    if (document.getElementById("checkout-body")) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const tbody = document.getElementById("checkout-body");
        const taxRate = 0.07;

        if (cart.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Your cart is empty.</td></tr>`;
        } else {
            let subtotal = 0;

            cart.forEach(item => {
                const total = item.price * item.quantity;
                subtotal += total;

                tbody.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${total.toFixed(2)}</td>
                    </tr>
                `;
            });

            const tax = subtotal * taxRate;
            const grandTotal = subtotal + tax;

            document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
            document.getElementById("grand-total").textContent = `$${grandTotal.toFixed(2)}`;
        }
    }



    // Header Carousel
    const header = document.getElementById("header");
    const captionBox = document.getElementById("header-caption");

    if (header) {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf("/") + 1) || "index.html";

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

        const images = imageSets[page] || [
            { src: "images/Header images/Zonta logo-cropped Jpeg.jpg", caption: "" }
        ];

        let index = 0;

        function changeBackground() {
            header.style.backgroundImage = `url('${images[index].src}')`;
            captionBox.textContent = images[index].caption;
            index = (index + 1) % images.length;
        }

        changeBackground();
        setInterval(changeBackground, 5000);
    }

    // Calendar
    const eventsList = document.getElementById("events-list");

    if (eventsList) {
        const API_KEY = "YOUR_API_KEY";
        const CAL_ID = "YOUR_CALENDAR_ID";

        const url =
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events` +
            `?key=${API_KEY}&timeMin=${new Date().toISOString()}` +
            "&singleEvents=true&orderBy=startTime&maxResults=10";

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!data.items || data.items.length === 0) {
                    eventsList.innerHTML = `<li class="no-events-message">No upcoming events.</li>`;
                    return;
                }

                data.items.forEach(event => {
                    const li = document.createElement("li");

                    const start = event.start.dateTime || event.start.date;
                    const date = new Date(start);

                    const dateStr = date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                    });

                    const timeStr = event.start.dateTime
                        ? date.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit"
                        })
                        : "All day";

                    li.innerHTML = `
                        <strong>${event.summary || "Untitled Event"}</strong><br>
                        ${dateStr} &nbsp; • &nbsp; ${timeStr}
                    `;

                    eventsList.appendChild(li);
                });
            })
            .catch(err => {
                console.error("Calendar API error:", err);
                eventsList.innerHTML = `<li class="no-events-message">Unable to load events.</li>`;
            });
    }

});


})(jQuery);