const canvas = document.getElementById("imageCanvas");
const downloadBtn = document.getElementById("download");
const sendBtn = document.getElementById("send");

/////////LASTF

let nowPlayingTrack;

let createButton = document.getElementById("createButton");

let usernameInput = document.getElementById("usernameInput");
let key = "b11d0f02d30b29b4092be9d26f4b5308";

sendBtn.addEventListener("click", () => {


  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";  // Add this line
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  }
let colors = [
  {
    color1: '#f8c0ea90',
    color2: '#a48ed290'
  },
  {
    color1: '#330d6990',
    color2: '#30c9cd90'
  },
  {
    color1: '#6717cd90',
    color2: '#2871fa90'
  },
  {
    color1: '#209cff90',
    color2: '#68e0cf90'
  },
  {
    color1: '#12d6df90',
    color2: '#f70fff90'
  },
  {
    color1: '#cd408f90',
    color2: '#094fc390'
  },
  {
    color1: '#e877ae90',
    color2: '#7c73f390'
  },
  {
    color1: '#fdc2d890',
    color2: '#04128290'
  },
  {
    color1: '#d70a8490',
    color2: '#51127f90'
  },
  {
    color1: '#c8e3fa90',
    color2: '#e6249090'
  },
  {
    color1: '#dbddd790',
    color2: '#1f182890'
  },
  {
    color1: '#facc2290',
    color2: '#f8360090'
  },
  {
    color1: '#f2f04790',
    color2: '#1ed94f90'
  },
  {
    color1: '#29f19c90',
    color2: '#02a1f990'
  },
  {
    color1: '#b193cb90',
    color2: '#60e4de90'
  },
]


let randomColor = colors[Math.floor(Math.random() * colors.length)]

let lastfmuser = usernameInput.value;
fetch(
  `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmuser}&api_key=${key}&limit=1&format=json`
)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    nowPlayingTrack = data;

    let songName = nowPlayingTrack.recenttracks.track[0].name;
    let songArtist = nowPlayingTrack.recenttracks.track[0].artist["#text"];
    let songAlbum = nowPlayingTrack.recenttracks.track[0].album["#text"];

    fetch(
      `https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${key}&artist=${songArtist}&album=${songAlbum}&format=json`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let trackCover = data;
        let songCover = trackCover.album.image[3]["#text"];
        let filterImg = 'imgs/img2.webp'

        const ctx = canvas.getContext("2d");

        // // Draw text
        // ctx.fillStyle = "black";
        // ctx.font = "100px Kanit";
        // ctx.fillText("Testing", 180, 50);

        // // Convert to image
        // const img = new Image();
        // img.src = canvas.toDataURL("image/png");
        const font = new FontFace("Kanit", "url(fonts/Kanit-Bold.ttf)");

        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont); // Add font to document
        
            return Promise.all([
                loadImage(songCover),
                loadImage(filterImg),
            ]);
        }).then(([songCoverImg, topImg]) => {
            ctx.drawImage(songCoverImg, -270, 810, 1620, 1620);
            ctx.drawImage(songCoverImg, 0, 0, 1080, 1080);
            ctx.drawImage(topImg, 0, 0, 1080, 1920);
            ctx.fillStyle = "white";
            fitTextInBox(ctx, 'Now Playing', 40, 1100, 1000, 200, '60', 'Kanit');
            fitTextInBox(ctx, songName, 40, 1280, 1000, 200, '140', 'Kanit');
            fitTextInBox(ctx, 'by', 40, 1360, 1000, 200, '40', 'Kanit');
            fitTextInBox(ctx, songArtist, 40, 1440, 1000, 200, '100', 'Kanit');
            ctx.globalCompositeOperation = "screen";
            const grad=ctx.createLinearGradient(0,0, 1080,1920);
            grad.addColorStop(0, randomColor.color1);
            grad.addColorStop(1, randomColor.color2);

            ctx.fillStyle = grad;
            ctx.fillRect(0,0, 1080,1920);
            ctx.save();
            ctx.translate(90, 21);
            ctx.rotate(Math.PI / 2);
            ctx.globalCompositeOperation = "multiply";
            ctx.fillStyle = "#00000030";
            ctx.font = "500px Kanit";
            ctx.textAlign = 'left';
            ctx.fillText(songArtist, -800, 0);
            ctx.font = "900px Kanit";
            ctx.textAlign = 'right';
            ctx.fillText(songName, 2100, -700);
            ctx.restore();
            ctx.globalCompositeOperation = "source-over";
            const img = new Image();
            // img.src = canvas.toDataURL("image/png");
        })
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });

/////////LASTFM

function fitTextInBox(ctx, text, x, y, maxWidth, maxHeight, initialFontSize, fontFamily) {
    let fontSize = initialFontSize;
    ctx.font = `${fontSize}px ${fontFamily}`;
    let textMetrics = ctx.measureText(text);
    
    // Reduce font size if text exceeds maxWidth or maxHeight
    while ((textMetrics.width > maxWidth || fontSize > maxHeight) && fontSize > 0) {
        fontSize--;
        ctx.font = `${fontSize}px ${fontFamily}`;
        textMetrics = ctx.measureText(text);
    }

    // Draw the text centered in the box
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeText(text, x + maxWidth / 2, y + maxHeight / 2);
    ctx.fillText(text, x + maxWidth / 2, y + maxHeight / 2);
}
})


downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "canvas-image.png";
    link.click();
})
