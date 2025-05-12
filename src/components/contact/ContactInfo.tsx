
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
        <CardDescription>
          We're here to help with any questions about quantum research and analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-sm text-muted-foreground mt-1">info@qram-research.com</p>
            <p className="text-sm text-muted-foreground">support@qram-research.com</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-sm text-muted-foreground mt-1">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground">Mon-Fri from 9am to 5pm</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium">Live Chat</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Our support team is available for live chat during business hours.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
