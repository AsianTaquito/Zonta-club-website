# Software Requirements Specification (SRS)

Project: Zonta Club Website
Repository: `Zonta-club-website` (branch: `main`)
Date: 2025-12-03

## 1. Introduction
- **Purpose:** Define the functional and non-functional requirements for the Zonta Club of Naples website, including shop/cart features implemented via static HTML/CSS/JS.
- **Audience:** Stakeholders, maintainers, designers, and developers.
- **Scope:** Public-facing informational website with pages for Home, About, Scholarship, Shop, Cart, and Checkout; client-side interactivity (no server-side processing within repo).

## 2. System Overview
- **Architecture:** Static site using HTML5UP template; assets in `assets/` (CSS/JS/images). No backend in repo.
- **Primary Pages:**
  - `index.html` — Home
  - `left-sidebar.html` — About
  - `right-sidebar.html` — Scholarship
  - `no-sidebar.html` — Shop (product listing)
  - `cart.html` — Shopping cart summary and actions
  - `checkout.html` — Order summary and user info form
- **Key Assets:**
  - CSS: `assets/css/main.css`
  - JS: `assets/js/main.js` + libraries (`jquery.min.js`, `jquery.dropotron.min.js`, `browser.min.js`, `breakpoints.min.js`, `util.js`)
  - Images in `/images` and `/assets/css/images`
- **Users:**
  - Visitor (browse content)
  - Shopper (use shop/cart)
  - Member (external login link)
  - Maintainer (update repo and deploy)
- **Environment:** Served via any static hosting (e.g., GitHub Pages); supports modern browsers.

## 3. Functional Requirements
### FR-1: Navigation
- Render global nav (`#nav`) on all pages; highlight current page; link to Home, Membership (external), About, Scholarship, Shop, Cart.

### FR-2: Shop Listing (no-sidebar)
- Display products as cards with image, title, price, and action buttons.
- Each product carries `data-id` and `data-price` for JS.

### FR-3: Add to Cart
- Clicking `.add-to-cart` adds product to client-side cart storage, updates `#cart-count`, persists across pages (e.g., via `localStorage`).

### FR-4: Purchase Now
- Clicking `.purchase-button` adds selected product to cart and navigates to `checkout.html` (or presents checkout flow).

### FR-5: Cart Page
- `cart.html` lists cart items with name, price, quantity, subtotal, total.
- Provide remove and quantity update controls.
- Provide Clear Cart action.

### FR-6: Clear Cart
- Clear-cart control empties cart and updates UI and `localStorage`.

### FR-7: Checkout Page
- `checkout.html` shows order summary and collects user info (name, email, address); validates required fields.
- Show confirmation upon submission (no payment processing integrated).

### FR-8: Header Carousel/Caption
- Header area supports images and a caption container (`#header-caption`); any carousel behavior is handled in `main.js`.

### FR-9: Responsive Behavior
- All layouts adapt to small screens; nav, cart icon (`#cart-count`), and shop buttons remain usable.

### FR-10: Accessibility
- Buttons and forms are keyboard accessible; images have `alt` text; semantic HTML used.

## 4. Non-Functional Requirements
- **Performance:** Typical pages load within ~3s on broadband; images sized appropriately.
- **Usability:** Buttons styled consistently; clear feedback on cart actions; readable typography.
- **Reliability:** Cart storage persists until cleared; no JS errors during core flows.
- **Maintainability:** CSS/JS organized; changes scoped to avoid unintended global impacts.
- **Security:** No sensitive data stored client-side; deploy over HTTPS; membership uses trusted external link.
- **Accessibility:** Focus states visible; sufficient contrast; form labels/placeholders clear.

## 5. Data Model (Client-side)
- **Product:** `{ id, title, price, imageUrl }`
- **Cart Item:** `{ productId, title, price, quantity }`
- **Cart Storage:** Stored in `localStorage` (e.g., key `cart`), or equivalent in-memory structure; rendered on `cart.html` and `checkout.html`.
- **Checkout Info:** `{ name, email, address }` plus computed totals; no payment info persisted.

## 6. UI/UX Specifications
- **Buttons:** Base `.button` styles in `assets/css/main.css`. Action lists typically wrapped in `ul.actions` with `<li>` items containing buttons.
- **Centering Buttons:** To center shop action buttons without site-wide side effects, prefer scoped rule:
  - Recommended CSS: `.highlight ul.actions { display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 0; }`
  - Avoid global `ul.actions` changes unless desired on all pages (contact form, other action lists).
- **Cart Icon:** Nav includes SVG cart icon, text `.cart-text`, and `#cart-count` badge; ensure visibility on small screens via media queries.

## 7. Interfaces
- **External:** Membership login link to Zonta site; no external APIs.
- **Browser APIs:** DOM manipulation, `localStorage`, events.

## 8. Constraints & Assumptions
- Static hosting; no backend within repo.
- Payments are out of scope; checkout captures basic info only.
- Images and content updated via repo commits.

## 9. Acceptance Criteria
- Navigation works across all pages; current page highlighted.
- Shop items display correctly; add-to-cart and purchase-now work; `#cart-count` updates.
- Cart page shows items and totals; clear-cart works; quantity updates reflected.
- Checkout validates required fields and shows confirmation; no payment handling.
- Buttons in shop are centered and evenly spaced; other pages remain unaffected (with scoped CSS).
- No console errors during normal usage.

## 10. Risks & Mitigations
- **Global CSS changes affect other pages:** Scope rules to `.highlight ul.actions` or use a modifier class (e.g., `.actions.centered`).
- **Client-side-only checkout limitations:** Document limitations; integrate secure payment externally if needed.
- **Responsive quirks (small screens):** Add media queries for nav/cart visibility and button layouts.

## 11. Maintenance Notes
- Keep product data consistent (`data-id`, `data-price`).
- Ensure `main.js` updates cart count early on page load.
- Test across major browsers after UI changes.

## 12. Future Enhancements (Optional)
- Integrate payment gateway (Stripe/PayPal) via external service.
- Add events calendar with dynamic data.
- Add member-only content gated via external auth.

---
