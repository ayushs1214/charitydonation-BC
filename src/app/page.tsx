
'use client';

import {useEffect, useState} from 'react';
import {CharityList} from "@/components/CharityList";
import {CharityDetails} from "@/components/CharityDetails";
import {MonitorCharityTrustworthinessOutput} from "@/ai/flows/monitor-charity-flow";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

interface Charity {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
}

export default function Home() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<MonitorCharityTrustworthinessOutput | null>(null);


  useEffect(() => {
    async function loadCharities() {
      try {
        const data = await import('../data/charities.json');
        setCharities(data.charities);
        setLoading(false);
      } catch (e: any) {
        setError('Failed to load charities: ' + e.message);
        setLoading(false);
      }
    }

    loadCharities();
  }, []);

  const handleCharitySelect = (charity: Charity) => {
    setSelectedCharity(charity);
    setAiReport(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ChainDonation</h1>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <p>Loading charities...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <CharityList charities={charities} onSelect={handleCharitySelect} />
          </div>
          <div className="md:col-span-2">
            {selectedCharity ? (
              <CharityDetails
                charity={selectedCharity}
                aiReport={aiReport}
                setAiReport={setAiReport}
              />
            ) : (
              <p>Select a charity to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
