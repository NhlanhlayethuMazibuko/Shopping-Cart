const products = [
    {
        id: 1,
        name: "Wireless Mouse",
        price: 299,
        image: "assets/wireless-mouse.jpeg"
    },
    {
        id: 2,
        name: "Mechanical Keyboard",
        price: 899,
        image: "assets/mech_keyboard.png"
    },
    {
        id: 3,
        name: "USB-C Hub",
        price: 549,
        image: "assets/USC-C-Hub.jpeg"
    },
    {
        id: 4,
        name: "Webcam",
        price: 450,
        image: "assets/webcam.png"
    }
];

let cart = [];

// DOM elements
const productGrid = document.getElementById("productGrid");
const cartSummary = document.getElementById("cartSummary");
const viewCartBtn = document.getElementById("viewCartBtn");
const cartDropdown = document.getElementById("cartDropdown");
const dropdownItems = document.getElementById("dropdownItems");
const dropdownTotal = document.getElementById("dropdownTotal");

function renderProducts() {
    productGrid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>R${product.price.toFixed(2)}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;

        productGrid.appendChild(card);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(i => i.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateUI();
}

function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity++;
    updateUI();
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    updateUI();
}

function updateUI() {
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
    });

    cartSummary.textContent = `Cart: ${count} items | R${total.toFixed(2)}`;

    dropdownItems.innerHTML = "";

    if (cart.length === 0) {
        dropdownItems.innerHTML = `<li style="color: #6b7280; padding: 8px 0;">No items yet</li>`;
    } else {
        cart.forEach(item => {
            const li = document.createElement("li");

            li.innerHTML = `
                <button class="qty-btn minus" data-id="${item.id}">-</button>
                <span>${item.name} x${item.quantity}</span>
                <button class="qty-btn plus" data-id="${item.id}">+</button>
            `;

            dropdownItems.appendChild(li);
        });
    }

    dropdownTotal.textContent = total.toFixed(2);
}

productGrid.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        addToCart(Number(e.target.dataset.id));
    }
});

dropdownItems.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("plus")) {
        increaseQty(id);
    }

    if (e.target.classList.contains("minus")) {
        decreaseQty(id);
    }
});

viewCartBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 

    const isCurrentlyOpen = cartDropdown.style.display === "block";
    cartDropdown.style.display = isCurrentlyOpen ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (
        cartDropdown.style.display === "block" &&
        !cartDropdown.contains(e.target) &&
        e.target !== viewCartBtn
    ) {
        cartDropdown.style.display = "none";
    }
});

renderProducts();
updateUI();