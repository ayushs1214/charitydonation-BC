import React from 'react';

interface Charity {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
}

interface CharityListProps {
  charities: Charity[];
  onSelect: (charity: Charity) => void;
}

export const CharityList: React.FC<CharityListProps> = ({charities, onSelect}) => {
  return (
    <div className="transition-colors duration-300 fade-in">
      <h2 className="text-lg font-semibold mb-3 text-secondary transition-colors duration-300">
        Charities
      </h2>
      <ul className="space-y-2">
        {charities.map((charity) => (
          <li key={charity.id} className="transition-colors duration-300 hover-scale">
            <button
              onClick={() => onSelect(charity)}
              className="block w-full text-left p-3 bg-secondary/10 hover:bg-secondary/20 rounded-md shadow-sm transition-colors duration-200"
            >
              <span className="text-lg font-medium text-foreground transition-colors duration-300">{charity.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
