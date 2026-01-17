document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const profilePic = document.getElementById("profilePic");
  const photoInput = document.getElementById("photoInput");

  editBtn.addEventListener("click", () => {
    ["name","phone","address"].forEach(id => {
      document.getElementById(id).disabled = false;
    });
    saveBtn.classList.add("show");
    profilePic.classList.add("edit");
  });

  profilePic.addEventListener("click", () => {
    if(!profilePic.classList.contains("edit")) return;
    photoInput.click();
  });

  photoInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("topProfile").src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  fetch("/user/userdetails/")
  .then(response=>response.json())
  .then(data=>{
    document.getElementById("userName").innerText=data.result.username;
    document.getElementById("userEmail").innerText=data.result.email;
    document.getElementById("phoneNumber").innerText=data.result.phonenumber;
    document.getElementById("name").value=data.result.username;
    document.getElementById("email").value=data.result.email;
    document.getElementById("phone").value=data.result.phonenumber;
    document.getElementById("address").value=data.result.address;
    document.getElementById("topProfile").src = data.result.photo;
  })

  // Fetch Products Posted Count
fetch("/transactions/productpostedcount/")
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("productpostedcount").innerText =
        data.products_posted;
    }
  })
  .catch(err => console.error("Products count error:", err));


// Fetch Biddings Posted Count
fetch("/transactions/biddingspostedcount/")
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("biddingspostedcount").innerText =
        data.bids_made;
    }
  })
  .catch(err => console.error("Biddings count error:", err));


});


document.getElementById("saveBtn").onclick = function (event) {
  event.preventDefault();

  fetch("/user/userdetails/edit/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken")
    },
    body: JSON.stringify({
      username: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phonenumber: document.getElementById("phone").value,
      address: document.getElementById("address").value
    })
  })
  .then(response => response.json())
  .then(res => {
    console.log(clicked);
    if (res.status === "success") {
      fetch("/user/userdetails/")
        .then(response => response.json())
        .then(data => {
          document.getElementById("userName").innerText = data.result.username;
          document.getElementById("userEmail").innerText = data.result.email;
          document.getElementById("phoneNumber").innerText = data.result.phonenumber;
          document.getElementById("name").value = data.result.username;
          document.getElementById("email").value = data.result.email;
          document.getElementById("phone").value = data.result.phonenumber;
          document.getElementById("address").value = data.result.address;
        });
    } else {
      alert("please login again");
      window.location.href = "/";
    }
  });
};

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
