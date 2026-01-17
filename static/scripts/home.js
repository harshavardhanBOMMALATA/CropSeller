const toggleBtn = document.getElementById("toggle");
const menu = document.getElementById("menu");
const cardsDiv = document.getElementById("cards");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("show");
  toggleBtn.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {

  const cardsDiv = document.getElementById("cards");
  const paginationDiv = document.querySelector(".pagination");

  const PAGE_SIZE = 10;
  let allProducts = [];

  function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function loadProducts(){
    const response = await fetch("/home/products/");
    const data = await response.json();

    /* randomize once */
    allProducts = shuffle([...data.results]);

    renderPagination();
    renderPage(1);
  }

  function renderPagination(){
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);

    for(let i = 1; i <= totalPages; i++){
      const btn = document.createElement("button");
      btn.textContent = i;
      if(i === 1) btn.classList.add("active");

      btn.addEventListener("click", () => {
        document.querySelectorAll(".pagination button")
          .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderPage(i);
      });

      paginationDiv.appendChild(btn);
    }
  }

  function renderPage(page){
    cardsDiv.innerHTML = "";

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = allProducts.slice(start, end);

    pageItems.forEach((p, index) => {

      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${index * 0.06}s`;

      card.innerHTML = `
        <div class="card-img-wrapper">
          <img data-src="${p.photo_url}" alt="${p.product_name}">
        </div>

        <div class="card-body">
          <p><b>${p.product_name}</b></p>
          <p><b>Quantity:</b> ${p.quantity} kg</p>
          <p><b>Location:</b> ${p.location}</p>
          <p class="available">Delivery: ${p.delivery}</p>
          <p class="price">₹${p.price_per_kg} / kg</p>
          <button class="bid-btn" onclick="anotherpage(${p.product_id})" style="background-color:blue">More info</button>
          <button class="bid-btn" onclick="toggleBid(this)">Place Bid</button>
          <div class="bid-form">
            <input type="number" placeholder="Quantity">
            <input type="number" placeholder="Bid Amount">
            <button onclick="working(event,${p.product_id},${p.quantity})">Submit Bid</button>
          </div>
        </div>
      `;

      cardsDiv.appendChild(card);
    });

    loadImages();
  }

  function loadImages(){
    const imgs = document.querySelectorAll(".card-img-wrapper img");

    imgs.forEach(img => {
      const realSrc = img.dataset.src;
      const tempImg = new Image();

      tempImg.onload = () => {
        img.src = realSrc;
        img.classList.add("loaded");
      };

      tempImg.src = realSrc;
    });
  }

  loadProducts();
});

/* Bid toggle */
function toggleBid(btn){
  const form = btn.nextElementSibling;
  form.style.display = form.style.display === "block" ? "none" : "block";
}


function anotherpage(productId){
  window.location.href=`/product/${productId}/`;
}


function working(event, product_id,existed_quantity) {
  event.preventDefault();

  const btn = event.target;
  const bidForm = btn.closest(".bid-form");

  const quantity = bidForm.querySelector('input[placeholder="Quantity"]').value;
  const bidAmount = bidForm.querySelector('input[placeholder="Bid Amount"]').value;
  if(existed_quantity<quantity){
    showPopup("Bid Qunatity higher than existed Quantity please reduce or Try another Option","error");
    return;
  }
  fetch("/transactions/placebid/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken")
    },
    body: JSON.stringify({
      quantity: quantity,
      price: bidAmount,
      product_id: product_id
    })
  })
  .then(res => res.json())
  .then(result => {
    if (result === true || result === "true") {
      showPopup("Bid placed successfully ✅", "success");
    } else {
      showPopup("Bid failed ❌", "error");
    }
  })
  .catch(() => {
    showPopup("Something went wrong ❌", "error");
  });
}


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


function showPopup(message, type) {
  const old = document.querySelector(".custom-popup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.className = `custom-popup ${type}`;
  popup.textContent = message;

  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 30);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 400);
  }, 1400);
}
