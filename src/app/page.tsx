'use client';

import {useEffect, useState} from 'react';
import {CharityList} from "@/components/CharityList";
import {CharityDetails} from "@/components/CharityDetails";
import {MonitorCharityTrustworthinessOutput} from "@/ai/flows/monitor-charity-flow";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

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
  const [open, setOpen] = useState(false);
  const [newCharity, setNewCharity] = useState({
    name: '',
    description: '',
    walletAddress: '',
  });
  const router = useRouter();

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

  const handleInputChange = (e: any) => {
    setNewCharity({
      ...newCharity,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCharity = () => {
    if (!newCharity.name || !newCharity.description || !newCharity.walletAddress) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields.',
      });
      return;
    }

    const newId = (charities.length + 1).toString();
    const charityToAdd = {
      id: newId,
      ...newCharity,
    };

    setCharities([...charities, charityToAdd]);
    setNewCharity({name: '', description: '', walletAddress: ''});
    setOpen(false);
    toast({
      title: 'Success',
      description: 'Charity added successfully.',
    });
    router.refresh(); // Refresh the route
  };

  return (
    <div className="container mx-auto p-4 transition-colors duration-300 fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary transition-colors duration-300">
          ChainDonation
        </h1>
        <p className="text-muted-foreground mt-1">
          Donate with trust and transparency.
        </p>
      </header>

      {error && (
        <Alert variant="destructive" className="alert-box">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary transition-colors duration-300">
            Verified Charities
          </h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover-scale">Add Charity</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Charity</DialogTitle>
                <DialogDescription>
                  Fill in the details to list a new charity.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newCharity.name}
                    onChange={handleInputChange}
                    className="col-span-3 input-field"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    value={newCharity.description}
                    onChange={handleInputChange}
                    className="col-span-3 input-field"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="walletAddress" className="text-right">
                    Wallet Address
                  </Label>
                  <Input
                    type="text"
                    id="walletAddress"
                    name="walletAddress"
                    value={newCharity.walletAddress}
                    onChange={handleInputChange}
                    className="col-span-3 input-field"
                  />
                </div>
              </div>
              <Button type="submit" onClick={handleAddCharity} className="btn-primary hover-scale">
                Add Charity
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-lg text-muted-foreground transition-colors duration-300">
            Loading charities...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CharityList charities={charities} onSelect={handleCharitySelect}/>
            </div>
            <div className="md:col-span-2">
              {selectedCharity ? (
                <CharityDetails
                  charity={selectedCharity}
                  aiReport={aiReport}
                  setAiReport={setAiReport}
                />
              ) : (
                <p className="text-lg text-muted-foreground transition-colors duration-300">
                  Select a charity to view details.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <footer className="mt-8 text-center text-muted-foreground">
        <p>
          ChainDonation - Donate with Trust &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
