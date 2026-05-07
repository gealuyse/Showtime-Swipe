import { theaters } from '../data/mockData';

export const generateShowtimesForMovies = (movies) => {
    const showtimes = [];
    const systems = ["Digital 2D", "IMAX Laser", "4DX", "Dolby Atmos"];
    const languages = [{ audio: "TH", sub: "None" }, { audio: "EN", sub: "TH" }];

    movies.forEach(movie => {
        // Randomly assign to theaters (70% chance per theater)
        theaters.forEach(theater => {
            if (Math.random() > 0.3) {
                // Generate 3-5 rounds per theater
                const rounds = Math.floor(Math.random() * 3) + 3;
                for (let i = 0; i < rounds; i++) {
                    const hour = 10 + Math.floor(Math.random() * 12); // 10:00 - 22:00
                    const minute = Math.random() > 0.5 ? "00" : "30";
                    const sys = systems[Math.floor(Math.random() * systems.length)];
                    const lang = languages[Math.floor(Math.random() * languages.length)];

                    showtimes.push({
                        id: `show_${movie.id}_${theater.id}_${i}`,
                        movieId: movie.id,
                        movieTitle: movie.title,
                        poster: movie.poster,
                        theaterId: theater.id,
                        startTime: `${new Date().toISOString().split('T')[0]}T${hour}:${minute}:00`,
                        system: sys,
                        audio: lang.audio,
                        subtitle: lang.sub,
                        price: sys.includes("IMAX") ? 350 : 240,
                        bookingLink: `https://example.com/book/${movie.id}/${theater.id}`
                    });
                }
            }
        });
    });

    return showtimes;
};
