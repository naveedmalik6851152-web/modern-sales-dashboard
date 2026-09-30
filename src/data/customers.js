import { mulberry32, weighted, int } from '@/utils/random';
import { slugify } from '@/utils/format';

// [name, company, country, city]
const RAW = [
  ['Ava Thompson', 'Brightwave', 'United States', 'Austin'],
  ['Liam Carter', 'Northfield Labs', 'United States', 'Seattle'],
  ['Sofia Rossi', 'Studio Lume', 'Italy', 'Milan'],
  ['Noah Kim', 'Kite & Co', 'South Korea', 'Seoul'],
  ['Amara Okafor', 'Tidal Works', 'Nigeria', 'Lagos'],
  ['Mateo García', 'Olivar Foods', 'Spain', 'Valencia'],
  ['Yuki Tanaka', 'Hinode Design', 'Japan', 'Osaka'],
  ['Hannah Müller', 'Rheinwerk', 'Germany', 'Hamburg'],
  ['Omar Farouk', 'Nile & Stone', 'Egypt', 'Cairo'],
  ['Priya Sharma', 'Lotus Analytics', 'India', 'Bengaluru'],
  ['Lucas Martin', 'Atelier Neuf', 'France', 'Lyon'],
  ['Emma Wilson', 'Harbour Goods', 'United Kingdom', 'Bristol'],
  ['Bilal Ahmed', 'Sindhu Supply', 'Pakistan', 'Karachi'],
  ['Ethan Brown', 'Ridgeline', 'Canada', 'Toronto'],
  ['Isabella Silva', 'Costa Verde', 'Brazil', 'São Paulo'],
  ['Mohammed Al-Farsi', 'Gulf Trade Co', 'United Arab Emirates', 'Dubai'],
  ['Ayesha Raza', 'Indus Traders', 'Pakistan', 'Lahore'],
  ['Olivia Nguyen', 'Saigon Studio', 'Vietnam', 'Ho Chi Minh City'],
  ['Daniel Lee', 'Pinecone', 'Australia', 'Melbourne'],
  ['Chloé Dubois', 'Maison Clair', 'France', 'Paris'],
  ['Arjun Mehta', 'Orbit Retail', 'India', 'Mumbai'],
  ['Grace Adeyemi', 'Kora Living', 'Nigeria', 'Abuja'],
  ['Hamza Sheikh', 'Kohistan Retail', 'Pakistan', 'Rawalpindi'],
  ['Jonas Lindqvist', 'Fjord & Co', 'Sweden', 'Stockholm'],
  ['Mei Lin', 'Jade Labs', 'Singapore', 'Singapore'],
  ['Carlos Ramírez', 'Sol Naciente', 'Mexico', 'Mexico City'],
  ['Fatima Zahra', 'Atlas Home', 'Morocco', 'Casablanca'],
  ['Ryan O’Connor', 'Emerald Supply', 'Ireland', 'Dublin'],
  ['Anika Kowalska', 'Vistula Digital', 'Poland', 'Warsaw'],
  ['Tariq Hussain', 'Crescent Mart', 'Pakistan', 'Islamabad'],
  ['Ben Harris', 'Copperline', 'United States', 'Denver'],
  ['Layla Haddad', 'Cedar Trading', 'Lebanon', 'Beirut'],
  ['Victor Costa', 'Tejo Studio', 'Portugal', 'Lisbon'],
  ['Naomi Clarke', 'Wren & Willow', 'United Kingdom', 'London'],
  ['Kenji Sato', 'Sakura Tech', 'Japan', 'Tokyo'],
  ['Elena Popescu', 'Danube Home', 'Romania', 'Bucharest'],
  ['Marcus Bell', 'Foundry 42', 'United States', 'Chicago'],
  ['Aisha Bello', 'Baobab Goods', 'Ghana', 'Accra'],
  ['Sara Iqbal', 'Faisalabad Textiles', 'Pakistan', 'Faisalabad'],
  ['Henrik Larsen', 'Nordhavn', 'Denmark', 'Copenhagen'],
  ['Tomás Herrera', 'Andes Outfitters', 'Chile', 'Santiago'],
  ['Zoe Adams', 'Fieldnote', 'United States', 'Portland'],
  ['Rahul Verma', 'Spice Route', 'India', 'Delhi'],
  ['Usman Tariq', 'Kohat Traders', 'Pakistan', 'Peshawar'],
];

const DIAL = {
  'United States': '+1',
  Canada: '+1',
  Italy: '+39',
  'South Korea': '+82',
  Nigeria: '+234',
  Spain: '+34',
  Japan: '+81',
  Germany: '+49',
  Egypt: '+20',
  India: '+91',
  France: '+33',
  'United Kingdom': '+44',
  Pakistan: '+92',
  Brazil: '+55',
  'United Arab Emirates': '+971',
  Vietnam: '+84',
  Australia: '+61',
  Sweden: '+46',
  Singapore: '+65',
  Mexico: '+52',
  Morocco: '+212',
  Ireland: '+353',
  Poland: '+48',
  Lebanon: '+961',
  Portugal: '+351',
  Romania: '+40',
  Ghana: '+233',
  Denmark: '+45',
  Chile: '+56',
};

const NOW = Date.now();
const DAY = 86400000;

export const customers = RAW.map(([name, company, country, city], i) => {
  const rand = mulberry32(9100 + i * 17);
  const first = slugify(name.split(' ')[0]);
  const last = slugify(name.split(' ').slice(1).join(' '));
  const tier = weighted(rand, [
    ['VIP', 20],
    ['Regular', 58],
    ['New', 22],
  ]);
  const joinedDaysAgo = tier === 'New' ? int(rand, 4, 45) : int(rand, 60, 900);
  return {
    id: `CUS-${1001 + i}`,
    name,
    email: `${first}.${last}@${slugify(company)}.com`,
    phone: `${DIAL[country] || '+1'} ${int(rand, 200, 999)} ${int(rand, 100, 999)} ${int(rand, 1000, 9999)}`,
    company,
    country,
    city,
    status: weighted(rand, [
      ['Active', 76],
      ['Inactive', 24],
    ]),
    tier,
    joinedAt: new Date(NOW - joinedDaysAgo * DAY).toISOString(),
    notes: '',
  };
});

export const COUNTRIES = [...new Set(customers.map((c) => c.country))].sort();
