// Simple in-memory store for reconciliation entries
let entries = [];
let nextId = 1;

// Load entries from localStorage on initialization
const loadEntriesFromStorage = () => {
  try {
    const savedEntries = localStorage.getItem('reconcileEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      entries = parsedEntries;
      // Update nextId to be one more than the highest existing id
      if (entries.length > 0) {
        nextId = Math.max(...entries.map(entry => entry.id)) + 1;
      }
    }
  } catch (error) {
    console.error('Error loading entries from localStorage:', error);
  }
};

// Save entries to localStorage
const saveEntriesToStorage = () => {
  try {
    // Create a copy of entries without file objects (which can't be serialized)
    const entriesToSave = entries.map(entry => {
      const { raw, ...rest } = entry;
      if (raw && raw.photo && typeof raw.photo === 'string' && raw.photo.startsWith('data:image')) {
        // Keep base64 photo data
        return { ...rest, raw };
      } else if (raw && raw.photo) {
        // Remove the photo file object but keep other raw data
        const { photo, ...rawWithoutPhoto } = raw;
        return { ...rest, raw: rawWithoutPhoto };
      }
      return entry;
    });
    
    localStorage.setItem('reconcileEntries', JSON.stringify(entriesToSave));
  } catch (error) {
    console.error('Error saving entries to localStorage:', error);
  }
};

// Load entries when the module is first loaded
loadEntriesFromStorage();

// Add a new entry to the store
export const addEntry = (entryData) => {
  const id = nextId++;
  const entry = {
    id,
    timestamp: new Date().toISOString(),
    ...entryData
  };
  
  entries.push(entry);
  saveEntriesToStorage(); // Save to localStorage
  console.log('Added entry:', entry);
  return id;
};

// Get all entries
export const getEntries = () => {
  return [...entries];
};

// Get entries by user name or email
export const getEntriesByUser = (userIdentifier) => {
  return entries.filter(entry => 
    entry.fullName === userIdentifier || 
    entry.userEmail === userIdentifier ||
    (entry.raw && entry.raw.finderName === userIdentifier) ||
    (entry.raw && entry.raw.fullName === userIdentifier)
  );
};

// Update an entry
export const updateEntry = (id, updateData) => {
  const index = entries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updateData };
    saveEntriesToStorage(); // Save to localStorage
    return entries[index];
  }
  return null;
};

// Delete an entry
export const deleteEntry = (id) => {
  const initialLength = entries.length;
  entries = entries.filter(entry => entry.id !== id);
  if (entries.length < initialLength) {
    saveEntriesToStorage(); // Save to localStorage
    return true;
  }
  return false;
};

// Find matching entries based on document type and identifiers
export const findMatches = (entry) => {
  return entries.filter(otherEntry => {
    // Don't match an entry with itself
    if (entry.id === otherEntry.id) return false;
    
    // Match lost items with found items of the same document type
    if (entry.docType === otherEntry.docType) {
      // For national IDs, match by national ID number
      if (entry.docType === 'national id' && entry.nationalId && otherEntry.nationalId) {
        return entry.nationalId === otherEntry.nationalId;
      }
      
      // For passports, match by passport number
      if (entry.docType === 'passport' && entry.raw && otherEntry.raw) {
        const passportNumber1 = entry.raw.passportNumber || entry.raw.nationalId;
        const passportNumber2 = otherEntry.raw.passportNumber || otherEntry.raw.nationalId;
        if (passportNumber1 && passportNumber2) {
          return passportNumber1 === passportNumber2;
        }
      }
      
      // For vehicle permits, match by permit number
      if (entry.docType === 'vehicle permit' && entry.raw && otherEntry.raw) {
        const permitNumber1 = entry.raw.permitNumber;
        const permitNumber2 = otherEntry.raw.permitNumber;
        if (permitNumber1 && permitNumber2) {
          return permitNumber1 === permitNumber2;
        }
      }
      
      // For land documents, match by document title
      if (entry.docType === 'land documents' && entry.raw && otherEntry.raw) {
        const title1 = entry.raw.documentTitle;
        const title2 = otherEntry.raw.documentTitle;
        if (title1 && title2) {
          return title1 === title2;
        }
      }
    }
    
    return false;
  });
};

// Find all matches across all entries
export const findAllMatches = () => {
  const allMatches = [];
  
  entries.forEach(entry => {
    const matches = findMatches(entry);
    if (matches.length > 0) {
      allMatches.push({
        entry: entry,
        matches: matches
      });
    }
  });
  
  return allMatches;
};

// Clear all entries (useful for testing)
export const clearEntries = () => {
  entries = [];
  nextId = 1;
  saveEntriesToStorage(); // Save to localStorage
};

// Mark entries as reconciled
export const markAsReconciled = (lostEntryId, foundEntryId) => {
  // Update both entries to mark them as reconciled
  updateEntry(lostEntryId, { status: 'reconciled', reconciledWith: foundEntryId });
  updateEntry(foundEntryId, { status: 'reconciled', reconciledWith: lostEntryId });
};