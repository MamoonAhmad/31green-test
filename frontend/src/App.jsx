import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import ResidentCard from "./components/ResidentCard";
import AddNoteModal from "./components/AddNoteModal";
import { Button } from "./components/ui/button";
import { Plus, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { fetchCareNotesAsync, syncOfflineDataAsync, setOfflineStatus } from "./store/careNotesSlice";
import dataLayer from "./data/dataLayer";

function App() {
  const dispatch = useDispatch();
  const { residents, loading, error, isOffline, lastSyncTime, syncQueueLength } = useSelector((state) => state.data);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchCareNotesAsync());
    
    // Setup online/offline status updates
    const updateOnlineStatus = () => {
      dispatch(setOfflineStatus(!navigator.onLine));
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial status
    updateOnlineStatus();
    
    // Cleanup
    return () => {
      dataLayer.stopPolling();
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [dispatch]);

  const handleAddNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleManualSync = () => {
    dispatch(syncOfflineDataAsync());
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading && residents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center w-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading care notes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center w-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => dispatch(fetchCareNotesAsync())}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex justify-center w-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Resident Records
        </h1>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-6 p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isOffline ? (
                <WifiOff className="h-5 w-5 text-red-500" />
              ) : (
                <Wifi className="h-5 w-5 text-green-500" />
              )}
              <span className="text-sm text-gray-600">
                {isOffline ? 'Offline' : 'Online'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              Last sync: {formatLastSync(lastSyncTime)}
            </div>
            
            {syncQueueLength > 0 && (
              <div className="text-sm text-orange-600">
                {syncQueueLength} item(s) pending sync
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualSync}
            disabled={isOffline || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        </div>
        
        <Button className={"mb-3"} onClick={handleAddNote}>
          <Plus />
          Add Note
        </Button>
        
        <div className="mx-auto">
          {residents.length === 0 ? (
            <div className="text-center text-gray-600 mt-8">
              <p>No care notes found. Add your first note!</p>
            </div>
          ) : (
            residents.map((resident) => (
              <ResidentCard key={resident.id} resident={resident} />
            ))
          )}
        </div>
        
        <AddNoteModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
}

export default App;
