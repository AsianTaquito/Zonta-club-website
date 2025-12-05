# UML Diagrams - Zonta Club Website

## 1. Cart Management Sequence Diagram

Shows the flow of managing items in the shopping cart.

```mermaid
sequenceDiagram
    actor User
    participant Cart as Cart Page
    participant JS as main.js
    participant LS as localStorage
    participant UI as Cart UI

    %% Initial Load
    User->>Cart: Navigate to cart.html
    Cart->>JS: DOMContentLoaded event
    JS->>LS: Get cart data
    LS-->>JS: Return cart array
    JS->>UI: Render cart items table
    JS->>UI: Calculate & display subtotal

    %% Increase Quantity
    User->>UI: Click + button
    UI->>JS: qty-btn click (change: +1)
    JS->>JS: cart[index].quantity++
    JS->>LS: Save updated cart
    JS->>UI: Re-render cart table
    JS->>UI: Update subtotal
    JS->>UI: Update nav badge count

    %% Decrease Quantity
    User->>UI: Click - button
    UI->>JS: qty-btn click (change: -1)
    JS->>JS: cart[index].quantity--
    alt quantity <= 0
        JS->>JS: Remove item from array
    end
    JS->>LS: Save updated cart
    JS->>UI: Re-render cart table
    JS->>UI: Update subtotal
    JS->>UI: Update nav badge count

    %% Remove Item
    User->>UI: Click X (remove) button
    UI->>JS: remove-btn click
    JS->>JS: cart.splice(index, 1)
    JS->>LS: Save updated cart
    JS->>UI: Re-render cart table
    JS->>UI: Update subtotal
    JS->>UI: Update nav badge count

    %% Clear Cart
    User->>UI: Click "Clear Cart" button
    UI->>JS: clear-cart click
    JS->>JS: cart = []
    JS->>LS: Save empty cart
    JS->>UI: Show empty cart message
    JS->>UI: Reset subtotal to $0.00
    JS->>UI: Hide nav badge
```

---

## 2. Class Diagram

Shows the data structures used in the application.

```mermaid
classDiagram
    class Product {
        +String id
        +String title
        +Number price
        +String imageUrl
        +String description
    }
    
    class CartItem {
        +String productId
        +String name
        +Number price
        +Number quantity
        +getTotal() Number
    }
    
    class Cart {
        -CartItem[] items
        +addItem(Product, quantity)
        +removeItem(index)
        +updateQuantity(index, change)
        +clear()
        +getSubtotal() Number
        +getItemCount() Number
        +save()
        +load()
    }
    
    class Donation {
        +String id = "donation"
        +String name = "Donation"
        +Number amount
        +Number quantity = 1
    }
    
    class CheckoutInfo {
        +String firstName
        +String lastName
        +String email
        +String phone
        +String address
        +String city
        +String state
        +String zip
        +validate() Boolean
    }
    
    class Order {
        +CartItem[] items
        +CheckoutInfo deliveryInfo
        +Number subtotal
        +Number tax
        +Number grandTotal
        +String paymentMethod
    }
    
    Cart "1" *-- "*" CartItem : contains
    CartItem ..> Product : references
    Donation --|> CartItem : extends
    Order "1" *-- "*" CartItem : contains
    Order "1" *-- "1" CheckoutInfo : has
```

---

## 3. Sequence Diagram

Shows the flow of adding an item to cart and completing checkout.

```mermaid
sequenceDiagram
    actor User
    participant Shop as Shop Page
    participant JS as main.js
    participant LS as localStorage
    participant Cart as Cart Page
    participant Checkout as Checkout Page
    participant Payment as Payment Gateway

    %% Add to Cart Flow
    User->>Shop: Click "Add to Cart"
    Shop->>JS: Trigger click event
    JS->>LS: Get current cart
    LS-->>JS: Return cart array
    JS->>JS: Add/update item in cart
    JS->>LS: Save updated cart
    JS->>Shop: Update cart count badge
    JS->>User: Show toast notification

    %% View Cart Flow
    User->>Cart: Navigate to cart.html
    Cart->>JS: DOMContentLoaded
    JS->>LS: Load cart data
    LS-->>JS: Return cart array
    JS->>Cart: Render cart items
    
    %% Update Quantity
    User->>Cart: Click +/- button
    Cart->>JS: Trigger qty-btn click
    JS->>JS: Update quantity
    JS->>LS: Save updated cart
    JS->>Cart: Re-render cart

    %% Checkout Flow
    User->>Cart: Click "Proceed to Checkout"
    Cart->>Checkout: Navigate to checkout.html
    Checkout->>JS: DOMContentLoaded
    JS->>LS: Load cart data
    LS-->>JS: Return cart array
    JS->>Checkout: Render order summary
    JS->>Checkout: Calculate tax & total
    
    User->>Checkout: Fill delivery form
    User->>Checkout: Click Pay with Stripe/PayPal
    Checkout->>JS: Validate form
    JS->>Payment: Initialize payment
    Payment-->>User: Payment UI
    User->>Payment: Complete payment
    Payment-->>JS: Payment result
    JS->>LS: Clear cart (on success)
    JS->>User: Show confirmation
```

---

## 4. Activity Diagram

Shows the complete shopping workflow from browsing to purchase.

```mermaid
flowchart TD
    Start([User Visits Site]) --> Browse[Browse Products on Shop Page]
    
    Browse --> Decision1{Want to Purchase?}
    Decision1 -->|No| ContinueBrowse[Continue Browsing]
    ContinueBrowse --> Browse
    
    Decision1 -->|Yes| ChooseAction{Choose Action}
    
    ChooseAction -->|Add to Cart| AddCart[Click Add to Cart Button]
    AddCart --> UpdateStorage[Update localStorage]
    UpdateStorage --> UpdateBadge[Update Cart Badge Count]
    UpdateBadge --> ShowToast[Show Toast Notification]
    ShowToast --> Decision2{Continue Shopping?}
    
    Decision2 -->|Yes| Browse
    Decision2 -->|No| GoCart[Navigate to Cart Page]
    
    ChooseAction -->|Purchase Now| DirectCheckout[Add to Cart & Go to Checkout]
    DirectCheckout --> CheckoutPage
    
    ChooseAction -->|Donate| OpenModal[Open Donation Modal]
    OpenModal --> EnterAmount[Enter Donation Amount]
    EnterAmount --> ValidateAmount{Valid Amount?}
    ValidateAmount -->|No| EnterAmount
    ValidateAmount -->|Yes| AddDonation[Add Donation to Cart]
    AddDonation --> GoCart
    
    GoCart --> ViewCart[View Cart Items]
    ViewCart --> CartActions{Cart Actions}
    
    CartActions -->|Update Qty| ChangeQty[Change Item Quantity]
    ChangeQty --> RenderCart[Re-render Cart]
    RenderCart --> ViewCart
    
    CartActions -->|Remove Item| RemoveItem[Remove from Cart]
    RemoveItem --> RenderCart
    
    CartActions -->|Clear All| ClearCart[Clear Entire Cart]
    ClearCart --> EmptyCart[Show Empty Cart]
    EmptyCart --> Browse
    
    CartActions -->|Checkout| CheckoutPage[Go to Checkout Page]
    
    CheckoutPage --> ViewSummary[View Order Summary]
    ViewSummary --> FillForm[Fill Delivery Information]
    FillForm --> ValidateForm{Form Valid?}
    ValidateForm -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> FillForm
    
    ValidateForm -->|Yes| SelectPayment{Select Payment Method}
    
    SelectPayment -->|Stripe| StripePayment[Process Stripe Payment]
    SelectPayment -->|PayPal| PayPalPayment[Process PayPal Payment]
    
    StripePayment --> PaymentResult{Payment Successful?}
    PayPalPayment --> PaymentResult
    
    PaymentResult -->|No| PaymentError[Show Error Message]
    PaymentError --> SelectPayment
    
    PaymentResult -->|Yes| ClearCartData[Clear Cart from localStorage]
    ClearCartData --> ShowConfirmation[Show Order Confirmation]
    ShowConfirmation --> End([End])
```

---

## Diagram Descriptions

### 1. Cart Management Sequence Diagram
Details all cart interactions: loading cart data, increasing/decreasing quantities (with auto-removal when quantity hits zero), removing items via the X button, and clearing the entire cart. Shows how each action updates localStorage and refreshes the UI.

### 2. Class Diagram
Shows the data structures used throughout the application:
- **Product**: Represents items in the shop
- **CartItem**: Items stored in the shopping cart
- **Cart**: Manages the collection of cart items with localStorage persistence
- **Donation**: Special cart item type for donations
- **CheckoutInfo**: Delivery/billing information
- **Order**: Complete order with items, delivery info, and totals

### 3. Sequence Diagram
Details the interaction flow between the user, UI components, JavaScript logic, and localStorage during the add-to-cart and checkout processes.

### 4. Activity Diagram
Shows the complete user journey from browsing products through to completing a purchase, including all decision points and alternative paths (donations, cart management, payment processing).

---
