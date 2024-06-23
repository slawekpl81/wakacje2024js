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
//  ==================== MAP =================================================
var lat_click = 0;
var lng_click = 0;
let map = L.map("map").setView([51.31526320761561, 21.953262725983183], 13);
map.on("click", function (e) {
  var coord = e.latlng;
  lat_click = coord.lat;
  lng_click = coord.lng;
  console.log(
    "You clicked the map at latitude: " +
      lat_click +
      " and longitude: " +
      lng_click
  );
  //   ================= ADD TO LIST ==============================================
  document.querySelector(
    "#in_coordination"
  ).value = `${lat_click}, ${lng_click}`;
});
document.querySelector("#bttn_ad_to_list").addEventListener("click", () => {
  localizations.push({
    // name: "nocne_zwiedzanie",
    // town: "KazimierzDolny",
    coord: [lat_click, lng_click],
    // color: "blue",
    popup_text: document.querySelector("#in_name").value,
    link: document.querySelector("#in_link").value,
  });
});
// ==================================================================================
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// ================================================================================
L.geoJSON(to_sand).addTo(map);
L.geoJSON(to_lu).addTo(map);
L.geoJSON(to_uj).addTo(map);
// =================== GET USER LOCATION =============================================
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
// ================= ADD ID TO DATA ==========================================
localizations.forEach((element, n) => {
  element.id = n;
});
// ============================================================================
let a_to_travel = document.querySelector("#link_to_web");
let data_link = "";
a_to_travel.addEventListener("click", () => {
  window.open(data_link, "_blank").focus();
});
for (let localization of localizations) {
  if (localization.coord.length > 0) {
    L.marker(localization.coord)
      .bindPopup(localization.popup_text)
      .openPopup()
      .on("click", () => {
        a_to_travel.innerText = localization.popup_text;
        data_link = localization.link;
      })
      .addTo(map);
  }
}
// ===================== LIST =======================================================
const ul = document.querySelector("ul");
for (let localization of localizations) {
  const li = document.createElement("li");
  const a_link = document.createElement("a");
  li.innerText = `${localization.town}- `;
  a_link.innerHTML = localization.popup_text;
  a_link.href = localization.link;
  a_link.target = "_blank";
  li.appendChild(a_link);
  ul.appendChild(li);
}
