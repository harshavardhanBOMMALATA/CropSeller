document.addEventListener("DOMContentLoaded", () => {
    const mapBox = document.querySelector(".map-preview");

    if (!mapBox) return;

    mapBox.addEventListener("click", () => {
        const start = mapBox.dataset.start;
        const end = mapBox.dataset.end;

        window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}`,
            "_blank"
        );
    });
});

function openGoogleMaps(el) {
    const startLat = el.dataset.startLat;
    const startLng = el.dataset.startLng;
    const endLat = el.dataset.endLat;
    const endLng = el.dataset.endLng;

    const origin = `${startLat},${startLng}`;
    const destination = `${endLat},${endLng}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

    window.open(url, "_blank");
}
