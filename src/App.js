import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch playlist from backend API
    fetch('https://your-backend-url.onrender.com/api/playlist')
      .then(response => response.json())
      .then(data => {
        setPlaylist(data);
        if (data.length > 0) {
          setCurrentTrack(data[0]);
        }
      })
      .catch(error => console.error('Error fetching playlist:', error));
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction) => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % playlist.length;
    } else {
      newIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    playTrack(playlist[newIndex]);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <div className="music-player">
        <h1>Music Player</h1>
        
        <div className="current-track">
          {currentTrack ? (
            <>
              <h2>{currentTrack.title}</h2>
              <p>{currentTrack.artist}</p>
            </>
          ) : (
            <p>No track selected</p>
          )}
        </div>

        <audio ref={audioRef} />

        <div className="controls">
          <button onClick={() => skipTrack('prev')}>⏮</button>
          <button onClick={togglePlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={() => skipTrack('next')}>⏭</button>
        </div>

        <div className="progress-bar">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="playlist">
          <h3>Playlist</h3>
          <ul>
            {playlist.map(track => (
              <li
                key={track.id}
                className={currentTrack && currentTrack.id === track.id ? 'active' : ''}
                onClick={() => playTrack(track)}
              >
                <strong>{track.title}</strong> - {track.artist}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
