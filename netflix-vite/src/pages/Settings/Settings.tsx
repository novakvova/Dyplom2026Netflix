import React, { useState } from "react";
import "./Settings.css";

const Settings: React.FC = () => {
    const [siteName, setSiteName] = useState("Netflix Clone");
    const [supportEmail, setSupportEmail] = useState("support@netflix-clone.com");
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [maxDevicesFree, setMaxDevicesFree] = useState(1);
    const [savedNotice, setSavedNotice] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Platform Settings</h1>
                <p>Manage application properties and global configurations</p>
            </div>

            {savedNotice && (
                <div className="save-alert">
                    ✓ Settings saved successfully!
                </div>
            )}

            <form onSubmit={handleSave} className="settings-form">
                <div className="settings-section">
                    <h2>General Configuration</h2>
                    <div className="form-group">
                        <label>Platform Name</label>
                        <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Support Email Address</label>
                        <input
                            type="email"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Subscriptions & Limits</h2>
                    <div className="form-group">
                        <label>Max Devices for Free Tier</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={maxDevicesFree}
                            onChange={(e) => setMaxDevicesFree(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h2>System Control</h2>

                    <div className="toggle-group">
                        <div>
                            <strong>Allow New User Registrations</strong>
                            <p>Enable or disable signup page for visitors</p>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle-checkbox"
                            checked={allowRegistration}
                            onChange={(e) => setAllowRegistration(e.target.checked)}
                        />
                    </div>

                    <div className="toggle-group">
                        <div>
                            <strong>Maintenance Mode (Режим обслуговування)</strong>
                            <p>Temporarily disable site access for non-admin users</p>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle-checkbox"
                            checked={maintenanceMode}
                            onChange={(e) => setMaintenanceMode(e.target.checked)}
                        />
                    </div>
                </div>

                <button type="submit" className="save-settings-btn">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default Settings;