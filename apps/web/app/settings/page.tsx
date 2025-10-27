import { useState } from "react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white rounded-md shadow p-4">
          <span className="text-lg">Email Notifications</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
              <span className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform ${emailNotifications ? 'translate-x-5' : ''}`}></span>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between bg-white rounded-md shadow p-4">
          <span className="text-lg">Dark Mode</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
              <span className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform ${darkMode ? 'translate-x-5' : ''}`}></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
