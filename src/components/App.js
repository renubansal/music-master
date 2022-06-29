import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Component } from "react/cjs/react.production.min";

const CLIENT_ID = "e2b6fd6022f84996898f9e65f2fc5d16";
const REDIRECT_URI = "http://localhost:1234/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const BASE_SPOTIFY_ADDRESS = "https://api.spotify.com/v1";

class App extends React.Component {
  state = { token: "", searchKey: "", artist: "", tracks: [] };

  componentDidMount() {
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

    this.setState({ token });
  }

  //   componentWillUnmount() {
  //     this.logout();
  //   }

  logout = () => {
    this.setState({ token: "" });
    window.localStorage.removeItem("token");
  };

  searchArtists = () => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    fetch(
      `${BASE_SPOTIFY_ADDRESS}/search?q=${this.state.searchKey}&type=artist&limit=1`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.artists.total > 0) {
            const artist = data.artists.items[0];
          this.setState({ artist });
          fetch(
            `${BASE_SPOTIFY_ADDRESS}/artists/${this.state.artist.id}/top-tracks?country=US`,
            requestOptions
          )
            .then((response) => response.json())
            .then((json) => this.setState({tracks: json.tracks}))
          .catch(err => alert(err.message))
        }
      })
      .catch(err => alert(err.message));
  };

  //   renderArtists = () => {
  //     // return artists.map((artist) => (
  //     //   <div key={artist.id}>
  //     //     {artist.images.length ? (
  //     //       <img width={"100%"} src={artist.images[0].url} alt="" />
  //     //     ) : (
  //     //       <div>No Image</div>
  //     //     )}
  //     //     {artist.name}
  //     //   </div>
  //     // ));
  //   };

  updateArtistQuery = (event) => {
    this.setState({ searchKey: event.target.value });
  };

  handleKeyPress = (event) => {
    if (event.key == "Enter") {
      this.searchArtists();
    }
  };

  render() {
      console.log(this.state);
    return (
      <div>
        <h1>Music</h1>
        {!this.state.token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={this.logout}>Logout</button>
        )}

        {this.state.token ? (
          <form onSubmit={this.searchArtists}>
            <input
              type="text"
              onChange={this.updateArtistQuery}
              placeholder="Search for an Artist"
              onKeyDown={this.handleKeyPress}
            />
            <button type={"submit"}>Search</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}
      </div>
    );
  }
}

export default App;
