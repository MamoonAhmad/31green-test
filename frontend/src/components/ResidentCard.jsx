import React from 'react';
import moment from 'moment';
import { WifiOff } from 'lucide-react';

const ResidentCard = ({ resident }) => {
  const formattedDateTime = moment(resident.dateTime).format('MMM DD, YYYY h:mm A');

  return (
    <div className="mb-4 bg-white rounded-xl border shadow-md hover:shadow-lg transition-shadow p-3 relative">
      {/* Offline indicator */}
      {resident.isOffline && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </div>
      )}
      
      <div className="mb-2">
        <h3 className="text-xl text-left font-semibold text-gray-800">
          {resident.residentName}
        </h3>
      </div>
      <div className="mt-0">
        <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
          <span>{formattedDateTime}</span> --
          <span className="font-medium">{resident.authorName}</span>
        </div>
        <p className="text-gray-700 leading-relaxed text-left">
          {resident.content}
        </p>
      </div>
    </div>
  );
};

export default ResidentCard; 