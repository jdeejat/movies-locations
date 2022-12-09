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
  // return link.includes('/maps');
  return link;
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
  'https://www.atlasofwonders.com/2022/11/monroeville-ny-where-was-disenchanted-filmed.html',
  'https://www.atlasofwonders.com/2022/11/barkley-cove-nc-where-the-crawdads-sing-location.html',
  'https://www.atlasofwonders.com/2022/11/where-was-the-royal-nanny-filmed.html',
  'https://www.atlasofwonders.com/2022/11/where-was-falling-for-christmas-filmed.html',
  'https://www.atlasofwonders.com/2022/11/gracious-vermont-we-wish-you-marriedhristmas.html',
  'https://www.atlasofwonders.com/2022/10/where-was-hocus-pocus-2-filmed.html',
  'https://www.atlasofwonders.com/2022/09/where-was-lou-filmed.html',
  'https://www.atlasofwonders.com/2022/09/where-was-do-revenge-filmed.html',
];
