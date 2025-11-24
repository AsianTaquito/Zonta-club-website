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

    /* 1. PURCHASE NOW BUTTONS*/
    if (document.querySelector('.purchase-button')) {
        document.querySelectorAll('.purchase-button').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();

                const productSection = this.closest('section.highlight');
                const productName = productSection.querySelector('h3').textContent.trim();
                const productPrice = productSection.querySelector('p').getAttribute('data-price');
                const productId = this.getAttribute('data-id');

                // Add product to localStorage cart
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItem = cart.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: parseFloat(productPrice),
                        quantity: 1
                    });
                }

                localStorage.setItem("cart", JSON.stringify(cart));

                // Go to checkout
                window.location.href = "checkout.html";
            });
        });
    }

    /*2. CHECKOUT PAGE RENDERING (ALWAYS FROM CART)*/
    if (document.getElementById("checkout-body")) {

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const tbody = document.getElementById("checkout-body");

        if (cart.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">Your cart is empty.</td>
                </tr>
            `;
            document.getElementById("subtotal").textContent = "$0.00";
            document.getElementById("tax").textContent = "$0.00";
            document.getElementById("grand-total").textContent = "$0.00";
            return;
        }

        let subtotal = 0;
        const taxRate = 0.07;

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

    /* CART PAGE  */
    if (document.getElementById("cart-body")) {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function renderCart() {
            const tbody = document.getElementById("cart-body");
            tbody.innerHTML = "";

            let subtotal = 0;

            cart.forEach((item, i) => {
                const total = item.price * item.quantity;
                subtotal += total;

                tbody.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>
                            <button class="qty-btn" data-index="${i}" data-change="-1">-</button>
                            ${item.quantity}
                            <button class="qty-btn" data-index="${i}" data-change="1">+</button>
                        </td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${total.toFixed(2)}</td>
                        <td><button class="remove-btn" data-index="${i}">X</button></td>
                    </tr>
                `;
            });

            document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        // Quantity +/- buttons
        document.addEventListener("click", e => {
            if (e.target.classList.contains("qty-btn")) {
                const index = e.target.dataset.index;
                const change = parseInt(e.target.dataset.change);

                cart[index].quantity += change;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }

                renderCart();
            }
        });

        // Remove item
        document.addEventListener("click", e => {
            if (e.target.classList.contains("remove-btn")) {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                renderCart();
            }
        });

        renderCart();
    }

    /* */
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

        const defaultImages = [
            { src: "images/Header images/Zonta logo-cropped Jpeg.jpg", caption: "" }
        ];

        let images = imageSets[page] || defaultImages;
        let index = 0;

        function changeBackground() {
            header.style.backgroundImage = `url('${images[index].src}')`;
            captionBox.textContent = images[index].caption || "";
            index = (index + 1) % images.length;
        }

        changeBackground();
        setInterval(changeBackground, 5000);
    }

});

})(jQuery);