const playButton = document.querySelector('.play'),
      muteButton = document.querySelector('.mute'),
      range = document.querySelector('.range'),
      nextButton = document.querySelector('.next'),
      previousButton = document.querySelector('.previous');


playButton.addEventListener('click', toggleMusic);
range.addEventListener('input', function() {
    changeVolume();
    usersVolume();
});
nextButton.addEventListener('click', nextSong);
previousButton.addEventListener('click', previousSong);


let trackList = ['1.mp3', '2.mp3', '3.mp3',];
let songId = 0; 
let rangeValue = 50;

let myAudio = new Audio(trackList[songId]);
myAudio.volume = range.value / 100;

myAudio.addEventListener('ended', nextSong);

function nextSong() {
    songId++;
    
    if(songId > trackList.length - 1) {
        songId = 0;
    }
    myAudio.src = trackList[songId];
    myAudio.play();
    if(playButton.classList.contains('fa-play')) {
        playButton.classList.replace('fa-play', 'fa-pause');
    }
}

function previousSong() {
    songId--;
    if(songId < 0) {
        songId = trackList.length -1;
    }

    myAudio.src = trackList[songId];
    myAudio.play();
    if(playButton.classList.contains('fa-play')) {
        playButton.classList.replace('fa-play', 'fa-pause');
    }
}

function changeVolume() {
    myAudio.volume = range.value / 100;
}

function usersVolume() {
    rangeValue = range.value;
}

function toggleMusic() {
    playButton.classList.toggle('fa-play');
    playButton.classList.toggle('fa-pause');
    
    if(playButton.classList.contains('fa-pause')) {
        myAudio.play();
    }

    if(playButton.classList.contains('fa-play')) {
        myAudio.pause();
    }
}



