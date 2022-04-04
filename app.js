// Variables
const formInput = document.getElementById('form'),
      input = document.getElementById('input');

let lat, lng, city, region, postalCode, timezone;

const geo = navigator.geolocation;

// Browser user geo
geo.getCurrentPosition(geoUser);

// IP receive event
formInput.addEventListener('submit', (event) => {
  event.preventDefault();
  const ipAddress = input.value;
  input.value = '';
  getDataFromIp(ipAddress);
});

// Function

// Get user geo
function geoUser(GeolocationPosition) {
  const {coords: {latitude, longitude}} = GeolocationPosition;
  [lat, lng] = [latitude, longitude];
  ymaps.ready(init);
}

// Getting data from ip
function getDataFromIp(ipAdrress) {
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_PxkTXrm276OiicMW67ucF7GmSPjci&ipAddress=${ipAddress}`)
    .then(res => res.json())
    .then(data => destrData(data));
}

// Data destructuring
function destrData(data) {
  console.log(data);
  ({location: {lat, lng}} = data);
  ymaps.ready(init);
}

// Creating map
function init() {
  let map = new ymaps.Map('map', {
    center: [lat, lng],
    zoom: 16,
  });

  const prevMap = document.getElementById('map').firstElementChild;
  const newMap = document.getElementById('map').lastElementChild;

  if (prevMap !== newMap) {
    prevMap.remove();
  }

  map.controls.remove('geolocationControl'); // удаляем геолокацию
  map.controls.remove('searchControl'); // удаляем поиск
  map.controls.remove('trafficControl'); // удаляем контроль трафика
  map.controls.remove('typeSelector'); // удаляем тип
  map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
  map.controls.remove('zoomControl'); // удаляем контрол зуммирования
  map.controls.remove('rulerControl'); // удаляем контрол правил
}

