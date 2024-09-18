
document.getElementById('downloadButton').addEventListener('click', function() {
    html2canvas(document.getElementById('renderedImg')).then(function(canvas) {
        const dataURL = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'saddesthyacinthVisitorCard.png';
        
        link.click();
    });
});

const borderSelector = document.getElementById('borderSelector');

const borderStyle = document.getElementById('borderStyle')
const mainArtStyle = document.getElementById('mainArtStyle')

let borderImg = borderSelector.value;

function changeBorder() {
    borderImg = borderSelector.value;
    borderStyle.style.backgroundImage = `url(${borderImg})`
}

const nameInput = document.getElementById('nameInput');
const effectInput = document.getElementById('effectInput');
const costInput = document.getElementById('costInput');
const powerInput = document.getElementById('powerInput');
const renderedName = document.getElementById('renderedName');
const renderedEffect = document.getElementById('renderedEffect');
const renderedCostText = document.getElementById('renderedCostText');
const renderedPowerText = document.getElementById('renderedPowerText');
const renderedWatermark = document.getElementById('watermark');
const imgResize = document.getElementById('imgResize');
const fontResize = document.getElementById('fontResize');
const resetZoom = document.getElementById('resetZoom');
const zoomValue = document.getElementById('zoomValue');
const bottomTextDiv = document.getElementById('bottomTextDiv');

nameInput.addEventListener('input', function() {
    renderedName.textContent = nameInput.value;
  });

effectInput.addEventListener('input', function() {
    renderedEffect.textContent = effectInput.value;
  });

costInput.addEventListener('input', function() {
    renderedCostText.textContent = costInput.value;
  });
powerInput.addEventListener('input', function() {
    renderedPowerText.textContent = powerInput.value;
  });

const fontSelector = document.getElementById('fontSelector');

const cls = ["amatic-sc-regular", "creepster-regular", "orbitron-regular", "righteous-regular", "silkscreen-regular", "indie-flower-regular", "shadows-into-light-regular", "luckiest-guy-regular", "micro-5-regular", "bebas-neue-regular", "nerko-one-regular", "oswald-regular", "zzzsystem-regular", "zzza-regular", "jacquard-regular"]

function changefont() {
    let fontSelected = fontSelector.value
    
    renderedName.classList.remove(...cls);  

    renderedName.classList.add(fontSelected);
}

document.getElementById('myFile').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        mainArtStyle.style.backgroundImage = `url(${e.target.result})`;
        mainArtStyle.style.backgroundSize = '436px'
      };
      reader.readAsDataURL(file);
    }
  });

resetZoom.addEventListener('click', function() {
    mainArtStyle.style.backgroundPosition = `center`
    imgResize.value = 436
    zoomValue.textContent = 436;
    mainArtStyle.style.backgroundSize = `436px`
})

imgResize.addEventListener('change', function() {
    mainArtStyle.style.backgroundSize = `${imgResize.value}px`
    mainArtStyle.style.backgroundRepeat = 'no-repeat'
})

fontResize.addEventListener('change', function() {
    renderedName.style.fontSize = `${fontResize.value}px`
    renderedName.style.backgroundRepeat = 'no-repeat'
    fontValue.textContent = renderedName.style.fontSize

})
zoomValue.textContent = imgResize.value;
fontValue.textContent = fontResize.value;

imgResize.onchange = function() {
    zoomValue.textContent = this.value;
  }

let isDragging = false;
let startX, startY;
let backgroundX = 0, backgroundY = 0;

mainArtStyle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    mainArtStyle.style.cursor = 'move';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    backgroundX += deltaX;
    backgroundY += deltaY;

    mainArtStyle.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;

    startX = e.clientX;
    startY = e.clientY;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    mainArtStyle.style.cursor = 'move';
});

// function resizeText(size) {
    
//     // Adjust the font size
//     renderedName.style.fontSize = size + 'px';
  
//     // Adjust the line height to keep it vertically aligned
//     renderedName.style.ma = (size * 1.2) + 'px';
//   }