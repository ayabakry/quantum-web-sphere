
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import TermsModal from './TermsModal';

interface ProtectedContentProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ children, requirePremium = false }) => {
  const { isAuthenticated, hasAcceptedTerms, isPremium } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasAcceptedTerms) {
      setShowTermsModal(true);
    }
  }, [isAuthenticated, hasAcceptedTerms]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to access this content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">Login to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAcceptedTerms) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Terms Acceptance Required</CardTitle>
              <CardDescription>
                Please accept our terms of service to continue.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <TermsModal open={showTermsModal} onOpenChange={setShowTermsModal} />
      </>
    );
  }

  if (requirePremium && !isPremium) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Premium Content</CardTitle>
            <CardDescription>
              This content is only available for premium subscribers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
