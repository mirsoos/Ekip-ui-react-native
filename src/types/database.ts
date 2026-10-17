// Ekip database types — maps to Supabase schema

export type Gender = 'male' | 'female' | 'nonbinary' | 'other';
export type GroupType = 'solo' | 'couple' | 'group';
export type GroupCategory = 'work' | 'entertainment';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type MemberRole = 'owner' | 'member';
export type MemberStatus = 'active' | 'left' | 'kicked';

export interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: Gender | null;
  age: number | null;
  city: string | null;
  job: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  interests: string[] | null;
  personality_type: string | null;
  social_links: Record<string, string> | null;
  is_premium: boolean;
  is_verified: boolean;
  is_identity_verified: boolean;
  level: number;
  xp: number;
  xp_to_next: number;
  honor_score: number;
  reputation_level: string;
  mood: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: GroupCategory;
  group_type: GroupType;
  min_members: number;
  max_members: number | null;
  city: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string[] | null;
  age_min: number | null;
  age_max: number | null;
  required_level: number | null;
  required_honor: number | null;
  gender_preference: Gender | 'any' | null;
  avg_cost: number | null;
  cover_url: string | null;
  premium_only: boolean;
  visibility: 'public' | 'private';
  auto_accept: boolean;
  is_repeating: boolean;
  event_date: string;
  views: number;
  member_count: number;
  created_at: string;
  owner?: Profile;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: string;
  profile?: Profile;
}

export interface GroupRequest {
  id: string;
  group_id: string;
  user_id: string;
  status: RequestStatus;
  message: string | null;
  created_at: string;
  group?: Group;
  profile?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  media_url: string | null;
  read_at: string | null;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title: string;
  avatar_url: string | null;
  group_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type:
    | 'chat'
    | 'friend_request'
    | 'group_request'
    | 'admin'
    | 'ticket'
    | 'subscription'
    | 'discount'
    | 'report'
    | 'achievement';
  title: string;
  body: string;
  icon: string;
  is_read: boolean;
  created_at: string;
}

export interface Badge {
  id: string;
  user_id: string | null;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned_at: string | null;
}

export interface Mission {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  xp_reward: number;
  icon: string;
  progress: number;
  target: number;
  is_complete: boolean;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  profile?: Profile;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      groups: { Row: Group; Insert: Partial<Group>; Update: Partial<Group> };
      group_members: { Row: GroupMember; Insert: Partial<GroupMember>; Update: Partial<GroupMember> };
      group_requests: { Row: GroupRequest; Insert: Partial<GroupRequest>; Update: Partial<GroupRequest> };
      messages: { Row: Message; Insert: Partial<Message>; Update: Partial<Message> };
      conversations: { Row: Conversation; Insert: Partial<Conversation>; Update: Partial<Conversation> };
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> };
      badges: { Row: Badge; Insert: Partial<Badge>; Update: Partial<Badge> };
      missions: { Row: Mission; Insert: Partial<Mission>; Update: Partial<Mission> };
      friendships: { Row: Friendship; Insert: Partial<Friendship>; Update: Partial<Friendship> };
    };
  };
}
