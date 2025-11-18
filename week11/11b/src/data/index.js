//import the faker library (english locale) to generate fake/random data
import {faker} from '@faker-js/faker/locale/en'

//generate a random movie title using a random adjective + noun
export const createRandomMovie = () => {
  return `${faker.word.adjective()} ${faker.word.noun()}`
}

//generate a random song name using faker's music helpers
export const createRandomSong = () => {
  return faker.music.songName()
}
