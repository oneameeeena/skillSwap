import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSwapRequests, updateSwapRequest } from '../store/swapSlice';
import Navbar from './Navbar';

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { swapRequests, isLoading } = useSelector((state) => state.swaps);

  useEffect(() => {
    dispatch(getSwapRequests());
  }, [dispatch]);

  const handleUpdateRequest = (requestId, status) => {
    dispatch(updateSwapRequest({ id: requestId, status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const RequestCard = ({ request, type }) => (
    <div className="bg-white p-6 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {type === 'sent' ? `To: ${request.to_user.name}` : `From: ${request.from_user.name}`}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-3 rounded">
          <h4 className="text-sm font-medium text-green-900 mb-1">You Offer</h4>
          <p className="text-green-800">{request.offered_skill.skill.name}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="text-sm font-medium text-blue-900 mb-1">You Want to Learn</h4>
          <p className="text-blue-800">{request.requested_skill.skill.name}</p>
        </div>
      </div>

      {type === 'received' && request.status === 'pending' && (
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => handleUpdateRequest(request.id, 'accepted')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Accept
          </button>
          <button
            onClick={() => handleUpdateRequest(request.id, 'rejected')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Reject
          </button>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => navigate(`/profile/${type === 'sent' ? request.to_user.id : request.from_user.id}`)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          View Profile →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Skill Swap Requests
            </h1>
            <p className="text-gray-600">
              Manage your incoming and outgoing skill exchange requests
            </p>
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading requests...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sent Requests */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sent Requests ({swapRequests.sent?.length || 0})
                </h2>
                {swapRequests.sent?.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">You haven't sent any swap requests yet.</p>
                    <button
                      onClick={() => navigate('/browse')}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Browse Users
                    </button>
                  </div>
                ) : (
                  swapRequests.sent.map((request) => (
                    <RequestCard key={request.id} request={request} type="sent" />
                  ))
                )}
              </div>

              {/* Received Requests */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Received Requests ({swapRequests.received?.length || 0})
                </h2>
                {swapRequests.received?.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">You haven't received any swap requests yet.</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Update Your Profile
                    </button>
                  </div>
                ) : (
                  swapRequests.received.map((request) => (
                    <RequestCard key={request.id} request={request} type="received" />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Requests;
