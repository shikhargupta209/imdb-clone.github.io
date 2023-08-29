const searchInput = document.getElementById("movieSearchBar");
const movieSearchList = document.getElementById("movieSearchList");
const currentURL = window.location.href;
const favButtoncheck = document.getElementById("favbutton");
const favList = document.getElementById("favList");
var favMovieList = [];

// update favMovieList array from local Storage
if (localStorage.getItem("favMovieList")) {
  var retrievedJsonString = localStorage.getItem("favMovieList");
  var retrievedArray = JSON.parse(retrievedJsonString);
  favMovieList = retrievedArray;
}

// hide search list when clicked outside or leaved the searchbar
document.addEventListener("mousedown", function (event) {
  const target = event.target;
  // Check if the click target is not inside the movieSearchList or the searchInput
  if (!movieSearchList.contains(target) && target !== searchInput) {
    searchInput.value = "";
    movieSearchList.innerHTML = "";
    movieSearchList.classList.add("hideSearchList");
  }
});

// delete perticular fav movie from fv list
favList.addEventListener('click', (e) => {
  if (e.target.classList.contains("removeFavMovieButton")) {
    var parentDiv = e.target.parentNode;
    var imdbID = parentDiv.querySelector(":nth-child(3)").value;
    favMovieList = favMovieList.filter((item) => item.IMDbId !== imdbID);
    udateLocals(favMovieList);
    updateFavList();
  }
})
 
// update fav heart button and input check in search list
function updateHeartButton() {
  const searchListMovieId = document.querySelectorAll(".favButton");
  for (let i = 0; i < searchListMovieId.length; i++) {
    favMovieList.map((item) => {
      if (item.IMDbId == searchListMovieId[i].value) {
        searchListMovieId[i].checked = true;
        const parentDiv = searchListMovieId[i].parentNode;
        const childElements = parentDiv.children;
        const secondChild = childElements[1];
        secondChild.classList.add("redHeartColor");
      }
    });
  }
}

// fetch movie
async function getMovie(keyword) {
  const URL = `https://omdbapi.com/?s=${keyword}&page=1&apikey=47981ab2`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    ListMovie(data.Search);
  }
}

// List movie
async function ListMovie(data) {
  movieSearchList.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const movie = document.createElement("div");
    var moviePoster = "";
    movie.dataset.id = data[i].imdbID;
    movie.classList.add("listItem");
    if (data[i].Poster != "N/A") {
      moviePoster = data[i].Poster;
    } else {
      moviePoster = "./images/n_a.jpg";
    }
    movie.innerHTML = `
      <div>
        <img src="${moviePoster}" alt="">
      </div>
      <div>
        <input class="searchListMovieId" type="hidden" value=${data[i].imdbID}>
        <p><a href="/movie-page.html?=${data[i].imdbID}">${data[i].Title}</a></p>
        <span>${data[i].Year}</span>
      </div>
      <div id="addToFav" class="addToFav">
        <input class="favButton" id="favbutton" type="checkbox" value=${data[i].imdbID}>
        <i class="material-icons favHeart" id="temp" style="font-size:20px;">favorite</i>
      </div>
    `;
    movieSearchList.appendChild(movie);
  }
  setTimeout(() => {
    updateHeartButton();
  }, 1);
}

// type movie from input
searchInput.addEventListener("input", (e) => {
  const searchInputValue = e.target.value;
  if (searchInputValue.length > 0) {
    movieSearchList.classList.remove("hideSearchList");
    getMovie(searchInputValue);
  } else {
    movieSearchList.classList.add("hideSearchList");
  }
});

// update localStorage
function udateLocals(arr) {
  var jsonString = JSON.stringify(arr);
  localStorage.setItem("favMovieList", jsonString);
}

// update fav list on when movie added
function updateFavList() {
  if (favMovieList.length > 0) {
    favList.innerHTML = "";
    for (let item of favMovieList) {
      var favListItem = document.createElement("div");
      favListItem.classList.add("favListItem");
      favListItem.innerHTML = `
        <span><a href="movie-page.html?=${item.IMDbId}">${item.movieName}</a></span>
        <button class="removeFavMovieButton">Remove</button>
        <input type="hidden" value=${item.IMDbId}>
    `;
      favList.appendChild(favListItem);
    }
  } else {
    favList.innerHTML = "no items added";
  }
}
updateFavList();

// Add movies to fav
function addMovieToFav(obj) {
  favMovieList.push(obj);
}

// remove movie from DOM fav from search list item
function removeMovieFromFav(favMovieList, imdbId) {
  var updatedList = favMovieList.filter((item) => item.IMDbId !== imdbId);
  return updatedList;
}

// toggle heart color, add/remove perticular movie name from fav list
movieSearchList.addEventListener("click", (e) => {
  if (e.target.classList.contains("favButton")) {
    // Find and remove the closest parent with the task
    const listItem = e.target.closest(".listItem");
    const favButton = e.target.closest(".favButton");
    const favHeart = e.target.closest(".addToFav");
    const heartIcon = favHeart.querySelector(":nth-child(2)");
    const IMDbId = listItem
      .querySelector(":nth-child(2)")
      .querySelector(":nth-child(1)").value;
    if (favButton.checked) {
      if (favHeart) heartIcon.classList.add("redHeartColor");
      var movieName = listItem
        .querySelector(":nth-child(2)")
        .querySelector(":nth-child(2)").innerHTML;
      addMovieToFav({
        IMDbId: IMDbId,
        movieName: movieName,
      });
      // Save the JSON string to local storage
    } else {
      heartIcon.classList.remove("redHeartColor");
      favMovieList = removeMovieFromFav(favMovieList, IMDbId);
    }
    udateLocals(favMovieList);
    updateFavList();
  }
});
