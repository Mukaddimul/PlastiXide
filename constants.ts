import { Voucher, MapPoint, Notification, Transaction, User } from './types';

export const APP_NAME = "PlastiXide";
export const TAGLINE = "Collect • Recycle • Reward";

// Mock Registered Fishermen/Hawkers for Collection Center
export const MOCK_REGISTERED_FISHERMEN = [
  { id: 'F-1001', name: 'Rahim Uddin', phone: '01712-345678', type: 'Fisherman' },
  { id: 'F-1002', name: 'Karim Miah', phone: '01823-456789', type: 'Fisherman' },
  { id: 'H-2001', name: 'Sujon Ahmed', phone: '01934-567890', type: 'Hawker' },
  { id: 'H-2002', name: 'Bilkis Begum', phone: '01745-678901', type: 'Hawker' },
  { id: 'F-1003', name: 'Jamal Hossain', phone: '01656-789012', type: 'Fisherman' },
];

// Mock Vouchers
export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: '1',
    partnerName: 'Foodpanda',
    description: '15% OFF your next meal',
    costPoints: 500,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Foodpanda_logo_orange_transparent.svg/2560px-Foodpanda_logo_orange_transparent.svg.png',
    category: 'FOOD',
    expiryDate: '2024-12-31'
  },
  {
    id: '2',
    partnerName: 'Uber',
    description: '$5 Ride Credit',
    costPoints: 1200,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    category: 'RIDE',
    expiryDate: '2024-11-30'
  },
  {
    id: '3',
    partnerName: 'Swap',
    description: '500 BDT Grocery Voucher',
    costPoints: 2000,
    logoUrl: 'https://play-lh.googleusercontent.com/Dk23c1P4C6sVdb0JqX84wG_QoJq_LhGqGg6W2gX84wG_QoJq_LhGqGg6W2gX84wG_Q=w240-h480-rw',
    category: 'SHOPPING',
    expiryDate: '2025-01-15'
  },
  {
    id: '4',
    partnerName: 'Pathao',
    description: 'Free Bike Ride (up to 2km)',
    costPoints: 800,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Pathao_Logo.svg/1200px-Pathao_Logo.svg.png',
    category: 'RIDE',
    expiryDate: '2024-12-20'
  }
];

export const MOCK_MAP_POINTS: MapPoint[] = [
  { id: 'm1', name: 'Gulshan 1 Vending Station', type: 'MACHINE', lat: 23.7925, lng: 90.4078, status: 'ONLINE', address: 'Gulshan Ave, Dhaka', capacity: 45 },
  { id: 'm2', name: 'Dhanmondi Lake Point', type: 'MACHINE', lat: 23.7461, lng: 90.3742, status: 'FULL', address: 'Lake View Rd, Dhaka', capacity: 98 },
  { id: 'c1', name: 'Mirpur Central Collection', type: 'CENTER', lat: 23.8103, lng: 90.3615, status: 'OPEN', address: 'Sec 10, Mirpur' },
  { id: 'm3', name: 'Banani Supermarket', type: 'MACHINE', lat: 23.7940, lng: 90.4043, status: 'MAINTENANCE', address: 'Banani Bazar', capacity: 0 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Reward Earned!', message: 'You earned 50 points for your recent submission.', date: '2 mins ago', read: false, type: 'REWARD' },
  { id: 'n2', title: 'New Partner: Aarong', message: 'Redeem points for Aarong lifestyle vouchers now!', date: '1 hour ago', read: false, type: 'SYSTEM' },
  { id: 'n3', title: 'Machine Alert', message: 'Dhanmondi Lake Point is currently full.', date: '3 hours ago', read: true, type: 'ALERT' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-20', amountKg: 1.2, pointsEarned: 120, location: 'Gulshan 1 Vending Station', type: 'DEPOSIT', status: 'COMPLETED' },
  { id: 't2', date: '2024-05-18', pointsEarned: -500, location: 'App Marketplace', type: 'REDEMPTION', status: 'COMPLETED' },
  { id: 't3', date: '2024-05-15', amountKg: 3.5, pointsEarned: 350, location: 'Mirpur Central Collection', type: 'DEPOSIT', status: 'COMPLETED' },
];

export const MOCK_FISHERMAN_TRANSACTIONS: Transaction[] = [
  { id: 'fp1', date: 'Today, 10:30 AM', amountKg: 12.5, cashEarned: 437, location: 'Mirpur Central Collection', type: 'DEPOSIT', status: 'COMPLETED' },
  { id: 'fp2', date: 'Yesterday, 4:15 PM', amountKg: 8.2, cashEarned: 287, location: 'Savar River Hub', type: 'DEPOSIT', status: 'COMPLETED' },
  { id: 'fp3', date: '18 May, 09:00 AM', amountKg: 25.0, cashEarned: 875, location: 'Mirpur Central Collection', type: 'DEPOSIT', status: 'COMPLETED' },
  { id: 'fp4', date: '15 May, 02:45 PM', amountKg: 15.5, cashEarned: 542, location: 'Gazipur Station', type: 'DEPOSIT', status: 'COMPLETED' },
];

export const MOCK_CHART_DATA = [
  { month: 'Jan', kgCollected: 400, pointsDistributed: 2400 },
  { month: 'Feb', kgCollected: 300, pointsDistributed: 1800 },
  { month: 'Mar', kgCollected: 550, pointsDistributed: 3300 },
  { month: 'Apr', kgCollected: 800, pointsDistributed: 4800 },
  { month: 'May', kgCollected: 700, pointsDistributed: 4200 },
  { month: 'Jun', kgCollected: 900, pointsDistributed: 5400 },
];