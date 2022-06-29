import React, { Component } from "react";

class Tracks extends Component {
  state = { playing: false, audio: null, playingPreviewUrl: null };

  playAudio = (previewUrl) => () => {
    const audio = new Audio(previewUrl);
    if (!this.state.playing) {
      audio.play();
      this.setState({ playing: true, audio, playingPreviewUrl: previewUrl });
    } else {
      this.state.audio.pause();
       
      this.setState({ playing: false });
    }
  };

  trackIcon = track => {
    if (!track.preview_url) {
        return <span>N/A</span>;
      }
  
      if (
        this.state.playing &&
        this.state.playingPreviewUrl === track.preview_url
      ) {
        return <span>| |</span>; //pause
      }
  
      return <span>&#9654;</span>; //play
  }

  render() {
    const { tracks } = this.props;

    return (
      <div>
        {tracks.map((track) => {
          const { id, name, album, preview_url } = track;

          return (
            <div
              key={id}
              className="track"
              onClick={this.playAudio(preview_url)}
            >
              <img
                src={album.images[0].url}
                alt="track-image"
                className="track-image"
              />
              <p className="track-text">{name}</p>
              <p className="track-icon">{this.trackIcon(track)}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Tracks;
