import { useState } from "react";
import { User, Mail, Badge as BadgeIcon, Edit3, Save, X, Camera, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AgentProfileProps {
  user: any;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  bio: string;
  signatureStyle: string;
  toneNote: string;
  avatar: string;
  persona: string;
}

export const AgentProfile = ({ user }: AgentProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    title: "Strategic Intelligence Agent",
    bio: "Specialized in competitive analysis and market disruption strategies.",
    signatureStyle: "Professional & Analytical",
    toneNote: "Direct, data-driven communication with strategic insights",
    avatar: user?.imageUrl || "",
    persona: "analyst"
  });

  const [tempData, setTempData] = useState(profileData);

  const personas = [
    { value: "analyst", label: "Market Analyst", description: "Data-driven, analytical approach" },
    { value: "ex-employee", label: "Ex-Employee", description: "Insider knowledge, critical perspective" },
    { value: "customer", label: "Concerned Customer", description: "User experience focused, emotional" },
    { value: "competitor", label: "Industry Expert", description: "Technical expertise, authoritative" }
  ];

  const signatureStyles = [
    "Professional & Analytical",
    "Casual & Friendly", 
    "Authoritative & Direct",
    "Empathetic & Understanding",
    "Technical & Detailed"
  ];

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your agent profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const getPersonaInfo = (persona: string) => {
    return personas.find(p => p.value === persona) || personas[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Profile</h2>
          <p className="text-muted-foreground">Configure your digital identity and communication style</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="btn-glow">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="btn-glow">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>
              Your basic profile information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={isEditing ? tempData.avatar : profileData.avatar} />
                  <AvatarFallback className="text-lg">
                    {(isEditing ? tempData.firstName : profileData.firstName)?.[0]}
                    {(isEditing ? tempData.lastName : profileData.lastName)?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    placeholder="Avatar URL"
                    value={tempData.avatar}
                    onChange={(e) => handleInputChange("avatar", e.target.value)}
                  />
                ) : (
                  <div>
                    <p className="font-medium">Profile Picture</p>
                    <p className="text-sm text-muted-foreground">Upload or link your agent avatar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={tempData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="p-2 bg-muted/30 rounded-md">{profileData.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={tempData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="p-2 bg-muted/30 rounded-md">{profileData.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={tempData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              ) : (
                <p className="p-2 bg-muted/30 rounded-md flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.email}</span>
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={tempData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter professional title"
                />
              ) : (
                <p className="p-2 bg-muted/30 rounded-md flex items-center space-x-2">
                  <BadgeIcon className="h-4 w-4" />
                  <span>{profileData.title}</span>
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={tempData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Brief description of your expertise"
                  className="min-h-[80px]"
                />
              ) : (
                <p className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed">
                  {profileData.bio}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent Configuration */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Agent Configuration</span>
            </CardTitle>
            <CardDescription>
              Define your digital persona and communication style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Persona Type */}
            <div className="space-y-3">
              <Label>Persona Type</Label>
              {isEditing ? (
                <Select 
                  value={tempData.persona} 
                  onValueChange={(value) => handleInputChange("persona", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.value} value={persona.value}>
                        <div>
                          <p className="font-medium">{persona.label}</p>
                          <p className="text-xs text-muted-foreground">{persona.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md">
                  <Badge className="mb-2">{getPersonaInfo(profileData.persona).label}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {getPersonaInfo(profileData.persona).description}
                  </p>
                </div>
              )}
            </div>

            {/* Signature Style */}
            <div className="space-y-3">
              <Label>Signature Style</Label>
              {isEditing ? (
                <Select 
                  value={tempData.signatureStyle} 
                  onValueChange={(value) => handleInputChange("signatureStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {signatureStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="p-2 bg-muted/30 rounded-md text-sm">
                  {profileData.signatureStyle}
                </p>
              )}
            </div>

            {/* Tone Note */}
            <div className="space-y-3">
              <Label>Communication Tone</Label>
              {isEditing ? (
                <Textarea
                  value={tempData.toneNote}
                  onChange={(e) => handleInputChange("toneNote", e.target.value)}
                  placeholder="Describe your preferred communication style..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed">
                  {profileData.toneNote}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Association */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Campaign Associations</CardTitle>
          <CardDescription>
            Campaigns and clients where this agent profile is active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Q1 Product Launch", "Competitor Analysis", "Market Research"].map((campaign, index) => (
              <div 
                key={campaign}
                className={`p-4 bg-muted/30 rounded-lg slide-in animate-delay-${(index + 1) * 100}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{campaign}</h4>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Using {getPersonaInfo(profileData.persona).label} persona
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};