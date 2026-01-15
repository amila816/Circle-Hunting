// ================= AUDIO =================
const musicMenu = new Audio("MUSIC/menu-theme.mp3");
const musicGame = new Audio("MUSIC/main-playing-theme.mp3");
const musicWin = new Audio("MUSIC/win-theme.mp3");
const musicLose = new Audio("MUSIC/game-over-theme.mp3");

// loop za sve
musicMenu.loop = true;
musicGame.loop = true;
musicWin.loop = false;
musicLose.loop = false;

// glasnoća (po želji)
musicMenu.volume = 0.4;
musicGame.volume = 0.4;
musicWin.volume = 0.4;
musicLose.volume = 0.4;

// ================= MENU MUSIC STATE =================
let menuMusicStarted = false;

// 👉 PAMETNO puštanje menu muzike
function playMenuMusicIfNeeded() {
  if (!menuMusicStarted) {
    musicMenu.play();
    menuMusicStarted = true;
  }
}

// ================= HELPER =================
function stopAllMusic() {
  musicMenu.pause();
  musicGame.pause();
  musicWin.pause();
  musicLose.pause();

  musicMenu.currentTime = 0;
  musicGame.currentTime = 0;
  musicWin.currentTime = 0;
  musicLose.currentTime = 0;

  // reset flaga samo kad STVARNO gasiš sve
  menuMusicStarted = false;
}
