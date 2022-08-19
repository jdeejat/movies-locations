// link extractor

const x = document.querySelectorAll('a');
const myarray = [];
for (let i = 0; i < x.length; i++) {
  const cleanlink = x[i].href;
  myarray.push(cleanlink);
}

console.log(myarray);

// keep only links containing 'maps'
const filtered = myarray.filter(function (link) {
  return link.includes('/maps');
});

function makeTable() {
  let table = '<table><thead><th>Links</th></thead><tbody>';
  for (let i = 0; i < filtered.length; i++) {
    table += '<tr><td>' + filtered[i] + '</td>';
  }

  const w = window.open('');
  w.document.write(table);
}
makeTable();

//Top Gun

const topGun = [
  'https://goo.gl/maps/uaGyEvDWGfPnibka6',
  'https://goo.gl/maps/Wma7uYtuz4iNg87e8',
  'https://goo.gl/maps/GhuQR1zdaUejE7qG7',
  'https://goo.gl/maps/mxUVHn5yYKWdzAaf7',
  'https://goo.gl/maps/WUT66FtLKrPQVYah7',
  'https://goo.gl/maps/MxUm3dzguSGogy1q6',
  'https://goo.gl/maps/JJcACsPa3uE5Egjq6',
  'https://goo.gl/maps/LSK7VdFeMjihknsKA',
  'https://goo.gl/maps/AC9iRbeDWmUQpsxQ8',
  'https://goo.gl/maps/iuA3Ry6Wts2yAeWE6',
  'https://goo.gl/maps/anvgmQF8cZ2cJGQw8',
  'https://goo.gl/maps/ebCKsBsgyUkaa7nU7',
  'https://goo.gl/maps/BkXQeVhR17z6V4Sq9',
  'https://goo.gl/maps/QkGscHf1u7UyEvcr6',
];

const regex = /@([0-9\.]+),([0-9\.]+)/;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('@([0-9\\.]+),([0-9\\.]+)', '')

const str = `https://www.google.fr/maps/place/Avenue+du+G%C3%A9n%C3%A9ral+Leclerc,+Vand%C5%93uvre-l%C3%A8s-Nancy/@48.6602046,6.1612375,17z/data=!4m2!3m1!1s0x47949883998f2a0d:0xb3a20a525afff3a8
  `;
let m;

if ((m = regex.exec(str)) !== null) {
  // The result can be accessed through the `m`-variable.
  m.forEach((match, groupIndex) => {
    console.log(`Found match, group ${groupIndex}: ${match}`);
  });
}

const allMovieLinks = [
  'https://www.atlasofwonders.com/2022/08/where-was-prey-filmed.html',
  'https://www.atlasofwonders.com/2022/07/zbrka-castle-where-was-gray-man.filmed.html',
  'https://www.atlasofwonders.com/2022/06/where-was-jurassic-world-dominion-filmed.html',
  'https://www.atlasofwonders.com/2022/06/where-was-top-gun-maverick-filmed.html',
  'https://www.atlasofwonders.com/2022/05/colby-beach-where-was-along-for-the-ride-filmed.html',
  'https://www.atlasofwonders.com/2022/04/where-was-the-northman-filmed.html',
  'https://www.atlasofwonders.com/2022/04/where-was-the-batman-filmed.html',
  'https://www.atlasofwonders.com/2022/04/vin-de-vie-all-the-old-knives.html',
  'https://www.atlasofwonders.com/2022/04/where-was-the-lost-city-filmed-island.html',
  'https://www.atlasofwonders.com/2022/03/where-was-deep-water-filmed.html',
  'https://www.atlasofwonders.com/2022/03/where-was-the-adam-project-filmed.html',
  'https://www.atlasofwonders.com/2022/02/where-was-nightmare-alley-filmed-house.html',
  'https://www.atlasofwonders.com/2022/01/lavania-the-royal-treatment.html',
  'https://www.atlasofwonders.com/2022/01/hollingbrook-where-was-the-perfect-pairing-filmed.html',
  'https://www.atlasofwonders.com/2022/01/where-was-ghostbusters-afterlife-filmed.html',
  'https://www.atlasofwonders.com/2022/01/kyopeli-where-was-the-lost-daughter-filmed.html',
  'https://www.atlasofwonders.com/2021/12/where-was-matrix-resurrections-filmed.html',
  'https://www.atlasofwonders.com/2021/12/where-was-the-unforgivable-filmed.html',
  'https://www.atlasofwonders.com/2021/12/where-was-the-power-of-the-dog-filmed.html',
  'https://www.atlasofwonders.com/2021/12/dun-dunbar-castle-for-christmas-location.html',
  'https://www.atlasofwonders.com/2021/11/where-was-christmas-at-castle-hart-filmed.html',
  'https://www.atlasofwonders.com/2021/11/where-was-the-harder-they-fall-filmed.html',
  'https://www.atlasofwonders.com/2021/10/where-was-dune-filmed.html',
  'https://www.atlasofwonders.com/2021/09/where-was-raise-a-glass-to-love-filmed.html',
  'https://www.atlasofwonders.com/2021/09/where-was-journey-of-my-heart-filmed.html',
  'https://www.atlasofwonders.com/2021/09/where-was-cinderella-filmed-house.html',
  'https://www.atlasofwonders.com/2021/08/sweet-girl-filming-locations.html',
  'https://www.atlasofwonders.com/2021/08/where-was-reminiscence-house-filmed.html',
  'https://www.atlasofwonders.com/2021/08/where-was-coda-filmed.html',
  'https://www.atlasofwonders.com/2021/08/where-was-kissing-booth-3-filmed.html',
  'https://www.atlasofwonders.com/2021/08/where-was-suicide-squad-filmed.html',
  'https://www.atlasofwonders.com/2021/08/where-was-jungle-cruise-filmed-la-luna-rota.html',
  'https://www.atlasofwonders.com/2021/07/resort-to-love-resort-hotel-mer-de-saphir.html',
  'https://www.atlasofwonders.com/2021/07/where-was-hitmans-wifes-bodyguard-filmed.html',
  'https://www.atlasofwonders.com/2021/07/where-was-gunpowder-milkshake-filmed.html',
  'https://www.atlasofwonders.com/2021/07/where-was-the-black-widow-filmed.html',
  'https://www.atlasofwonders.com/2021/07/fear-street-camp-nightwing-shadyside-mall.html',
  'https://www.atlasofwonders.com/2021/06/fast-furious-9-house-filming-locations.html',
  'https://www.atlasofwonders.com/2021/06/where-was-sand-dollar-cove-filmed-connecticut.html',
  'https://www.atlasofwonders.com/2021/06/where-was-the-bakers-son-filmed-windward-washington.html',
  'https://www.atlasofwonders.com/2021/06/you-had-me-at-aloha-hotel-location.html',
  'https://www.atlasofwonders.com/2021/05/cruella-house-filming-location.html',
  'https://www.atlasofwonders.com/2021/05/where-was-a-quiet-place-2-filmed-island-city.html',
  'https://www.atlasofwonders.com/2021/04/things-heard-seen-house-location-chosen-ny.html',
  'https://www.atlasofwonders.com/2021/04/lemon-myrtle-cove-hearts-down-under.html',
  'https://www.atlasofwonders.com/2021/04/where-was-mortal-kombat-filmed.html',
  'https://www.atlasofwonders.com/2021/04/where-was-nobody-filmed.html',
  'https://www.atlasofwonders.com/2021/04/kilabbey-ireland-castle-as-luck-would-have-it-location.html',
  'https://www.atlasofwonders.com/2021/04/thunder-force-filming-locations.html',
  'https://www.atlasofwonders.com/2021/04/augusta-victoria-college-six-minutes-to-midnight.html',
  'https://www.atlasofwonders.com/2021/04/where-was-godzilla-vs-kong-filmed.html',
  'https://www.atlasofwonders.com/2021/03/where-was-chasing-waterfalls-filmed.html',
  'https://www.atlasofwonders.com/2021/03/where-was-sas-red-notice-filmed-house-locations.html',
  'https://www.atlasofwonders.com/2021/03/yes-day-park-filming-locations.html',
  'https://www.atlasofwonders.com/2021/03/where-was-fit-for-prince-filmed.html',
  'https://www.atlasofwonders.com/2021/03/coming-2-america-house-filming-locations.html',
  'https://www.atlasofwonders.com/2021/03/where-was-boss-level-filmed.html',
  'https://www.atlasofwonders.com/2021/03/moxie-high-school-filming-locations.html',
  'https://www.atlasofwonders.com/2021/02/royal-gate-hotel-tom-and-jerry.html',
  'https://www.atlasofwonders.com/2021/02/i-care-lot-house-location.html',
  'https://www.atlasofwonders.com/2021/01/where-was-snowkissed-filmed-beachwood-bed-breakfast.html',
  'https://www.atlasofwonders.com/2021/01/the-dig-house-filming-locations.html',
  'https://www.atlasofwonders.com/2021/01/where-was-a-winter-getaway-filmed.html',
  'https://www.atlasofwonders.com/2021/01/outside-the-wire-filming-locations.html',
  'https://www.atlasofwonders.com/2021/01/news-of-the-world-filming-locations.html',
  'https://www.atlasofwonders.com/2021/01/where-was-pieces-of-woman-filmed-bridge-location.html',
  'https://www.atlasofwonders.com/2020/12/where-was-wonder-woman-1984-filmed.html',
  'https://www.atlasofwonders.com/2020/12/barbeau-observatory-where-was-the-midnight-sky-filmed.html',
  'https://www.atlasofwonders.com/2020/12/ancadia-where-was-christmas-carousel-filmed.html',
  'https://www.atlasofwonders.com/2020/12/a-california-christmas-filming-location-bernet-vineyard.html',
  'https://www.atlasofwonders.com/2020/12/edgewater-indiana-the-prom-filming-locations.html',
  'https://www.atlasofwonders.com/2020/12/where-was-freaky-filmed.html',
  'https://www.atlasofwonders.com/2020/11/where-was-let-him-go-filmed.html',
  'https://www.atlasofwonders.com/2020/11/christmas-chronicles-resort-mexico.html',
  'https://www.atlasofwonders.com/2020/11/happiest-season-filming-locations.html',
  'https://www.atlasofwonders.com/2020/11/where-was-hillbilly-elegy-filmed.html',
  'https://www.atlasofwonders.com/2020/11/montenaro-princess-switch-filming-locations.html',
  'https://www.atlasofwonders.com/2020/11/where-was-jingle-jangle-filmed.html',
  'https://www.atlasofwonders.com/2020/11/where-was-life-ahead-filmed.html',
  'https://www.atlasofwonders.com/2020/11/operation-christmas-drop-location-guam.html',
  'https://www.atlasofwonders.com/2020/11/his-house-city-filming-location.html',
  'https://www.atlasofwonders.com/2020/10/holidate-filming-locations.html',
  'https://www.atlasofwonders.com/2020/10/borat-house-village-filming-location.html',
  'https://www.atlasofwonders.com/2020/10/rebecca-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/10/the-mortuary-collection-house-ravens-end.html',
  'https://www.atlasofwonders.com/2020/10/trial-chicago-7-court-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/10/hubie-halloween-locations.html',
  'https://www.atlasofwonders.com/2020/09/enola-holmes-house-filming-locations.html',
  'https://www.atlasofwonders.com/2020/09/the-devil-all-time-locations-knockemstiff-ohio.html',
  'https://www.atlasofwonders.com/2020/09/the-babysitter-killer-queen-lake.html',
  'https://www.atlasofwonders.com/2020/09/where-was-love-guaranteed-filmed.html',
  'https://www.atlasofwonders.com/2020/09/bill-and-ted-house-filming-locations.html',
  'https://www.atlasofwonders.com/2020/06/mulan-filming-locations.html',
  'https://www.atlasofwonders.com/2020/08/tenet-filming-locations-house-italy.html',
  'https://www.atlasofwonders.com/2020/08/project-power-city-filming-locations.html',
  'https://www.atlasofwonders.com/2020/08/where-was-secret-garden-house-filmed.html',
  'https://www.atlasofwonders.com/2020/08/made-in-italy-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/08/work-it-city-high-school-filming-locations.html',
  'https://www.atlasofwonders.com/2020/08/where-was-black-is-king-filmed.html',
  'https://www.atlasofwonders.com/2020/07/oceancrest-fatal-affair-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/07/the-rental-movie-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/07/kissing-booth-2-school-filming-location.html',
  'https://www.atlasofwonders.com/2020/07/ghosts-of-war-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/07/the-old-guard-house-city-filming-locations.html',
  'https://www.atlasofwonders.com/2020/07/desperados-las-playas-resort-hotel-cabos-location.html',
  'https://www.atlasofwonders.com/2020/06/eurovision-story-fire-saga-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/06/feel-beat-city-filming-locations.html',
  'https://www.atlasofwonders.com/2020/06/you-should-have-left-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/06/artemis-fowl-house-filming-locations.html',
  'https://www.atlasofwonders.com/2020/06/the-last-days-of-american-crime-city-locations.html',
  'https://www.atlasofwonders.com/2020/06/the-vast-of-night-cayuga-location.html',
  'https://www.atlasofwonders.com/2020/05/the-lovebirds-city-new-orleans-filming-locations.html',
  'https://www.atlasofwonders.com/2020/05/capone-house-movie-filming-location-florida.html',
  'https://www.atlasofwonders.com/2020/05/the-wrong-missy-hotel-resort-filming-location-hawaii.html',
  'https://www.atlasofwonders.com/2020/05/dangerous-lies-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/05/the-half-of-it-filming-location-squamish.html',
  'https://www.atlasofwonders.com/2020/04/bad-education-filming-locations-roslyn.html',
  'https://www.atlasofwonders.com/2020/04/where-was-extraction-filmed-filming-locations-dhaka.html',
  'https://www.atlasofwonders.com/2020/04/love-wedding-repeat-villa-filming-location.html',
  'https://www.atlasofwonders.com/2020/03/easter-cove-maine-blow-man-down-filming-locations.html',
  'https://www.atlasofwonders.com/2020/02/bartlett-indiana-all-bright-places-city-filming-locations.html',
  'https://www.atlasofwonders.com/2020/03/mica-arizona-stargirl-filming-location.html',
  'https://www.atlasofwonders.com/2020/02/the-call-of-wild-filming-locations-where-filmed-yukon.html',
  'https://www.atlasofwonders.com/2020/02/where-was-to-all-boys-filmed-filming-locations-house-belleview-alder-high-school.html',
  'https://www.atlasofwonders.com/2020/02/fantasy-island-filming-location-house-beach-taveuni-fiji.html',
  'https://www.atlasofwonders.com/2020/02/come-to-daddy-house-filming-location-cabin-beach.html',
  'https://www.atlasofwonders.com/2020/01/the-turning-house-filming-location.html',
  'https://www.atlasofwonders.com/2020/01/1917-filming-location-where-how-filmed-making-of.html',
  'https://www.atlasofwonders.com/2020/01/troop-zero-wiggly-georgia-filming-locations.html',
];
