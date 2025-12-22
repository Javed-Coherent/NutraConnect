'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  LogOut,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getCurrentUser, updateUserProfile } from '@/lib/actions/auth';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  plan: string;
}

const defaultNotificationSettings = {
  emailNewMatches: true,
  emailWeeklyDigest: true,
  emailPromotions: false,
  pushNewMessages: true,
  pushPriceAlerts: true,
  pushNewCompanies: false,
};

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'buyer',
  });
  const [notifications, setNotifications] = useState(defaultNotificationSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserData(user as UserData);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          company: user.company || '',
          role: user.role || 'buyer',
        });
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!userData) return;

    setIsSaving(true);
    setSaveMessage(null);

    const result = await updateUserProfile(userData.id, {
      name: formData.name,
      company: formData.company,
    });

    setIsSaving(false);

    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Not Logged In
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please log in to access settings.
        </p>
      </div>
    );
  }

  const initials = formData.name
    ? formData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-teal-500" />
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Avatar Section */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-lg">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formData.name || 'User'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-0">
                      {userData.plan?.charAt(0).toUpperCase() + userData.plan?.slice(1) || 'Free'} Member
                    </Badge>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300 capitalize">
                      {formData.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    disabled
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone verification required to change</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="dark:text-gray-300">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="dark:text-gray-300">I am a</Label>
                <Select value={formData.role} disabled>
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white w-full sm:w-[200px] cursor-not-allowed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contact support to change your role</p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-teal-500" />
                Email Notifications
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose what updates you receive via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Matches</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when new companies match your criteria
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNewMatches}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNewMatches: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive a weekly summary of industry updates
                  </p>
                </div>
                <Switch
                  checked={notifications.emailWeeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailWeeklyDigest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Promotions</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive offers and promotional emails
                  </p>
                </div>
                <Switch
                  checked={notifications.emailPromotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailPromotions: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal-500" />
                Push Notifications
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Control in-app and browser notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Messages</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when you receive new messages
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNewMessages}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNewMessages: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Price Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified about price changes on saved companies
                  </p>
                </div>
                <Switch
                  checked={notifications.pushPriceAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushPriceAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Companies</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when new companies join the platform
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNewCompanies}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNewCompanies: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-teal-500" />
                Change Password
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="dark:text-gray-300">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="dark:text-gray-300">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-500" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">2FA is not enabled</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Secure your account with two-factor authentication
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-300">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-teal-500" />
                Active Sessions
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Manage devices where you&apos;re logged in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Current Browser</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This device • Current session
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-0">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-600/80 dark:text-red-400/80">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="dark:text-gray-400">
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
