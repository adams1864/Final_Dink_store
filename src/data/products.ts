export interface Product {
  id: string;
  name: string;
  category: 'match-kits' | 'training' | 'casual' | 'accessories';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  sku: string;
  description: string;
  material: string;
  weight: string;
  fit: string;
  features: string[];
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

import {
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
} from '../assets';

export const products: Product[] = [
  {
    id: '1',
    name: 'Velocity Pro Home Kit',
    category: 'match-kits',
    gender: 'men',
    sku: 'DNK-001',
    description: 'Professional grade match kit featuring micro-mesh ventilation for optimal performance during intense matches.',
    material: '100% Polyester',
    weight: '140gsm',
    fit: 'Athletic Slim',
    features: ['Moisture Wicking', '4-Way Stretch', 'UV Protection', 'Anti-Bacterial', 'Breathable Mesh'],
    images: [photo1],
    isNew: true,
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'Elite Training Jersey',
    category: 'training',
    gender: 'unisex',
    sku: 'DNK-002',
    description: 'Lightweight training jersey designed for high-intensity workouts with superior breathability.',
    material: '90% Polyester, 10% Spandex',
    weight: '130gsm',
    fit: 'Regular',
    features: ['Quick Dry', 'Stretch Fabric', 'Moisture Control', 'Odor Resistant'],
    images: [photo2],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Strike Force Shorts',
    category: 'match-kits',
    gender: 'men',
    sku: 'DNK-003',
    description: 'Performance shorts with elastic waistband and built-in compression layer for maximum support.',
    material: '100% Polyester',
    weight: '150gsm',
    fit: 'Athletic',
    features: ['Elastic Waistband', 'Side Pockets', 'Compression Liner', 'Lightweight'],
    images: [photo3],
    isNew: true,
  },
  {
    id: '4',
    name: "Women's Performance Kit",
    category: 'match-kits',
    gender: 'women',
    sku: 'DNK-004',
    description: 'Tailored fit kit designed specifically for female athletes with ergonomic cut and premium fabric.',
    material: '92% Polyester, 8% Elastane',
    weight: '135gsm',
    fit: 'Athletic Fit',
    features: ['Feminine Cut', 'Moisture Wicking', 'Four-Way Stretch', 'Flatlock Seams'],
    images: [photo4],
    isBestSeller: true,
  },
  {
    id: '5',
    name: 'Youth Champion Kit',
    category: 'match-kits',
    gender: 'kids',
    sku: 'DNK-005',
    description: 'Durable and comfortable kit designed for young athletes with room for growth.',
    material: '100% Polyester',
    weight: '125gsm',
    fit: 'Relaxed',
    features: ['Soft Touch', 'Easy Care', 'Durable Stitching', 'Breathable'],
    images: [photo5],
    isNew: true,
  },
  {
    id: '6',
    name: 'Pro Training Tracksuit',
    category: 'training',
    gender: 'unisex',
    sku: 'DNK-006',
    description: 'Complete tracksuit set perfect for warm-ups and cool-downs with modern athletic design.',
    material: '85% Polyester, 15% Cotton',
    weight: '280gsm',
    fit: 'Regular',
    features: ['Full Zip', 'Side Pockets', 'Elastic Cuffs', 'Thermal Insulation'],
    images: [photo6],
  },
  {
    id: '7',
    name: 'Goalkeeper Elite Jersey',
    category: 'match-kits',
    gender: 'unisex',
    sku: 'DNK-007',
    description: 'Specialized goalkeeper jersey with padded elbows and reinforced shoulders for ultimate protection.',
    material: '100% Polyester',
    weight: '160gsm',
    fit: 'Regular Fit',
    features: ['Padded Elbows', 'Reinforced Shoulders', 'Grip Zones', 'Extra Length'],
    images: [photo7],
  },
  {
    id: '8',
    name: 'Performance Sports Socks',
    category: 'accessories',
    gender: 'unisex',
    sku: 'DNK-008',
    description: 'Technical sports socks with arch support and cushioned sole for all-day comfort.',
    material: '70% Cotton, 25% Polyester, 5% Elastane',
    weight: '50gsm',
    fit: 'Stretchable',
    features: ['Arch Support', 'Cushioned Sole', 'Moisture Wicking', 'Anti-Slip Grip'],
    images: [photo8],
    isNew: true,
    isBestSeller: true,
  },
];
