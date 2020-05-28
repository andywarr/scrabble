var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

document.getElementById("play").addEventListener("click", function(){
  window.location.href = './play/' + ID();
});
