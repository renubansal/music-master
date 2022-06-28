import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";


function App() {
  const CLIENT_ID = "e2b6fd6022f84996898f9e65f2fc5d16";
  const REDIRECT_URI = "http://localhost:1234/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const BASE_SPOTIFY_ADDRESS = 'https://api.spotify.com/v1';
//   state = {};

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    console.log("search key  : ", searchKey);
    const requestOptions = {
        method: 'GET',
        headers: {  'Authorization': `Bearer ${token}` }
    };
    fetch(`${BASE_SPOTIFY_ADDRESS}/search?q=${searchKey}&type=artist&limit=1`, requestOptions)
    .then(response => response.json())
    .then(data => {
        if(data.artists.total >  0) {
            console.log(data.artists.items[0]);
            setArtist(data.artists.items[0]);
            fetch(`${BASE_SPOTIFY_ADDRESS}/artists/${data.artists.items[0].id}/top-tracks?country=US`, requestOptions)
            .then(response => response.json())
            .then(json => console.log("tracks : ", json))
            // .catch(err => alert(err.message))
        }
    });
  };

  const renderArtists = () => {
    // return artists.map((artist) => (
    //   <div key={artist.id}>
    //     {artist.images.length ? (
    //       <img width={"100%"} src={artist.images[0].url} alt="" />
    //     ) : (
    //       <div>No Image</div>
    //     )}
    //     {artist.name}
    //   </div>
    // ));
  };

  const updateArtistQuery = event => {
      setSearchKey(event.target.value);
  }

  const handleKeyPress = event => {
      if(event.key == 'Enter') {
          searchArtists();
      }

  } 


  return (
    <div>
      <h1>Music</h1>
      {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>}

                {token ?
                    <form onSubmit={searchArtists}>
                        <input 
                            type="text"
                            onChange={updateArtistQuery} 
                            placeholder="Search for an Artist"
                            onKeyDown={handleKeyPress}/>
                        <button type={"submit"}>Search</button>
                    </form>

                    : <h2>Please login</h2>
                }

                {renderArtists()}
    </div>
  );
}

export default App;
