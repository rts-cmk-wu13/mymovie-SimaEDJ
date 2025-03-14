// HEADER:
let header = document.querySelector("header");
if (header) {
    header.innerHTML = `
        <img class="header__menu-icon" src="./icons/menu.png">
        <h1>MyMovies</h1>
        <div class="darkmode">
            <label class="switch">
                <input type="checkbox" id="switch" />
                <span class="slider round"></span>
            </label>
        </div>
    `;
}

// NOW SHOWING
const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTk0OWUwMDhhYTFhZjU2MmMzYTAyMzlhYzcyMmQxMSIsIm5iZiI6MTc0MTE1OTk5MC4wMzIsInN1YiI6IjY3YzdmZTM2OTAzNTVjNjQ1NzZlNGI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2TU_ju7xxFRCzaV3bGZxjwVUEZ6KFhJeQDR5_j0Buzw'
    }
};

// Opret section til "Now Showing"
const sectionShowing = document.createElement('section');
sectionShowing.classList.add('showing');

// Opret overskrift
const headingShowing = document.createElement('h2');
headingShowing.textContent = 'Now Showing';

// Opret knap
const buttonShowing = document.createElement('button');
buttonShowing.id = 'seeMoreShowing';
buttonShowing.textContent = 'See More';

// Opret container til film
const moviesContainerShowing = document.createElement('div');
moviesContainerShowing.classList.add('movies-container');

// Tilføj elementerne til section
sectionShowing.appendChild(headingShowing);
sectionShowing.appendChild(buttonShowing);
sectionShowing.appendChild(moviesContainerShowing);

// Tilføj section til body
document.body.appendChild(sectionShowing);

// Funktion til at hente "Now Showing" film
function fetchMovies() {
    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            moviesContainerShowing.innerHTML = ''; // Ryd tidligere film
            data.results.forEach(movie => {
                const article = document.createElement('article');

                const link = document.createElement('a');
                link.href = `details.html?movieId=${movie.id}`; // Link til detaljesiden
                link.classList.add('movie-link');

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                img.alt = movie.title;
                img.loading = 'lazy';

                const title = document.createElement('h3');
                title.textContent = movie.title;

                const rating = document.createElement('p');
                rating.innerHTML = `<i class="fa-solid fa-star"></i> ${movie.vote_average}/10 IMDb`;

                article.appendChild(img);
                article.appendChild(title);
                article.appendChild(rating);
                moviesContainerShowing.appendChild(article);

                link.appendChild(article);
                moviesContainerShowing.appendChild(link);
            });
        })
        .catch(err => console.error(err));

}
// Hent film, når siden loader
fetchMovies();

// POPULAR MOVIES
const popularUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const popularOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTk0OWUwMDhhYTFhZjU2MmMzYTAyMzlhYzcyMmQxMSIsIm5iZiI6MTc0MTE1OTk5MC4wMzIsInN1YiI6IjY3YzdmZTM2OTAzNTVjNjQ1NzZlNGI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2TU_ju7xxFRCzaV3bGZxjwVUEZ6KFhJeQDR5_j0Buzw'
    }
};

// Opret section til "Popular"
const sectionPopular = document.createElement('section');
sectionPopular.classList.add('popular');

// Opret overskrift
const headingPopular = document.createElement('h2');
headingPopular.textContent = 'Popular';

// Opret knap
const buttonPopular = document.createElement('button');
buttonPopular.id = 'seeMorePopular';
buttonPopular.textContent = 'See More';

// Opret container til film
const moviesContainerPopular = document.createElement('div');
moviesContainerPopular.classList.add('movies-container__popular');

// Tilføj elementerne til section
sectionPopular.appendChild(headingPopular);
sectionPopular.appendChild(buttonPopular);
sectionPopular.appendChild(moviesContainerPopular);

// Tilføj section til body
document.body.appendChild(sectionPopular);

// Funktion til at hente detaljer om film
function fetchMovieDetails(movieId) {
    return fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
        .then(res => res.json())
        .catch(err => console.error('Error fetching movie details:', err));
}

// Funktion til at hente populære film
function fetchPopularMovies() {
    fetch(popularUrl, popularOptions)
        .then(res => res.json())
        .then(data => {
            let movieDetailsFetches = data.results.map(movie => fetchMovieDetails(movie.id));

            return Promise.all(movieDetailsFetches).then(moviesDetails => {
                let combinedMovies = data.results.map((movie, index) => ({
                    ...movie,
                    genres: moviesDetails[index]?.genres || [],
                    runtime: moviesDetails[index]?.runtime || 'N/A'
                }));

                displayMovies(combinedMovies);
            });
        })
        .catch(err => console.error('Error fetching popular movies:', err));
}

function formatRuntime(minutes) {
    if (!minutes || isNaN(minutes)) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function displayMovies(movies) {
    moviesContainerPopular.innerHTML = ''; // Ryd tidligere film
    movies.forEach(movie => {
        const article = document.createElement('article');

        const link = document.createElement('a');
        link.href = `details.html?movieId=${movie.id}`; // Link til detaljesiden
        link.classList.add('movie-link');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = 'lazy';

        const title = document.createElement('h3');
        title.textContent = movie.title;

        const rating = document.createElement('p');
        rating.innerHTML = `<i class="fa-solid fa-star"></i>${movie.vote_average} IMDb`;

        
        const genreText = movie.genres.map(genre => genre.name).join(' ') || 'No genres available';
        const genres = document.createElement('p');
        genres.classList.add('genre');
        genres.textContent = `${genreText}`;

        const runtime = document.createElement('p');
        runtime.classList.add('runtime');
        runtime.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatRuntime(movie.runtime)}`;

        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(rating);
        article.appendChild(genres);
        article.appendChild(runtime);

        link.appendChild(article);
        moviesContainerPopular.appendChild(link);
    });
}

fetchPopularMovies();

// FOOTER:
let footer = document.querySelector("footer");
if (footer) {
    footer.innerHTML = `
        <div class="footer__content">
            <img class="footer__menu-icon1" src="./icons/bookmark.svg">
            <img class="footer__menu-icon2" src="./icons/bookmark2.svg">
            <img class="footer__menu-icon3" src="./icons/bookmark3.svg">
        </div>
    `;
}