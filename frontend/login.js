document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;
    

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ nickname, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.replace("profile.html");
        } else {
            document.getElementById("errorMsg").textContent = data.error;
        }
    } catch (error) {
        console.error("Error:", error)
    }
});

