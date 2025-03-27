async function registerUser() {
    const nickname = document.getElementById("nickname").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/register", {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  name, nickname, password })
        
    })

    console.log( JSON.stringify({ name, nickname, password }))
    const data = await response.json();
    if (response.ok) {
        alert(`Registro exitoso`);
        window.location.href = "profile.html";
    } else {
        alert(`Error ${data.error}`);
    }
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    registerUser();
})