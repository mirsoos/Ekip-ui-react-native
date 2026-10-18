import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';

interface SecurityScreenProps {
  onBack: () => void;
}

interface ActiveDevice {
  id: string;
  name: string;
  platform: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'phone' | 'laptop' | 'tablet';
}

const INITIAL_DEVICES: ActiveDevice[] = [
  {
    id: 'dev-1',
    name: 'Pixel 9 Pro',
    platform: 'Android 15 · Ekip Mobile',
    location: 'London, United Kingdom',
    ip: '82.165.197.42',
    lastActive: 'Active now',
    isCurrent: true,
    type: 'phone',
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro 16"',
    platform: 'macOS Sequoia · Safari 18.2',
    location: 'London, United Kingdom',
    ip: '82.165.197.42',
    lastActive: '2 hours ago',
    isCurrent: false,
    type: 'laptop',
  },
  {
    id: 'dev-3',
    name: 'Galaxy Tab S9',
    platform: 'Android 14 · Ekip App',
    location: 'Oxford, United Kingdom',
    ip: '146.198.81.12',
    lastActive: 'Yesterday at 18:24',
    isCurrent: false,
    type: 'tablet',
  },
];

const RECOVERY_CODES = [
  'EKIP-89A2-94CF',
  'EKIP-47K1-82MN',
  'EKIP-93X9-11QA',
  'EKIP-60Z3-88PP',
  'EKIP-12B7-44VK',
  'EKIP-75D0-39LQ',
];

export function SecurityScreen({ onBack }: SecurityScreenProps) {
  const { addNotification } = useAppData();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [passkeyRegistered, setPasskeyRegistered] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [devices, setDevices] = useState<ActiveDevice[]>(INITIAL_DEVICES);

  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [showRecoverySheet, setShowRecoverySheet] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const ShieldCheck = getIcon('ShieldCheck');
  const Lock = getIcon('Lock');
  const Key = getIcon('Key');
  const Smartphone = getIcon('Smartphone');
  const Laptop = getIcon('Laptop');
  const Tablet = getIcon('Tablet');
  const ChevronRight = getIcon('ChevronRight');
  const Trash = getIcon('Trash');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    setShowPasswordSheet(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Master password updated successfully');
    addNotification({
      type: 'system',
      title: 'Security Alert',
      body: 'Your account credentials were changed recently.',
      icon: 'Lock',
    });
  };

  const handleRevokeDevice = (id: string, name: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast(`Session revoked for ${name}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <GlassBackButton onClick={onBack} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Security & Access</Text>
            <Text style={styles.headerSubtitle}>Passkeys, credentials & multi-factor shield</Text>
          </View>
        </View>
        <View style={styles.badgePill}>
          <ShieldCheck size={13} color="#10b981" />
          <Text style={styles.badgeText}>Secured</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Passkey / Biometrics Card */}
        <GlassCard variant="thick" style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <ShieldCheck size={22} color="#10b981" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.heroTitle}>Biometric & Passkey Access</Text>
              <Text style={styles.heroDesc}>
                FIDO2 WebAuthn & biometric cryptographic hardware key
              </Text>
            </View>
            <Switch
              value={passkeyRegistered}
              onValueChange={(val) => {
                setPasskeyRegistered(val);
                showToast(`Hardware passkey ${val ? 'registered' : 'revoked'}`);
              }}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#10b981' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Multi-Factor Authentication */}
        <Text style={styles.sectionHeading}>AUTHENTICATION PROTOCOLS</Text>
        <GlassCard style={styles.cardSection}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Two-Factor Authentication (2FA)</Text>
              <Text style={styles.settingDesc}>Require TOTP code or passkey for every login</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Biometric Unlock on Open</Text>
              <Text style={styles.settingDesc}>Prompt fingerprint or face unlock upon launch</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Suspicious Activity Alerts</Text>
              <Text style={styles.settingDesc}>Instant notification upon login from new sector</Text>
            </View>
            <Switch
              value={loginAlerts}
              onValueChange={setLoginAlerts}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Credentials & Keys */}
        <Text style={styles.sectionHeading}>CREDENTIALS</Text>
        <GlassCard style={styles.cardSection}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowPasswordSheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(236,72,153,0.15)' }]}>
              <Lock size={18} color="#ec4899" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingTitle}>Change Master Password</Text>
              <Text style={styles.settingDesc}>Last updated 24 days ago</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowRecoverySheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
              <Key size={18} color="#f59e0b" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingTitle}>Backup Recovery Codes</Text>
              <Text style={styles.settingDesc}>Emergency one-time access tokens</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </GlassCard>

        {/* Active Sessions */}
        <Text style={styles.sectionHeading}>ACTIVE SESSIONS ({devices.length})</Text>
        <GlassCard style={styles.cardSection}>
          {devices.map((dev, idx) => (
            <View key={dev.id}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.deviceItem}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                  {dev.type === 'phone' ? (
                    <Smartphone size={20} color="#fff" />
                  ) : dev.type === 'laptop' ? (
                    <Laptop size={20} color="#fff" />
                  ) : (
                    <Tablet size={20} color="#fff" />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.settingTitle}>{dev.name}</Text>
                    {dev.isCurrent && (
                      <Text style={styles.currentBadge}>This Device</Text>
                    )}
                  </View>
                  <Text style={styles.settingDesc}>{dev.platform}</Text>
                  <Text style={[styles.settingDesc, { marginTop: 2 }]}>
                    {dev.location} · {dev.lastActive}
                  </Text>
                </View>
                {!dev.isCurrent && (
                  <TouchableOpacity
                    onPress={() => handleRevokeDevice(dev.id, dev.name)}
                    style={{ padding: 6 }}
                  >
                    <Trash size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </GlassCard>
      </ScrollView>

      {/* Change Password Sheet */}
      <GlassSheet
        open={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        title="Update Master Password"
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.inputLabel}>CURRENT PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>NEW PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>CONFIRM NEW PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <View style={{ marginTop: 22 }}>
            <GlassButton variant="primary" onClick={handleUpdatePassword}>
              Save New Password
            </GlassButton>
          </View>
        </View>
      </GlassSheet>

      {/* Recovery Codes Sheet */}
      <GlassSheet
        open={showRecoverySheet}
        onClose={() => setShowRecoverySheet(false)}
        title="Emergency Recovery Codes"
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
            Store these emergency keys in a secure offline vault. Each key can only be used once.
          </Text>

          <View style={styles.codesGrid}>
            {RECOVERY_CODES.map((code) => (
              <View key={code} style={styles.codePill}>
                <Text style={styles.codeText}>{code}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 20 }}>
            <GlassButton
              variant="secondary"
              onClick={() => {
                showToast('Recovery codes copied to clipboard');
              }}
            >
              Copy All Codes
            </GlassButton>
          </View>
        </View>
      </GlassSheet>

      <Toast message={toastMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    padding: 16,
    borderRadius: 20,
    borderColor: 'rgba(16,185,129,0.3)',
    borderWidth: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  heroDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardSection: {
    padding: 16,
    borderRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  settingDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentBadge: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  codesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  codePill: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: '#ec4899',
  },
});
