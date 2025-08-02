import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampaignFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'scheduled' | 'active';
}

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
}

export const CampaignForm = ({ onSubmit }: CampaignFormProps) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'draft'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.description.trim() !== '';
      case 3:
        return formData.startDate !== '' && formData.endDate !== '';
      default:
        return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center space-x-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step === currentStep
                ? 'bg-primary text-primary-foreground shadow-glow'
                : step < currentStep
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Name */}
      {currentStep === 1 && (
        <div className="space-y-4 slide-in">
          <div>
            <Label htmlFor="name" className="text-base font-medium">Campaign Name</Label>
            <p className="text-sm text-muted-foreground mb-2">Give your campaign a memorable name</p>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Q1 Product Launch"
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Step 2: Description */}
      {currentStep === 2 && (
        <div className="space-y-4 slide-in">
          <div>
            <Label htmlFor="description" className="text-base font-medium">Campaign Description</Label>
            <p className="text-sm text-muted-foreground mb-2">Describe the goals and scope of this campaign</p>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of campaign objectives and target audience..."
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>
      )}

      {/* Step 3: Schedule & Status */}
      {currentStep === 3 && (
        <div className="space-y-4 slide-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-base font-medium">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-base font-medium">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="mt-1"
                min={formData.startDate}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status" className="text-base font-medium">Initial Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className="btn-glow"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!canProceed()}
            className="btn-glow"
          >
            Create Campaign
          </Button>
        )}
      </div>
    </form>
  );
};