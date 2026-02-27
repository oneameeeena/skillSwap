import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../store/userSlice';
import { getSkills } from '../store/skillSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Browse = () => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  
  const { users, pagination, isLoading: usersLoading } = useSelector((state) => state.users);
  const { skills, isLoading: skillsLoading } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(getSkills());
  }, [dispatch]);

  useEffect(() => {
    const params = selectedSkill ? { skill: selectedSkill } : {};
    dispatch(getUsers(params));
  }, [dispatch, selectedSkill]);

  const handleSkillFilter = (skillId) => {
    setSelectedSkill(skillId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = selectedSkill ? { skill: selectedSkill, page } : { page };
    dispatch(getUsers(params));
  };

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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Browse Users
                </h1>
                <p className="text-gray-600">
                  Discover talented individuals and find the perfect skill exchange match
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {pagination.total} user{pagination.total !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </div>
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Skill
                </label>
                <div className="relative">
                  <select
                    value={selectedSkill}
                    onChange={(e) => handleSkillFilter(e.target.value)}
                    className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
                  >
                    <option value="">All Skills</option>
                    {skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name} ({skill.offered_by_users_count} users)
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Page {currentPage} of {pagination.last_page}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          {usersLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-500">Loading amazing users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or check back later</p>
              <button
                onClick={() => handleSkillFilter('')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  {/* User Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white font-bold text-xl">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-indigo-100 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Content */}
                  <div className="p-6">
                    {user.bio && (
                      <div className="mb-6">
                        <p className="text-gray-600 line-clamp-3">{user.bio}</p>
                      </div>
                    )}

                    {/* Skills Section */}
                    <div className="space-y-4">
                      {user.offered_skills && user.offered_skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Can Teach
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {user.offered_skills.map((userSkill) => (
                              <span
                                key={userSkill.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                              >
                                {userSkill.skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.wanted_skills && user.wanted_skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Wants to Learn
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {user.wanted_skills.map((userSkill) => (
                              <span
                                key={userSkill.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                              >
                                {userSkill.skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/profile/${user.id}`)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm overflow-hidden">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="relative inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                )}
                
                {[...Array(pagination.last_page)].map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  const isNearCurrent = Math.abs(page - currentPage) <= 2 || page === 1 || page === pagination.last_page;
                  
                  if (!isNearCurrent && index !== 0 && index !== pagination.last_page - 1) {
                    return null;
                  }
                  
                  if (!isNearCurrent && index === 1) {
                    return (
                      <span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }
                  
                  if (!isNearCurrent && index === pagination.last_page - 2) {
                    return (
                      <span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'z-10 bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {currentPage < pagination.last_page && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="relative inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Next
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
