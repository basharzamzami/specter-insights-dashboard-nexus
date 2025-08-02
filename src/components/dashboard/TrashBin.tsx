import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useClerkSupabaseAuth } from '@/hooks/useClerkSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { restoreRecord, permanentDeleteRecord, SOFT_DELETE_TABLES } from '@/utils/softDelete';
import { Trash2, RotateCcw, AlertTriangle, Archive, Timer } from 'lucide-react';
import { format } from 'date-fns';

interface DeletedItem {
  id: string;
  name?: string;
  title?: string;
  subject?: string;
  deleted_at: string;
  table: string;
  type: string;
}

export function TrashBin() {
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { getUser } = useClerkSupabaseAuth();

  const itemTypes = [
    { value: 'all', label: 'All Items', icon: Archive },
    { value: 'contacts', label: 'Contacts', icon: Archive },
    { value: 'campaigns', label: 'Campaigns', icon: Archive },
    { value: 'deals', label: 'Deals', icon: Archive },
    { value: 'tasks', label: 'Tasks', icon: Archive },
    { value: 'email_campaigns', label: 'Email Campaigns', icon: Archive },
  ];

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const fetchDeletedItems = async () => {
    try {
      const { data: { user } } = await getUser();
      if (!user) throw new Error('User not authenticated');

      const allDeletedItems: DeletedItem[] = [];

      // Fetch deleted items from each table
      for (const [tableKey, tableName] of Object.entries(SOFT_DELETE_TABLES)) {
        try {
          const { data, error } = await supabase
            .from(tableName as any)
            .select('*')
            .not('deleted_at', 'is', null)
            .eq('user_id', user.id)
            .order('deleted_at', { ascending: false });

          if (!error && data) {
            const itemsWithType = data.map((item: any) => ({
              ...item,
              table: tableName,
              type: tableKey,
              name: item.name || item.title || item.subject || item.first_name + ' ' + item.last_name || 'Unnamed Item'
            }));
            allDeletedItems.push(...itemsWithType);
          }
        } catch (tableError) {
          console.log(`No data found in ${tableName}:`, tableError);
        }
      }

      // Sort all items by deletion date
      allDeletedItems.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
      setDeletedItems(allDeletedItems);
    } catch (error) {
      console.error('Error fetching deleted items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deleted items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item: DeletedItem) => {
    try {
      const { data: { user } } = await getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await restoreRecord(item.table, item.id, user.id);
      
      if (error) throw error;

      toast({
        title: "Item Restored",
        description: `"${item.name}" has been restored successfully`,
      });

      await fetchDeletedItems();
    } catch (error) {
      console.error('Error restoring item:', error);
      toast({
        title: "Error",
        description: "Failed to restore item",
        variant: "destructive",
      });
    }
  };

  const handlePermanentDelete = async (item: DeletedItem) => {
    try {
      const { data: { user } } = await getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await permanentDeleteRecord(item.table, item.id, user.id);
      
      if (error) throw error;

      toast({
        title: "Item Permanently Deleted",
        description: `"${item.name}" has been permanently deleted`,
      });

      await fetchDeletedItems();
    } catch (error) {
      console.error('Error permanently deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to permanently delete item",
        variant: "destructive",
      });
    }
  };

  const filteredItems = activeTab === 'all' 
    ? deletedItems 
    : deletedItems.filter(item => item.type === activeTab);

  const getTypeColor = (type: string) => {
    const colors = {
      contacts: 'bg-blue-500',
      campaigns: 'bg-green-500',
      deals: 'bg-purple-500',
      tasks: 'bg-orange-500',
      email_campaigns: 'bg-pink-500',
      competitor_profiles: 'bg-red-500',
      personas: 'bg-indigo-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

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
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Trash2 className="mr-3 h-8 w-8" />
            Trash Bin
          </h1>
          <p className="text-muted-foreground">Restore or permanently delete items</p>
        </div>
        <div className="flex items-center space-x-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredItems.length} deleted item{filteredItems.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          {itemTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Archive className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No deleted items</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'all' 
                    ? "Your trash bin is empty. Deleted items will appear here."
                    : `No deleted ${activeTab} found.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card key={`${item.table}-${item.id}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Trash2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`${getTypeColor(item.type)} text-white`}>
                              {item.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Deleted {format(new Date(item.deleted_at), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(item)}
                          className="hover:bg-green-50 hover:border-green-200"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Forever
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                                Permanently Delete Item
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to permanently delete "{item.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button variant="outline">Cancel</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handlePermanentDelete(item)}
                              >
                                Delete Forever
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}