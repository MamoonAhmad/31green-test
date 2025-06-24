const API_BASE_URL = 'http://localhost:8000';

/**
 * Fetch all care notes from the API
 * @returns {Promise<Array>} Array of care notes
 */
export const fetchCareNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/care-notes`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching care notes:', error);
    throw error;
  }
};

/**
 * Create a new care note
 * @param {Object} noteData - The note data to create
 * @param {string} noteData.residentName - Name of the resident
 * @param {string} noteData.content - Content of the note
 * @param {string} noteData.authorName - Name of the author
 * @returns {Promise<Object>} The created note with ID and timestamp
 */
export const createCareNote = async (noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/care-notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating care note:', error);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}; 