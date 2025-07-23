import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Plus, ExternalLink, Database, Monitor, TrendingUp } from "lucide-react";

interface DataConnectionPlaceholderProps {
  title: string;
  description: string;
  suggestions?: string[];
  onConnectClick?: () => void;
  icon?: React.ReactNode;
}

export const DataConnectionPlaceholder = ({ 
  title, 
  description, 
  suggestions = [], 
  onConnectClick,
  icon = <Database className="h-16 w-16 text-muted-foreground" />
}: DataConnectionPlaceholderProps) => {
  return (
    <Card className="border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="flex items-center justify-center py-16">
        <div className="text-center space-y-6 max-w-md">
          {icon}
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Recommended integrations:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button 
              variant="default" 
              onClick={onConnectClick}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Data Source
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const NoDataState = ({ 
  icon = <Monitor className="h-12 w-12 text-muted-foreground" />,
  title = "No Data Available",
  description = "Connect your data sources to see insights here"
}: {
  icon?: React.ReactNode;
  title?: string; 
  description?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-3">
        {icon}
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground/70">{description}</p>
        </div>
      </div>
    </div>
  );
};