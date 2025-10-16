import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [playlist] = useState([
    { id: 1, title: 'Song One', artist: 'Artist A', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Song Two', artist: 'Artist B', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Song Three', artist: 'Artist C', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 4, title: 'Song Four', artist: 'Artist D', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 5, title: 'Song Five', artist: 'Artist E', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  ]);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction) => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % playlist.length;
    } else {
      nextIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    playTrack(playlist[nextIndex]);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🎵 Music Player</h1>
        </header>
        
        <div className="now-playing-card">
          <div className="album-art">
            {currentTrack ? (
              <div className="album-placeholder">
                <span className="music-icon">🎵</span>
              </div>
            ) : (
              <div className="album-placeholder">
                <span className="music-icon">🎵</span>
              </div>
            )}
          </div>
          <div className="track-info">
            {currentTrack ? (
              <>
                <h2 className="track-title">{currentTrack.title}</h2>
                <p className="track-artist">{currentTrack.artist}</p>
              </>
            ) : (
              <p className="no-track">Select a track to play</p>
            )}
          </div>
        </div>

        <audio ref={audioRef} />
        
        <div className="controls-card">
          <div className="controls">
            <button className="control-btn" onClick={() => skipTrack('prev')}>⏮</button>
            <button className="play-btn" onClick={togglePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="control-btn" onClick={() => skipTrack('next')}>⏭</button>
          </div>
          
          <div className="progress-bar">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="progress-slider"
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="playlist-card">
          <h3 className="playlist-title">Playlist</h3>
          <ul className="playlist">
            {playlist.map(track => (
              <li
                key={track.id}
                className={`playlist-item ${currentTrack && currentTrack.id === track.id ? 'active' : ''}`}
                onClick={() => playTrack(track)}
              >
                <div className="track-number">{track.id}</div>
                <div className="track-details">
                  <strong className="item-title">{track.title}</strong>
                  <span className="item-artist">{track.artist}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
