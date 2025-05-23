
import React, { useState } from 'react';
import { Settings, Shield, Bell, Eye, Database, Download, Upload, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    security: {
      twoFactorEnabled: true,
      biometricEnabled: true,
      sessionTimeout: 30,
      autoLock: true
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      securityAlerts: true,
      systemUpdates: false
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      crashReports: true,
      personalizedAds: false
    },
    advanced: {
      developerMode: false,
      debugLogs: false,
      experimentalFeatures: false,
      apiAccess: true
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-6 h-6" />
          System Settings
        </h2>
        <p className="text-gray-300">Configure your SovereignGuard experience</p>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Two-Factor Authentication</label>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Switch
              checked={settings.security.twoFactorEnabled}
              onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Biometric Authentication</label>
              <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
            </div>
            <Switch
              checked={settings.security.biometricEnabled}
              onCheckedChange={(checked) => updateSetting('security', 'biometricEnabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Auto-lock Screen</label>
              <p className="text-sm text-gray-600">Automatically lock after inactivity</p>
            </div>
            <Switch
              checked={settings.security.autoLock}
              onCheckedChange={(checked) => updateSetting('security', 'autoLock', checked)}
            />
          </div>
          <div>
            <label className="font-medium mb-2 block">Session Timeout (minutes)</label>
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Email Alerts</label>
              <p className="text-sm text-gray-600">Receive alerts via email</p>
            </div>
            <Switch
              checked={settings.notifications.emailAlerts}
              onCheckedChange={(checked) => updateSetting('notifications', 'emailAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Push Notifications</label>
              <p className="text-sm text-gray-600">Browser push notifications</p>
            </div>
            <Switch
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Security Alerts</label>
              <p className="text-sm text-gray-600">Critical security notifications</p>
            </div>
            <Switch
              checked={settings.notifications.securityAlerts}
              onCheckedChange={(checked) => updateSetting('notifications', 'securityAlerts', checked)}
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-green-500" />
          Privacy Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Data Sharing</label>
              <p className="text-sm text-gray-600">Share anonymized data for improvements</p>
            </div>
            <Switch
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Analytics Collection</label>
              <p className="text-sm text-gray-600">Help improve the platform</p>
            </div>
            <Switch
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Crash Reports</label>
              <p className="text-sm text-gray-600">Automatically send crash reports</p>
            </div>
            <Switch
              checked={settings.privacy.crashReports}
              onCheckedChange={(checked) => updateSetting('privacy', 'crashReports', checked)}
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-500" />
          Advanced Settings
          <Badge variant="secondary">Developer</Badge>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Developer Mode</label>
              <p className="text-sm text-gray-600">Enable advanced debugging features</p>
            </div>
            <Switch
              checked={settings.advanced.developerMode}
              onCheckedChange={(checked) => updateSetting('advanced', 'developerMode', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Debug Logs</label>
              <p className="text-sm text-gray-600">Enable detailed logging</p>
            </div>
            <Switch
              checked={settings.advanced.debugLogs}
              onCheckedChange={(checked) => updateSetting('advanced', 'debugLogs', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Experimental Features</label>
              <p className="text-sm text-gray-600">Try new features before release</p>
            </div>
            <Switch
              checked={settings.advanced.experimentalFeatures}
              onCheckedChange={(checked) => updateSetting('advanced', 'experimentalFeatures', checked)}
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-500" />
          Data Management
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset Settings
          </Button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Storage Usage</h4>
          <div className="text-sm text-gray-600">
            <div>Credentials: 2.3 MB</div>
            <div>Analytics: 1.8 MB</div>
            <div>Cache: 5.1 MB</div>
            <div className="font-semibold mt-2">Total: 9.2 MB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
