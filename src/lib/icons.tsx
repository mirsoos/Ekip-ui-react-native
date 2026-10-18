import React from 'react';
import {
  Bell, MessageCircle, Compass, User, Plus, Search, Settings, MapPin,
  Calendar, Users, Heart, Shield, Crown, Zap, Target, Trophy, Sparkles,
  Camera, Image, Video, Smile, Send, Check, X, ChevronRight, ChevronLeft,
  ChevronDown, MoreHorizontal, MoreVertical, Eye, EyeOff, Lock, Mail,
  Phone, ArrowLeft, ArrowRight, LogOut, Edit, Trash, Flag, Ban, UserPlus,
  UserCheck, Clock, Star, Award, TrendingUp, Flame, Gift, Info, ChevronUp,
  Wifi, Battery, Signal, Moon, Sun, Filter, SlidersHorizontal, Share,
  Copy, Link, Bookmark, ThumbsUp, MessageSquare, CircleDot, PartyPopper,
  Briefcase, Gamepad2, Music, Dumbbell, Coffee, Utensils, Plane, BookOpen,
  Palette, Hash, Globe, BadgeCheck, ShieldCheck, Play, Pause,
  SkipForward, Volume2, Layers, MapPinned, Route, Circle, CheckCircle2,
  AlertCircle, XCircle, PlusCircle, MinusCircle, ArrowUpRight, RefreshCw,
  Power, Fingerprint, Brush, Rocket, Activity, BarChart3, LineChart, Brain,
  Radio, type LucideIcon,
} from 'lucide-react-native';

export const Icons = {
  Bell, MessageCircle, Compass, User, Plus, Search, Settings, MapPin,
  Calendar, Users, Heart, Shield, Crown, Zap, Target, Trophy, Sparkles,
  Camera, Image, Video, Smile, Send, Check, X, ChevronRight, ChevronLeft,
  ChevronDown, MoreHorizontal, MoreVertical, Eye, EyeOff, Lock, Mail,
  Phone, ArrowLeft, ArrowRight, LogOut, Edit, Trash, Flag, Ban, UserPlus,
  UserCheck, Clock, Star, Award, TrendingUp, Flame, Gift, Info, ChevronUp,
  Wifi, Battery, Signal, Moon, Sun, Filter, SlidersHorizontal, Share,
  Copy, Link, Bookmark, ThumbsUp, MessageSquare, CircleDot, PartyPopper,
  Briefcase, Gamepad2, Music, Dumbbell, Coffee, Utensils, Plane, BookOpen,
  Palette, Hash, Globe, Verified: BadgeCheck, BadgeCheck, ShieldCheck, Play, Pause,
  SkipForward, Volume2, Layers, MapPinned, Route, Circle, CheckCircle2,
  AlertCircle, XCircle, PlusCircle, MinusCircle, ArrowUpRight, RefreshCw,
  Power, Fingerprint, Brush, Rocket, Activity, BarChart3, LineChart, Brain,
  Radio,
};

export type IconName = keyof typeof Icons;

export function getIcon(name: string): LucideIcon {
  return (Icons as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}
