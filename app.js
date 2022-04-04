// Variables
// DOM elem
const formInput = document.getElementById('form'),
      input = document.getElementById('input'),
      locationElem = document.getElementById('location'),
      timezoneElem = document.getElementById('timezone');

// Data
let lat, lng, city, region, postalCode, timezone;

// User geo
// The user's geolocation is more accurately determined through Yandex Map than through the Geolocation API
ymaps.ready(initGeo); 

getDataUser();

// IP receive event
formInput.addEventListener('submit', (event) => {
  event.preventDefault();

  const isIpAddress = validateForm(input.value);
  if (isIpAddress) {
    getDataFromIp(input.value);
  } else {
    alert('Enter correct IP..');
  }
  input.value = '';
});

// Function
// Validate form
function validateForm(ipAddress) {
  const regExp = /(\d{1,3}\.){3}\d{1,3}/;
  return regExp.test(ipAddress);
}

// Gettting data user
function getDataUser() {
  fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(data => destrData(data, true));
}

// Getting data from ip
function getDataFromIp(ipAddress) {
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_PxkTXrm276OiicMW67ucF7GmSPjci&ipAddress=${ipAddress}`)
    .then(res => res.json())
    .then(data => destrData(data, false));
}

// Data destructuring
function destrData(data, isUserData) {
  if (isUserData) {
    ({city, region} = data);
    postalCode = data.postal;
    timezone = data.utc_offset.slice(0, 3) + ':00';
  } else {
    ({location: {lat, lng, city, region, postalCode, timezone}} = data);
    ymaps.ready(init);
  }
  renderData();
}

// Render data
function renderData() {
  const newLocation = `${city}, ${region} ${postalCode}`;
  
  locationElem.innerText = newLocation;
  timezoneElem.innerText = timezone;
}

// Creating map
function init() {
  let map = new ymaps.Map('map', {
    center: [lat, lng],
    zoom: 10,
  });

  map.geoObjects.add(new ymaps.Placemark([lat, lng], {
    balloonContent: 'То самое место'
  }, {
    preset: 'islands#circleIcon',
    iconColor: '#3caa3c'
  }));

  // Remove previous map
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
  map.controls.remove('rulerControl'); // удаляем контрол правил
}

function initGeo() {
  let geolocation = ymaps.geolocation,
    myMap = new ymaps.Map('map', {
      center: [55, 34],
      zoom: 10
    });

  geolocation.get({
    provider: 'yandex',
    mapStateAutoApply: true
  }).then(function (result) {
    result.geoObjects.options.set('preset', 'islands#redCircleIcon');
    result.geoObjects.get(0).properties.set({
      balloonContentBody: 'Мое местоположение'
    });
    myMap.geoObjects.add(result.geoObjects);
  });

  myMap.controls.remove('geolocationControl'); // удаляем геолокацию
  myMap.controls.remove('searchControl'); // удаляем поиск
  myMap.controls.remove('trafficControl'); // удаляем контроль трафика
  myMap.controls.remove('typeSelector'); // удаляем тип
  myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
  myMap.controls.remove('rulerControl'); // удаляем контрол правил
}

