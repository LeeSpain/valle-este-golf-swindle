
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, PaintBucket, Eye, Info } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [upcomingGamesEnabled, setUpcomingGamesEnabled] = useState(true);
  const [scoresVerifiedEnabled, setScoresVerifiedEnabled] = useState(true);
  const [newScoresEnabled, setNewScoresEnabled] = useState(true);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to a database or local storage
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <Layout isAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-golf-green text-white">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Card className="w-[350px] border-none shadow-none">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about game updates
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                    
                    {notificationsEnabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="upcoming-games">Upcoming Games</Label>
                          <Switch
                            id="upcoming-games"
                            checked={upcomingGamesEnabled}
                            onCheckedChange={setUpcomingGamesEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="scores-verified">Scores Verified</Label>
                          <Switch
                            id="scores-verified"
                            checked={scoresVerifiedEnabled}
                            onCheckedChange={setScoresVerifiedEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-scores">New Scores</Label>
                          <Switch
                            id="new-scores"
                            checked={newScoresEnabled}
                            onCheckedChange={setNewScoresEnabled}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-golf-green text-white">
                <PaintBucket className="mr-2 h-4 w-4" />
                Appearance
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Card className="w-[350px] border-none shadow-none">
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Customize your viewing experience</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-view">Compact View</Label>
                        <p className="text-sm text-muted-foreground">
                          Display more content with less spacing
                        </p>
                      </div>
                      <Switch id="compact-view" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="large-text">Larger Text</Label>
                        <p className="text-sm text-muted-foreground">
                          Increase text size for better readability
                        </p>
                      </div>
                      <Switch id="large-text" />
                    </div>
                  </CardContent>
                </Card>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-golf-green text-white">
                <Eye className="mr-2 h-4 w-4" />
                Display
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Card className="w-[350px] border-none shadow-none">
                  <CardHeader>
                    <CardTitle>Custom Display</CardTitle>
                    <CardDescription>Personalize your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-weather">Show Weather</Label>
                        <p className="text-sm text-muted-foreground">
                          Display weather information on dashboard
                        </p>
                      </div>
                      <Switch id="show-weather" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-stats">Show Stats</Label>
                        <p className="text-sm text-muted-foreground">
                          Display player statistics on dashboard
                        </p>
                      </div>
                      <Switch id="show-stats" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Manage application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" />
                <Label htmlFor="email-notifications">Send email updates about games and scores</Label>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="privacy">Privacy Settings</Label>
              <div className="flex items-center space-x-2">
                <Switch id="privacy" />
                <Label htmlFor="privacy">Make player profiles visible to all users</Label>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveSettings} 
              className="w-full md:w-auto mt-4 bg-golf-green hover:bg-golf-green-dark"
            >
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
