if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function register() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const repeatPassword = document.getElementById("repeat-password").value;
  const hashedPassword = await hashPassword(password);
  const idCounter = users.length > 0 ? users.reduce((max, user) => user.id > max ? user.id : max, 0) + 1 : 1;
  if (email !== "" && password !== "" && repeatPassword !== "") {
    if (password !== repeatPassword) {
      alert("Repeat password does not match!");
      return;
    }

    if (!checkValidEmail(email)) {
      return;
    }
    const newUser = {
      id: idCounter,
      email: email,
      password: hashedPassword,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Registration successful!");
    window.location.href = "./login.html";
  } else {
    alert("Please fill in both email and password fields.");
    return;
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;
  const hashedPassword = await hashPassword(password);
  
  if (email !== "" && password !== "") {
    let users = JSON.parse(localStorage.getItem("users") || []);
    const user = users.find(
      (user) => user.email === email && user.password === hashedPassword);
    if (user) {
      alert("Login successful!");

      if (rememberMe) {
        localStorage.setItem("remembered-user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("current-user", JSON.stringify(user));
      }

      window.location.href = "./index.html";
    } else {
      alert("Invalid email or password.");
    }
  } else {
    alert("Please fill in both email and password fields.");
  }
}

window.onload = function () {
  const rememberedUser = JSON.parse(localStorage.getItem("remembered-user"));
  const currentSessionUser = JSON.parse(sessionStorage.getItem("current-user"));
  const currentPage = window.location.pathname.split("/").pop();

  if (rememberedUser || currentSessionUser) {
    if (currentPage === "./login.html" || currentPage === "./signup.html") {
      window.location.href = "index.html";
    }
  } else {
    if (currentPage === "./index.html" || currentPage === "") {
      window.location.href = "login.html";
    }
  }
};

function logout() {
  const confirmation = confirm("Are you sure you want to log out?");
  if (confirmation) {
    localStorage.removeItem("remembered-user");
    sessionStorage.removeItem("current-user");
    alert("Logout successful!");
    window.location.href = "./login.html";
  } else {
    return;
  }
}
