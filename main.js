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
// =============== coordinations ========================================
let lat_user;
let lng_user;
let lat_click = 0;
let lng_click = 0;
let map;
let markers = [];
// let layer;
let localizations = [...localizations_data];
let selected = null;
//  ==================== MAP =================================================

function create_map() {
  console.log("create_map");
  map = L.map("map").setView([51.31526320761561, 21.953262725983183], 13);
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

    //   ================= ADD TO CLICK COORD TO INPUT ==============================================
    document.querySelector(
      "#in_coordination"
    ).value = `${lat_click}, ${lng_click}`;
  });
}
function create_layer() {
  // ==================================================================================
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  // ================================================================================
}

create_map();
create_layer();

document.querySelector("#bttn_ad_to_list").addEventListener("click", () => {
  localizations.push({
    // name: "nocne_zwiedzanie",
    town: document.querySelector("#in_town").value,
    coord: [lat_click, lng_click],
    // color: "blue",
    popup_text: document.querySelector("#in_name").value,
    link: document.querySelector("#in_link").value,
    id: getId(),
  });
  console.log(localizations);
  document.querySelector("#in_coordination").value = "";
  document.querySelector("#in_town").value = "";
  document.querySelector("#in_name").value = "";
  document.querySelector("#in_link").value = "";
  update_map();
});

// L.geoJSON(to_sand).addTo(map);
// L.geoJSON(to_lu).addTo(map);
// L.geoJSON(to_uj).addTo(map);
// =================== GET USER LOCATION =============================================
// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
  // Prompt user for permission to access their location
  navigator.geolocation.getCurrentPosition(
    // Success callback function
    (position) => {
      // Get the user's latitude and longitude coordinates
      lat_user = position.coords.latitude;
      lng_user = position.coords.longitude;
      L.marker([lat_user, lng_user], { icon: here_icon })
        .bindPopup("TU JESTEM!")
        .openPopup()
        .addTo(map);

      // Do something with the location data, e.g. display on a map
      console.log(`Latitude: ${lat_user}, longitude: ${lng_user}`);
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
  element.id = getId();
});
// ============================================================================

// window.open(data_link, "_blank").focus();
function add_markers() {
  for (let localization of localizations) {
    if (localization.coord.length > 0) {
      let temp = L.marker(localization.coord)
        .bindPopup(localization.popup_text)
        .openPopup()
        .on("click", () => {
          // a_to_travel.innerText = localization.popup_text;
          data_link = localization.link;
          selected = localization.id;
          update_list();
        });
      markers.push(temp);
    }
  }
  markers.forEach((m) => m.addTo(map));
  console.log("markers ", markers.length);
}
function remove_all_markers() {
  markers.forEach((m) => map.removeLayer(m));
  markers.forEach((m) => m.remove());
  markers = [];
}
add_markers();
// ===================== LIST =======================================================
function render_list() {
  const ul = document.querySelector("ul");
  for (let localization of localizations) {
    const li = document.createElement("li");
    const select_span = document.createElement("span");
    select_span.innerText = "ZAZNACZ";
    select_span.setAttribute("id", localization.id);
    select_span.addEventListener("click", selectLocalization);
    const remove_span = document.createElement("span");
    remove_span.setAttribute("id", localization.id);
    remove_span.addEventListener("click", removeLocalization);
    remove_span.innerText = "USUŃ";

    li.innerText = `${localization.town} - ${localization.popup_text}`;
    if (localization.id == selected) {
      li.style.backgroundColor = "lightgrey";
    }

    if (localization.link != "") {
      const a_link = document.createElement("a");
      a_link.innerHTML = "www";
      a_link.href = localization.link;
      a_link.target = "_blank";
      li.appendChild(a_link);
    }
    li.appendChild(select_span);
    li.appendChild(remove_span);
    ul.appendChild(li);
  }
}
function clear_list() {
  let div_ul = document.querySelector("ul");

  while (div_ul.firstChild) {
    div_ul.removeChild(div_ul.firstChild);
  }
}
render_list();
// =====================================================================================
function update_map() {
  remove_all_markers();
  // console.log(localizations);
  add_markers();
}
function update_list() {
  clear_list();
  render_list();
}
// =====================================================================================
function selectLocalization(event) {
  event.preventDefault();
  const selected_id = event.target.id;
  selected = selected_id;
  update_map();
  update_list();
  let select_localization = localizations.find((e) => e.id == selected_id);
  let select_coord = select_localization.coord;
  console.log(select_coord);
  map.setView(select_coord, 13);
}
// =========================================================================================
function removeLocalization(event) {
  event.preventDefault();
  const remove_id = event.target.id;
  console.log(remove_id);
  localizations = [
    ...localizations.filter((location) => location.id != remove_id),
  ];
  update_map();
  update_list();
}
// ======================================================================================
function getId() {
  return Math.floor(Math.random() * 1000) + Date.now();
}
