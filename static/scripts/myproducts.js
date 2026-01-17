document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card");

    let activeFilter = "all";

    // filter button click
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // search input
    searchInput.addEventListener("input", applyFilters);

    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const productName = card.querySelector("h4").innerText.toLowerCase();
            const status = card.dataset.status; // current / past

            const matchesSearch = productName.includes(searchText);
            const matchesFilter =
                activeFilter === "all" || status === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

});


function endbid(product_id){
    fetch(`/transactions/myproducts/endbid/${product_id}/`)
    .then(response => response.json())
    .then(data => {

        // ---------- notification ----------
        const note = document.createElement("div");
        note.innerText = data.status === "success"
            ? "Bidding Ended Successfully"
            : "Something went wrong. Try again";

        note.style.position = "fixed";
        note.style.bottom = "20px";
        note.style.right = "20px";
        note.style.background = data.status === "success" ? "#2f8f5b" : "#c62828";
        note.style.color = "#fff";
        note.style.padding = "12px 18px";
        note.style.borderRadius = "8px";
        note.style.fontSize = "14px";
        note.style.zIndex = "9999";
        note.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";

        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
        // ----------------------------------

        if (data.status !== "success") return;

        // ---------- UI update ----------
        const card = document.querySelector(`#product-${product_id}`);
        if (!card) return;

        const statusDiv = card.querySelector(".status");
        if (statusDiv) {
            statusDiv.innerText = "Bidding Ended";
            statusDiv.className = "status current";
            statusDiv.style.color = "red";
        }
        // -------------------------------
    })
    .catch(() => {
        const note = document.createElement("div");
        note.innerText = "Server error";
        note.style.position = "fixed";
        note.style.bottom = "20px";
        note.style.right = "20px";
        note.style.background = "#c62828";
        note.style.color = "#fff";
        note.style.padding = "12px 18px";
        note.style.borderRadius = "8px";
        note.style.fontSize = "14px";
        note.style.zIndex = "9999";
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    });
}
