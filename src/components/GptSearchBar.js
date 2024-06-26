import { useRef } from "react";
import lang from "../utils/languageconstants";
import { useSelector,useDispatch } from "react-redux";
import { openai } from "../utils/openai";
import { options } from "../utils/constant";
import { addGptMovieResult } from "../utils/gptSlice";
export default function GptSearchBar(){
    const dispatch = useDispatch()
    const langKey = useSelector((store)=>store.config.lang)
    const searchText = useRef(null)
    

    //search movie in tmdb
    const searchMovieTMDB = async(movie) =>{
        const data = await fetch('https://api.themoviedb.org/3/search/movie?query='+movie+'&include_adult=false&language=en-US&page=1', options)
        const json = await data.json()
        return json.results
    }

    const handleGPTSearchClick =async () =>{
        // Make an API call to get movie results from openapi
        const gptQuery ="Act as a Movie Recommendation system nad suggest some movies for the query"+searchText.current.value+". only give me names of 5 movie names ,comma seperated like the example result given ahead.Example Result:RRR,Bahubali,KGF,Pushpa,SALAAR";
        const gptResults = await openai.chat.completions.create({
            messages: [{ role: 'user', content: gptQuery}],
            model: 'gpt-3.5-turbo',
        });
          if(!gptResults.choices){

          }
        //   console.log(gptResults.choices?.[0]?.message?.content)
          const gptMovies = gptResults.choices?.[0]?.message?.content.split(",")
          const promiseArray = gptMovies.map((movie)=>searchMovieTMDB(movie));
          const tmdbResults = await Promise.all(promiseArray)
          console.log(tmdbResults)
        dispatch(addGptMovieResult({movieNames:gptMovies,movieResults:tmdbResults}))
    }
    return(
        <div className="pt-[33%] md:pt-[10%] flex justify-center ">
            <form className="w-full md:w-1/2 bg-black grid grid-cols-12" onSubmit={(e)=>e.preventDefault()}>
                <input ref={searchText} type="text" className="p-4 m-6 col-span-9 " placeholder={lang[langKey].gptSearchPlaceholder}/>
                <button className="py-2 px-4 m-4 col-span-3  bg-red-700 text-white rounded" onClick={handleGPTSearchClick}>{lang[langKey].search}</button>
            </form>
        </div>
    )
}