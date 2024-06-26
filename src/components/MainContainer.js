import { useSelector } from "react-redux"
import VideoBackground from "./VideoBackground"
import VideoTitle from "./VideoTitle"

const MainContainer = () =>{
    const movies = useSelector(store=>store.movies?.nowPlayingMovies)
    if(movies===null) return;
    const random = Math.floor(Math.random()*movies.length)
    const mainMovie = movies[random]
    // console.log("mainMvie",mainMovie)
    const {original_title,overview,id} = mainMovie
    return(
        <div className="pt-[30%] bg-black md:pt-0">
            <VideoTitle title={original_title} overview={overview}/>
            <VideoBackground movie_id={id}/>
        </div>
    )
}

export default MainContainer