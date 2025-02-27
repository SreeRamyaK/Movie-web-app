const APILINK = "https://imdb236.p.rapidapi.com/imdb/top250-movies";
const SEARCHAPI = "https://imdb-com.p.rapidapi.com/search?searchTerm=";


// Select elements
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

// Function to fetch and display movies
async function returnMovies(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "imdb236.p.rapidapi.com",
                "x-rapidapi-key": "199b974457msh9144fe7d2af71aep1ac5cbjsn89cfe9ab2443"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging output

        // Ensure `data` is an array
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Invalid response format: No valid movies found");
        }

        main.innerHTML = ""; // Clear previous results

        // Loop through movies and create cards
        data.forEach((movie) => {
            if (!movie.id || !movie.primaryTitle) return; // Skip invalid entries

            const div_card = document.createElement("div");
            div_card.classList.add("card");

            const image = document.createElement("img");
            image.classList.add("thumbnail");
            image.src = movie.primaryImage || "https://via.placeholder.com/300x450"; // Default image

            const title = document.createElement("h3");
            title.classList.add("movie-title");
            title.innerText = movie.primaryTitle || "No Title Available";

            div_card.appendChild(image);
            div_card.appendChild(title);
            main.appendChild(div_card);
        });

    } catch (err) {
        console.error("Error fetching movies:", err);
    }
}

// Fetch IMDb Movies by default
returnMovies(APILINK);

// Event listener for search form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchItem = search.value.trim();
    if (searchItem) {
        returnMovies(SEARCHAPI + encodeURIComponent(searchItem));
    } else {
        returnMovies(APILINK);
    }
});

async function returnMoviesSearch(query) {
    try {
        const url = SEARCHAPI + encodeURIComponent(query);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "imdb-com.p.rapidapi.com",
                "x-rapidapi-key": "199b974457msh9144fe7d2af71aep1ac5cbjsn89cfe9ab2443"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging output

        // Check if the data contains search results
        if (!data.data || !data.data.mainSearch || !data.data.mainSearch.edges) {
            throw new Error("No valid movies found");
        }

        main.innerHTML = ""; // Clear previous results

        // Loop through movies and create cards
        data.data.mainSearch.edges.forEach(({ node }) => {
            if (!node || !node.entity || !node.entity.titleText) return;

            const movie = node.entity;

            const div_card = document.createElement("div");
            div_card.classList.add("card");

            const image = document.createElement("img");
            image.classList.add("thumbnail");
            image.src = movie.primaryImage?.url || "https://via.placeholder.com/300x450"; // Default image

            const title = document.createElement("h3");
            title.classList.add("movie-title");
            title.innerText = movie.titleText.text || "No Title Available";

            div_card.appendChild(image);
            div_card.appendChild(title);
            main.appendChild(div_card);
        });

    } catch (err) {
        console.error("Error fetching movies:", err);
    }
}

// Event listener for search form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchItem = search.value.trim();
    if (searchItem) {
        returnMoviesSearch(searchItem);
    }
});