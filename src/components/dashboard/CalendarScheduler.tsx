import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, Clock, MapPin, Video, User, Phone } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  meeting_link: string;
  status: string;
  created_at: string;
  contact?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
  };
}

export function CalendarScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    meeting_link: '',
    contact_id: ''
  });

  const appointmentStatuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-500' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
    { value: 'no_show', label: 'No Show', color: 'bg-orange-500' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsResponse, contactsResponse] = await Promise.all([
        supabase.from('appointments').select(`
          *,
          contact:contacts(first_name, last_name, email, phone, company)
        `).order('start_time', { ascending: true }),
        supabase.from('contacts').select('id, first_name, last_name, email, phone, company').order('first_name')
      ]);

      setAppointments(appointmentsResponse.data || []);
      setContacts(contactsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch calendar data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const appointmentData = {
        ...newAppointment,
        user_id: user.id,
        contact_id: newAppointment.contact_id || null
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });

      setIsAddDialogOpen(false);
      setNewAppointment({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        meeting_link: '',
        contact_id: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment status updated",
      });
      fetchData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = appointmentStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-500' };
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(app => 
      new Date(app.start_time).toDateString() === new Date(date).toDateString()
    );
  };

  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(app => 
      new Date(app.start_time).toDateString() === today
    );
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(app => 
      new Date(app.start_time) > now
    ).slice(0, 5);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const stats = [
    {
      title: "Today's Appointments",
      value: getTodayAppointments().length,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "This Week",
      value: appointments.filter(app => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const appDate = new Date(app.start_time);
        return appDate >= weekStart && appDate <= weekEnd;
      }).length,
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Confirmed",
      value: appointments.filter(app => app.status === 'confirmed').length,
      icon: User,
      color: "text-purple-600"
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: Calendar,
      color: "text-orange-600"
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
          <h1 className="text-3xl font-bold tracking-tight">Calendar & Scheduling</h1>
          <p className="text-muted-foreground">Manage appointments and meetings</p>
        </div>
        <div className="flex space-x-2">
          <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Create a new appointment or meeting</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div>
                  <Label htmlFor="title">Appointment Title</Label>
                  <Input
                    id="title"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Sales Discovery Call"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAppointment.description}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Meeting agenda and notes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      value={newAppointment.start_time}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, start_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={newAppointment.end_time}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, end_time: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newAppointment.location}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Office, Address, or 'Remote'"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meeting_link">Meeting Link</Label>
                    <Input
                      id="meeting_link"
                      value={newAppointment.meeting_link}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, meeting_link: e.target.value }))}
                      placeholder="Zoom, Teams, or Meet link"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact_id">Contact</Label>
                  <Select value={newAppointment.contact_id} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, contact_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No contact</SelectItem>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name} ({contact.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Appointment</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Calendar View */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Calendar View</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() - (viewMode === 'day' ? 1 : 7));
                    setSelectedDate(date.toISOString().split('T')[0]);
                  }}>
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric',
                      ...(viewMode === 'day' && { day: 'numeric' })
                    })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() + (viewMode === 'day' ? 1 : 7));
                    setSelectedDate(date.toISOString().split('T')[0]);
                  }}>
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'week' && (
                <div className="space-y-4">
                  {getWeekDays().map((day, index) => {
                    const dayAppointments = getAppointmentsForDate(day.toISOString());
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">
                            {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </h3>
                          <Badge variant="secondary">{dayAppointments.length} appointments</Badge>
                        </div>
                        <div className="space-y-2">
                          {dayAppointments.map((appointment) => {
                            const statusConfig = getStatusBadge(appointment.status);
                            return (
                              <div key={appointment.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{appointment.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                  </p>
                                </div>
                                <Badge className={`${statusConfig.color} text-white`}>
                                  {statusConfig.label}
                                </Badge>
                              </div>
                            );
                          })}
                          {dayAppointments.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">No appointments</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next 5 scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUpcomingAppointments().map((appointment) => {
                  const statusConfig = getStatusBadge(appointment.status);
                  return (
                    <div key={appointment.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{appointment.title}</h4>
                        <Badge className={`${statusConfig.color} text-white`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(appointment.start_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </div>
                        
                        {appointment.contact && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {appointment.contact.first_name} {appointment.contact.last_name}
                          </div>
                        )}
                        
                        {appointment.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {appointment.location}
                          </div>
                        )}
                        
                        {appointment.meeting_link && (
                          <div className="flex items-center">
                            <Video className="h-3 w-3 mr-1" />
                            Meeting Link
                          </div>
                        )}
                      </div>

                      <Select value={appointment.status} onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {appointmentStatuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
                
                {getUpcomingAppointments().length === 0 && (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}