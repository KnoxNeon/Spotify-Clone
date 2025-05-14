let songs = [];
let currentSongIndex = 0;
let audio = new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songList = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songList.push(element.href.split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0]);
        }
    }

    return songList;
}

function playSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;
    let songName = songs[index];
    audio.src = `http://127.0.0.1:3000/songs/${songName}.mp3`;
    audio.play();

    // Update UI song name and duration
    document.querySelector(".songname").innerText = songName;
    document.querySelector(".song-duration").innerText = "00:00 / 00:00";

    audio.onloadedmetadata = () => {
        document.querySelector(".song-duration").innerText = `00:00 / ${formatTime(audio.duration)}`;
    };

    audio.ontimeupdate = () => {
        document.querySelector(".song-duration").innerText = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    };
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = "0" + secs;
    return `${mins}:${secs}`;
}

function setupControls() {
    document.querySelector('.play-buttons .buttons img[src="play-button.svg"]').addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    document.querySelector('.play-buttons .buttons img[src="previous-button.svg"]').addEventListener("click", () => {
        playSong((currentSongIndex - 1 + songs.length) % songs.length);
    });

    document.querySelector('.play-buttons .buttons img[src="next-button.svg"]').addEventListener("click", () => {
        playSong((currentSongIndex + 1) % songs.length);
    });
}

async function main() {
    songs = await getSongs();
    let songUL = document.querySelector(".songList ul");

    songs.forEach((song, index) => {
        let li = document.createElement("li");
        li.innerText = song;

        li.addEventListener("click", () => {
            playSong(index);
        });

        songUL.appendChild(li);
    });

    setupControls();
}

main();
