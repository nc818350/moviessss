import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom' // Added useLocation
import { TMDB_Access_Key } from '../../config'
 
const Player = () => {
  const { state } = useLocation(); // Fixed: Get state properly in React Router v6
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  })

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(response => response.json())
      .then(response => {
        // Check if there are results to avoid crashing if no videos exist
        if (response.results && response.results.length > 0) {
          setApiData(response.results[0]);
        }
      })
      .catch(err => console.error(err));
  }, [id]) // Added id to dependency array to refetch if the movie changes
  
  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="Go back" onClick={() => { navigate(-2) }} />
      
      {/* Added referrerPolicy and allow attributes to fix YouTube embedding */}
      <iframe 
        src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1`}
        title='trailer' 
        frameBorder='0' 
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      
      <div className="player-info">
        {apiData.published_at && <p>{apiData.published_at.slice(0, 10)}</p>}
        <p>{state?.name}</p> {/* Fixed: state is now an object from useLocation */}
        <p>{apiData.type}</p>
      </div>
    </div>
  )
}

export default Player