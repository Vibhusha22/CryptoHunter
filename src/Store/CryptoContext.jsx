import { create } from 'zustand';

const useCryptoStore = create((set) => ({
  currency: 'INR',
  symbol: '₹',

  setCurrency: (newCurrency) => {
    const newSymbol = newCurrency === 'INR' ? '₹' : '$';
    set({ currency: newCurrency, symbol: newSymbol });
  },
}));

export default useCryptoStore; 
