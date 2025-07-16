// Demo data population utility
export const populateWithDemoData = async (
  fetchFn: () => Promise<any[]>,
  demoData: any[],
  minCount = 5
): Promise<any[]> => {
  const realData = await fetchFn();
  
  // If we have enough real data, use it
  if (realData && realData.length >= minCount) {
    return realData;
  }
  
  // Otherwise, mix real data with demo data
  const combined = [...(realData || [])];
  const needed = Math.max(0, minCount - combined.length);
  
  // Add demo data to reach minimum count
  for (let i = 0; i < needed && i < demoData.length; i++) {
    combined.push({
      ...demoData[i],
      id: `demo-${i}`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return combined;
};

// Demo task data
export const demoTasks = [
  {
    title: "Follow up with TechCorp prospect",
    description: "Schedule demo call with their engineering team",
    priority: "high",
    status: "pending",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: "demo"
  },
  {
    title: "Analyze competitor pricing strategy", 
    description: "Research DataSolutions' new pricing model",
    priority: "medium",
    status: "in_progress",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: "demo"
  },
  {
    title: "Prepare Q3 sales presentation",
    description: "Create compelling slides for quarterly review",
    priority: "high",
    status: "completed",
    completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: "demo"
  },
  {
    title: "Update CRM with latest leads",
    description: "Import and categorize new prospect data",
    priority: "low",
    status: "pending",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: "demo"
  }
];

// Demo social posts
export const demoSocialPosts = [
  {
    platform: "linkedin",
    content: "Excited to announce our latest AI-powered analytics feature! 🚀 #Innovation #Analytics",
    status: "published",
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    engagement_metrics: { likes: 45, comments: 8, shares: 12, views: 234 },
    user_id: "demo"
  },
  {
    platform: "twitter", 
    content: "The future of business intelligence is here. See how we're revolutionizing data analytics.",
    status: "scheduled",
    scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    engagement_metrics: {},
    user_id: "demo"
  },
  {
    platform: "facebook",
    content: "Join us for an exclusive webinar on competitive intelligence strategies.",
    status: "draft",
    engagement_metrics: {},
    user_id: "demo"
  }
];

// Demo appointments
export const demoAppointments = [
  {
    title: "Sales Discovery Call",
    description: "Initial discussion with CloudInnovate prospect",
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    location: "Video Call",
    meeting_link: "https://zoom.us/j/example",
    status: "scheduled",
    user_id: "demo"
  },
  {
    title: "Product Demo",
    description: "Showcase our latest features to enterprise client",
    start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 48 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    location: "Conference Room A",
    status: "confirmed",
    user_id: "demo"
  },
  {
    title: "Weekly Team Standup",
    description: "Review progress and plan upcoming sprints",
    start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    location: "Office",
    status: "scheduled",
    user_id: "demo"
  }
];

// Demo email campaigns
export const demoEmailCampaigns = [
  {
    name: "Q3 Product Launch",
    subject: "Introducing Revolutionary AI Analytics",
    content: "Dear valued customer, we're excited to announce...",
    status: "sent",
    sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    recipient_count: 1250,
    opened_count: 386,
    clicked_count: 89,
    user_id: "demo"
  },
  {
    name: "Competitive Intelligence Newsletter",
    subject: "Weekly Market Insights & Competitor Analysis",
    content: "This week in competitive intelligence...",
    status: "scheduled",
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    recipient_count: 850,
    user_id: "demo"
  },
  {
    name: "Customer Success Stories",
    subject: "How Our Clients Are Winning",
    content: "See how industry leaders are using our platform...",
    status: "draft",
    recipient_count: 0,
    user_id: "demo"
  }
];
