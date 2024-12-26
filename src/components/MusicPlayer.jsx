import React, { useState, useRef, useEffect } from 'react';
import musicData from '../data/music.json';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(musicData.playlist[0].url));

  useEffect(() => {
    audioRef.current.volume = volume;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume]);

  useEffect(() => {
    audioRef.current.addEventListener('ended', handleNext);
    return () => {
      audioRef.current.removeEventListener('ended', handleNext);
      audioRef.current.pause();
    };
  }, [currentSong]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextSong = (currentSong + 1) % musicData.playlist.length;
    audioRef.current.src = musicData.playlist[nextSong].url;
    setCurrentSong(nextSong);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const handlePrev = () => {
    const prevSong = (currentSong - 1 + musicData.playlist.length) % musicData.playlist.length;
    audioRef.current.src = musicData.playlist[prevSong].url;
    setCurrentSong(prevSong);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 
        bg-gradient-to-br from-white/95 to-white/90
        backdrop-blur-md rounded-2xl shadow-2xl 
        border border-red-100/50
        transition-all duration-500 ease-in-out transform
        hover:shadow-red-100/20
        ${isExpanded ? 'w-80 scale-100' : 'w-16 scale-95 hover:scale-100'}`}
    >
      {/* Toggle Expand Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-12 
          bg-gradient-to-r from-red-500 to-red-600
          text-white rounded-l-xl flex items-center justify-center 
          hover:from-red-600 hover:to-red-700 
          transition-all duration-300 shadow-lg group"
      >
        <span className={`transform transition-transform duration-300 ${
          isExpanded ? 'rotate-180 translate-x-0' : 'translate-x-0.5'
        }`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-4 h-4"
          >
            <path 
              fillRule="evenodd" 
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
        <div className={`absolute inset-y-0 ${isExpanded ? 'left-0' : 'right-0'} w-0.5 
          bg-gradient-to-b from-transparent via-white/20 to-transparent`} 
        />
      </button>

      <div className="p-4">
        {isExpanded ? (
          <>
            {/* Song Info with Thumbnail */}
            <div className="mb-4 text-center relative group">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <img
                  src={musicData.playlist[currentSong].thumbnail}
                  alt={musicData.playlist[currentSong].title}
                  className="w-full h-full rounded-2xl object-cover shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-bold text-gray-800 truncate">
                {musicData.playlist[currentSong].title}
              </h3>
              <p className="text-sm text-gray-500">
                {musicData.playlist[currentSong].artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-600 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <button
                onClick={handlePrev}
                className="text-2xl text-gray-600 hover:text-red-600 transition-colors transform hover:scale-110"
              >
                ⏮️
              </button>
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 
                  text-white flex items-center justify-center hover:from-red-600 hover:to-red-700 
                  transition-all transform hover:scale-105 shadow-lg text-2xl"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={handleNext}
                className="text-2xl text-gray-600 hover:text-red-600 transition-colors transform hover:scale-110"
              >
                ⏭️
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg text-gray-600">🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-600 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-lg text-gray-600">🔊</span>
            </div>

            {/* Playlist */}
            <div className="mt-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent">
              {musicData.playlist.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => {
                    audioRef.current.src = song.url;
                    setCurrentSong(index);
                    if (isPlaying) {
                      audioRef.current.play();
                    }
                  }}
                  className={`w-full text-left p-2 hover:bg-red-50 rounded-xl flex items-center gap-3 
                    transition-all duration-300 ${
                    currentSong === index 
                      ? 'bg-red-100 text-red-600 shadow-sm' 
                      : 'hover:shadow-sm'
                  }`}
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full rounded-lg object-cover"
                    />
                    {currentSong === index && isPlaying && (
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <span className="animate-pulse">🎵</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{song.title}</div>
                    <div className="text-xs text-gray-500 truncate">{song.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 
              text-white flex items-center justify-center hover:from-red-600 hover:to-red-700 
              transition-all transform hover:scale-110 shadow-lg"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer; 