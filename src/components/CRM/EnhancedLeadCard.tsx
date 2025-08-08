
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User,
  Phone,
  Mail,
  Star,
  Eye,
  MessageSquare,
  Activity
} from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  title: string;
  company: string;
  status: string;
  value: number;
  leadScore: number;
  engagementLevel: string;
  lastActivity: string;
  nextSteps: string;
  stage: string;
  progress: number;
  temperature: number;
  confidence: number;
  signals: number;
  currentProvider: string;
}

interface EnhancedLeadCardProps {
  lead: Lead;
  onUpdateStage: (leadId: number, newStage: string) => void;
  onScheduleMeeting: (leadId: number) => void;
}

export const EnhancedLeadCard = ({ lead }: EnhancedLeadCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="bg-card/90 backdrop-blur-sm border hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{lead.name}</CardTitle>
              <CardDescription className="text-sm">
                {lead.title} at {lead.company}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <Badge>
              {lead.status}
            </Badge>
            <div className="text-lg font-bold mt-1">
              ${lead.value.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Lead Score</span>
            </div>
            <span className="font-bold">{lead.leadScore}</span>
          </div>
          <Progress value={lead.leadScore} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button className="text-xs" onClick={() => console.log('Call lead')}>
            <Phone className="h-3 w-3 mr-1" />
            Call
          </Button>
          <Button onClick={() => console.log('Email lead')}>
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
          <Button className="col-span-2">
            <MessageSquare className="h-3 w-3 mr-1" />
            Schedule Meeting
          </Button>
          <Button className="col-span-2">
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
          <Button className="col-span-2">
            <MessageSquare className="h-3 w-3 mr-1" />
            Add Note
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span>Engagement Level</span>
            </div>
            <span className="font-bold">{lead.engagementLevel}</span>
          </div>
          <Progress value={lead.leadScore} className="h-2" />
        </div>
        
        <div className="pt-3 border-t">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm"
          >
            {showDetails ? 'Hide' : 'Show'} Advanced Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
