import mytLogo from '../assets/myt-logo.png';

export const SITE = {
  name: 'MYT',
  tagline: 'Ecommerce Business',
  email: 'yaz.info@gmail.com',
  phones: ['0934010984', '0987516251', '0944721607'],
  telegramUrl: 'https://t.me/MYT_ECommerce',
  telegramHandle: '@MYT_ECommerce',
  logisticsTitle: 'Logistics — Delivery across Ethiopia',
  logisticsDescription:
    'We deliver orders across Ethiopia. Support & logistics coverage includes the following cities and hubs:',
  deliveryCities: [
    { name: 'Bole, Addis Ababa', note: 'Main hub' },
    { name: 'Dire Dawa', note: 'Eastern Ethiopia' },
    { name: 'Hawassa', note: 'Southern Ethiopia' },
    { name: 'Bahir Dar', note: 'Amhara region' },
  ],
  businessHours: {
    weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
    saturday: 'Saturday: 9:00 AM - 1:00 PM',
    sunday: 'Sunday: Closed',
  },
} as const;

export function phoneTelLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `+251${digits.slice(1)}`;
  }
  if (digits.startsWith('251')) {
    return `+${digits}`;
  }
  return `+251${digits}`;
}

export { mytLogo as brandLogo };
