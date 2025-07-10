const express = require('express');
const crypto = require('node:crypto');
const movies = require('./movies.json');
// zod es una librería para validar datos
const z = require('zod');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');
const app = express();
app.disable('x-powered-by') //dehabilita ese header

const PORT = process.env.PORT ?? 3000;
// para usar el body de las peticiones
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// ENDPOINT para recuperar todas las películas
app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query;
  if (genre) {
    const filterGenre = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
    return res.json(filterGenre);
  }
  res.json(movies);

})

app.post('/movies', (req, res) => {
  const { title, genre, year, director, duration, rate, poster } = req.body;
  const result = validateMovie(req.body);

  if (result.error) {
    // el cliente ha hecho algo para que la petición no sea válida
    // por ejemplo, enviar un campo que no existe o un tipo de dato incorrecto
    // en este caso, se devuelve un error 400 (Bad Request)
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(), // crea uuid v4
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0, // si no se envía rate, se asigna 0
    poster
  }
  movies.push(newMovie);
  // el 201 indica que se ha creado un recurso
  res.status(201).json(newMovie);
});

// endpoint para recuperar una película por ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id)
  if (!movie) {
    res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
})

// endpoint para actualizar una película por ID
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params;
  let movieIndex = movies.findIndex(movie => movie.id === id);
  if (movieIndex < 0) return res.status(404).json({ error: 'Movie not found' });
  const isMovieValid = validatePartialMovie(req.body);
  if (isMovieValid.error) {
    return res.status(400).json({ error: JSON.parse(isMovieValid.error.message) });
  }
  movies[movieIndex] = { ...movies[movieIndex], ...req.body }
  res.status(204).json(movies[movieIndex])

})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

