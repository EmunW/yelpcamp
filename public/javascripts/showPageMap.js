mapboxgl.accessToken = mapToken; // mapToken is defined in show.ejs
const coordinates = thisCamp.geometry.coordinates; // thisCamp is defined in show.ejs.
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right')

new mapboxgl.Marker() // Adds a marker to our map
    .setLngLat(coordinates)
    .setPopup( // Allows us to click on the marker and open a pop up
        new mapboxgl.Popup({offset: 25})
            .setHTML(`<h3>${thisCamp.title}</h3><p>${thisCamp.location}</p>`))
    .addTo(map)
