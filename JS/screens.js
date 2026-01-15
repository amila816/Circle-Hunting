// === TITLE SCREEN ===
const mainTitleScreen = document.getElementById("mainTitleScreen");
const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", function () {
  stopAllMusic();
  musicMenu.play();

  mainTitleScreen.style.display = "none";
  startScreen.style.display = "flex";
});

//== SELEKCIJA ELEMENATA==
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");

//reset nickname i avatara na klik new game
function resetNicknameScreen() {
  document.getElementById("nickname").value = "";

  const avatars = document.querySelectorAll('input[name="avatar"]');
  avatars.forEach((a) => (a.checked = false));

  delete player.avatarImg;
  delete player.nickname;
}
