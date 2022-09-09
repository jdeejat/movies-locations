/* eslint-disable */

export const initMapbox = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamRlZWphdCIsImEiOiJjbDdkN3J5bncwazhvM3ZvbDJ3Mjl3dGh2In0.MqeSMRvJZuR5gu7Ndwww-A';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/jdeejat/cj20he7w700402rmjs5zfkwlj', // style URL
    // scrollZoom: false,
    cooperativeGestures: true,

    //   center: [-74.5, 40], // starting position [lng, lat]
    //   zoom: 9, // starting zoom
    //   projection: 'globe', // display the map as a 3D globe
    //interactive: false, // disable map interactivity
    // more details https://docs.mapbox.com/mapbox-gl-js/api/map/
  });
  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });
  map.addControl(new mapboxgl.FullscreenControl());

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
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<a href='${loc.googleMapsLink}' target="_blank">${loc.pointName}</a>`
          )
      )
      .addTo(map);

    // add popup OLD
    // new mapboxgl.Popup({ offset: 25 })
    //   .setLngLat(loc.coordinates)
    //   .setHTML(
    //     `<a href='${loc.googleMapsLink}' target="_blank">${loc.pointName}</a>`
    //   )
    //   .addTo(map);

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
