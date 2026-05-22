document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: document.querySelector("[name='name']").value,
    email: document.querySelector("[name='email']").value,
    message: document.querySelector("[name='message']").value,
  };
  await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
});
