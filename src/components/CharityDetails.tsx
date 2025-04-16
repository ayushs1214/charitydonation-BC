
import React, {useState, useEffect, useCallback} from 'react';
import {QRCodeCanvas} from 'qrcode.react';
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
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {monitorCharityTrustworthiness} from "@/ai/flows/monitor-charity-flow";

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
    setReportError(null);
  }, [charity.walletAddress]);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWalletAddress(e.target.value);
    setAddressError(null);
  }, []);

  const handleCopyAddress = useCallback(() => {
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
  }, [walletAddress]);

  const handleGenerateReport = useCallback(async () => {
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
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: "Failed to generate AI report: " + e.message,
      });
    } finally {
      setLoadingReport(false);
    }
  }, [charity.name, charity.description, setAiReport]);

  return (
    <div className="transition-colors duration-300">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{charity.name}</CardTitle>
          <CardDescription className="text-muted-foreground">{charity.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-secondary transition-colors duration-300">
              Donate to:
            </h3>
            {walletAddress ? (
              <QRCodeCanvas value={walletAddress} size={128} level="H"/>
            ) : (
              <p className="text-muted-foreground">No wallet address available.</p>
            )}
            <Textarea
              value={walletAddress}
              onChange={handleAddressChange}
              className="w-full mt-2 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors duration-300"
              placeholder="Wallet Address"
            />
            {addressError && (
              <p className="text-red-500 mt-1">{addressError}</p>
            )}
            <Button variant="secondary" onClick={handleCopyAddress} className="mt-2">
              <Icons.copy className="w-4 h-4 mr-2"/>
              Copy Address
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-secondary transition-colors duration-300">
              AI Trustworthiness Report
            </h3>
            <Button
              onClick={handleGenerateReport}
              disabled={loadingReport}
              className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors duration-300"
            >
              {loadingReport ? 'Generating...' : 'Generate Report'}
            </Button>

            {reportError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Report Error</AlertTitle>
                <AlertDescription>{reportError}</AlertDescription>
              </Alert>
            )}

            {aiReport ? (
              <div className="mt-4">
                <h4 className="font-semibold text-secondary transition-colors duration-300">
                  Report:
                </h4>
                <p className="text-muted-foreground">{aiReport.report}</p>
                {aiReport.concerns.length > 0 && (
                  <div>
                    <h4 className="font-semibold mt-2 text-secondary transition-colors duration-300">
                      Concerns:
                    </h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {aiReport.concerns.map((concern, index) => (
                        <li key={index}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No report generated. Click "Generate Report" to create one.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
