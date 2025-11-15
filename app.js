// Playlist: update file paths & cover images as needed.
// Place your audio files inside ./songs/ folder
const tracks = [
  { title: "Song One", artist: "Artist A", src: "songs/song1.mp3", cover: "cover1.jpg" },
  { title: "Song Two", artist: "Artist B", src: "songs/song2.mp3", cover: "cover2.jpg" },
  { title: "Song Three", artist: "Artist C", src: "songs/song3.mp3", cover: "cover3.jpg" }
];

const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volumeSlider = document.getElementById("volume");
const autoplayCheckbox = document.getElementById("autoplay");
const playlistContainer = document.getElementById("playlistContainer");

let currentIndex = 0;
let isPlaying = false;

// Initialize
function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist || "";
  coverEl.src = track.cover || "cover-placeholder.png";
  highlightActiveItem();
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
}

function togglePlay() {
  if (isPlaying) pauseTrack();
  else playTrack();
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  playTrack();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  playTrack();
}

// progress & time
function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
}

function setProgress(e) {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const ratio = clickX / width;
  audio.currentTime = ratio * audio.duration;
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// volume
volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
});

// autoplay end behavior
audio.addEventListener("ended", () => {
  if (autoplayCheckbox.checked) nextTrack();
  else {
    pauseTrack();
    audio.currentTime = 0;
  }
});

// update UI as audio plays
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", updateProgress);

// progress click to seek
progressContainer.addEventListener("click", setProgress);

// control buttons
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// Build playlist UI
function buildPlaylist() {
  playlistContainer.innerHTML = "";
  tracks.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = "playlist-item";
    item.dataset.index = i;

    const meta = document.createElement("div");
    meta.className = "playlist-meta";
    const tTitle = document.createElement("div");
    tTitle.className = "playlist-title";
    tTitle.textContent = t.title;
    const tArtist = document.createElement("div");
    tArtist.className = "playlist-artist";
    tArtist.textContent = t.artist || "";

    meta.appendChild(tTitle);
    meta.appendChild(tArtist);

    const dur = document.createElement("div");
    dur.className = "playlist-duration";
    dur.textContent = ""; // we can fill if desired after loading metadata

    item.appendChild(meta);
    item.appendChild(dur);

    item.addEventListener("click", () => {
      currentIndex = i;
      loadTrack(currentIndex);
      playTrack();
    });

    playlistContainer.appendChild(item);
  });
}

function highlightActiveItem(){
  const items = Array.from(document.querySelectorAll(".playlist-item"));
  items.forEach(it => it.classList.remove("active"));
  const active = items[currentIndex];
  if(active) active.classList.add("active");
}

// Keyboard shortcuts (optional)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  else if (e.code === "ArrowRight") nextTrack();
  else if (e.code === "ArrowLeft") prevTrack();
});

// init
buildPlaylist();
loadTrack(currentIndex);

// set default volume
audio.volume = parseFloat(volumeSlider.value);
