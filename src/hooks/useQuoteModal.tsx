'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SelectedCar {
    name: string;
    manufacturerName: string;
}

interface QuoteModalContextType {
    isOpen: boolean;
    selectedCar: SelectedCar | null;
    openModal: (car?: SelectedCar) => void;
    closeModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType | null>(null);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);

    const openModal = (car?: SelectedCar) => {
        setSelectedCar(car || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedCar(null);
    };

    return (
        <QuoteModalContext.Provider value={{ isOpen, selectedCar, openModal, closeModal }}>
            {children}
        </QuoteModalContext.Provider>
    );
}

export function useQuoteModal() {
    const context = useContext(QuoteModalContext);
    if (!context) {
        throw new Error('useQuoteModal must be used within QuoteModalProvider');
    }
    return context;
}