import React, {useState, useEffect} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {toast} from "@/hooks/use-toast";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {Textarea} from "@/components/ui/textarea";

interface Charity {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
}

interface CharityDetailsProps {
  charity: Charity;
  aiReport: any;
  setAiReport: (report: any) => void;
}

export const CharityDetails: React.FC<CharityDetailsProps> = ({
                                                                charity,
                                                                aiReport,
                                                                setAiReport
                                                              }) => {
  const [walletAddress, setWalletAddress] = useState(charity.walletAddress);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    setWalletAddress(charity.walletAddress);
    setAddressError(null);
  }, [charity.walletAddress]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWalletAddress(e.target.value);
    setAddressError(null);
  };

  const handleCopyAddress = () => {
    try {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the address manually!",
      });
    }
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    setReportError(null);
    try {
      const report = await monitorCharityTrustworthiness({
        charityName: charity.name,
        charityDescription: charity.description,
      });
      setAiReport(report);
    } catch (e: any) {
      setReportError("Failed to generate AI report: " + e.message);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{charity.name}</CardTitle>
          <CardDescription>{charity.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Donate to:</h3>
            {walletAddress ? (
              <QRCodeCanvas value={walletAddress} size={128} level="H"/>
            ) : (
              <p>No wallet address available.</p>
            )}
            <Textarea
              value={walletAddress}
              onChange={handleAddressChange}
              className="w-full mt-2"
              placeholder="Wallet Address"
            />
            {addressError && (
              <p className="text-red-500 mt-1">{addressError}</p>
            )}
            <Button variant="secondary" onClick={handleCopyAddress}>
              <Icons.copy className="w-4 h-4 mr-2"/>
              Copy Address
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">AI Trustworthiness Report</h3>
            <Button onClick={handleGenerateReport} disabled={loadingReport}>
              {loadingReport ? 'Generating...' : 'Generate Report'}
            </Button>

            {reportError && (
              <Alert variant="destructive">
                <AlertTitle>Report Error</AlertTitle>
                <AlertDescription>{reportError}</AlertDescription>
              </Alert>
            )}

            {aiReport ? (
              <div className="mt-4">
                <h4 className="font-semibold">Report:</h4>
                <p>{aiReport.report}</p>
                {aiReport.concerns.length > 0 && (
                  <div>
                    <h4 className="font-semibold mt-2">Concerns:</h4>
                    <ul>
                      {aiReport.concerns.map((concern, index) => (
                        <li key={index}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>No report generated. Click "Generate Report" to create one.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
