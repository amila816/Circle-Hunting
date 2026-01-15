// ================= START SCREEN - nickname + avatar =================
startBtn.addEventListener("click", function () {
  const nicknameInput = document.getElementById("nickname").value.trim();
  if (!nicknameInput) {
    alert("Please enter a nickname!");
    return;
  }

  const avatarRadio = document.querySelector('input[name="avatar"]:checked');
  if (!avatarRadio) {
    alert("Please select an avatar!");
    return;
  }

  player.nickname = nicknameInput;

  player.avatarImg = new Image();
  player.avatarImg.src = avatarRadio.value;

  player.avatarImg.onload = function () {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    gameOverScreen.style.display = "none";
    startGame();
  };
});
