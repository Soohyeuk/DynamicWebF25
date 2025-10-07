import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const searchImages = async () => {
    //when using axios GET, first argument is the url as a string 
    //second argument is for options obj 
    const response = await axios.get("https://unsplash.com/search/photos", {
        //inside headers is where you pass your ACESS KEY
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
        params: {
            query: 'chickens'
        },
    })
    //path to the JSON obj 
    console.log(response.data.results)
    return response
}


export default searchImages
