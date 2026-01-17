document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const bidCards = document.querySelectorAll(".bid-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {

            // remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");

            bidCards.forEach(card => {
                const status = card.getAttribute("data-status");

                if (filter === "all" || status === filter) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});
