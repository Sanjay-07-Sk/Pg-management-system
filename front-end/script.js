async function loadRooms() {
  const res = await fetch("/api/rooms");
  const data = await res.json();
  document.getElementById("output").textContent =
    JSON.stringify(data, null, 2);
}
