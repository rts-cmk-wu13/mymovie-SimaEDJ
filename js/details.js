let search = window.location.search;
let params = new URLSearchParams(search);
let id = params.get("movieId");
console.log("Movie ID:", id);

function formatRuntime(minutes) {
    if (!minutes || isNaN(minutes)) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTk0OWUwMDhhYTFhZjU2MmMzYTAyMzlhYzcyMmQxMSIsIm5iZiI6MTc0MTE1OTk5MC4wMzIsInN1YiI6IjY3YzdmZTM2OTAzNTVjNjQ1NzZlNGI3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2TU_ju7xxFRCzaV3bGZxjwVUEZ6KFhJeQDR5_j0Buzw'
    }
};

// DOM-elementer
let headerElm = document.querySelector("header");
let mainElm = document.querySelector("main");

// Opret sektioner
let detailHeader = document.createElement("section");
detailHeader.className = "detailheader";

let movieDetail = document.createElement("section");
movieDetail.classList.add("moviedetail");

let movieDescription = document.createElement("section");
movieDescription.classList.add("moviedescription");

let movieCast = document.createElement("section");
movieCast.classList.add("cast");

// Tilføj sektionerne til DOM
headerElm.appendChild(detailHeader);
mainElm.appendChild(movieDetail);
mainElm.appendChild(movieDescription);
mainElm.appendChild(movieCast);

// Tilføj HTML-indhold til header
detailHeader.innerHTML = `
    <a href="index.html"><i class="fa-solid fa-arrow-left"></i></a>
    <div class="darkmode">
        <label class="switch">
            <input type="checkbox" id="switch" />
            <span class="slider round"></span>
        </label>
    </div>
`;

const img = document.createElement('img');
img.classList.add("hero");
img.loading = 'lazy';

detailHeader.prepend(img);

// Opret sektion til "Details"
const sectionDetails = document.createElement('section');
sectionDetails.classList.add('details__section');

const headingDetails = document.createElement('h1');
headingDetails.textContent = ' ';

const detailsList = document.createElement('ul');
detailsList.classList.add('details-list');

sectionDetails.appendChild(headingDetails);
sectionDetails.appendChild(detailsList);
movieDescription.appendChild(sectionDetails);

// Opret sektion til "Description"
const sectionDescription = document.createElement('section');
sectionDescription.classList.add('description__section');

const headingDescription = document.createElement('h2');
headingDescription.textContent = 'Description';

const paragraphDescription = document.createElement('p');
paragraphDescription.classList.add('description');

sectionDescription.appendChild(headingDescription);
sectionDescription.appendChild(paragraphDescription);
movieDescription.appendChild(sectionDescription);

// Fetch movie details
fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=translations`, options)
    .then(response => response.json())
    .then(movie => {
        img.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
        img.alt = movie.title;
        paragraphDescription.textContent = movie.overview;
        console.log(movie);

        // Tilføj film detaljer
        detailsList.innerHTML = `
            <div class="title">
            <h1>${movie.title}</h1>
            <i class="fa-regular fa-bookmark"></i>
            </div>
            <p class="rating_p"><i class="fa-solid fa-star"></i> ${movie.vote_average}/10 IMDb</p>
            <div class="genre">${movie.genres.map(genre => `<p class="genre__name caption_type">${genre.name}</p>`).join("")}</div>
            <table>
                <tr>
                    <th>Length</th>
                    <th>Language</th>
                    <th>Rating</th>
                </tr>
                <tr>
                    <td>${formatRuntime(movie.runtime)}</td>
                    <td>${movie.translations.translations[0].english_name}</td>
                    <td id="certification"></td> <!-- Opdateres med rating -->
                </tr>
            </table>
        `;

        // Fetch rating (certification)
        return fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates`, options);
    })
    .then(response => response.json())
    .then(data => {
        let certification = "N/A"; // Standardværdi

        // Find US rating 
        const usRelease = data.results.find(release => release.iso_3166_1 === "US");
        if (usRelease && usRelease.release_dates.length > 0) {
            certification = usRelease.release_dates[0].certification || "N/A";
        }

        // Opdater rating i tabellen
        document.getElementById("certification").textContent = certification;
    })
    .catch(err => console.error("Fejl ved hentning af film eller rating:", err));


// Opret sektion til "Cast"
const sectionCast = document.createElement('section');
sectionCast.classList.add('cast__section');

const divCast = document.createElement('div');
divCast.classList.add('cast__info');

const headingCast = document.createElement('h2');
headingCast.textContent = 'Cast';

const buttonCast = document.createElement('button');
buttonCast.id = 'seeMoreCast';
buttonCast.textContent = 'See More';

const containerCast = document.createElement('div');
containerCast.classList.add('container-cast');

sectionCast.appendChild(divCast);
divCast.appendChild(headingCast)
divCast.appendChild(buttonCast);
sectionCast.appendChild(containerCast);
movieCast.appendChild(sectionCast);

// Fetch cast information
fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
    .then(response => response.json())
    .then(data => {
        containerCast.innerHTML = ''; // Ryd tidligere cast
        data.cast.slice(0, 4).forEach(cast => {
            let castHTML = `
                <div class="cast">
                <figure class="cast__img">
                    <img src="https://image.tmdb.org/t/p/w185${cast.profile_path}" alt="${cast.name}">
                </figure>
                <h4 class="cast__name">${cast.name}</h4>
                </div>
            `;
            containerCast.innerHTML += castHTML;
        });
    })
    .catch(err => console.error("Fejl ved hentning af cast:", err));