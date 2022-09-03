/* eslint-disable */

export const initMapbox = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamRlZWphdCIsImEiOiJjbDdkN3J5bncwazhvM3ZvbDJ3Mjl3dGh2In0.MqeSMRvJZuR5gu7Ndwww-A';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/jdeejat/cl7d83jn6001714qi5lbncigi', // style URL
    scrollZoom: false,
    //   center: [-74.5, 40], // starting position [lng, lat]
    //   zoom: 9, // starting zoom
    //   projection: 'globe', // display the map as a 3D globe
    //interactive: false, // disable map interactivity
    // more details https://docs.mapbox.com/mapbox-gl-js/api/map/
  });
  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({ offset: 25 })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<a href='${loc.googleMapsLink}' target="_blank">${loc.pointName}</a>`
      )
      .addTo(map);

    // extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
