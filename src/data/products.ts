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

import football from '../assets/football.jpg';
import football1 from '../assets/football1.jpg';
import football2 from '../assets/football2.jpg';
import football3 from '../assets/football3.jpg';
import football4 from '../assets/football4.jpg';
import kits from '../assets/kits.jpg';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';

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
    images: [football3],
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
    images: [football2],
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
    images: [football4],
    isNew: true,
  },
  {
    id: '4',
    name: 'Women\'s Performance Kit',
    category: 'match-kits',
    gender: 'women',
    sku: 'DNK-004',
    description: 'Tailored fit kit designed specifically for female athletes with ergonomic cut and premium fabric.',
    material: '92% Polyester, 8% Elastane',
    weight: '135gsm',
    fit: 'Athletic Fit',
    features: ['Feminine Cut', 'Moisture Wicking', 'Four-Way Stretch', 'Flatlock Seams'],
    images: [football1],
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
    images: [football],
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
    images: [kits],
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
    images: [image2],
  },
  {
    id: '8',
    name: 'Compression Base Layer',
    category: 'training',
    gender: 'unisex',
    sku: 'DNK-008',
    description: 'Second-skin compression layer that enhances circulation and reduces muscle fatigue.',
    material: '80% Polyester, 20% Spandex',
    weight: '180gsm',
    fit: 'Compression',
    features: ['Graduated Compression', 'Muscle Support', 'Temperature Control', 'Seamless Design'],
    images: [image3],
    isBestSeller: true,
  },
  {
    id: '9',
    name: 'Casual Sports Polo',
    category: 'casual',
    gender: 'unisex',
    sku: 'DNK-009',
    description: 'Classic polo design with modern performance fabric, perfect for off-field wear.',
    material: '95% Cotton, 5% Elastane',
    weight: '200gsm',
    fit: 'Regular',
    features: ['Soft Cotton Blend', 'Collar Design', 'Button Placket', 'Breathable'],
    images: [image1],
  },
  {
    id: '10',
    name: 'Performance Sports Socks',
    category: 'accessories',
    gender: 'unisex',
    sku: 'DNK-010',
    description: 'Technical sports socks with arch support and cushioned sole for all-day comfort.',
    material: '70% Cotton, 25% Polyester, 5% Elastane',
    weight: '50gsm',
    fit: 'Stretchable',
    features: ['Arch Support', 'Cushioned Sole', 'Moisture Wicking', 'Anti-Slip Grip'],
    images: [image4],
    isNew: true,
  },
  {
    id: '11',
    name: 'Storm Shield Jacket',
    category: 'training',
    gender: 'unisex',
    sku: 'DNK-011',
    description: 'Lightweight windbreaker with water-resistant finish for training in unpredictable weather.',
    material: '100% Nylon',
    weight: '210gsm',
    fit: 'Regular',
    features: ['Water Resistant', 'Packable', 'Reflective Details', 'Adjustable Hood'],
    images: [kits],
    isNew: true,
  },
  {
    id: '12',
    name: 'Urban Casual Hoodie',
    category: 'casual',
    gender: 'unisex',
    sku: 'DNK-012',
    description: 'Soft fleece hoodie with athletic cut, perfect for travel and daily wear.',
    material: '60% Cotton, 40% Polyester',
    weight: '320gsm',
    fit: 'Relaxed',
    features: ['Soft Fleece', 'Kangaroo Pocket', 'Ribbed Cuffs', 'Drawstring Hood'],
    images: [image1],
    isBestSeller: true,
  },
  {
    id: '13',
    name: 'Pro Match Ball',
    category: 'accessories',
    gender: 'unisex',
    sku: 'DNK-013',
    description: 'FIFA-inspired match ball with textured panels for consistent flight and control.',
    material: 'PU Composite',
    weight: '430gsm',
    fit: 'Standard',
    features: ['Thermal Bonded', 'Textured Grip', 'Durable Bladder', 'All-Weather'],
    images: [football],
    isNew: true,
  },
];
