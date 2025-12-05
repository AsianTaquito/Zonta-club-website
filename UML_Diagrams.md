# UML Diagrams - Zonta Club Website

## 1. Use Case Diagram

Shows the interactions between users and the system.

```mermaid
graph TB
    subgraph Actors
        V((Visitor))
        S((Shopper))
        M((Member))
    end
    
    subgraph "Zonta Club Website"
        UC1[Browse Home Page]
        UC2[View About Page]
        UC3[View Scholarship Info]
        UC4[Browse Shop]
        UC5[Add Item to Cart]
        UC6[View Cart]
        UC7[Update Quantity]
        UC8[Remove Item]
        UC9[Clear Cart]
        UC10[Proceed to Checkout]
        UC11[Enter Delivery Info]
        UC12[Make Donation]
        UC13[Process Payment]
        UC14[Access Member Portal]
    end
    
    V --> UC1
    V --> UC2
    V --> UC3
    V --> UC4
    
    S --> UC4
    S --> UC5
    S --> UC6
    S --> UC7
    S --> UC8
    S --> UC9
    S --> UC10
    S --> UC11
    S --> UC12
    S --> UC13
    
    M --> UC14
    
    UC5 -.->|includes| UC6
    UC10 -.->|includes| UC11
    UC12 -.->|includes| UC6
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

### 1. Use Case Diagram
Illustrates the three types of users (Visitor, Shopper, Member) and the actions they can perform on the website. Visitors can browse content, Shoppers can use the full e-commerce functionality, and Members can access the external member portal.

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

## How to View These Diagrams

These diagrams are written in **Mermaid** syntax and can be viewed:

1. **GitHub**: Renders automatically in README/markdown files
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Paste into [Mermaid Live Editor](https://mermaid.live)
4. **Export**: Use Mermaid CLI to export as PNG/SVG
