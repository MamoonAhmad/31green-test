import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import ResidentCard from "./components/ResidentCard";
import AddNoteModal from "./components/AddNoteModal";
import "./App.css";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { fetchCareNotesAsync } from "./store/dataSlice";

function App() {
  const dispatch = useDispatch();
  const { residents, loading, error } = useSelector((state) => state.data);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCareNotesAsync());
  }, [dispatch]);

  const handleAddNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
