import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

type MovieList = {
  id: string;
  title: string;
  releaseDate: number;
  reveivedAnOscar: boolean;
};

function App() {
  const [movieList, setMovieList] = useState<MovieList[]>([]);

  const moviesCollectionRef = collection(db, "movies");

  const [newMovieTitle, setNewMovieTitle] = useState<string>("");
  const [newReleaseDate, setNewReleaseDate] = useState<number | string>(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState<boolean>(false);

  // update
  const [updatedTitle, setUpdatedTitle] = useState<string>("");

  // file upload
  const [fileUpload, setFileUpload] = useState<any>();

  const getMovieList = async () => {
    try {
      const response = await getDocs(moviesCollectionRef);
      const data = response.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as MovieList)
      );
      setMovieList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const handleAddMovie = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        reveivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);

      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateMovie = async (id: string) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updatedTitle });

      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadFile = async () => {
    try {
      if (!fileUpload) return;
      const fileFolderRef = ref(storage, `uploads/${fileUpload.name}`);
      await uploadBytes(fileFolderRef, fileUpload);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-start gap-20">
        <h1 className="text-4xl text-center">Firebase CRUD</h1>
        <Auth />

        <div>
          <form onSubmit={handleAddMovie}>
            <input
              type="text"
              placeholder="Movite Title..."
              onChange={(e) => setNewMovieTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Release Date..."
              onChange={(e) => setNewReleaseDate(e.target.value)}
            />
            <input
              type="checkbox"
              onChange={(e) => setIsNewMovieOscar(e.target.checked)}
              checked={isNewMovieOscar}
            />
            <button>Add Movie</button>
          </form>
        </div>

        <div>
          {movieList.map((movie) => (
            <div key={movie.id}>
              <div className="text-center">
                <h2
                  className={`text-2xl ${
                    movie.reveivedAnOscar ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {movie.title}
                </h2>
                <span>{movie.releaseDate}</span>
              </div>
              <hr />
              <button onClick={() => handleDeleteMovie(movie.id)}>
                Delete Movie
              </button>

              <hr />

              <div>
                <input
                  type="text"
                  placeholder="new Title.."
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <button onClick={() => handleUpdateMovie(movie.id)}>
                  Update Movie
                </button>
              </div>

              <hr />

              <div>
                <input
                  type="file"
                  onChange={(e) => setFileUpload(e.target.files![0])}
                />
                <button onClick={handleUploadFile}>Upload File</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
