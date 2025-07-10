const z = require('zod');

const movieSchema = z.object({
  title: z.string({
    error: (issue) => {
      issue.input === undefined ? 'Title is required' : 'Title must be a string'
    }
  }),
  genre: z.array(z.enum(['action', 'comedy', 'drama', 'horror', 'sci-fi', 'fantasy', 'thriller', 'romance'])),
  year: z.number().int().positive().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10), // si no se envía rate, se asigna 0
  poster: z.string().url({
    error: issue => {
      issue.input === undefined ? 'Poster is required' : 'Poster must be a valid URL'
    }
  })
})

function validateMovie(movie) {
  return movieSchema.safeParse(movie);
}

module.exports = {
  validateMovie
}