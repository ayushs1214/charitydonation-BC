
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
    <div>
      <h2 className="text-lg font-semibold mb-2">Charities</h2>
      <ul>
        {charities.map((charity) => (
          <li key={charity.id} className="mb-2">
            <button
              onClick={() => onSelect(charity)}
              className="block w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {charity.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
