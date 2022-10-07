
const container = document.querySelector(".container"),
    musicImg = container.querySelector(".img-area img"),
    musicName = container.querySelector(".song-details .name"),
    musicArtist = container.querySelector(".song-details .artist"),
    mainAudio = container.querySelector("#main-audio"),
    playpauseBtn = container.querySelector(".play-pause"),
    nextBtn = container.querySelector("#next"),
    prevBtn = container.querySelector("#prev"),
    progressArea = container.querySelector(".progress-area"),
    // progressArea = container.querySelector(".progress-bar"),

    progressBar = container.querySelector(".progress-bar"),
    // progressBar = container.querySelector(".progress-area"),

    musicList = container.querySelector(".music-list"),
    moreMusicBtn = container.querySelector("#more-music"),
    closemoreMusic = musicList.querySelector("#close");




// let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
let musicIndex = 1;


window.addEventListener("load", () => {
    loadMusic(musicIndex);
    // playingSong();
    playingNow();
})

// load music function

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `photos/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;
}


// play music function
function playMusic() {
    container.classList.add("paused");
    // playpauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic() {
    container.classList.remove("paused");
    // playpauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}


// Next Music function
function nextMusic() {
    musicIndex++; //increment of musicIndex by 1
    // if musicIndex is greater than array length then musicIndex will be 1 so the first music play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    // playingSong();
}
// Prev Music function
function prevMusic() {
    musicIndex--; //increment of musicIndex by 1
    // if musicIndex is less than array length then musicIndex will be 1 so the first music play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    // playingSong();
}


// play or Pause button event
playpauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();

});

// next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
    playingNow();
});


// prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
    playingNow();
});

// update progressbar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting playing song currenttime
    const duration = e.target.duration; //getting playing total song duration
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;



    let musicCurrentTime = container.querySelector(".current-time"),
        musicDuration = container.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {

        //  update song total duration
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) { //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { //if sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

});

// update playing song current width onaccording to the progress bar width

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();

});

// change loop, shuffle , repeat icon onclick
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; // getting this tag innerText
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
      case "repeat_one":
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "playback shuffled");
        break;
        case "shuffle":
          repeatBtn.innerText = "repeat";
          repeatBtn.setAttribute("title", "playlist looped");
          break;
        }
});

// above we just change icon, now let's work on what to do after song ended
mainAudio.addEventListener("ended", ()=>{
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();  // calling next musi function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;  // setting audio current time to 0
      loadMusic(musicIndex);
      playMusic();
      break;
      case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        } while (musicIndex == randIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;
  }
});

// show the music list onclick music icon
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = container.querySelector("ul");

// let create li tags according to array length for List

for (let i = 0; i < allMusic.length; i++) {
  // let's pass the song name, artist from the array to li
  let liTag = `  <li li-index="${i}">
      <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
      </div>
      <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}"></audio>
      <span id="${allMusic[i].src}" class="audio-duration">1:45</span>
    </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
      let audioDuration = liAudioTag.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if (totalSec < 10) { //if sec is less than 10 then add 0 before it
          totalSec = `0${totalSec}`;
      }

      liAudioDuration.innerText = `${totalMin}:${totalSec}`;
      liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");

    if(allLiTags[j].classList.contains("playing")){
      allLiTags[j].classList.remove("playing");
      // audioTag.innerText = "";
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }



    if(allLiTags[j].getAttribute("li-index") == musicIndex){
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    // adding onclick attribute in all li allLiTags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}


// let's play song on li click
function clicked(element){
  // getting li index of particular clicked li tags
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; // passing that liindex to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
  // playingSong();
}
