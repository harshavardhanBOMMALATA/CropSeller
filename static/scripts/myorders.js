const filterButtons = document.querySelectorAll(".filter-btn");
const orderCards = document.querySelectorAll(".order-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        orderCards.forEach(card => {
            const status = card.dataset.status;

            if (filter === "all" || status === filter) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
});
