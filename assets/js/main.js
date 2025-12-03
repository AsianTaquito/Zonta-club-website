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

        // NavBar Cart Counter 
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            const badge = document.getElementById("cart-count");
            if (!badge) return;
            badge.textContent = count > 0 ? count : "";
            badge.style.display = count > 0 ? "inline-block" : "none";
        }
        updateCartCount();

        // Shop Page Buttons 
        function addItemToCart(section, productId) {
            const productName = section.querySelector("h3").textContent.trim();
            const priceElement = section.querySelector("p");
            const productPrice = parseFloat(priceElement.getAttribute("data-price"));
            
            const id = productId || productName;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id,
                    name: productName,
                    price: productPrice, 
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        }

        // Purchase buttons (Go directly to checkout)
        document.querySelectorAll(".purchase-button").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();

                const section = btn.closest("section.highlight");
                addItemToCart(section, btn.dataset.id);

                setTimeout(() => {
                    window.location.href = "checkout.html";
                }, 50);
            });
        });

        // Toast notification function
        function showToast(message, duration = 2500) {
            // Remove existing toast if any
            const existingToast = document.querySelector('.toast-notification');
            if (existingToast) existingToast.remove();

            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `<span class="toast-icon">✓</span>${message}`;
            document.body.appendChild(toast);

            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 10);

            // Remove after duration
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, duration);
        }

        // Add-to-cart buttons 
        document.querySelectorAll(".add-to-cart").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();

                const section = btn.closest("section.highlight");
                addItemToCart(section, btn.dataset.id);

                showToast("Item added to cart!");
            });
        });


        // Donate Button & Modal
        const donateBtn = document.getElementById("donate-button");
        const donationModal = document.getElementById("donation-modal");
        const donationAmount = document.getElementById("donation-amount");
        const donationConfirm = document.getElementById("donation-confirm");
        const donationCancel = document.getElementById("donation-cancel");

        if (donateBtn && donationModal) {
            // Open modal
            donateBtn.addEventListener("click", e => {
                e.preventDefault();
                donationModal.classList.add("active");
                donationAmount.value = "";
                donationAmount.focus();
            });

            // Cancel - close modal
            donationCancel.addEventListener("click", e => {
                e.preventDefault();
                donationModal.classList.remove("active");
            });

            // Close on overlay click
            donationModal.addEventListener("click", e => {
                if (e.target === donationModal) {
                    donationModal.classList.remove("active");
                }
            });

            // Confirm donation - add to cart using same pattern as shop items
            donationConfirm.addEventListener("click", e => {
                e.preventDefault();
                const amt = parseFloat(donationAmount.value);

                if (isNaN(amt) || amt <= 0) {
                    alert("Please enter a valid donation amount.");
                    donationAmount.focus();
                    return;
                }

                // Add donation to cart using same structure as shop items
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                
                // Check if donation already exists, update it
                const existingDonation = cart.find(item => item.id === "donation");
                if (existingDonation) {
                    existingDonation.price = amt;
                    existingDonation.quantity = 1;
                } else {
                    cart.push({
                        id: "donation",
                        name: "Donation",
                        price: amt,
                        quantity: 1
                    });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                donationModal.classList.remove("active");

                // Navigate to cart page
                window.location.href = "cart.html";
            });
        }


        // Cart Page 
        if (document.getElementById("cart-body")) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            function renderCart() {
                const tbody = document.getElementById("cart-body");
                tbody.innerHTML = "";
                let subtotal = 0;

                cart.forEach((item, i) => {
                    const hasPrice = !isNaN(item.price);

                    const total = hasPrice ? item.price * item.quantity : NaN;

                    if (hasPrice) subtotal += total;

                    tbody.innerHTML += `
                        <tr>
                            <td>${item.name}</td>
                            <td>
                                <button class="qty-btn" data-index="${i}" data-change="-1">-</button>
                                ${item.quantity}
                                <button class="qty-btn" data-index="${i}" data-change="1">+</button>
                            </td>
                            <td>${hasPrice ? `$${item.price.toFixed(2)}` : "—"}</td>
                            <td>${hasPrice ? `$${total.toFixed(2)}` : "—"}</td>
                            <td><button class="remove-btn" data-index="${i}">X</button></td>
                        </tr>
                    `;
                });

                document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
            }

            // Quantity change + removal
            document.addEventListener("click", e => {
                if (e.target.classList.contains("qty-btn")) {
                    const i = parseInt(e.target.dataset.index);
                    cart[i].quantity += parseInt(e.target.dataset.change);

                    if (cart[i].quantity <= 0) cart.splice(i, 1);

                    renderCart();
                }

                if (e.target.classList.contains("remove-btn")) {
                    const i = parseInt(e.target.dataset.index);
                    cart.splice(i, 1);
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
                ["subtotal", "tax", "grand-total"].forEach(id => document.getElementById(id).textContent = "$0.00");
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

        if (header && captionBox) { 

            let page = window.location.pathname.split("/").pop() || "index.html";
            page = page.split("?")[0].split("#")[0].replace(/\/$/, "");

            const imageSets = {
                "index.html": [
                    { src: "images/Header images/IndexHeader.JPG", caption: "Zonta international district meeting" },
                    { src: "images/Header images/IndexHeader01.JPG", caption: "" },
                    { src: "images/Header images/IndexHeader02.jpg", caption: "Zonta Club of Naples" },
                    { src: "images/Header images/IndexHeader03.jpg", caption: "" },
                    { src: "images/Header images/IndexHeader04.jpeg", caption: "" },
                    { src: "images/Header images/IndexHeader05.jpg", caption: "" },
                    { src: "images/Header images/Zonta Club Naples.jpeg", caption: "" }
                ],
                "left-sidebar.html": [
                    { src: "images/Header images/LeftHeader02.jpg", caption: "Club Brunch" },
                    { src: "images/Header images/LeftHeader03.jpg", caption: "District 11 Awards" },
                    { src: "images/Header images/LeftHeader04.jpeg", caption: "" },
                    { src: "images/Header images/LeftHeader05.jpg", caption: "Community Service" }
                ],
                "right-sidebar.html": [
                    { src: "images/Header images/ScholarshipBanner01.jpeg", caption: "Memorial Scholarship Endowment Fund" },
                    { src: "images/Header images/Scholarshipbanner02.jpeg", caption: "A thing they did" },
                    { src: "images/Header images/ScholarshipBanner03.webp", caption: "25k check for something" }
                ]
            };

            const images = imageSets[page] || [{ src: "images/Header images/Zonta logo-cropped Jpeg.jpg"}];
            let index = 0;

            function changeBackground() {
                header.style.backgroundImage = `url('${images[index].src}')`;
                captionBox.textContent = images[index].caption || "";
                index = (index + 1) % images.length;
            }

            changeBackground();
            setInterval(changeBackground, 5000);
        

            // Make caption follow the mouse
            header.addEventListener("mousemove", e => {
                // Hide caption box if theres no caption
                if(!images[index === 0 ? images.length - 1 : index - 1].caption) {
                    captionBox.style.opacity = 0;
                    return;
                }

                const rect = header.getBoundingClientRect();
                captionBox.style.left = `${e.clientX - rect.left + 15}px`;
                captionBox.style.top = `${e.clientY - rect.top + 15}px`;
                captionBox.style.opacity = 1;
            });

            header.addEventListener("mouseleave", () => {
                captionBox.style.opacity = 0;
            });
        }

       /* 
        * GOOGLE CALENDAR INTEGRATION
        * 
        * To connect to your Google Calendar:
        * 
        * 1. Go to Google Cloud Console: https://console.cloud.google.com/
        * 2. Create a new project (or select existing)
        * 3. Enable "Google Calendar API" in APIs & Services > Library
        * 4. Create API credentials: APIs & Services > Credentials > Create Credentials > API Key
        * 5. Copy your API key and replace "YOUR_API_KEY" below
        * 
        * 6. Get your Calendar ID:
        *    - Go to Google Calendar > Settings > [Your Calendar] > Integrate calendar
        *    - Copy the "Calendar ID" (looks like: abc123@group.calendar.google.com)
        *    - For public calendars, use the email-style ID
        *    - Replace "YOUR_CALENDAR_ID" below
        * 
        * 7. Make sure your calendar is PUBLIC:
        *    - Google Calendar > Settings > [Your Calendar] > Access permissions
        *    - Check "Make available to public"
        * 
        * The events will auto-load and refresh every 24 hours.
        */
        
        const eventsList = document.getElementById("events-list");

        if (eventsList) {
            // REPLACE THESE WITH YOUR CREDENTIALS 
            const API_KEY = "YOUR_API_KEY";
            const CAL_ID = "YOUR_CALENDAR_ID";
            

            // Show loading state
            eventsList.innerHTML = `<li class="no-events-message">Loading events...</li>`;

            function loadCalendarEvents() {
                const now = new Date();
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

                const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events?` +
                    `key=${API_KEY}` +
                    `&timeMin=${now.toISOString()}` +
                    `&timeMax=${thirtyDaysFromNow.toISOString()}` +
                    `&singleEvents=true` +
                    `&orderBy=startTime` +
                    `&maxResults=20`;

                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        eventsList.innerHTML = ""; 

                        if (!data.items || data.items.length === 0) {
                            eventsList.innerHTML = `<li class="no-events-message">No upcoming events in the next 30 days.</li>`;
                            return;
                        }

                        data.items.forEach(event => {
                            const li = document.createElement("li");
                            
                            // Parse start date/time
                            const start = event.start.dateTime || event.start.date;
                            const date = new Date(start);
                            
                            // Format date: "Month Day, Year"
                            const dateStr = date.toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            });
                            
                            // Format time: "2:00 PM" or "All day"
                            const timeStr = event.start.dateTime
                                ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                                : "All day";
                            
                            // Build event HTML matching your example structure
                            const title = event.summary || "Untitled Event";
                            const location = event.location || "";
                            const description = event.description || "";
                            
                            let html = `<h3>${title}</h3>`;
                            html += `<p>Date: ${dateStr} at ${timeStr}</p>`;
                            
                            if (location) {
                                html += `<p>Location: ${location}</p>`;
                            }
                            
                            if (description) {
                                // Truncate long descriptions and strip HTML
                                const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 200);
                                html += `<p>${cleanDesc}${description.length > 200 ? '...' : ''}</p>`;
                            }
                            
                            li.innerHTML = html;
                            eventsList.appendChild(li);
                        });
                    })
                    .catch(err => {
                        console.error("Calendar API error:", err);
                        eventsList.innerHTML = `<li class="no-events-message">Unable to load events. Please check API configuration.</li>`;
                    });
            }

            // Load immediately
            loadCalendarEvents();

            // Auto-refresh every 24 hours
            setInterval(loadCalendarEvents, 24 * 60 * 60 * 1000);
        }

        // Clear Cart Button
        document.getElementById("clear-cart")?.addEventListener("click", () => {
            localStorage.removeItem("cart"); 
            alert("Cart has been cleared!"); 
            location.reload(); 
        });

    });



})(jQuery);