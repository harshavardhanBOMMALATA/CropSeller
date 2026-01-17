/* ===============================
   CLOUDINARY CONFIG
================================ */
const CLOUD_NAME = "dz1i8o4w6";
const UPLOAD_PRESET = "cropseller_upload";

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {

    const uploadBox = document.getElementById("uploadBox");
    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("preview");
    const form = document.getElementById("addProductForm");

    const product_id = document.getElementById("product_id").value;

    const product_name = document.getElementById("product_name");
    const quantity = document.getElementById("quantity");
    const price_per_kg = document.getElementById("price_per_kg");
    const location = document.getElementById("location");
    const delivery = document.getElementById("delivery");
    const supply_capacity = document.getElementById("supply_capacity");
    const fssai_license = document.getElementById("fssai_license");
    const organic_certified = document.getElementById("organic_certified");
    const moisture = document.getElementById("moisture");
    const crop_year = document.getElementById("crop_year");
    const packaging = document.getElementById("packaging");
    const description = document.getElementById("description");

    let existingPhotoUrl = preview?.src || "";

    uploadBox.addEventListener("click", () => imageInput.click());

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            let photo_url = existingPhotoUrl;

            if (imageInput.files.length) {
                showToast("⏳ Uploading image…", "info");
                photo_url = await uploadToCloudinary(imageInput.files[0]);
            }

            const payload = {
                product_id: product_id,
                product_name: product_name.value,
                quantity: quantity.value,
                price_per_kg: price_per_kg.value,
                location: location.value,
                delivery: delivery.value,
                supply_capacity: supply_capacity.value,
                fssai_license: fssai_license.value,
                organic_certified: organic_certified.value,
                moisture: moisture.value,
                crop_year: crop_year.value,
                packaging: packaging.value,
                description: description.value,
                photo_url: photo_url
            };

            const response = await fetch("/transactions/updateproduct/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Server error:", text);
                showToast("❌ Server error", "error");
                return;
            }

            const result = await response.json();

            if (result.success) {
                showToast("✅ Product updated successfully", "success");
                setTimeout(() => {
                    window.location.href = "/transactions/myproducts/";
                }, 1200);
            } else {
                showToast(result.error || "❌ Update failed", "error");
            }

        } catch (err) {
            console.error(err);
            showToast("❌ Something went wrong", "error");
        }
    });
});

/* ===============================
   CLOUDINARY UPLOAD
================================ */
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
        throw new Error("Image upload failed");
    }
    return data.secure_url;
}

/* ===============================
   TOAST
================================ */
function showToast(message, type = "info", duration = 3000) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.className = "";
    toast.classList.add(type, "show");

    setTimeout(() => toast.classList.remove("show"), duration);
}

/* ===============================
   CSRF
================================ */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        for (let cookie of document.cookie.split(";")) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
