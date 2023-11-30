// script.js

document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById("myVideo");

    // video.addEventListener("click", function () {
    //     // Change the URL below to the desired website
    //     window.location.href = "https://miqito.com.br";
    // });

    // Function to generate a random number between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to format a number with leading zeros
    function formatNumberWithLeadingZeros(number, length) {
        return number.toString().padStart(length, '0');
    }

    // Generate a random number between 1 and 10
    var randomNumber = getRandomInt(1, 11);

    // Format the number with leading zeros
    var formattedNumber = formatNumberWithLeadingZeros(randomNumber, 3);

    // Set the source of the video dynamically based on the generated number
    var videoFileName = formattedNumber + "_VP8.webm";
    video.src = videoFileName;

    // Get the video caption element
    var videoCaption = document.getElementById("video-caption");
    // Set the text below the video
    videoCaption.textContent = "Card number #" + formattedNumber;

});
