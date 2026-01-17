document.addEventListener("DOMContentLoaded", () => {

    /* =============================
       READ WEEKLY DATA (Option 2)
    ============================== */
    const weeklyEl = document.getElementById("weeklyData");

    const weeklyData = {
        week1: { bids_count: +weeklyEl.dataset.w1Count, highest_bid: +weeklyEl.dataset.w1High },
        week2: { bids_count: +weeklyEl.dataset.w2Count, highest_bid: +weeklyEl.dataset.w2High },
        week3: { bids_count: +weeklyEl.dataset.w3Count, highest_bid: +weeklyEl.dataset.w3High },
        week4: { bids_count: +weeklyEl.dataset.w4Count, highest_bid: +weeklyEl.dataset.w4High }
    };

    /* =============================
       STEP SIZE HELPER
    ============================== */
    function getStepSize(maxValue) {
        if (maxValue <= 0) return 1;
        const roundedMax = Math.ceil(maxValue / 10) * 10;
        return Math.ceil(roundedMax / 4);
    }

    /* =============================
       BID CARDS
    ============================== */
    const cards = [...document.querySelectorAll(".bid-card")];

    /* =============================
       BAR + LINE DATA
    ============================== */
    const countValues = Object.values(weeklyData).map(w => w.bids_count);
    const priceValues = Object.values(weeklyData).map(w => w.highest_bid);

    const maxCount = Math.max(...countValues);
    const maxPrice = Math.max(...priceValues);

    const countStep = getStepSize(maxCount);
    const priceStep = getStepSize(maxPrice);

    /* =============================
       BID COUNT BAR CHART
    ============================== */
    new Chart(document.getElementById("countChart"), {
        type: "bar",
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{
                data: countValues,
                backgroundColor: "#16a34a",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: countStep * 4,
                    ticks: { stepSize: countStep }
                }
            }
        }
    });

    /* =============================
       HIGHEST BID LINE CHART
    ============================== */
    new Chart(document.getElementById("priceChart"), {
        type: "line",
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{
                data: priceValues,
                borderColor: "#16a34a",
                backgroundColor: "rgba(134,239,172,0.6)",
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => "₹" + ctx.parsed.y
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: priceStep * 4,
                    ticks: {
                        stepSize: priceStep,
                        callback: v => "₹" + v
                    }
                }
            }
        }
    });

    /* =============================
       PIE CHART (REAL DISTRIBUTION)
       Logic:
       - Low  : < avg
       - Mid  : avg → avg + 10%
       - High : > avg + 10%
    ============================== */
    let prices = cards.map(c => +c.dataset.price);

    let low = 0, mid = 0, high = 0;

    if (prices.length > 0) {
        const avg = prices.reduce((a,b)=>a+b,0) / prices.length;

        prices.forEach(p => {
            if (p < avg) low++;
            else if (p <= avg * 1.1) mid++;
            else high++;
        });
    } else {
        mid = 1; // fallback to prevent empty pie
    }

    new Chart(document.getElementById("distChart"), {
        type: "pie",
        data: {
            labels: ["Low Bids", "Medium Bids", "High Bids"],
            datasets: [{
                data: [low, mid, high],
                backgroundColor: ["#86efac", "#16a34a", "#15803d"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.parsed}`
                    }
                },
                legend: {
                    position: "bottom"
                }
            }
        }
    });

});


function accepted(biddingid){
    fetch("/transactions/biddingverdict/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            biddingid: biddingid,
            verdict: "accepted"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status !== "success") return;

        const card = document.querySelector(`[data-bid="${biddingid}"]`);
        if (!card) return;

        // update badge
        const badge = card.querySelector(".badge");
        badge.textContent = "accepted";
        badge.className = "badge accepted";

        // create order
        fetch("/transactions/makeorder/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ biddingid })
        })
        .then(res => res.json())
        .then(orderData => {
            if (orderData.status !== "success") return;

            const orderId = orderData.order_id;

            // create transaction
            fetch(`/transactions/createtransaction/${orderId}/`, {
                method: "POST"
            })
            .then(res => res.json())
            .then(txnData => {

                // create transportation
                fetch(`/transactions/createtransportation/${orderId}/`, {
                    method: "POST"
                })
                .then(res => res.json())
                .then(trnData => {

                    const actions = card.querySelector(".actions");
                    if (actions) {
                        actions.innerHTML = `
                            <div class="buyer-details"
                                style="
                                    margin-top:10px;
                                    padding:10px;
                                    border:1px solid #4CAF50;
                                    border-radius:8px;
                                    background:#f4fff6;
                                    font-size:14px;
                                    width:100%;
                                    box-sizing:border-box;
                                ">
                                <div style="margin-bottom:4px;">
                                    Buyer Name: <b>${data.buyer_name}</b>
                                </div>
                                <div style="margin-bottom:4px;">
                                    Buyer Contact: <b>${data.phone_number}</b>
                                </div>
                                <div style="margin-bottom:4px;">
                                    Order ID: <b>${orderId}</b>
                                </div>
                                <div style="margin-bottom:4px;">
                                    Transaction ID: <b>${txnData.transaction_id}</b>
                                </div>
                                <div style="margin-bottom:8px;">
                                    Transportation ID: <b>${trnData.transportation_id}</b>
                                </div>

                                <button
                                    onclick="paymentandorderdetails('${biddingid}')"
                                    style="
                                        padding:6px 12px;
                                        background:#4CAF50;
                                        color:#fff;
                                        border:none;
                                        border-radius:6px;
                                        cursor:pointer;
                                        font-size:13px;
                                    ">
                                    Payment & Order Details
                                </button>
                            </div>
                        `;
                    }
                });
            });
        });
    });
}



function rejected(biddingid){
    fetch("/transactions/biddingverdict/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            biddingid: biddingid,
            verdict: "rejected"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status !== "success") return;

        const card = document.querySelector(`[data-bid="${biddingid}"]`);
        if (!card) {
            console.error("Bid card not found for:", biddingid);
            return;
        }

        const badge = card.querySelector(".badge");
        if (badge) {
            badge.textContent = "rejected";
            badge.className = "badge rejected";
        }

        const actions = card.querySelector(".actions");
        if (actions) actions.remove();
    });
}


const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const bidList = document.getElementById("bidList");

searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const sortValue = filterSelect.value;

    let cards = Array.from(bidList.getElementsByClassName("bid-card"));

    // 🔍 SEARCH by bidder name
    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(searchValue) ? "flex" : "none";
    });

    // 🔃 SORT
    if (sortValue) {
        cards.sort((a, b) => {
            if (sortValue === "price") {
                return b.dataset.price - a.dataset.price;
            }
            if (sortValue === "quantity") {
                return b.dataset.quantity - a.dataset.quantity;
            }
            if (sortValue === "profit") {
                const profitA = a.dataset.price * a.dataset.quantity;
                const profitB = b.dataset.price * b.dataset.quantity;
                return profitB - profitA;
            }
            return 0;
        });

        // re-append sorted cards
        cards.forEach(card => bidList.appendChild(card));
    }
}


function paymentandorderdetails(orderId){
    window.location.href = `/transactions/orders/details/${orderId}/`;
}
