document.addEventListener("DOMContentLoaded", function () {
  const allbutton = document.querySelectorAll(".searchbtn");
  const searchbar = document.querySelector(".searchBar");
  const searchinput = document.getElementById("searchInput");
  const searchclose = document.getElementById("searchclose");

  for (var i = 0; i < allbutton.length; i++) {
    allbutton[i].addEventListener("click", function () {
      searchbar.style.visibility = "visible";
      searchbar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchinput.focus();
    });
  }
    searchclose.addEventListener("click", function () {
      searchbar.style.visibility = "hidden";
      searchbar.classList.remove("open");
      this.setAttribute("aria-expanded", "false");
      searchinput.focus();
    });
});
