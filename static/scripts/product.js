// product.js

window.addEventListener("load", () => {
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("active");
        }, index * 300);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    
    const raw = document.getElementById("history-data");
    if (!raw) {
        console.error("history-data not found");
        return;
    }

    let historyData = JSON.parse(raw.textContent);


    if (!historyData.length) {
        console.error("historyData is empty");
        return;
    }

    // 🔹 Step 1: replace null with 0
    historyData = historyData.map(v => v === null ? 0 : Number(v));

    // 🔹 Step 2: find max value
    const maxValue = Math.max(...historyData);

    // 🔹 Step 3: divide max into 4 equal parts
    const step = Math.ceil(maxValue / 4);
    const yMax = step * 4;   // clean rounded max

    const ctx = document.getElementById("bidChart");
    if (!ctx) {
        console.error("Canvas not found");
        return;
    }

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["30d", "25d", "20d", "15d", "10d", "5d", "Today"],
            datasets: [{
                data: historyData,
                borderColor: "#16a34a",
                backgroundColor: "rgba(22,163,74,0.15)",
                fill: true,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    min: 0,
                    max: yMax,
                    ticks: {
                        stepSize: step
                    }
                }
            }
        }
    });

    // ======================
    // Growth Arrow + Number
    // ======================

    const values = historyData;

    // latest value (Today / last bucket)
    const current = values[values.length - 1];

    // find previous non-zero value before current
    let prev = null;
    for (let i = values.length - 2; i >= 0; i--) {
        if (values[i] !== 0) {
            prev = values[i];
            break;
        }
    }

    // default: neutral
    let arrow = "→";
    let color = "#2563eb"; // blue

    if (prev !== null) {
        if (current > prev) {
            arrow = "↑";
            color = "#16a34a"; // green
        } else if (current < prev) {
            arrow = "↓";
            color = "#dc2626"; // red
        }
    }

    const growthEl = document.querySelector(".growth");
    if (growthEl) {
        growthEl.textContent = `${arrow} ${current}`;
        growthEl.style.color = color;
        growthEl.style.fontWeight = "700";
        growthEl.style.fontSize = "18px";
    }

});


function placebid(event) {

  event.preventDefault();
  const card = event.target.closest(".bid-card");

  const quantity = card.querySelector('input[placeholder="Quantity (Kg)"]').value;
  const price = card.querySelector('input[placeholder="Your Price (₹/Kg)"]').value;

  const product_id = document.getElementById("product_id").textContent;

  if (!quantity || !price) {
    showPopup("Please fill all fields ❌", "error");
    return;
  }
  const availableQty = parseInt(
  document.getElementById("quantityhidden").innerText,
  10);
  console.log(availableQty);
  if (quantity > availableQty) {
    showPopup("Sorry! Required Quantity is greater than Existed Quantity","error");
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
      price: price,
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


function showPopup(message, type) {
  const old = document.querySelector(".custom-popup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.className = `custom-popup ${type}`;
  popup.textContent = message;

  document.body.appendChild(popup);

  // trigger animation
  setTimeout(() => {
    popup.classList.add("show");
  }, 30);

  // auto close
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 400);
  }, 1300);
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
