"use client";
import React, { useState, useRef } from "react";
import { Settings, Download, Upload, Phone, Mail } from "lucide-react";

const defaultSettings = {
  language: "en",
  unit: "qtl",
};

function exportInventoryCSV() {
  // Dummy export function
  alert("Inventory data exported as CSV!");
}

const SettingsContent = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const importInputRef = useRef(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Settings className="mr-2 text-gray-600" />
          Settings
        </h2>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <h3 className="font-semibold mb-3">Language</h3>
            <select
              className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg bg-white"
              value={settings.language}
              onChange={(e) =>
                setSettings((s) => ({ ...s, language: e.target.value }))
              }
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          {/* Display */}
          <div>
            <h3 className="font-semibold mb-3">Display</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                className="px-4 py-2 rounded-lg border bg-white"
                value={settings.unit}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, unit: e.target.value }))
                }
              >
                <option value="qtl">Unit: Quintal</option>
                <option value="ton">Unit: Ton</option>
              </select>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="font-semibold mb-3">Security</h3>
            <div className="space-y-3">
              <button className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Change Password
              </button>
              <button className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-0 md:ml-3">
                Set PIN
              </button>
            </div>
          </div>

          {/* Backup */}
          <div>
            <h3 className="font-semibold mb-3">Data Backup</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <button
                className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={exportInventoryCSV}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Data
              </button>
              <button
                className="flex items-center justify-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                onClick={() => importInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Data
              </button>
              <input
                type="file"
                ref={importInputRef}
                style={{ display: "none" }}
                accept=".csv"
                onChange={() => alert("Data uploaded!")}
              />
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">Helpline</span>
                </div>
                <p className="text-sm text-gray-600">1800-XXX-XXXX</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Email Support</span>
                </div>
                <p className="text-sm text-gray-600">
                  support@samriddhagrain.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
