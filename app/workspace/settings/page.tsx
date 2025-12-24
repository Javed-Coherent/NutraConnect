import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Phone, Mail, Shield, Bell } from 'lucide-react';

export default async function WorkspaceSettingsPage() {
  const session = await auth();

  const voipSettings = await prisma.voipSettings.findUnique({
    where: { userId: session!.user!.id },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your workspace preferences
        </p>
      </div>

      {/* VoIP Settings */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Phone className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            VoIP Settings
          </CardTitle>
          <CardDescription>
            Configure your browser-based calling settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Twilio Phone Number</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {voipSettings?.twilioPhoneNumber || 'Not configured'}
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Call Recording</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically record outgoing calls
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${voipSettings?.callRecording ? 'text-green-600' : 'text-gray-400'}`}>
                {voipSettings?.callRecording ? 'Enabled' : 'Disabled'}
              </span>
              <Button variant="outline" size="sm">Toggle</Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Voicemail</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable voicemail for missed calls
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${voipSettings?.voicemailEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                {voipSettings?.voicemailEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Button variant="outline" size="sm">Toggle</Button>
            </div>
          </div>

          {!voipSettings?.twilioPhoneNumber && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note:</strong> VoIP calling requires Twilio configuration. Contact your administrator to set up a Twilio phone number.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Configure email sending preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Default Signature</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add a signature to all outgoing emails
              </p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email Templates</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your custom email templates
              </p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure workspace notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email Delivery Status</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified when emails are delivered or fail
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Missed Call Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified about missed incoming calls
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
