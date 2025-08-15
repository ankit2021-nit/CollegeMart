import React, { useState, useEffect } from 'react';
import { FaUser, FaMale, FaFemale } from 'react-icons/fa';

const Avatar = ({ 
  user, 
  size = 160, 
  showGender = true, 
  className = "",
  onAvatarChange = null 
}) => {
  const [selectedGender, setSelectedGender] = useState(user?.gender || 'male');
  const [selectedStyle, setSelectedStyle] = useState('adventurer');
  const [customAvatar, setCustomAvatar] = useState(null);

  // Avatar styles available
  const avatarStyles = [
    { name: 'adventurer', label: 'Adventurer' },
    { name: 'adventurer-neutral', label: 'Adventurer Neutral' },
    { name: 'avataaars', label: 'Avataaars' },
    { name: 'big-ears', label: 'Big Ears' },
    { name: 'big-ears-neutral', label: 'Big Ears Neutral' },
    { name: 'big-smile', label: 'Big Smile' },
    { name: 'bottts', label: 'Bottts' },
    { name: 'croodles', label: 'Croodles' },
    { name: 'croodles-neutral', label: 'Croodles Neutral' },
    { name: 'identicon', label: 'Identicon' },
    { name: 'initials', label: 'Initials' },
    { name: 'micah', label: 'Micah' },
    { name: 'miniavs', label: 'Mini Avatars' },
    { name: 'personas', label: 'Personas' },
    { name: 'pixel-art', label: 'Pixel Art' },
    { name: 'pixel-art-neutral', label: 'Pixel Art Neutral' }
  ];

  // Generate avatar URL based on gender and style
  const generateAvatarUrl = (gender, style, seed = null) => {
    const avatarSeed = seed || user?.name || 'default';
    const baseUrl = 'https://api.dicebear.com/7.x';
    
    let url = `${baseUrl}/${style}/svg?seed=${encodeURIComponent(avatarSeed)}`;
    
    // Add gender-specific parameters for certain styles
    if (style === 'personas' || style === 'avataaars') {
      url += `&gender=${gender}`;
    }
    
    // Add size parameter
    url += `&size=${size}`;
    
    return url;
  };

  // Get current avatar URL
  const getAvatarUrl = () => {
    if (customAvatar) {
      return URL.createObjectURL(customAvatar);
    }
    return generateAvatarUrl(selectedGender, selectedStyle);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomAvatar(file);
      if (onAvatarChange) {
        onAvatarChange(file);
      }
    }
  };

  // Handle gender change
  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setCustomAvatar(null); // Reset custom avatar when changing gender
  };

  // Handle style change
  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    setCustomAvatar(null); // Reset custom avatar when changing style
  };

  // Generate random avatar
  const generateRandomAvatar = () => {
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)].name;
    const randomGender = Math.random() > 0.5 ? 'male' : 'female';
    setSelectedStyle(randomStyle);
    setSelectedGender(randomGender);
    setCustomAvatar(null);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Avatar Display */}
      <div className="relative mb-4">
        <div 
          className="rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100"
          style={{ width: size, height: size }}
        >
          <img
            src={getAvatarUrl()}
            alt={`${user?.name || 'User'} Avatar`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=${size}&background=random`;
            }}
          />
        </div>
        
        {/* Gender Icon Overlay */}
        {showGender && (
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
            {selectedGender === 'male' ? (
              <FaMale className="text-blue-500 text-lg" />
            ) : (
              <FaFemale className="text-pink-500 text-lg" />
            )}
          </div>
        )}

        {/* File Upload Overlay */}
        {onAvatarChange && (
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
            <label className="cursor-pointer text-white text-center">
              <FaUser className="mx-auto mb-1" />
              <span className="text-xs">Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Avatar Controls */}
      <div className="w-full max-w-xs space-y-4">
        {/* Gender Selection */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleGenderChange('male')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              selectedGender === 'male' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaMale />
            <span>Male</span>
          </button>
          <button
            onClick={() => handleGenderChange('female')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              selectedGender === 'female' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaFemale />
            <span>Female</span>
          </button>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar Style
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => handleStyleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {avatarStyles.map((style) => (
              <option key={style.name} value={style.name}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={generateRandomAvatar}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Random Avatar
          </button>
          {onAvatarChange && (
            <label className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer text-center">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Current Avatar Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Current: {avatarStyles.find(s => s.name === selectedStyle)?.label}</p>
          <p>Gender: {selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
