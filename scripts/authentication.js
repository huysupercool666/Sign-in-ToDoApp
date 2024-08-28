if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

function register() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const repeatPassword = document.getElementById("repeat-password").value;
  if (email !== "" && password !== "" && repeatPassword !== "") {
    if (password !== repeatPassword) {
      alert("Repeat password does not match!");
      return;
    }

    if (!checkValidEmail(email)) {
      return;
    }

    const newUser = {
      email: email,
      password: password,
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

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  if (email !== "" && password !== "") {
    let users = JSON.parse(localStorage.getItem("users") || []);
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
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