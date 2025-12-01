import React, { createContext, useContext, useState, ReactNode } from "react";

interface SavedDecksContextType {
  savedDeckIds: string[];
  addDeck: (deckId: string) => void;
  removeDeck: (deckId: string) => void;
  toggleDeck: (deckId: string) => void;
  isSaved: (deckId: string) => boolean;
  clearAll: () => void;
}

const SavedDecksContext = createContext<SavedDecksContextType | undefined>(undefined);

export const SavedDecksProvider = ({ children }: { children: ReactNode }) => {
  const [savedDeckIds, setSavedDeckIds] = useState<string[]>([]);

  const addDeck = (deckId: string) => {
    setSavedDeckIds((prev) => {
      if (prev.includes(deckId)) return prev;
      return [...prev, deckId];
    });
  };

  const removeDeck = (deckId: string) => {
    setSavedDeckIds((prev) => prev.filter((id) => id !== deckId));
  };

  const toggleDeck = (deckId: string) => {
    setSavedDeckIds((prev) => {
      if (prev.includes(deckId)) {
        return prev.filter((id) => id !== deckId);
      }
      return [...prev, deckId];
    });
  };

  const isSaved = (deckId: string) => {
    return savedDeckIds.includes(deckId);
  };

  const clearAll = () => {
    setSavedDeckIds([]);
  };

  return (
    <SavedDecksContext.Provider
      value={{ savedDeckIds, addDeck, removeDeck, toggleDeck, isSaved, clearAll }}
    >
      {children}
    </SavedDecksContext.Provider>
  );
};

export const useSavedDecks = () => {
  const context = useContext(SavedDecksContext);
  if (context === undefined) {
    throw new Error("useSavedDecks must be used within a SavedDecksProvider");
  }
  return context;
};
