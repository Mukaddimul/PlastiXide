
import { Voucher, MapPoint, Notification, Transaction, User } from './types';

export const APP_NAME = "PlastiXide";
export const TAGLINE = "Collect • Recycle • Reward";

// Custom SVG Logo representing the PlastiXide Brand based on "Option 1: Highly Detailed" prompt
// Features: Green circle, White Machine with Dark Blue Outline, Bottle on Screen, Recycling Symbol, Ocean Waves, Curved Text.
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Large Solid Green Circle Background -->
  <circle cx="256" cy="256" r="230" fill="#15803D"/>
  
  <!-- Curved Text: COLLECT. RECYCLE. REWARD -->
  <path id="curve" d="M 136, 95 A 190, 190 0 0, 1 376, 95" fill="none"/>
  <text width="512" font-family="Montserrat, sans-serif" font-weight="bold" font-size="22" fill="white" letter-spacing="1.2">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">COLLECT. RECYCLE. REWARD</textPath>
  </text>

  <!-- Machine Body: Rectangular, white with dark blue outline -->
  <rect x="156" y="120" width="200" height="300" rx="16" fill="#FFFFFF" stroke="#1E3A8A" stroke-width="8"/>
  
  <!-- Machine Base/Shadow -->
  <path d="M 120 440 Q 256 460 392 440 L 356 425 H 156 Z" fill="#1E3A8A"/>

  <!-- Upper Section: Dark screen displaying a blue plastic bottle icon -->
  <rect x="180" y="150" width="90" height="90" rx="8" fill="#1E3A8A"/>
  
  <!-- Bottle Icon on Screen -->
  <path d="M220 165 L230 165 L232 175 H218 Z" fill="#38BDF8"/>
  <rect x="218" y="175" width="14" height="40" rx="2" fill="#38BDF8"/>
  <path d="M218 200 Q 225 215 232 200 V 190 H 218 Z" fill="#7DD3FC"/>

  <!-- Vents/Interface on the right side -->
  <rect x="285" y="155" width="40" height="50" rx="4" fill="#1E3A8A"/>
  <line x1="295" y1="165" x2="315" y2="165" stroke="#60A5FA" stroke-width="3"/>
  <line x1="295" y1="175" x2="315" y2="175" stroke="#60A5FA" stroke-width="3"/>
  <line x1="295" y1="185" x2="315" y2="185" stroke="#60A5FA" stroke-width="3"/>
  
  <rect x="285" y="215" width="40" height="50" rx="4" fill="#1E3A8A"/>
  <circle cx="305" cy="240" r="10" fill="#10B981"/>

  <!-- Stylized Blue Ocean Waves at Bottom -->
  <!-- Wave 1 (Back) -->
  <path d="M160 360 C 200 345, 240 390, 280 375 C 320 360, 352 380, 352 380 V 412 H 160 Z" fill="#3B82F6" opacity="0.8"/>
  <!-- Wave 2 (Front) -->
  <path d="M160 380 C 200 365, 250 405, 352 385 V 412 H 160 Z" fill="#0EA5E9"/>

  <!-- Center: Large Green Triangular Recycling Symbol (Mobius Loop) -->
  <g transform="translate(190, 260) scale(0.15)">
    <!-- Top Arrow -->
    <path d="M460 280 L 240 280 L 340 100 Z" fill="#16A34A"/>
    <path d="M340 100 L380 180 L300 180 Z" fill="#15803D"/> <!-- Depth detail -->
    
    <!-- Right Arrow -->
    <path d="M460 280 L 350 480 L 600 480 L 550 380 Z" fill="#16A34A"/> <!-- Simplified shape for robustness -->
    <path d="M460 280 L 350 480 L 600 480 Z" fill="#15803D" opacity="0.2"/>
    
    <!-- Left Arrow -->
    <path d="M240 280 L 130 480 L 350 480 Z" fill="#16A34A"/>
    
    <!-- Vector Overlay for Mobius Loop Look -->
    <path d="M350 180 L450 350 L250 350 Z" fill="#15803D" transform="rotate(0 350 300) translate(0, 50) scale(0.8)" />
    <path d="M350 180 L450 350 L250 350 Z" fill="#22C55E" transform="rotate(120 350 300) translate(0, 50) scale(0.8)" />
    <path d="M350 180 L450 350 L250 350 Z" fill="#4ADE80" transform="rotate(240 350 300) translate(0, 50) scale(0.8)" />
  </g>

  <!-- Bottom Text: PLASTIXIDE (Large Bold Dark Blue) -->
  <text x="256" y="490" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="56" fill="#1E3A8A" letter-spacing="-1" font-style="normal">PLASTIXIDE</text>
</svg>
`;

export const DEFAULT_LOGO_URL = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`;

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
  { id: 'fp5', date: '12 May, 11:20 AM', amountKg: 10.0, cashEarned: 350, location: 'Savar River Hub', type: 'DEPOSIT', status: 'COMPLETED' },
  { id: 'fp6', date: '10 May, 04:15 PM', amountKg: 5.5, cashEarned: 192, location: 'Mirpur Central Collection', type: 'DEPOSIT', status: 'COMPLETED' },
  { id: 'fp7', date: '08 May, 09:30 AM', amountKg: 18.2, cashEarned: 637, location: 'Gazipur Station', type: 'DEPOSIT', status: 'COMPLETED' },
];

export const MOCK_CHART_DATA = [
  { month: 'Jan', kgCollected: 400, pointsDistributed: 2400 },
  { month: 'Feb', kgCollected: 300, pointsDistributed: 1800 },
  { month: 'Mar', kgCollected: 550, pointsDistributed: 3300 },
  { month: 'Apr', kgCollected: 800, pointsDistributed: 4800 },
  { month: 'May', kgCollected: 700, pointsDistributed: 4200 },
  { month: 'Jun', kgCollected: 900, pointsDistributed: 5400 },
];
