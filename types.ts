export enum UserRole {
  CITIZEN = 'CITIZEN',
  FISHERMAN = 'FISHERMAN',
  COLLECTION_CENTER = 'COLLECTION_CENTER',
  CORPORATE = 'CORPORATE',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  points: number;
  walletBalance: number; // For fishermen (Cash) or Corporate (Credit)
  totalPlasticRecycled: number; // in kg
  impactScore: number;
  phone: string;
  email?: string;
  avatarUrl?: string;
}

export interface Voucher {
  id: string;
  partnerName: string;
  description: string;
  costPoints: number;
  logoUrl: string;
  category: 'FOOD' | 'RIDE' | 'SHOPPING' | 'LIFESTYLE';
  expiryDate: string;
  code?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amountKg?: number;
  pointsEarned?: number;
  cashEarned?: number;
  location: string;
  type: 'DEPOSIT' | 'REDEMPTION' | 'SALE' | 'PURCHASE';
  status: 'COMPLETED' | 'PENDING';
}

export interface MapPoint {
  id: string;
  name: string;
  type: 'MACHINE' | 'CENTER';
  lat: number;
  lng: number;
  status: 'ONLINE' | 'FULL' | 'MAINTENANCE' | 'OPEN';
  address: string;
  capacity?: number; // % full
}

export interface CollectionEntry {
  id: string;
  userId: string; // Fisherman ID
  userName: string;
  weight: number;
  paymentAmount: number;
  timestamp: string;
  centerId: string;
  proofImageUrl?: string;
}

export interface CorporateOrder {
  id: string;
  companyName: string;
  plasticType: string;
  amountKg: number;
  totalCost: number;
  status: 'PENDING' | 'FULFILLED';
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'REWARD' | 'SYSTEM' | 'ALERT';
}

export interface ScanResult {
  isPlastic: boolean;
  plasticType?: string;
  estimatedWeight?: number; // rough AI estimate
  confidence?: number;
  message: string;
}