import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateProfile } from '../store/userSlice';
import { getSkills } from '../store/skillSlice';
import { createSwapRequest } from '../store/swapSlice';
import Navbar from './Navbar';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, isLoading: userLoading } = useSelector((state) => state.users);
  const { skills, isLoading: skillsLoading } = useSelector((state) => state.skills);
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    offered_skills: [],
    wanted_skills: [],
  });
  const [swapData, setSwapData] = useState({
    offered_skill_id: '',
    requested_skill_id: '',
  });

  const isOwnProfile = !id || parseInt(id) === loggedInUser?.id;
  const profileUserId = isOwnProfile ? loggedInUser?.id : parseInt(id);

  useEffect(() => {
    dispatch(getSkills());
  }, [dispatch]);

  useEffect(() => {
    if (profileUserId) {
      dispatch(getUserById(profileUserId));
    }
  }, [dispatch, profileUserId]);

  useEffect(() => {
    if (currentUser && isOwnProfile) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        offered_skills: currentUser.offered_skills?.map(us => us.skill.id) || [],
        wanted_skills: currentUser.wanted_skills?.map(us => us.skill.id) || [],
      });
    }
  }, [currentUser, isOwnProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skillId, type) => {
    setFormData(prev => {
      const currentSkills = prev[type];
      const updatedSkills = currentSkills.includes(skillId)
        ? currentSkills.filter(id => id !== skillId)
        : [...currentSkills, skillId];
      return {
        ...prev,
        [type]: updatedSkills,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleSwapRequest = () => {
    dispatch(createSwapRequest({
      to_user_id: profileUserId,
      offered_skill_id: swapData.offered_skill_id,
      requested_skill_id: swapData.requested_skill_id,
    }));
    setShowSwapModal(false);
  };

  if (userLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {isOwnProfile ? 'My Profile' : `${currentUser?.name}'s Profile`}
                </h1>
                <p className="text-gray-600">
                  {isOwnProfile ? 'Manage your skills and connect with others' : 'View skills and request exchanges'}
                </p>
              </div>
              <div className="flex space-x-3">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowSwapModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Request Skill Swap
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Skills Selection */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills I Can Teach</h4>
                        <div className="space-y-2">
                          {skills.map((skill) => (
                            <label key={skill.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.offered_skills.includes(skill.id)}
                                onChange={() => handleSkillToggle(skill.id, 'offered_skills')}
                                className="mr-2"
                              />
                              {skill.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills I Want to Learn</h4>
                        <div className="space-y-2">
                          {skills.map((skill) => (
                            <label key={skill.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.wanted_skills.includes(skill.id)}
                                onChange={() => handleSkillToggle(skill.id, 'wanted_skills')}
                                className="mr-2"
                              />
                              {skill.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-2xl">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-6">
                      <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
                      <p className="text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>

                  {currentUser.bio && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{currentUser.bio}</p>
                    </div>
                  )}

                  {/* Skills Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Can Teach</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.offered_skills?.length > 0 ? (
                          currentUser.offered_skills.map((userSkill) => (
                            <span
                              key={userSkill.id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                              {userSkill.skill.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Wants to Learn</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.wanted_skills?.length > 0 ? (
                          currentUser.wanted_skills.map((userSkill) => (
                            <span
                              key={userSkill.id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {userSkill.skill.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Request Skill Swap with {currentUser.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Want to Offer
                </label>
                <select
                  value={swapData.offered_skill_id}
                  onChange={(e) => setSwapData(prev => ({ ...prev, offered_skill_id: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a skill</option>
                  {loggedInUser?.offered_skills?.map((userSkill) => (
                    <option key={userSkill.id} value={userSkill.id}>
                      {userSkill.skill.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Want to Learn
                </label>
                <select
                  value={swapData.requested_skill_id}
                  onChange={(e) => setSwapData(prev => ({ ...prev, requested_skill_id: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a skill</option>
                  {currentUser.wanted_skills?.map((userSkill) => (
                    <option key={userSkill.id} value={userSkill.id}>
                      {userSkill.skill.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSwapModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapRequest}
                disabled={!swapData.offered_skill_id || !swapData.requested_skill_id}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
