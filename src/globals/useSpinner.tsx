import create from 'zustand';

interface UseSpinner {
    spinnerStatus: boolean;
    setSpinner: (spinner: boolean) => void;
}

export const useSpinner = create<UseSpinner>(set => ({
    spinnerStatus: false,
    setSpinner: (spinner: boolean) => set(state => ({ ...state, spinnerStatus: spinner  })),
}));