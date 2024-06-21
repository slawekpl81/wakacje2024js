let castle_icon = L.icon({
  iconUrl: "castle.png",
  iconSize: [38, 95],
});
let sleep_icon = L.icon({
  iconUrl: "sleeping.png",
  iconSize: [38, 95],
});
let here_icon = L.icon({
  iconUrl: "placeholder.png",
  iconSize: [38, 38],
});

let map = L.map("map").setView([51.31526320761561, 21.953262725983183], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.geoJSON(to_sand).addTo(map);
L.geoJSON(to_lu).addTo(map);
L.geoJSON(to_uj).addTo(map);

// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
  // Prompt user for permission to access their location
  navigator.geolocation.getCurrentPosition(
    // Success callback function
    (position) => {
      // Get the user's latitude and longitude coordinates
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      L.marker([lat, lng], { icon: here_icon })
        .bindPopup("TU JESTEM!")
        .openPopup()
        .addTo(map);

      // Do something with the location data, e.g. display on a map
      console.log(`Latitude: ${lat}, longitude: ${lng}`);
    },
    // Error callback function
    (error) => {
      // Handle errors, e.g. user denied location sharing permissions
      console.error("Error getting user location:", error);
    }
  );
} else {
  // Geolocation is not supported by the browser
  console.error("Geolocation is not supported by this browser.");
}
let a_to_travel = document.querySelector("#link_to_web");
let data_link = "";
a_to_travel.addEventListener("click", () => {
  window.open(data_link, "_blank").focus();
});
for (let localization of localizations) {
  L.marker(localization.coord)
    .bindPopup(localization.popup_text)
    .openPopup()
    .on("click", () => {
      a_to_travel.innerText = localization.popup_text;
      data_link = localization.link;
    })
    .addTo(map);
}
