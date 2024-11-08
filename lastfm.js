let nowPlayingTrack;

let createButton = document.getElementById('createButton');

let coverArt = document.getElementById('coverArt');
let border = document.getElementById('border');
let borderSelector = document.getElementById('borderSelector');

let songName = document.getElementById('songName')
let songArtist = document.getElementById('songArtist')
let songAlbum = document.getElementById('songAlbum')
let nowPlaying = document.getElementById('nowPlaying')
let user = document.getElementById('user')

let cardText = document.getElementById('cardText')


let usernameInput = document.getElementById('usernameInput')

document.getElementById('downloadButton').addEventListener('click', function() {
    html2canvas(document.getElementById('cardRendered'), {useCORS: true}).then(function(canvas) {
        const dataURL = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'nowplaying.png';
        
        link.click();
    });
});


function setTracks(){
    let lastfmuser = usernameInput.value
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmuser}&api_key=b11d0f02d30b29b4092be9d26f4b5308&limit=1&format=json`)
        .then((res)=> {
            return  res.json()
        })
        .then((data)=> {
            nowPlayingTrack = data

            songName.textContent = nowPlayingTrack.recenttracks.track[0].name
            songArtist.textContent = nowPlayingTrack.recenttracks.track[0].artist['#text']
            songAlbum.textContent = nowPlayingTrack.recenttracks.track[0].album['#text']
            
            user.textContent = lastfmuser
            changeCoverArt(nowPlayingTrack.recenttracks.track[0].image[3]['#text'])
            changefont()
            changeborder()
        }).catch((err) => {
            console.log(err)
        })
        
    }
    
function changeCoverArt(coverArtImg) {
        coverArt.style.backgroundImage = `url(${coverArtImg})`        
}




const fontSelector = document.getElementById('fontSelector');


function changefont() {
    const cls = ["amatic-sc-regular", "creepster-regular", "orbitron-regular", "righteous-regular", "silkscreen-regular", "indie-flower-regular", "shadows-into-light-regular", "luckiest-guy-regular", "micro-5-regular", "bebas-neue-regular", "nerko-one-regular", "oswald-regular", "jacquard-regular"]
    let fontSelected = fontSelector.value
    
    nowPlaying.classList.remove(...cls);  
    songName.classList.remove(...cls);  
    songArtist.classList.remove(...cls);
    songAlbum.classList.remove(...cls);
    user.classList.remove(...cls);  

    nowPlaying.classList.add(fontSelected);
    songName.classList.add(fontSelected);
    songArtist.classList.add(fontSelected);
    songAlbum.classList.add(fontSelected);
    user.classList.add(fontSelected);
}


function changeborder() {
    const clsBorder = ["text-border1", "text-border2", "text-border3", "text-border4"]
    cardText.classList.remove(...clsBorder);  

    border.style.backgroundImage = `url(imgs/${borderSelector.value}.png)`
    cardText.classList.add(`text-${borderSelector.value}`)
}
