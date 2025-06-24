import { fetchCareNotes, createCareNote } from '../api/careNotesApi';

const STORAGE_KEY = 'care_notes_data';
const SYNC_QUEUE_KEY = 'care_notes_sync_queue';
const LAST_SYNC_KEY = 'care_notes_last_sync';

class DataLayer {
  constructor() {
    this.pollingInterval = null;
    this.isOnline = navigator.onLine;
    this.setupOnlineOfflineListeners();
  }

  // Setup online/offline event listeners
  setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Get data from local storage
  getLocalData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return [];
    }
  }

  // Save data to local storage
  saveLocalData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  // Get sync queue from local storage
  getSyncQueue() {
    try {
      const queue = localStorage.getItem(SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error reading sync queue:', error);
      return [];
    }
  }

  // Add item to sync queue
  addToSyncQueue(item) {
    try {
      const queue = this.getSyncQueue();
      queue.push({
        ...item,
        timestamp: new Date().toISOString(),
        id: item.id || `temp_${Date.now()}_${Math.random()}`
      });
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  // Remove item from sync queue
  removeFromSyncQueue(id) {
    try {
      const queue = this.getSyncQueue();
      const filteredQueue = queue.filter(item => item.id !== id);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Error removing from sync queue:', error);
    }
  }

  // Fetch data from API and update local storage
  async fetchAndSyncData() {
    if (!this.isOnline) {
      console.log('Offline - using local data');
      return this.getLocalData();
    }

    try {
      const apiData = await fetchCareNotes();
      this.saveLocalData(apiData);
      return apiData;
    } catch (error) {
      console.error('Error fetching from API:', error);
      return this.getLocalData();
    }
  }

  // Sync offline data with API
  async syncOfflineData() {
    if (!this.isOnline) {
      console.log('Still offline - cannot sync');
      return;
    }

    const queue = this.getSyncQueue();
    if (queue.length === 0) {
      console.log('No items to sync');
      return;
    }

    console.log(`Syncing ${queue.length} items...`);

    for (const item of queue) {
      try {
        const { residentName, content, authorName } = item;
        await createCareNote({ residentName, content, authorName });
        this.removeFromSyncQueue(item.id);
        console.log(`Synced item: ${item.id}`);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
      }
    }

    // Refresh data after sync
    await this.fetchAndSyncData();
  }

  // Add new note (stores locally and queues for sync)
  async addNote(noteData) {
    // Generate temporary ID for offline storage
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const newNote = {
      id: tempId,
      residentName: noteData.residentName,
      dateTime: new Date().toISOString(),
      content: noteData.content,
      authorName: noteData.authorName,
      isOffline: true
    };

    // Save to local storage immediately
    const localData = this.getLocalData();


    try {
      const apiResponse = await createCareNote(noteData);
      localData.push(apiResponse);
      return apiResponse;
    } catch (error) {
      console.error('Failed to sync immediately:', error);
      // Add to sync queue
      this.addToSyncQueue(newNote);
      localData.push(newNote);
    }

    this.saveLocalData(localData);

    return newNote;
  }

  // Start polling
  startPolling(intervalMs = 60000) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      console.log('Polling for updates...');
      await this.fetchAndSyncData();
      await this.syncOfflineData();
    }, intervalMs);

    console.log(`Started polling every ${intervalMs / 1000} seconds`);
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Stopped polling');
    }
  }

  // Get last sync time
  getLastSyncTime() {
    try {
      return localStorage.getItem(LAST_SYNC_KEY);
    } catch {
      return null;
    }
  }

  // Check if data is stale (older than 5 minutes)
  isDataStale() {
    const lastSync = this.getLastSyncTime();
    if (!lastSync) return true;

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastSync) < fiveMinutesAgo;
  }
}

// Create singleton instance
const dataLayer = new DataLayer();
export default dataLayer; 