import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/theme-context';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Database, 
  Shield, 
  Download, 
  Upload,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    desktop: true,
    email: false,
    deadlines: true,
    dailyDigest: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h'
  });

  const { theme, setTheme } = useTheme();

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account settings</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about important updates</p>
            </div>
            <Switch
              checked={notifications.desktop}
              onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Deadline Alerts</Label>
              <p className="text-sm text-muted-foreground">Get alerted before task deadlines</p>
            </div>
            <Switch
              checked={notifications.deadlines}
              onCheckedChange={(checked) => handleNotificationChange('deadlines', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Daily Digest</Label>
              <p className="text-sm text-muted-foreground">Daily summary of your tasks</p>
            </div>
            <Switch
              checked={notifications.dailyDigest}
              onCheckedChange={(checked) => handleNotificationChange('dailyDigest', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2 block">Theme</Label>
              <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Language</Label>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <SettingsIcon className="w-5 h-5" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2 block">Date Format</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Time Format</Label>
              <Select value={preferences.timeFormat} onValueChange={(value) => handlePreferenceChange('timeFormat', value)}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Auto-backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Sync across devices</Label>
                <p className="text-sm text-muted-foreground">Keep your data synchronized</p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-foreground mb-2 block">Change Password</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input type="password" placeholder="Current password" className="bg-background border-input" />
                <Input type="password" placeholder="New password" className="bg-background border-input" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-foreground">Two-factor authentication</Label>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Privacy Mode</Label>
                <p className="text-sm text-muted-foreground">Hide sensitive task details</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Clear All Data</Label>
              <p className="text-sm text-muted-foreground">Permanently delete all your tasks and data</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
              Clear Data
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Reset to Defaults</Label>
              <p className="text-sm text-muted-foreground">Reset all settings to default values</p>
            </div>
            <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}