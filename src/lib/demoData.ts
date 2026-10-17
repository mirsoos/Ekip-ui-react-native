import type {
  Profile, Group, GroupMember, GroupRequest, Conversation, Message,
  Notification, Badge, Mission, Friendship,
} from '../types/database';

// Avatar + banner stock photos (Pexels - tactical/military/operator aesthetic)
const av = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop`;
const cover = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;

export const demoProfiles: Profile[] = [
  {
    id: 'me', username: 'cmd.vance', first_name: 'Marcus', last_name: 'Vance',
    email: 'vance@ekip-command.mil', phone: '+1 505 555 0199', gender: 'male', age: 34,
    city: 'Sector 7 - Command HQ', job: 'Tactical Commander (CO)', bio: 'Special Operations Command. 12th Tactical Recon Group. Clearance Level: Omega.',
    avatar_url: av('220453'), banner_url: cover('355465'),
    interests: ['Tactical Ops', 'Reconnaissance', 'Cryptology', 'UAV Piloting', 'Survival', 'Ballistics'],
    personality_type: 'ESTJ-A', social_links: { secure_comms: 'vance.secure', radio: 'CH-9-ALPHA' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 48, xp: 9420, xp_to_next: 10000, honor_score: 99, reputation_level: 'Commander',
    mood: 'On Alert', created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'u2', username: 'elena.rostov', first_name: 'Elena', last_name: 'Rostova',
    email: null, phone: null, gender: 'female', age: 29, city: 'Sector 4 - FOB Alpha',
    job: 'Lead Cryptographer & Signal Intel', bio: 'Intercept analysis, quantum encryption, and secure network routing.',
    avatar_url: av('774909'), banner_url: cover('1103970'),
    interests: ['Cyber Defense', 'Signals Intelligence', 'Python', 'Cryptography', 'RF Jamming'],
    personality_type: 'INTJ-A', social_links: { radio: 'CH-4-SIGINT' },
    is_premium: false, is_verified: true, is_identity_verified: true,
    level: 42, xp: 8100, xp_to_next: 9000, honor_score: 97, reputation_level: 'Elite Operative',
    mood: 'Monitoring', created_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'u3', username: 'jax.reyes', first_name: 'Jackson', last_name: 'Reyes',
    email: null, phone: null, gender: 'male', age: 31, city: 'Sector 2 - Forward Base',
    job: 'Master Sniper / Recon Specialist', bio: 'Long range precision reconnaissance and overwatch operations.',
    avatar_url: av('1043471'), banner_url: cover('1640777'),
    interests: ['Marksmanship', 'Camouflage', 'Terrain Analysis', 'UAVs', 'Mountain Warfare'],
    personality_type: 'ISTP-A', social_links: { radio: 'CH-2-RECON' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 45, xp: 8900, xp_to_next: 9500, honor_score: 98, reputation_level: 'Elite Operative',
    mood: 'Vigilant', created_at: '2024-12-10T10:00:00Z',
  },
  {
    id: 'u4', username: 'mei.chen', first_name: 'Mei', last_name: 'Chen',
    email: null, phone: null, gender: 'female', age: 27, city: 'Sector 6 - Logistics',
    job: 'Combat Medic & Bio-Hazard Specialist', bio: 'Emergency triage, field surgery, and biological threat mitigation.',
    avatar_url: av('762020'), banner_url: cover('167964'),
    interests: ['Triage', 'Emergency Medicine', 'Toxicology', 'Field Surgery', 'Biotech'],
    personality_type: 'ISFJ-A', social_links: { radio: 'CH-6-MED' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 39, xp: 7400, xp_to_next: 8000, honor_score: 96, reputation_level: 'Trusted Operative',
    mood: 'Prepared', created_at: '2025-03-20T10:00:00Z',
  },
  {
    id: 'u5', username: 'viktor.vance', first_name: 'Viktor', last_name: 'Kovalev',
    email: null, phone: null, gender: 'male', age: 36, city: 'Sector 1 - Armor Division',
    job: 'Heavy Armor & Demolitions Lead', bio: 'Breaching operations, explosive ordnance disposal, and armored vehicle command.',
    avatar_url: av('1220794'), banner_url: cover('1677256'),
    interests: ['Demolitions', 'Armor', 'Heavy Mechanics', 'Structural Analysis', 'Tactical Driving'],
    personality_type: 'ESTP-T', social_links: { radio: 'CH-1-HEAVY' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 44, xp: 8750, xp_to_next: 9200, honor_score: 94, reputation_level: 'Elite Operative',
    mood: 'Aggressive', created_at: '2025-01-28T10:00:00Z',
  },
  {
    id: 'u6', username: 'sarah.connor', first_name: 'Sarah', last_name: 'Connor',
    email: null, phone: null, gender: 'female', age: 30, city: 'Sector 5 - Drone Command',
    job: 'Autonomous Swarm Pilot', bio: 'UAV tactical reconnaissance and automated perimeter defense systems.',
    avatar_url: av('1130626'), banner_url: cover('2425567'),
    interests: ['Drone Swarms', 'AI Targeting', 'Radar Systems', 'Electronic Warfare', 'Robotics'],
    personality_type: 'ENTJ-A', social_links: { radio: 'CH-5-UAV' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 41, xp: 7900, xp_to_next: 8500, honor_score: 95, reputation_level: 'Trusted Operative',
    mood: 'Calculating', created_at: '2025-02-14T10:00:00Z',
  },
];

const profileById = (id: string) => demoProfiles.find((p) => p.id === id)!;

export const demoGroups: Group[] = [
  {
    id: 'g1', owner_id: 'u3', title: 'Operation Nightfall - Sector 4 Recon',
    description: 'Execute covert infiltration and high-ground reconnaissance of Sector 4 relay station. Full night-vision gear and encrypted radio check-in required 15 mins prior to deployment.',
    category: 'work', group_type: 'group', min_members: 4, max_members: 12,
    city: 'Sector 4 - Alpha Zone', location_name: 'Checkpoint Delta, Ridge Road',
    latitude: 37.7955, longitude: -122.3937,
    tags: ['Recon', 'Night Ops', 'Stealth', 'Tier-1'],
    age_min: 21, age_max: 50, required_level: 10, required_honor: 80,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('167964'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-02T22:30:00Z', views: 842, member_count: 7, created_at: '2026-07-20T10:00:00Z',
    owner: profileById('u3'),
  },
  {
    id: 'g2', owner_id: 'u2', title: 'Cyber Defense & Quantum Encryption Drill',
    description: 'Live simulation of a hostile network intrusion against command servers. Test counter-measures, firewall hardening, and decentralized data recovery protocols.',
    category: 'work', group_type: 'group', min_members: 5, max_members: 15,
    city: 'Command HQ - Cyber Wing', location_name: 'Server Vault 3, Sub-Level B',
    latitude: 37.7822, longitude: -122.4051,
    tags: ['Cyber', 'Defense', 'Encryption', 'Intel'],
    age_min: 20, age_max: 55, required_level: 15, required_honor: 85,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('3184292'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-05T14:00:00Z', views: 1250, member_count: 11, created_at: '2026-07-18T10:00:00Z',
    owner: profileById('u2'),
  },
  {
    id: 'g3', owner_id: 'u4', title: 'Combat Triage & Mass Casualty Simulation',
    description: 'Advanced battlefield medical response training under simulated hostile fire. Practice tourniquet application, airway maintenance, and secure medevac procedures.',
    category: 'work', group_type: 'group', min_members: 3, max_members: 8,
    city: 'Forward Base - Medical Bay', location_name: 'Field Hospital Alpha, Sector 2',
    latitude: 37.7599, longitude: -122.4148,
    tags: ['Medical', 'Triage', 'Survival', 'Readiness'],
    age_min: 18, age_max: 50, required_level: 5, required_honor: 70,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('884600'),
    premium_only: true, visibility: 'public', auto_accept: false, is_repeating: false,
    event_date: '2026-08-08T09:00:00Z', views: 498, member_count: 6, created_at: '2026-07-25T10:00:00Z',
    owner: profileById('u4'),
  },
  {
    id: 'g4', owner_id: 'u6', title: 'UAV Swarm Perimeter Defense Exercise',
    description: 'Deploy automated drone swarms to secure perimeter coordinates against hostile incursions. Review telemetry feeds, thermal tracking, and interception flight paths.',
    category: 'work', group_type: 'group', min_members: 3, max_members: 10,
    city: 'Sector 5 - Airdrome', location_name: 'Pad 4, Runway North',
    latitude: 37.6152, longitude: -122.4925,
    tags: ['UAV', 'Defense', 'Surveillance', 'Tech'],
    age_min: 21, age_max: 45, required_level: 12, required_honor: 80,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1654748'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-03T05:30:00Z', views: 667, member_count: 8, created_at: '2026-07-22T10:00:00Z',
    owner: profileById('u6'),
  },
  {
    id: 'g5', owner_id: 'u5', title: 'Heavy Breach & Demolitions Workshop',
    description: 'Controlled breaching of reinforced barriers, tactical explosive handling, and structural integrity assessment for urban combat environments.',
    category: 'work', group_type: 'group', min_members: 2, max_members: 6,
    city: 'Sector 1 - Demolitions Range', location_name: 'Firing Range 9, Bunker Complex',
    latitude: 37.7096, longitude: -122.3933,
    tags: ['Demolitions', 'Breaching', 'Tactical', 'Urban'],
    age_min: 25, age_max: 50, required_level: 20, required_honor: 90,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1677256'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-06T10:00:00Z', views: 343, member_count: 5, created_at: '2026-07-26T10:00:00Z',
    owner: profileById('u5'),
  },
  {
    id: 'g6', owner_id: 'me', title: 'Command Staff Operational Briefing',
    description: 'Weekly high-level tactical briefing for squad leaders. Review telemetry data, upcoming deployment schedules, and resource allocation across all sectors.',
    category: 'work', group_type: 'group', min_members: 4, max_members: 15,
    city: 'Command HQ - Main Hall', location_name: 'Briefing Room Omega, Floor 4',
    latitude: 37.7563, longitude: -122.4185,
    tags: ['Command', 'Briefing', 'Strategy', 'Leadership'],
    age_min: 25, age_max: 60, required_level: 25, required_honor: 95,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('6952383'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-04T08:30:00Z', views: 889, member_count: 12, created_at: '2026-07-27T10:00:00Z',
    owner: profileById('me'),
  },
];

export const demoMembers: GroupMember[] = [
  { id: 'm1', group_id: 'g1', user_id: 'u3', role: 'owner', status: 'active', joined_at: '2026-07-20T10:00:00Z', profile: profileById('u3') },
  { id: 'm2', group_id: 'g1', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-21T10:00:00Z', profile: profileById('me') },
  { id: 'm3', group_id: 'g1', user_id: 'u5', role: 'member', status: 'active', joined_at: '2026-07-22T10:00:00Z', profile: profileById('u5') },
  { id: 'm4', group_id: 'g2', user_id: 'u2', role: 'owner', status: 'active', joined_at: '2026-07-18T10:00:00Z', profile: profileById('u2') },
  { id: 'm5', group_id: 'g2', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-19T10:00:00Z', profile: profileById('me') },
  { id: 'm6', group_id: 'g2', user_id: 'u6', role: 'member', status: 'active', joined_at: '2026-07-23T10:00:00Z', profile: profileById('u6') },
  { id: 'm7', group_id: 'g6', user_id: 'me', role: 'owner', status: 'active', joined_at: '2026-07-27T10:00:00Z', profile: profileById('me') },
  { id: 'm8', group_id: 'g6', user_id: 'u3', role: 'member', status: 'active', joined_at: '2026-07-28T10:00:00Z', profile: profileById('u3') },
  { id: 'm9', group_id: 'g6', user_id: 'u4', role: 'member', status: 'active', joined_at: '2026-07-28T10:00:00Z', profile: profileById('u4') },
];

export const demoRequests: GroupRequest[] = [
  { id: 'r1', group_id: 'g6', user_id: 'u5', status: 'pending', message: 'Requesting clearance for Command Staff briefing attendance.', created_at: '2026-07-28T09:00:00Z', group: demoGroups[5], profile: profileById('u5') },
  { id: 'r2', group_id: 'g6', user_id: 'u2', status: 'pending', message: 'Submitting updated SIGINT telemetry reports for review.', created_at: '2026-07-28T10:00:00Z', group: demoGroups[5], profile: profileById('u2') },
  { id: 'r3', group_id: 'g6', user_id: 'u6', status: 'pending', message: null, created_at: '2026-07-28T11:00:00Z', group: demoGroups[5], profile: profileById('u6') },
  { id: 'r4', group_id: 'g1', user_id: 'me', status: 'pending', message: 'Command oversight requested for Operation Nightfall.', created_at: '2026-07-28T08:00:00Z', group: demoGroups[0], profile: profileById('me') },
  { id: 'r5', group_id: 'g3', user_id: 'me', status: 'accepted', message: null, created_at: '2026-07-27T08:00:00Z', group: demoGroups[2], profile: profileById('me') },
];

export const demoConversations: Conversation[] = [
  { id: 'c1', type: 'direct', title: 'Jackson Reyes (Sniper Lead)', avatar_url: av('1043471'), group_id: null, last_message: 'Overwatch position secured. Sector 4 clear.', last_message_at: '2026-07-28T11:30:00Z', unread_count: 2 },
  { id: 'c2', type: 'group', title: 'Operation Nightfall - Squad Channel', avatar_url: cover('167964'), group_id: 'g1', last_message: 'Elena: Quantum encryption keys updated for infiltration.', last_message_at: '2026-07-28T10:15:00Z', unread_count: 5 },
  { id: 'c3', type: 'direct', title: 'Sarah Connor (UAV Command)', avatar_url: av('1130626'), group_id: null, last_message: 'Drone telemetry nominal across all checkpoints.', last_message_at: '2026-07-28T09:00:00Z', unread_count: 0 },
  { id: 'c4', type: 'group', title: 'Command Staff Operations', avatar_url: cover('3184292'), group_id: 'g2', last_message: 'Viktor: Heavy breach charges staged at Sub-Level B.', last_message_at: '2026-07-27T18:00:00Z', unread_count: 0 },
  { id: 'c5', type: 'direct', title: 'Mei Chen (Combat Medics)', avatar_url: av('762020'), group_id: null, last_message: 'Field hospital resupply manifest confirmed.', last_message_at: '2026-07-27T14:00:00Z', unread_count: 0 },
];

export const demoMessages: Record<string, Message[]> = {
  c1: [
    { id: 'msg1', conversation_id: 'c1', sender_id: 'u3', body: 'Commander Vance, recon team in position at Sector 4 ridge.', media_url: null, read_at: '2026-07-28T11:00:00Z', created_at: '2026-07-28T11:00:00Z', sender: profileById('u3') },
    { id: 'msg2', conversation_id: 'c1', sender_id: 'me', body: 'Acknowledged Jackson. Maintain radio silence until zero-hour.', media_url: null, read_at: null, created_at: '2026-07-28T11:10:00Z', sender: profileById('me') },
    { id: 'msg3', conversation_id: 'c1', sender_id: 'u3', body: 'Copy that. Thermal scope check complete.', media_url: null, read_at: null, created_at: '2026-07-28T11:20:00Z', sender: profileById('u3') },
    { id: 'msg4', conversation_id: 'c1', sender_id: 'u3', body: 'Overwatch position secured. Sector 4 clear.', media_url: null, read_at: null, created_at: '2026-07-28T11:30:00Z', sender: profileById('u3') },
  ],
  c2: [
    { id: 'msg5', conversation_id: 'c2', sender_id: 'u3', body: 'All operators check in for Operation Nightfall briefing.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u3') },
    { id: 'msg6', conversation_id: 'c2', sender_id: 'me', body: 'Command online. Proceed with deployment checklists.', media_url: null, read_at: null, created_at: '2026-07-28T09:30:00Z', sender: profileById('me') },
    { id: 'msg7', conversation_id: 'c2', sender_id: 'u3', body: 'Zero-hour is 22:30 sharp.', media_url: null, read_at: null, created_at: '2026-07-28T09:45:00Z', sender: profileById('u3') },
    { id: 'msg8', conversation_id: 'c2', sender_id: 'u2', body: 'Elena: Quantum encryption keys updated for infiltration.', media_url: null, read_at: null, created_at: '2026-07-28T10:15:00Z', sender: profileById('u2') },
  ],
  c3: [
    { id: 'msg9', conversation_id: 'c3', sender_id: 'u6', body: 'Drone telemetry nominal across all checkpoints.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u6') },
  ],
  c4: [
    { id: 'msg10', conversation_id: 'c4', sender_id: 'u5', body: 'Viktor: Heavy breach charges staged at Sub-Level B.', media_url: null, read_at: null, created_at: '2026-07-27T18:00:00Z', sender: profileById('u5') },
  ],
  c5: [
    { id: 'msg11', conversation_id: 'c5', sender_id: 'u4', body: 'Field hospital resupply manifest confirmed.', media_url: null, read_at: null, created_at: '2026-07-27T14:00:00Z', sender: profileById('u4') },
  ],
};

export const demoNotifications: Notification[] = [
  { id: 'n1', user_id: 'me', type: 'group_request', title: 'Tactical Clearance Request', body: 'Viktor Kovalev requested access to Command Staff Briefing', icon: 'Shield', is_read: false, created_at: '2026-07-28T09:00:00Z' },
  { id: 'n2', user_id: 'me', type: 'chat', title: 'Secure Comms: Jackson Reyes', body: 'Overwatch position secured. Sector 4 clear.', icon: 'Lock', is_read: false, created_at: '2026-07-28T11:30:00Z' },
  { id: 'n3', user_id: 'me', type: 'achievement', title: 'Mission Medal Awarded', body: 'Unlocked "Master Strategist" badge for leading 10 successful operations.', icon: 'Award', is_read: false, created_at: '2026-07-28T08:00:00Z' },
  { id: 'n4', user_id: 'me', type: 'friend_request', title: 'Operator Connection', body: 'Elena Rostova sent an encrypted tactical link request.', icon: 'Radio', is_read: true, created_at: '2026-07-27T16:00:00Z' },
  { id: 'n5', user_id: 'me', type: 'group_request', title: 'Deployment Approved', body: 'Mei Chen approved your squad deployment for Combat Triage.', icon: 'CheckCircle2', is_read: true, created_at: '2026-07-27T12:00:00Z' },
  { id: 'n6', user_id: 'me', type: 'subscription', title: 'Omega Clearance Active', body: 'Top-secret security clearance status verified.', icon: 'ShieldCheck', is_read: true, created_at: '2026-07-26T10:00:00Z' },
  { id: 'n7', user_id: 'me', type: 'discount', title: 'Armor Upgrade Available', body: 'Logistics division dispatched 20% upgraded plating for squad units.', icon: 'Zap', is_read: true, created_at: '2026-07-25T14:00:00Z' },
];

export const demoBadges: Badge[] = [
  { id: 'b1', user_id: 'me', name: 'Master Tactician', description: 'Lead 10 tactical operations', icon: 'Shield', color: 'blue', earned_at: '2026-07-28T08:00:00Z' },
  { id: 'b2', user_id: 'me', name: 'First Deployment', description: 'Initiate your first mission', icon: 'Rocket', color: 'green', earned_at: '2026-07-27T10:00:00Z' },
  { id: 'b3', user_id: 'me', name: 'Omega Clearance', description: 'Complete military biometric verification', icon: 'ShieldCheck', color: 'amber', earned_at: '2026-07-20T10:00:00Z' },
  { id: 'b4', user_id: 'me', name: 'Encrypted Comms', description: 'Send 50 secure dispatches', icon: 'Lock', color: 'indigo', earned_at: '2026-07-22T10:00:00Z' },
  { id: 'b5', user_id: 'me', name: 'Command Tier-1', description: 'Achieve Commander rank', icon: 'Award', color: 'purple', earned_at: '2026-07-15T10:00:00Z' },
  { id: 'b6', user_id: 'me', name: 'Early Veteran', description: 'Deploy in beta testing phase', icon: 'Sparkles', color: 'slate', earned_at: '2025-01-15T10:00:00Z' },
  { id: 'b7', user_id: 'me', name: 'Honor Guard', description: 'Maintain 95+ readiness score for 30 days', icon: 'Check', color: 'blue', earned_at: null },
  { id: 'b8', user_id: 'me', name: 'General Rank', description: 'Reach Level 50 command status', icon: 'Trophy', color: 'amber', earned_at: null },
  { id: 'b9', user_id: 'me', name: 'Global Recon', description: 'Deploy squads across 5 operational sectors', icon: 'Compass', color: 'green', earned_at: null },
];

export const demoMissions: Mission[] = [
  { id: 'ms1', user_id: 'me', title: 'Deploy 2 tactical squads', description: 'Initiate new operations in assigned sectors', xp_reward: 100, icon: 'Plus', progress: 1, target: 2, is_complete: false },
  { id: 'ms2', user_id: 'me', title: 'Transmit 10 secure dispatches', description: 'Maintain communication with squad leads', xp_reward: 50, icon: 'Lock', progress: 7, target: 10, is_complete: false },
  { id: 'ms3', user_id: 'me', title: 'Inspect radar telemetry', description: 'Review live tactical map coordinates', xp_reward: 75, icon: 'Compass', progress: 1, target: 1, is_complete: true },
  { id: 'ms4', user_id: 'me', title: 'Verify operator credentials', description: 'Confirm biometric security clearances', xp_reward: 80, icon: 'ShieldCheck', progress: 3, target: 3, is_complete: true },
  { id: 'ms5', user_id: 'me', title: 'Complete Omega clearance check', description: 'Secure encrypted authorization keys', xp_reward: 120, icon: 'Shield', progress: 1, target: 1, is_complete: true },
];

export const demoFriends: Friendship[] = [
  { id: 'f1', user_id: 'me', friend_id: 'u3', status: 'accepted', created_at: '2025-02-01T10:00:00Z', profile: profileById('u3') },
  { id: 'f2', user_id: 'me', friend_id: 'u5', status: 'accepted', created_at: '2025-02-10T10:00:00Z', profile: profileById('u5') },
  { id: 'f3', user_id: 'me', friend_id: 'u4', status: 'accepted', created_at: '2025-03-01T10:00:00Z', profile: profileById('u4') },
  { id: 'f4', user_id: 'u2', friend_id: 'me', status: 'pending', created_at: '2026-07-27T16:00:00Z', profile: profileById('u2') },
  { id: 'f5', user_id: 'me', friend_id: 'u6', status: 'accepted', created_at: '2025-04-01T10:00:00Z', profile: profileById('u6') },
];

export const cities = [
  'Sector 7 - Command HQ', 'Sector 4 - FOB Alpha', 'Sector 2 - Forward Base',
  'Sector 6 - Logistics', 'Sector 1 - Armor Division', 'Sector 5 - Airdrome',
  'Sector 3 - Deep Range', 'Sector 8 - Orbital Relay', 'Outpost Omega', 'Bastion Prime',
];

export const allInterests = [
  'Tactical Ops', 'Reconnaissance', 'Cryptology', 'UAV Piloting', 'Survival',
  'Ballistics', 'Cyber Defense', 'Signals Intelligence', 'Marksmanship', 'Camouflage',
  'Terrain Analysis', 'Demolitions', 'Armor', 'Triage', 'Emergency Medicine',
  'Drone Swarms', 'AI Targeting', 'Radar Systems', 'Electronic Warfare', 'Strategy',
];

export const personalityTypes = [
  'ESTJ-A', 'ESTJ-T', 'ENTJ-A', 'ENTJ-T', 'INTJ-A', 'INTJ-T',
  'ISTJ-A', 'ISTJ-T', 'ISTP-A', 'ISTP-T', 'ESTP-A', 'ESTP-T',
  'ENTP-A', 'ENTP-T', 'ENFJ-A', 'ENFJ-T', 'INFJ-A', 'INFJ-T',
];
