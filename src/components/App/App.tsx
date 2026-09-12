import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsError(false);
    setSelectedMovie(null);
    setIsLoading(true);

    try {
      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast.error("No movies found for your request.");
      }

      setMovies(results);
    } catch (error) {
      setIsError(true);
      toast.error("There was an error, please try again...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <SearchBar onSubmit={handleSearch} />

      <main className={styles.main}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        ) : null}
      </main>

      {selectedMovie ? (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      ) : null}

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default App;
