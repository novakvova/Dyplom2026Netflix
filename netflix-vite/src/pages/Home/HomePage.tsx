// import "./HomePage.css";
import { getPopularMovies } from "../../api/tmdb.tsx";
import { useEffect, useState } from "react";

type Movie = {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    original_language: string;
    poster_path: string | null;
};

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getPopularMovies()
            .then((data) => setMovies(data))
            .catch((error) => console.error(error));
    }, []);

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <header className="header">
                <a className="logo" href="#">
                    Stream<span>Purple</span>
                </a>

                <nav className="nav">
                    <a href="#catalog">Фільми</a>
                    <a href="#genres">Жанри</a>
                    <a href="#about">Про сайт</a>
                </nav>

                <div className="header-search">
                    <input
                        id="searchInput"
                        type="search"
                        placeholder="Пошук фільму..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button id="searchButton">🔎</button>

                    <button className="login-btn" id="loginButton">
                        Увійти
                    </button>
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="hero-content">
                        <span className="eyebrow">STREAMPURPLE</span>

                        <h1>
                            Дивись більше.
                            <br />
                            <span>Відчувай сильніше.</span>
                        </h1>

                        <p>
                            Великий каталог фільмів та серіалів у сучасному
                            темному інтерфейсі.
                        </p>

                        <div className="hero-buttons">
                            <a href="#catalog" className="primary-btn large">
                                Переглянути каталог
                            </a>

                            <a href="#genres" className="ghost-btn large">
                                Жанри
                            </a>
                        </div>

                        <div className="hero-meta">
                            <span>● HD</span>
                            <span>● 4K</span>
                            <span>● Великий каталог</span>
                        </div>
                    </div>

                    <div className="hero-art">
                        <div className="hero-poster poster-a">
                            DUNE
                            <div>PART TWO</div>
                        </div>

                        <div className="hero-poster poster-b">
                            INTER
                            <br />
                            STELLAR
                        </div>

                        <div className="hero-poster poster-c">
                            THE
                            <br />
                            BATMAN
                        </div>
                    </div>
                </section>

                <div className="brand-strip">
                    <span>NETFLIX</span>
                    <span>HBO</span>
                    <span>MARVEL</span>
                    <span>DISNEY+</span>
                    <span>WARNER</span>
                    <span>PIXAR</span>
                </div>

                <section className="catalog" id="catalog">
                    <div className="section-head">
                        <div>
                            <span className="section-kicker">КАТАЛОГ</span>
                            <h2 id="catalogTitle">
                                {search
                                    ? `Результати пошуку: ${search}`
                                    : "Популярне зараз"}
                            </h2>
                        </div>
                    </div>

                    <div className="toolbar">
                        <div className="genre-chips" id="genreButtons">
                            <button className="active" data-genre="all">
                                Усі
                            </button>

                            <button data-genre="Фантастика">
                                Фантастика
                            </button>

                            <button data-genre="Бойовик">
                                Бойовик
                            </button>

                            <button data-genre="Драма">
                                Драма
                            </button>

                            <button data-genre="Комедія">
                                Комедія
                            </button>

                            <button data-genre="Жахи">
                                Жахи
                            </button>

                            <button data-genre="Пригоди">
                                Пригоди
                            </button>
                        </div>

                        <select className="sort-select" id="sortSelect">
                            <option value="popular">Популярні</option>
                            <option value="rating">За рейтингом</option>
                            <option value="new">Новинки</option>
                            <option value="title">За назвою</option>
                        </select>
                    </div>

                    <div className="movie-grid" id="movieGrid">
                        {filteredMovies.map((movie) => (
                            <div className="movie-card" key={movie.id}>
                                <img
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : "https://via.placeholder.com/500x750?text=No+Image"
                                    }
                                    alt={movie.title}
                                />

                                <div className="movie-info">
                                    <h3>{movie.title}</h3>

                                    <div className="movie-meta">
                                        <span>
                                            {movie.release_date
                                                ? movie.release_date.slice(0, 4)
                                                : "Невідомо"}
                                        </span>

                                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMovies.length === 0 && (
                        <p className="no-results">
                            Фільмів не знайдено 😔
                        </p>
                    )}
                </section>

                <section className="wide-promo" id="about">
                    <div>
                        <span className="section-kicker">STREAMPURPLE</span>

                        <h2>Дивись улюблені фільми</h2>

                        <p>
                            Знаходь нові фільми, додавай їх до обраного та
                            відкривай нові жанри.
                        </p>
                    </div>

                    <a href="#catalog" className="primary-btn">
                        Перейти до каталогу
                    </a>
                </section>

                <section className="catalog" id="genres">
                    <div className="section-head">
                        <div>
                            <span className="section-kicker">
                                МОЖЛИВОСТІ
                            </span>

                            <h2>Все необхідне в одному місці</h2>
                        </div>
                    </div>

                    <div className="feature-grid">
                        <div>
                            <b>🔎 Пошук</b>
                            <span>Швидко знаходь фільми за назвою.</span>
                        </div>

                        <div>
                            <b>🎬 Каталог</b>
                            <span>
                                Переглядай популярні та нові фільми.
                            </span>
                        </div>

                        <div>
                            <b>⭐ Рейтинг</b>
                            <span>Сортуй фільми за оцінкою.</span>
                        </div>

                        <div>
                            <b>❤️ Обране</b>
                            <span>
                                Зберігай улюблені фільми у браузері.
                            </span>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                © 2026 StreamPurple. Навчальний ASP.NET Core MVC проєкт.
            </footer>

            <div className="modal" id="loginModal">
                <div className="modal-box">
                    <div className="modal-top">
                        <h3>Вхід</h3>

                        <button className="close" data-close="loginModal">
                            ×
                        </button>
                    </div>

                    <label>Email</label>

                    <input
                        id="loginEmail"
                        type="email"
                        placeholder="example@email.com"
                    />

                    <label>Пароль</label>

                    <input
                        id="loginPassword"
                        type="password"
                        placeholder="••••••••"
                    />

                    <button className="modal-submit" id="loginSubmit">
                        Увійти
                    </button>

                    <div
                        className="modal-message"
                        id="loginMessage"
                    ></div>
                </div>
            </div>
        </>
    );
};

export default HomePage;