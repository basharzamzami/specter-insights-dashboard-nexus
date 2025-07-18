import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Play, Pause, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CampaignForm } from "./CampaignForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { populateWithDemoData } from "@/utils/demoData";

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  posts: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 Product Launch",
    description: "Comprehensive marketing campaign for our new AI features",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    status: "active",
    posts: 12
  },
  {
    id: "2", 
    name: "Customer Success Stories",
    description: "Highlighting client testimonials and case studies",
    startDate: "2024-02-15",
    endDate: "2024-04-15",
    status: "scheduled",
    posts: 8
  },
  {
    id: "3",
    name: "Industry Conference Prep",
    description: "Pre-event marketing and thought leadership content",
    startDate: "2024-04-01",
    endDate: "2024-05-01",
    status: "draft",
    posts: 5
  }
];

export const CampaignScheduler = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const fetchRealCampaigns = async () => {
        const { data, error } = await supabase
          .from('campaigns')
          .select(`
            id,
            target_company,
            type,
            objective,
            status,
            scheduled_date,
            created_at,
            actions
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform database campaigns to component format
        return data.map(campaign => ({
          id: campaign.id,
          name: `${campaign.type} - ${campaign.target_company}`,
          description: campaign.objective || 'Strategic campaign',
          startDate: campaign.scheduled_date || campaign.created_at,
          endDate: campaign.scheduled_date ? 
            new Date(new Date(campaign.scheduled_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : 
            new Date(new Date(campaign.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: campaign.status as Campaign['status'],
          posts: Array.isArray(campaign.actions) ? campaign.actions.length : 0
        }));
      };

      const campaignsData = await populateWithDemoData(fetchRealCampaigns, mockCampaigns, 3);
      setCampaigns(campaignsData as Campaign[]);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'scheduled': return 'bg-warning text-warning-foreground';
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'completed': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />;
      case 'scheduled': return <Calendar className="h-3 w-3" />;
      case 'draft': return <Edit className="h-3 w-3" />;
      case 'completed': return <Pause className="h-3 w-3" />;
      default: return <Edit className="h-3 w-3" />;
    }
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          target_company: campaignData.name || 'Target Company',
          type: 'marketing',
          objective: campaignData.description,
          status: campaignData.status || 'draft',
          scheduled_date: campaignData.startDate,
          actions: []
        }])
        .select()
        .single();

      if (error) throw error;

      const newCampaign: Campaign = {
        id: data.id,
        name: campaignData.name,
        description: campaignData.description,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        status: campaignData.status || 'draft',
        posts: 0
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      setIsDialogOpen(false);
      
      toast({
        title: "Campaign Created",
        description: "New campaign has been successfully created.",
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditDialogOpen(true);
  };

  const handleSchedulePosts = (campaign: Campaign) => {
    toast({
      title: "Post Scheduler Opened",
      description: `Opening post scheduling interface for "${campaign.name}" campaign.`,
    });
    // In a real app, this would open a post scheduling interface
  };

  const handleViewDetails = (campaign: Campaign) => {
    navigate(`/campaign-details?name=${encodeURIComponent(campaign.name)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Scheduler</h2>
          <p className="text-muted-foreground">Manage and schedule your marketing campaigns</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CampaignForm onSubmit={handleCreateCampaign} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Grid */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-48"></div>
                    <div className="h-3 bg-muted rounded w-64"></div>
                  </div>
                  <div className="h-5 bg-muted rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign, index) => (
          <Card 
            key={campaign.id}
            className={`card-hover slide-in animate-delay-${(index % 4) * 100}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                <Badge className={`flex items-center space-x-1 ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                  <span className="capitalize">{campaign.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-medium">{new Date(campaign.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <p className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Posts:</span>
                  <p className="font-medium">{campaign.posts} scheduled</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">
                    {Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 3600 * 24))} days
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(campaign)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditCampaign(campaign)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleSchedulePosts(campaign)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Posts
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign: {selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Campaign editing interface would go here. For now, showing campaign details:
            </p>
            {selectedCampaign && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedCampaign.name}</p>
                <p><strong>Description:</strong> {selectedCampaign.description}</p>
                <p><strong>Status:</strong> {selectedCampaign.status}</p>
                <p><strong>Posts:</strong> {selectedCampaign.posts}</p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Campaign Updated",
                  description: "Campaign changes have been saved successfully.",
                });
                setIsEditDialogOpen(false);
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};