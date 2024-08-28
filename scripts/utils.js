function checkValidEmail(email) {
  //error missing @ or missing part after @
  const domainPart = email.split("@")[1];
  if (!domainPart) {
    alert("Missing '@' or domain part after '@' ");
    return;
  }
  //error too short
  const localPart = email.split("@")[0];
  if (localPart.length < 4) {
    alert("Username must be at least 4 characters long");
    return;
  }
  //error missing "." or don't have any part after "."
  const checkEmailPartDoc = domainPart.split(".");
  if (
    checkEmailPartDoc.length < 2 ||
    checkEmailPartDoc.some((part) => part.length < 1)
  ) {
    alert(
      "Email domain is invalid. It must contain a '.' and have valid parts after it."
    );
    return;
  }

  //error username have already exited
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const emailExit = users.some((user) => user.email === email);

  if (emailExit) {
    alert("This email is already registered");
    return;
  }

  //error username have special character
  const regex = regexCondition;
  for (let part of checkEmailPartDoc) {
    if (!regex.test(part)) {
      alert("Email mustn't have special character");
      return;
    }
  }
  return true;
}
