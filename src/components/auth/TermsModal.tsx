
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ open, onOpenChange }) => {
  const { acceptTerms } = useAuth();

  const handleAccept = () => {
    acceptTerms();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read and accept our terms of service to continue.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold">1. Acceptance of Terms</h3>
            <p>By accessing and using this Quantum Research and Analysis Management platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h3 className="font-semibold">2. Use License</h3>
            <p>Permission is granted to temporarily access the materials on this platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
            
            <h3 className="font-semibold">3. Disclaimer</h3>
            <p>The materials on this platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            
            <h3 className="font-semibold">4. Limitations</h3>
            <p>In no event shall the platform or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this platform.</p>
            
            <h3 className="font-semibold">5. Privacy Policy</h3>
            <p>Your privacy is important to us. We collect and use your information in accordance with our privacy policy.</p>
            
            <h3 className="font-semibold">6. Subscription Services</h3>
            <p>Premium features require a valid subscription. Free users have access to limited content and features.</p>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Decline
          </Button>
          <Button onClick={handleAccept}>
            Accept Terms
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
