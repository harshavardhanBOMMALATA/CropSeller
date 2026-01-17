document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const btn = document.getElementById("loginBtn");
    const btnText = document.getElementById("btnText");
    const spinner = document.getElementById("spinner");

    form.addEventListener("submit", function () {
        btn.classList.add("loading");
        btnText.style.display = "none";
        spinner.style.display = "block";
    });
});

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch('/database/user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href='home/';
        } else {
            document.getElementById("failuremessage").innerText = "Username or Password is Wrong";
            document.getElementById("failuremessage").style.color = "red";
            console.log("failure");
        }
    })
    .catch(() => {
        alert("failure");
    });
});
