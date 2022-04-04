// Variables
const formInput = document.getElementById('form'),
      input = document.getElementById('input'),
      locationElem = document.getElementById('location'),
      timezoneElem = document.getElementById('timezone');


let lat, lng, city, region, postalCode, timezone;

// Data user
getDataUser();

// IP receive event
formInput.addEventListener('submit', (event) => {
  event.preventDefault();
  const ipAddress = input.value;
  input.value = '';
  getDataFromIp(ipAddress);
});

// Function

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
    [lat, lng, postalCode] = [data.latitude, data.longitude, data.postal];
    timezone = data.utc_offset.slice(0, 3) + ':00';
  } else {
    ({location: {lat, lng, city, region, postalCode, timezone}} = data);
  }

  renderData();
  ymaps.ready(init);
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

