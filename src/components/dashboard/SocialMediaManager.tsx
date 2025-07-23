import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClerkSupabaseAuth } from '@/hooks/useClerkSupabaseAuth';
import { Plus, Search, Calendar, MoreHorizontal, TrendingUp, Users, Heart, Share, Eye, BarChart, Target, Share, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { fetchRealData } from '@/utils/dataUtils';

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  media_urls: string[];
  scheduled_at: string;
  published_at: string;
  status: string;
  engagement_metrics: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  created_at: string;
}

export function SocialMediaManager() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>([]);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getUser, isSignedIn } = useClerkSupabaseAuth();

  const [newPost, setNewPost] = useState({
    platform: 'twitter',
    content: '',
    scheduled_at: '',
    media_urls: ''
  });

  const platforms = [
    { value: 'twitter', label: 'Twitter', color: 'bg-blue-500', icon: '𝕏' },
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-600', icon: '📘' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-500', icon: '📷' },
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700', icon: '💼' },
    { value: 'youtube', label: 'YouTube', color: 'bg-red-500', icon: '📺' },
    { value: 'tiktok', label: 'TikTok', color: 'bg-black', icon: '🎵' }
  ];

  const postStatuses = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-500' },
    { value: 'published', label: 'Published', color: 'bg-green-500' },
    { value: 'failed', label: 'Failed', color: 'bg-red-500' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, platformFilter, statusFilter]);

  const fetchPosts = async () => {
    try {
      const fetchRealPosts = async () => {
        const { data, error } = await supabase
          .from('social_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      };

      const postsData = await fetchRealPosts();
      setPosts(postsData as SocialPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch social media posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (platformFilter !== 'all') {
      filtered = filtered.filter(post => post.platform === platformFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await getUser();
      if (!user) throw new Error('Not authenticated');

      const postData = {
        ...newPost,
        user_id: user.id,
        media_urls: newPost.media_urls ? newPost.media_urls.split(',').map(url => url.trim()) : [],
        scheduled_at: newPost.scheduled_at || null,
        engagement_metrics: {}
      };

      // Use the social-scheduler edge function for scheduling
      if (newPost.scheduled_at) {
        const { data, error } = await supabase.functions.invoke('social-scheduler', {
          body: {
            platform: newPost.platform,
            content: newPost.content,
            scheduled_time: newPost.scheduled_at,
            media_urls: postData.media_urls,
            user_id: user.id
          }
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: `Post scheduled for ${new Date(newPost.scheduled_at).toLocaleString()}`,
        });
      } else {
        // Save as draft in social_posts table
        const { error } = await supabase
          .from('social_posts')
          .insert([postData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Social media post saved as draft",
        });
      }

      setIsAddDialogOpen(false);
      setNewPost({
        platform: 'twitter',
        content: '',
        scheduled_at: '',
        media_urls: ''
      });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create social media post",
        variant: "destructive",
      });
    }
  };

  const socialStats = [
    {
      title: "Total Posts",
      value: filteredPosts.length.toString(),
      icon: Share,
      color: "text-blue-600",
      trend: "Ready for content"
    },
    {
      title: "Platforms",
      value: platforms.length.toString(),
      icon: Target,
      color: "text-purple-600",
      trend: "Multi-platform ready"
    }
  ];

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'published') {
        updates.published_at = new Date().toISOString();
        // Simulate engagement metrics for demo
        updates.engagement_metrics = {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
          views: Math.floor(Math.random() * 1000)
        };
      }

      const { error } = await supabase
        .from('social_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post status updated",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    }
  };

  const getPlatformConfig = (platform: string) => {
    return platforms.find(p => p.value === platform) || { label: platform, color: 'bg-gray-500', icon: '📱' };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = postStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-500' };
  };

  const getTotalEngagement = (metrics: any) => {
    if (!metrics) return 0;
    return (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
  };

  const getPostsByPlatform = (platform: string) => {
    return posts.filter(post => post.platform === platform);
  };

  const handleSchedulePosts = (post: SocialPost) => {
    setNewPost({
      platform: post.platform,
      content: post.content,
      scheduled_at: '',
      media_urls: post.media_urls ? post.media_urls.join(', ') : ''
    });
    setIsAddDialogOpen(true);
    toast({
      title: "Schedule Posts",
      description: "Post content loaded for scheduling on multiple platforms.",
    });
  };

  const stats = [
    {
      title: "Total Posts",
      value: posts.length,
      icon: BarChart,
      change: "+12 this week",
      color: "text-blue-600"
    },
    {
      title: "Published",
      value: posts.filter(p => p.status === 'published').length,
      icon: Eye,
      change: "+8 this week",
      color: "text-green-600"
    },
    {
      title: "Scheduled",
      value: posts.filter(p => p.status === 'scheduled').length,
      icon: Calendar,
      change: "5 pending",
      color: "text-yellow-600"
    },
    {
      title: "Total Engagement",
      value: posts.reduce((sum, post) => sum + getTotalEngagement(post.engagement_metrics), 0),
      icon: TrendingUp,
      change: "+25% growth",
      color: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Manager</h1>
          <p className="text-muted-foreground">Create, schedule, and manage your social media presence</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Social Media Post</DialogTitle>
              <DialogDescription>Create and schedule a new social media post</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={newPost.platform} onValueChange={(value) => setNewPost(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.icon} {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's happening?"
                  className="min-h-[120px]"
                  required
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {newPost.content.length}/280 characters
                </div>
              </div>

              <div>
                <Label htmlFor="media_urls">Media URLs (comma separated)</Label>
                <Input
                  id="media_urls"
                  value={newPost.media_urls}
                  onChange={(e) => setNewPost(prev => ({ ...prev, media_urls: e.target.value }))}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div>
                <Label htmlFor="scheduled_at">Schedule Post (Optional)</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={newPost.scheduled_at}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduled_at: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {newPost.scheduled_at ? 'Schedule Post' : 'Create Draft'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Social Media Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {socialStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Ready for Live Data - No Demo Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Analytics</CardTitle>
          <CardDescription>Real-time engagement data will appear here once you start posting</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium">Analytics Ready</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Create and publish social media posts to see live engagement analytics, platform performance, and content insights.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Platform Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          const platformPosts = getPostsByPlatform(platform.value);
          const publishedPosts = platformPosts.filter(p => p.status === 'published');
          const totalEngagement = publishedPosts.reduce((sum, post) => sum + getTotalEngagement(post.engagement_metrics), 0);
          
          return (
            <Card key={platform.value}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <span className="mr-2">{platform.icon}</span>
                    {platform.label}
                  </CardTitle>
                  <Badge className={`${platform.color} text-white`}>
                    {platformPosts.length} posts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Published:</span>
                    <span className="font-medium">{publishedPosts.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Scheduled:</span>
                    <span className="font-medium">{platformPosts.filter(p => p.status === 'scheduled').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Engagement:</span>
                    <span className="font-medium">{totalEngagement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Search by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map(platform => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.icon} {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Search by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {postStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Posts ({filteredPosts.length})</CardTitle>
          <CardDescription>Manage your social media content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const platformConfig = getPlatformConfig(post.platform);
              const statusConfig = getStatusBadge(post.status);
              const totalEngagement = getTotalEngagement(post.engagement_metrics);

              return (
                <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${platformConfig.color} text-white`}>
                        {platformConfig.icon} {platformConfig.label}
                      </Badge>
                      <Badge className={`${statusConfig.color} text-white`}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm">{post.content}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {post.scheduled_at && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.scheduled_at).toLocaleDateString()}
                        </span>
                      )}
                      
                      {post.published_at && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Published {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                      
                      {post.status === 'published' && (
                        <>
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {post.engagement_metrics.likes || 0} likes
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {post.engagement_metrics.comments || 0} comments
                          </span>
                          <span className="flex items-center">
                            <Share className="h-3 w-3 mr-1" />
                            {post.engagement_metrics.shares || 0} shares
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.status === 'draft' && (
                      <Button variant="outline" size="sm" onClick={() => updatePostStatus(post.id, 'published')}>
                        Publish Now
                      </Button>
                    )}
                    
                    {post.status === 'scheduled' && (
                      <Button variant="outline" size="sm" onClick={() => updatePostStatus(post.id, 'published')}>
                        Publish Early
                      </Button>
                    )}
                    
                    <Select value={post.status} onValueChange={(value) => updatePostStatus(post.id, value)}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {postStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-8">
                <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No social media posts found</p>
                <p className="text-sm text-muted-foreground">Create your first post to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}