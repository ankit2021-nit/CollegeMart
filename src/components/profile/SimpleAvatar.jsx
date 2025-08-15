import React from 'react';
import { FaMale, FaFemale, FaUser } from 'react-icons/fa';

const SimpleAvatar = ({ 
  user, 
  size = 40, 
  showGender = false, 
  className = "",
  gender = null // Will use user.gender if available
}) => {
  // Generate avatar URL
  const generateAvatarUrl = () => {
    const avatarSeed = user?.name || 'default';
    const baseUrl = 'https://api.dicebear.com/7.x';
    const style = 'adventurer'; // Default style for simple avatars
    const userGender = gender || user?.gender || 'male';
    
    let url = `${baseUrl}/${style}/svg?seed=${encodeURIComponent(avatarSeed)}`;
    
    // Add gender-specific parameters for certain styles
    if (style === 'personas' || style === 'avataaars') {
      url += `&gender=${userGender}`;
    }
    
    // Add size parameter
    url += `&size=${size}`;
    
    return url;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className="rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100"
        style={{ width: size, height: size }}
      >
        <img
          src={generateAvatarUrl()}
          alt={`${user?.name || 'User'} Avatar`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=${size}&background=random`;
          }}
        />
      </div>
      
      {/* Gender Icon Overlay */}
      {showGender && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          {(gender || user?.gender || 'male') === 'male' ? (
            <FaMale className="text-blue-500 text-xs" />
          ) : (
            <FaFemale className="text-pink-500 text-xs" />
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleAvatar;
