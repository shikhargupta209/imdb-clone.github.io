// fetch imdb id from current url
const currentURL = window.location.href;
const urlParams = new URLSearchParams(currentURL.split('?')[1]);
const imdbId = urlParams.values().next().value;
const feedContainer = document.getElementById('main');
if (imdbId) {
    getMovie();
} else {
    window.location.href = "https://shikhargupta209.github.io/imdb-clone.github.io/404.html";
}
async function getMovie() {
    try {
        const URL = `https://www.omdbapi.com/?i=${imdbId}&plot=full&page=1&apikey=47981ab2`;
        const res = await fetch(`${URL}`);
        const data = await res.json();
        if (data.Response == "True") {
            mapMovie(data);
        } else {
            window.location.href = "https://shikhargupta209.github.io/imdb-clone.github.io/404.html";
        }
    } catch (error) {
        console.log(error);
        window.location.href = "https://shikhargupta209.github.io/imdb-clone.github.io/404.html";
    }
}

// map data to DOM
function mapMovie(data) {
    const con = document.createElement('div');
    con.classList.add('con');
    var moviePoster = "";
    if (data.Poster != "N/A") {
        moviePoster = data.Poster;
    } else {
        moviePoster = "./images/n_a.jpg";
    }
    con.innerHTML = `
    <div class="movieImg">
        <img src=${moviePoster} alt="">
    </div>
    <div>
        <h1>${data.Title}</h1>
        <h3>${data.Year}</h3>
        <h4>${data.Genre}</h4>
        <p>${data.Language}</p>
        <p><strong>Director :</strong> ${data.Director}</p>
        <p><strong>Actors :</strong> ${data.Actors}</p>
        <div id="ratings">
            <img src=./images/download.png alt="">
            <span> : ${data.imdbRating}</span>
        </div>
        <p><strong>Plot :</strong> ${data.Plot}</p>
    </div>
    `;
    feedContainer.appendChild(con)

}



