const z = require('zod');

const movieSchema = z.object({
  title: z.string({
    error: (issue) => {
      issue.input === undefined ? 'Title is required' : 'Title must be a string'
    }
  }),
  genre: z.array(z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Fantasy', 'Thriller', 'Romance', 'Crime'])),
  year: z.number().int().positive().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5), // si no se envía rate, se asigna 0
  poster: z.string().url({
    error: issue => {
      issue.input === undefined ? 'Poster is required' : 'Poster must be a valid URL'
    }
  })
})

// ponemos object porque como tal aun no se sabe si lo que se ingresa es una pelicula, por eso se debe validar
function validateMovie(object) {
  return movieSchema.safeParse(object);
}

// This function validates a partial movie object against the movieSchema using Zod's partial() method, which makes all fields optional, and safeParse() method, which returns a result object indicating whether the validation was successful or not.
function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}