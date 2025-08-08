
/**
 * 🎯 ENHANCED LEAD CARD
 * 
 * Advanced lead management card with competitive intelligence, behavioral analysis,
 * and AI-powered recommendations for maximum conversion potential
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Target,
  Eye,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';

interface ThreatScore {
  readonly score: number;
  readonly factors: readonly string[];
  readonly competitorActivity: number;
  readonly localSEOMomentum: number;
  readonly urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface BehaviorIntel {
  readonly lastSeen: string;
  readonly lastActivity: string;
  readonly source: string;
  readonly pagesVisited: readonly string[];
  readonly timeOnSite: number;
  readonly emailOpens: number;
  readonly adClicks: number;
  readonly sentimentScore: number;
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

interface Lead {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly company?: string;
  readonly location: string;
  readonly zipCode: string;
  readonly stage: string;
  readonly source: string;
  readonly createdAt: string;
  readonly threatScore: ThreatScore;
  readonly behaviorIntel: BehaviorIntel;
  readonly competitorContext: CompetitorContext;
  readonly predictedValue: PredictedValue;
  readonly nextAction: string;
  readonly priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface EnhancedLeadCardProps {
  readonly lead: Lead;
  readonly onUpdateStage: (leadId: string, stage: string) => void;
  readonly onScheduleFollowUp: (leadId: string) => void;
  readonly onViewFullIntel: (leadId: string) => void;
}

export function EnhancedLeadCard({ lead, onUpdateStage, onScheduleFollowUp, onViewFullIntel }: EnhancedLeadCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${getPriorityColor(lead.priority)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {lead.name}
              {lead.company && <span className="text-sm font-normal text-muted-foreground">• {lead.company}</span>}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lead.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatTimeAgo(lead.createdAt)}
                </span>
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">{lead.stage.toUpperCase()}</Badge>
            <Badge className={`${getThreatColor(lead.threatScore.urgencyLevel)} bg-opacity-10`}>
              THREAT: {lead.threatScore.score}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              ${lead.predictedValue.estimatedValue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Est. Value</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {lead.predictedValue.conversionProbability}%
            </div>
            <div className="text-xs text-muted-foreground">Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {lead.behaviorIntel.sentimentScore}%
            </div>
            <div className="text-xs text-muted-foreground">Intent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {lead.competitorContext.nearbyCompetitors}
            </div>
            <div className="text-xs text-muted-foreground">Competitors</div>
          </div>
        </div>

        {/* Threat Assessment */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-900">Competitive Threat Analysis</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Threat Score</span>
              <span className="font-bold text-red-600">{lead.threatScore.score}%</span>
            </div>
            <Progress value={lead.threatScore.score} className="h-2" />
            <div className="text-xs text-red-700">
              <strong>Key Factors:</strong> {lead.threatScore.factors.slice(0, 2).join(', ')}
              {lead.threatScore.factors.length > 2 && '...'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => window.location.href = `tel:${lead.phone}`} className="bg-green-600 hover:bg-green-700">
            <Phone className="h-4 w-4 mr-1" />
            Call Now
          </Button>
          <Button onClick={() => onScheduleFollowUp(lead.id)} className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
          <Button 
            onClick={() => setExpanded(!expanded)} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="h-4 w-4 mr-1" />
            {expanded ? 'Hide' : 'Show'} Intel
          </Button>
          <Button 
            onClick={() => onViewFullIntel(lead.id)} 
            className="bg-gray-600 hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            Full Report
          </Button>
          <Button 
            onClick={() => window.location.href = `mailto:${lead.email}`} 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
        </div>

        {/* Expanded Intelligence */}
        {expanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Behavioral Intelligence */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Behavioral Intelligence
              </h4>
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Last Activity:</strong> {lead.behaviorIntel.lastActivity}
                  </div>
                  <div>
                    <strong>Source:</strong> {lead.behaviorIntel.source}
                  </div>
                  <div>
                    <strong>Time on Site:</strong> {Math.floor(lead.behaviorIntel.timeOnSite / 60)}m {lead.behaviorIntel.timeOnSite % 60}s
                  </div>
                  <div>
                    <strong>Email Opens:</strong> {lead.behaviorIntel.emailOpens}
                  </div>
                </div>
                <div>
                  <strong className="text-sm">Intent Signals:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lead.behaviorIntel.intentSignals.map((signal, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">{signal}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Action */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Recommended Next Action</span>
              </div>
              <div className="text-sm text-green-800">{lead.nextAction}</div>
            </div>

            {/* Competitive Context */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                Market Context
              </h4>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <strong>Market Saturation:</strong> {lead.competitorContext.marketSaturation}%
                  </div>
                  <div>
                    <strong>Avg. Service Price:</strong> ${lead.competitorContext.averageServicePrice}
                  </div>
                </div>
                {lead.competitorContext.recentCompetitorActivity.length > 0 && (
                  <div>
                    <strong className="text-sm">Recent Activity:</strong>
                    <ul className="text-xs mt-1 space-y-1">
                      {lead.competitorContext.recentCompetitorActivity.slice(0, 2).map((activity, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Value Prediction */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Value Prediction
              </h4>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Confidence Level</span>
                  <span className="font-bold text-green-600">{lead.predictedValue.confidence}%</span>
                </div>
                <Progress value={lead.predictedValue.confidence} className="h-2 mb-2" />
                <div className="text-xs text-green-700">
                  <strong>Based on:</strong> {lead.predictedValue.basedOnFactors.slice(0, 2).join(', ')}
                  {lead.predictedValue.basedOnFactors.length > 2 && '...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedLeadCard;
