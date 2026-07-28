const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchData(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
}

export async function getPopularMovies() {
    const data = await fetchData("/movie/popular?language=en-US&page=1");
    return data.results;
}

export async function getPopularTVSeries() {
    const data = await fetchData("/tv/popular?language=en-US&page=1");
    return data.results;
}