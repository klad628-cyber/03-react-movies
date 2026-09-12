import axios, { type AxiosResponse } from "axios";

import type { Movie } from "../types/movie";

interface MovieSearchResponse {
  results: Movie[];
}

const tmdbToken =
  import.meta.env.VITE_TMDB_TOKEN ??
  import.meta.env.VITE_THERMOVIEW_API_TOKEN ??
  "";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
    ...(tmdbToken
      ? {
          Authorization: `Bearer ${tmdbToken}`,
        }
      : {}),
  },
});

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response: AxiosResponse<MovieSearchResponse> = await api.get(
    "/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page: 1,
      },
    },
  );

  return response.data.results ?? [];
};
