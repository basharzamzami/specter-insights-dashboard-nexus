/**
 * 🔥 ENHANCED LEAD CARD - COMPETITIVE INTELLIGENCE INTEGRATED
 * 
 * Each lead card shows real-time competitive intelligence, threat scores,
 * and AI-powered insights for maximum conversion potential
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Target,
  Eye,
  Phone,
  Mail,
  Calendar,
  Flame,
  Shield,
  Brain,
  Zap
} from 'lucide-react';

interface LeadThreatScore {
  readonly score: number; // 0-100
  readonly factors: readonly string[];
  readonly competitorActivity: number;
  readonly localSEOMomentum: number;
  readonly urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface LeadBehaviorIntel {
  readonly lastSeen: string;
  readonly lastActivity: string;
  readonly source: string;
  readonly pagesVisited: readonly string[];
  readonly timeOnSite: number;
  readonly emailOpens: number;
  readonly adClicks: number;
  readonly sentimentScore: number; // 0-100
  readonly intentSignals: readonly string[];
}

interface CompetitorContext {
  readonly nearbyCompetitors: number;
  readonly averageServicePrice: number;
  readonly marketSaturation: number;
  readonly recentCompetitorActivity: readonly string[];
}

interface PredictedValue {
  readonly estimatedValue: number;
  readonly confidence: number;
  readonly basedOnFactors: readonly string[];
  readonly similarDealsInArea: number;
  readonly conversionProbability: number;
}

interface EnhancedLead {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly company?: string;
  readonly location: string;
  readonly zipCode: string;
  readonly stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  readonly source: string;
  readonly createdAt: string;
  readonly threatScore: LeadThreatScore;
  readonly behaviorIntel: LeadBehaviorIntel;
  readonly competitorContext: CompetitorContext;
  readonly predictedValue: PredictedValue;
  readonly nextAction: string;
  readonly priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface EnhancedLeadCardProps {
  readonly lead: EnhancedLead;
  readonly onUpdateStage: (leadId: string, stage: string) => void;
  readonly onScheduleFollowUp: (leadId: string) => void;
  readonly onViewFullIntel: (leadId: string) => void;
}

export function EnhancedLeadCard({ lead, onUpdateStage, onScheduleFollowUp, onViewFullIntel }: EnhancedLeadCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getThreatColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
      lead.priority === 'urgent' ? 'border-2 border-red-500 shadow-red-100' : ''
    }`}>
      {/* Priority Indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(lead.priority)}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              {lead.name}
              {lead.priority === 'urgent' && <Flame className="h-4 w-4 text-red-500 animate-pulse" />}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {lead.location} ({lead.zipCode})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStageColor(lead.stage)}>
              {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
            </Badge>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ${(lead.predictedValue.estimatedValue / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-muted-foreground">
                {lead.predictedValue.confidence}% confidence
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Threat Score Alert */}
        <div className={`p-3 rounded-lg border ${getThreatColor(lead.threatScore.urgencyLevel)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">Threat Level: {lead.threatScore.urgencyLevel.toUpperCase()}</span>
            </div>
            <Badge variant="outline">{lead.threatScore.score}/100</Badge>
          </div>
          <div className="text-xs">
            {lead.threatScore.competitorActivity} competitors active • {lead.threatScore.localSEOMomentum}% SEO momentum
          </div>
        </div>

        {/* Last Seen Intelligence */}
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Last Seen</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{lead.behaviorIntel.lastActivity}</div>
            <div className="text-xs text-muted-foreground">{lead.behaviorIntel.lastSeen}</div>
          </div>
        </div>

        {/* Behavior Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold">{lead.behaviorIntel.emailOpens}</div>
            <div className="text-xs text-muted-foreground">Email Opens</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold">{Math.round(lead.behaviorIntel.timeOnSite / 60)}m</div>
            <div className="text-xs text-muted-foreground">Time on Site</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold">{lead.behaviorIntel.sentimentScore}%</div>
            <div className="text-xs text-muted-foreground">Intent Score</div>
          </div>
        </div>

        {/* Competitive Context */}
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-sm text-orange-800">Market Context</span>
          </div>
          <div className="text-xs text-orange-700">
            {lead.competitorContext.nearbyCompetitors} competitors in area • 
            Avg price: ${lead.competitorContext.averageServicePrice} • 
            {lead.competitorContext.marketSaturation}% market saturation
          </div>
        </div>

        {/* AI Recommended Action */}
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm text-purple-800">AI Recommendation</span>
          </div>
          <div className="text-sm text-purple-700">{lead.nextAction}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => onScheduleFollowUp(lead.id)}>
            <Calendar className="h-4 w-4 mr-1" />
            Follow Up
          </Button>
          <Button size="sm" variant="outline" onClick={() => onViewFullIntel(lead.id)}>
            <Shield className="h-4 w-4 mr-1" />
            Full Intel
          </Button>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Zap className="h-4 w-4 mr-1" />
            Auto-Sequence
          </Button>
        </div>

        {/* Expandable Details */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <div className="text-sm font-medium mb-1">Intent Signals</div>
              <div className="flex flex-wrap gap-1">
                {lead.behaviorIntel.intentSignals.map((signal, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {signal}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1">Recent Competitor Activity</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {lead.competitorContext.recentCompetitorActivity.map((activity, idx) => (
                  <li key={idx}>• {activity}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Value Prediction Factors</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {lead.predictedValue.basedOnFactors.map((factor, idx) => (
                  <li key={idx}>• {factor}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More Intelligence'}
        </Button>
      </CardContent>
    </Card>
  );
}
