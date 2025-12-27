function checkCode() {
  const input = document.getElementById("codeInput").value;
  if (input === "0525") {
    window.location.href = "cards.html";
  } else {
    document.getElementById("error").textContent = "❌ Incorrect code";
  }
}
