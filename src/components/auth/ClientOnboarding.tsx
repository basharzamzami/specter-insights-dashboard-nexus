import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Building, Target, Zap, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientData {
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zipcode: string;
  businessGoals: string;
  painPoints: string;
}

export const ClientOnboarding = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientData>({
    businessName: '',
    industry: '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',
    city: '',
    state: '',
    zipcode: '',
    businessGoals: '',
    painPoints: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Professional Services', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      console.error('No user ID found:', user);
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!clientData.businessName || !clientData.industry || !clientData.email || 
        !clientData.city || !clientData.state || !clientData.zipcode || !clientData.businessGoals) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting onboarding for user:', user.id);

    try {
      // Debug: Log the data being inserted
      const insertData = {
        user_id: user.id,
        business_name: clientData.businessName,
        industry: clientData.industry,
        email: clientData.email,
        phone: clientData.phone || null,
        city: clientData.city,
        state: clientData.state,
        zipcode: clientData.zipcode,
        business_goals: clientData.businessGoals,
        pain_points: clientData.painPoints || null
      };
      
      console.log('Inserting client data:', insertData);

      // Save client data to Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully created client record:', data);

      toast({
        title: "Welcome to Specter Net™",
        description: "Your elite intelligence platform is now being configured for your business.",
      });

      // Trigger background data collection process
      console.log('Starting background competitor scanning for:', clientData.industry, clientData.city, clientData.state);

      // Redirect to user-specific dashboard after successful onboarding
      setTimeout(() => {
        navigate(`/dashboard/${user.id}`);
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      toast({
        title: "Onboarding Error",
        description: `${errorMessage}. Please try again or contact support.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Specter Net™
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Configure your elite competitive intelligence platform
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Business Information</h3>
                </div>
                
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={clientData.businessName}
                    onChange={(e) => setClientData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Company Name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={clientData.industry} onValueChange={(value) => setClientData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@company.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Location & Goals</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={clientData.city}
                      onChange={(e) => setClientData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={clientData.state}
                      onChange={(e) => setClientData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="NY"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zipcode">Zipcode *</Label>
                  <Input
                    id="zipcode"
                    value={clientData.zipcode}
                    onChange={(e) => setClientData(prev => ({ ...prev, zipcode: e.target.value }))}
                    placeholder="10001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="businessGoals">Business Goals *</Label>
                  <Textarea
                    id="businessGoals"
                    value={clientData.businessGoals}
                    onChange={(e) => setClientData(prev => ({ ...prev, businessGoals: e.target.value }))}
                    placeholder="Describe your competitive intelligence goals, target markets, and key competitors you want to monitor..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pain Points Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold">Current Business Challenges</h3>
              </div>
              
              <div>
                <Label htmlFor="painPoints">What are your biggest business struggles or pain points? *</Label>
                <Textarea
                  id="painPoints"
                  value={clientData.painPoints}
                  onChange={(e) => setClientData(prev => ({ ...prev, painPoints: e.target.value }))}
                  placeholder="Describe the main challenges your business is facing, what keeps you up at night, and what you're hoping our intelligence platform will help you overcome..."
                  className="min-h-[140px]"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This helps us tailor our competitive intelligence to address your specific challenges.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 py-3 btn-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Zap className="h-5 w-5 mr-2 animate-spin" />
                    Configuring Platform...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Launch Specter Net™
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
