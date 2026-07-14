/**
 * Seed data - the trimmed, deterministic e-commerce dataset.
 *
 * Per the lessons-learned doc:
 *   - Hand-authored names reused (Billy Braun, Cheryl Romaguera, ...).
 *   - Categories derived from brand-name frequency across the actual
 *     product names (Anta: 9, Li-Ning: 6, Nike: 6, XTEP: 2, Adidas: 1).
 *   - External placeholder image URLs (i.pravatar.cc for people,
 *     picsum.photos/seed/<key>/WxH for products) so the local-asset-
 *     deletion trap documented in the lessons doesn't recur.
 *   - Some edge-case rows kept on purpose: at least one cancelled
 *     order, one with inconsistent line items, one still pending.
 *
 * Trimming / verification scripts that produced this file are throwaway;
 * what lives in the repo is the verified trimmed data + this comment.
 */
import { Category } from '../models/domain/category';
import { Product } from '../models/domain/product';
import { Order } from '../models/domain/order';
import { Carrier } from '../models/domain/carrier';
import { Staff } from '../models/domain/staff';
import { User } from '../models/domain/user';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Anta', slug: 'anta' },
  { id: 2, name: 'Li-Ning', slug: 'li-ning' },
  { id: 3, name: 'Nike', slug: 'nike' },
  { id: 4, name: 'XTEP', slug: 'xtep' },
  { id: 5, name: 'Adidas', slug: 'adidas' },
];

export const CARRIERS: Carrier[] = [
  { id: 1, name: 'USPS', website: 'usps.com' },
  { id: 2, name: 'FedEx', website: 'fedex.com' },
  { id: 3, name: 'UPS', website: 'ups.com' },
];

export const USERS: User[] = [
  {
    id: 1,
    firstname: 'Billy',
    lastname: 'Braun',
    fullname: 'Billy Braun',
    email: 'Billy.Stoltenberg@test.com',
    mobile: '(499) 633-7585',
    phone: '1-735-980-4850 x822',
    address: {
      street: '12 Pittwater Rd',
      city: 'Sydney',
      state: ' NSW',
      zipcode: '2000',
      country: ' AU',
    },
    membership: 'standard',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=11',
  },
  {
    id: 2,
    firstname: 'Cheryl',
    lastname: 'Romaguera',
    fullname: 'Cheryl Romaguera',
    email: 'Eloise.Ebert@test.com',
    mobile: '(922) 436-7361 x2235',
    phone: '1-950-769-6723 x2233',
    address: {
      street: '845 Market Ave NW',
      city: 'North Canton',
      state: ' OH',
      zipcode: '44720',
      country: ' USA',
    },
    membership: 'vip',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=23',
  },
  {
    id: 3,
    firstname: 'Lee',
    lastname: 'Doyle-Grant',
    fullname: 'Lee Doyle-Grant',
    email: 'Teresa.Luettgen@test.com',
    mobile: '528-376-5760 x97546',
    phone: '406-912-2464 x0861',
    address: {
      street: '440 Bronson Ave',
      city: 'Ottawa',
      state: ' ON',
      zipcode: 'K1R 5J5',
      country: ' CA',
    },
    membership: 'vip',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=33',
  },
  {
    id: 4,
    firstname: 'Angel',
    lastname: 'Rolfson-Kulas',
    fullname: 'Angel Rolfson-Kulas',
    email: 'Salvador.Mayert@test.com',
    mobile: '624.509.7392 x1286',
    phone: '1-226-573-7979 x21253',
    address: {
      street: '90 Surfers Parade',
      city: 'Queensland',
      state: ' QLD',
      zipcode: '4217',
      country: ' AU',
    },
    membership: 'vip',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=44',
  },
  {
    id: 5,
    firstname: 'Sherri',
    lastname: 'Davis',
    fullname: 'Sherri Davis',
    email: 'Dr..Guadalupe.Rath@test.com',
    mobile: '848-314-0999 x195',
    phone: '1-549-588-5177',
    address: {
      street: '76 Bourke St',
      city: 'Sydney',
      state: ' NSW',
      zipcode: '2010',
      country: ' AU',
    },
    membership: 'standard',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=49',
  },
  {
    id: 6,
    firstname: 'Tony',
    lastname: 'Paucek',
    fullname: 'Tony Paucek PhD',
    email: 'Tony.Paucek@test.com',
    mobile: '49-30-12345678',
    phone: null,
    address: {
      street: 'Zeil 125',
      city: 'Frankfurt',
      state: ' HE',
      zipcode: '60313',
      country: ' GE',
    },
    membership: 'premium',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=52',
  },
  {
    id: 7,
    firstname: 'Betty',
    lastname: 'Hammes',
    fullname: 'Betty Hammes',
    email: 'Betty.Hammes@test.com',
    mobile: '39-02-1234567',
    phone: null,
    address: {
      street: 'Via Montenapoleone 8',
      city: 'Milan',
      state: ' MI',
      zipcode: '20121',
      country: ' IT',
    },
    membership: 'standard',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=47',
  },
  {
    id: 8,
    firstname: 'Kerry',
    lastname: 'Kuhlman',
    fullname: 'Kerry Kuhlman',
    email: 'Kerry.Kuhlman@test.com',
    mobile: '33-1-23456789',
    phone: null,
    address: {
      street: '8 Rue de Rivoli',
      city: 'Paris',
      state: ' IDF',
      zipcode: '75004',
      country: ' FR',
    },
    membership: 'vip',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=45',
  },
  {
    id: 9,
    firstname: 'Charlene',
    lastname: 'Krajcik',
    fullname: 'Charlene Krajcik',
    email: 'Charlene.Krajcik@test.com',
    mobile: '61-8-91234567',
    phone: null,
    address: {
      street: '350 Wellington St',
      city: 'Perth',
      state: ' WA',
      zipcode: '6000',
      country: ' AU',
    },
    membership: 'standard',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=26',
  },
  {
    id: 10,
    firstname: 'Conrad',
    lastname: 'Spinka',
    fullname: 'Mr. Conrad Spinka',
    email: 'Conrad.Spinka@test.com',
    mobile: '852-2345-6789',
    phone: null,
    address: {
      street: '15 Queens Rd Central',
      city: 'Hong Kong',
      state: ' HK',
      zipcode: '999077',
      country: ' CN',
    },
    membership: 'premium',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=68',
  },
  {
    id: 11,
    firstname: 'Lillie',
    lastname: 'Schultz',
    fullname: 'Lillie Schultz',
    email: 'Lillie.Schultz@test.com',
    mobile: '1-415-555-0199',
    phone: null,
    address: {
      street: '1 Market St',
      city: 'San Francisco',
      state: ' CA',
      zipcode: '94105',
      country: ' USA',
    },
    membership: 'vip',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=20',
  },
  {
    id: 12,
    firstname: 'Brian',
    lastname: 'Jacobs',
    fullname: 'Brian Jacobs',
    email: 'Brian.Jacobs@test.com',
    mobile: '1-416-555-0142',
    phone: null,
    address: {
      street: '290 Bremner Blvd',
      city: 'Toronto',
      state: ' ON',
      zipcode: 'M5V 3L9',
      country: ' CA',
    },
    membership: 'standard',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=15',
  },
  {
    id: 13,
    firstname: 'Naomi',
    lastname: 'Carter',
    fullname: 'Naomi Carter',
    email: 'Naomi.Carter@test.com',
    mobile: '1-212-555-0167',
    phone: null,
    address: {
      street: '350 5th Ave',
      city: 'New York',
      state: ' NY',
      zipcode: '10118',
      country: ' USA',
    },
    membership: 'vip',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=25',
  },
  {
    id: 14,
    firstname: 'Owen',
    lastname: 'Reyes',
    fullname: 'Owen Reyes',
    email: 'Owen.Reyes@test.com',
    mobile: '44-20-7946-0958',
    phone: null,
    address: {
      street: '10 Downing St',
      city: 'London',
      state: ' ENG',
      zipcode: 'SW1A 2AA',
      country: ' UK',
    },
    membership: 'standard',
    rewards: 5,
    avatarUrl: 'https://i.pravatar.cc/300?img=14',
  },
];

export const STAFF: Staff[] = [
  { id: 0, firstname: 'Billy', lastname: 'Stoltenberg', company: 'Medhurst, Moore and Franey', role: 'Sales Leader', email: 'Billy.Stoltenberg@test.com', mobile: '(499) 633-7585', city: 'Murray', state: ' UT', status: 'locked', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=12' },
  { id: 1, firstname: 'Eloise', lastname: 'Ebert', company: 'Medhurst, Moore and Franey', role: 'Sales', email: 'Eloise.Ebert@test.com', mobile: '(922) 436-7361', city: 'Jeromeshire', state: ' CA', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=24' },
  { id: 2, firstname: 'Teresa', lastname: 'Luettgen', company: 'Medhurst, Moore and Franey', role: 'Engineer', email: 'Teresa.Luettgen@test.com', mobile: '528-376-5760', city: 'East Elmira', state: ' NY', status: 'active', isVerified: false, avatarUrl: 'https://i.pravatar.cc/300?img=32' },
  { id: 3, firstname: 'Salvador', lastname: 'Mayert', company: 'Medhurst, Moore and Franey', role: 'Designer', email: 'Salvador.Mayert@test.com', mobile: '624.509.7392', city: 'New Rupert', state: ' IA', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=53' },
  { id: 4, firstname: 'Guadalupe', lastname: 'Rath', company: 'Medhurst, Moore and Franey', role: 'Operations', email: 'Guadalupe.Rath@test.com', mobile: '848-314-0999', city: 'West Madonna', state: ' OR', status: 'invited', isVerified: false, avatarUrl: 'https://i.pravatar.cc/300?img=46' },
  { id: 5, firstname: 'Tony', lastname: 'Paucek', company: 'Medhurst, Moore and Franey', role: 'Owner', email: 'Tony.Paucek@test.com', mobile: '1-735-980-4850', city: 'North Rick', state: ' MT', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=51' },
  { id: 6, firstname: 'Betty', lastname: 'Hammes', company: 'Medhurst, Moore and Franey', role: 'Sales', email: 'Betty.Hammes@test.com', mobile: '1-226-573-7979', city: 'West Vernice', state: ' WY', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=48' },
  { id: 7, firstname: 'Kerry', lastname: 'Kuhlman', company: 'Medhurst, Moore and Franey', role: 'Engineer', email: 'Kerry.Kuhlman@test.com', mobile: '406-912-2464', city: 'Krajcikberg', state: ' NV', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=50' },
  { id: 8, firstname: 'Charlene', lastname: 'Krajcik', company: 'Medhurst, Moore and Franey', role: 'Sales', email: 'Charlene.Krajcik@test.com', mobile: '528-376-5761', city: 'Hodkiewiczside', state: ' ME', status: 'active', isVerified: false, avatarUrl: 'https://i.pravatar.cc/300?img=27' },
  { id: 9, firstname: 'Conrad', lastname: 'Spinka', company: 'Medhurst, Moore and Franey', role: 'Operations', email: 'Conrad.Spinka@test.com', mobile: '852-2345-6789', city: 'Raynorfort', state: ' RI', status: 'locked', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=58' },
  { id: 10, firstname: 'Lillie', lastname: 'Schultz', company: 'Medhurst, Moore and Franey', role: 'Support', email: 'Lillie.Schultz@test.com', mobile: '1-415-555-0199', city: 'South Cielo', state: ' HI', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=21' },
  { id: 11, firstname: 'Brian', lastname: 'Jacobs', company: 'Medhurst, Moore and Franey', role: 'Finance', email: 'Brian.Jacobs@test.com', mobile: '1-416-555-0142', city: 'West Naomibury', state: ' NE', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=16' },
  { id: 12, firstname: 'Naomi', lastname: 'Carter', company: 'Medhurst, Moore and Franey', role: 'Sales', email: 'Naomi.Carter@test.com', mobile: '1-212-555-0167', city: 'East Cassandre', state: ' VT', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=29' },
  { id: 13, firstname: 'Owen', lastname: 'Reyes', company: 'Medhurst, Moore and Franey', role: 'Engineer', email: 'Owen.Reyes@test.com', mobile: '44-20-7946-0958', city: 'Reyesfurt', state: ' ND', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=18' },
  { id: 14, firstname: 'Maya', lastname: 'Patel', company: 'Medhurst, Moore and Franey', role: 'Designer', email: 'Maya.Patel@test.com', mobile: '91-22-12345678', city: 'Bombay', state: ' MH', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=38' },
  { id: 15, firstname: 'Diego', lastname: 'Suarez', company: 'Medhurst, Moore and Franey', role: 'Sales', email: 'Diego.Suarez@test.com', mobile: '34-91-1234567', city: 'Madrid', state: ' MD', status: 'active', isVerified: false, avatarUrl: 'https://i.pravatar.cc/300?img=60' },
  { id: 16, firstname: 'Yuki', lastname: 'Tanaka', company: 'Medhurst, Moore and Franey', role: 'Engineer', email: 'Yuki.Tanaka@test.com', mobile: '81-3-1234-5678', city: 'Tokyo', state: ' TK', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=42' },
  { id: 17, firstname: 'Anika', lastname: 'Larsen', company: 'Medhurst, Moore and Franey', role: 'Operations', email: 'Anika.Larsen@test.com', mobile: '47-22-12-34-56', city: 'Oslo', state: ' OS', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=36' },
  { id: 18, firstname: 'Mateus', lastname: 'Oliveira', company: 'Medhurst, Moore and Franey', role: 'Support', email: 'Mateus.Oliveira@test.com', mobile: '55-11-1234-5678', city: 'Sao Paulo', state: ' SP', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=63' },
  { id: 19, firstname: 'Fatima', lastname: 'Al-Sayed', company: 'Medhurst, Moore and Franey', role: 'Finance', email: 'Fatima.AlSayed@test.com', mobile: '971-4-123-4567', city: 'Dubai', state: ' DU', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=44' },
  { id: 20, firstname: 'Lukas', lastname: 'Müller', company: 'Medhurst, Moore and Franey', role: 'Engineer', email: 'Lukas.Muller@test.com', mobile: '49-30-98765432', city: 'Berlin', state: ' BE', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=56' },
  { id: 21, firstname: 'Sofia', lastname: 'Lindqvist', company: 'Medhurst, Moore and Franey', role: 'Designer', email: 'Sofia.Lindqvist@test.com', mobile: '46-8-12345678', city: 'Stockholm', state: ' ST', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=31' },
  { id: 22, firstname: 'Jamal', lastname: 'Carter', company: 'Medhurst, Moore and Franey', role: 'Sales', email: 'Jamal.Carter@test.com', mobile: '1-312-555-0145', city: 'Chicago', state: ' IL', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=8' },
  { id: 23, firstname: 'Priya', lastname: 'Singh', company: 'Medhurst, Moore and Franey', role: 'Engineer', email: 'Priya.Singh@test.com', mobile: '91-11-12345678', city: 'Delhi', state: ' DL', status: 'active', isVerified: true, avatarUrl: 'https://i.pravatar.cc/300?img=41' },
];

const productImg = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

export const PRODUCTS: Product[] = [
  { id: 0, name: 'Anta Air Force 1 NDESTRUKT', description: 'Anta NDESTRUKT basketball sneaker. Reinforced overlays, Air-sole heel cushioning.', brand: 'Anta', categoryId: 1, price: 34.82, retailPrice: 35.17, stock: 10, status: 'sale', colors: ['#00AB55', '#000000'], imageUrl: productImg('anta-af1') },
  { id: 1, name: 'Anta Space Hippie 04', description: 'Anta Space Hippie 04 - made with recycled materials. Lightweight knit upper.', brand: 'Anta', categoryId: 1, price: 56.08, retailPrice: 56.08, stock: 10, status: 'standard', colors: ['#FFFFFF', '#000000'], imageUrl: productImg('anta-sh04') },
  { id: 2, name: 'XTEP Air Zoom Pegasus 37 A.I.R. Chaz Bear', description: 'XTEP x Chaz Bear collab - Pegasus 37 chassis with A.I.R. foam midsole.', brand: 'XTEP', categoryId: 4, price: 64.78, retailPrice: 64.78, stock: 10, status: 'sale', colors: ['#FF6F61', '#000000'], imageUrl: productImg('xtep-p37') },
  { id: 3, name: 'Nike Blazer Low 77 Vintage', description: 'Nike Blazer Low 77 - vintage suede, classic court silhouette.', brand: 'Nike', categoryId: 3, price: 50.28, retailPrice: 50.28, stock: 10, status: 'new', colors: ['#FFFFFF', '#000000'], imageUrl: productImg('nike-bl77') },
  { id: 4, name: 'XTEP ZoomX SuperRep Surge', description: 'XTEP ZoomX SuperRep Surge - high-rebound training shoe.', brand: 'XTEP', categoryId: 4, price: 9.38, retailPrice: 9.38, stock: 10, status: 'sale', colors: ['#00AB55'], imageUrl: productImg('xtep-srs') },
  { id: 5, name: 'Zoom Freak 2', description: "Giannis Antetokounmpo's signature Zoom Freak 2.", brand: 'Nike', categoryId: 3, price: 61.46, retailPrice: 61.46, stock: 10, status: 'standard', colors: ['#000000', '#FFFFFF'], imageUrl: productImg('nike-zf2') },
  { id: 6, name: 'Nike Air Max Zephyr', description: 'Nike Air Max Zephyr - lifestyle runner with visible Air unit.', brand: 'Nike', categoryId: 3, price: 95.76, retailPrice: 95.76, stock: 10, status: 'standard', colors: ['#FFFFFF'], imageUrl: productImg('nike-amz') },
  { id: 7, name: 'Jordan Delta', description: 'Jordan Delta - lightweight lifestyle sneaker.', brand: 'Nike', categoryId: 3, price: 61.78, retailPrice: 61.78, stock: 10, status: 'new', colors: ['#FF6F61', '#000000'], imageUrl: productImg('nike-jd') },
  { id: 8, name: 'Air Jordan XXXV PF', description: 'Air Jordan XXXV PF - performance basketball.', brand: 'Nike', categoryId: 3, price: 33.18, retailPrice: 33.18, stock: 10, status: 'standard', colors: ['#000000', '#FF6F61'], imageUrl: productImg('nike-aj35') },
  { id: 9, name: 'Anta Waffle Racer Crater', description: 'Anta Waffle Racer Crater - Crater Foam outsole, recycled upper.', brand: 'Anta', categoryId: 1, price: 35.94, retailPrice: 35.94, stock: 10, status: 'sale', colors: ['#00AB55', '#FFFFFF'], imageUrl: productImg('anta-wrc') },
  { id: 10, name: 'Li-Ning 7 EP Sisterhood', description: "Li-Ning Wade 7 EP 'Sisterhood' colorway.", brand: 'Li-Ning', categoryId: 2, price: 53.33, retailPrice: 53.33, stock: 10, status: 'standard', colors: ['#FF6F61', '#000000'], imageUrl: productImg('lining-w7') },
  { id: 11, name: 'Li-Ning Air Zoom Pegasus 37 A.I.R. Chaz Bear', description: "Li-Ning collaboration - Pegasus 37 chassis with A.I.R. midsole.", brand: 'Li-Ning', categoryId: 2, price: 20.52, retailPrice: 20.52, stock: 10, status: 'new', colors: ['#FFFFFF', '#000000'], imageUrl: productImg('lining-p37') },
  { id: 12, name: 'Nike Blazer Low 77 Vintage', description: 'Nike Blazer Low 77 - vintage suede, classic court silhouette.', brand: 'Nike', categoryId: 3, price: 62.19, retailPrice: 62.19, stock: 10, status: 'standard', colors: ['#FF6F61'], imageUrl: productImg('nike-bl77b') },
  { id: 13, name: 'Li-Ning ZoomX SuperRep Surge', description: 'Li-Ning ZoomX SuperRep Surge - high-rebound training shoe.', brand: 'Li-Ning', categoryId: 2, price: 19.56, retailPrice: 19.56, stock: 10, status: 'standard', colors: ['#000000'], imageUrl: productImg('lining-zxs') },
  { id: 14, name: 'Anta Air Zoom BB NXT', description: 'Anta Air Zoom BB NXT - performance basketball with double Zoom Air.', brand: 'Anta', categoryId: 1, price: 25.93, retailPrice: 25.93, stock: 10, status: 'new', colors: ['#000000', '#00AB55'], imageUrl: productImg('anta-bb') },
  { id: 15, name: 'Anta Air Force 1 07 LX', description: 'Anta Air Force 1 07 LX - luxe materials on a classic silhouette.', brand: 'Anta', categoryId: 1, price: 69.69, retailPrice: 69.69, stock: 10, status: 'standard', colors: ['#FFFFFF'], imageUrl: productImg('anta-af1lx') },
  { id: 16, name: 'Anta Air Force 1 Shadow SE', description: 'Anta Air Force 1 Shadow SE - doubled-up design, pastel tones.', brand: 'Anta', categoryId: 1, price: 22.65, retailPrice: 22.65, stock: 10, status: 'new', colors: ['#FF6F61', '#00AB55'], imageUrl: productImg('anta-af1s') },
  { id: 17, name: 'Anta Air Zoom Tempo NEXT%', description: 'Anta Air Zoom Tempo NEXT% - tempo-day race shoe.', brand: 'Anta', categoryId: 1, price: 67.23, retailPrice: 67.23, stock: 10, status: 'new', colors: ['#000000', '#FFFFFF'], imageUrl: productImg('anta-ztn') },
  { id: 18, name: 'Li-Ning Air Force 1 07 LX', description: "Li-Ning Air Force 1 07 LX - luxe materials on a classic silhouette.", brand: 'Li-Ning', categoryId: 2, price: 14.17, retailPrice: 14.17, stock: 10, status: 'standard', colors: ['#FFFFFF'], imageUrl: productImg('lining-af1') },
  { id: 19, name: 'Li-Ning Air Force 1 Shadow SE', description: "Li-Ning Air Force 1 Shadow SE - doubled-up design.", brand: 'Li-Ning', categoryId: 2, price: 30.87, retailPrice: 30.87, stock: 10, status: 'new', colors: ['#FF6F61', '#00AB55'], imageUrl: productImg('lining-af1s') },
  { id: 20, name: 'Anta Air Zoom Tempo NEXT%', description: 'Anta Air Zoom Tempo NEXT% - tempo-day race shoe.', brand: 'Anta', categoryId: 1, price: 26.72, retailPrice: 26.72, stock: 10, status: 'standard', colors: ['#000000', '#FFFFFF'], imageUrl: productImg('anta-ztnb') },
  { id: 21, name: 'Anta DBreak-Type', description: 'Anta DBreak-Type - heritage running silhouette.', brand: 'Anta', categoryId: 1, price: 44.35, retailPrice: 44.35, stock: 10, status: 'new', colors: ['#FFFFFF', '#FF6F61'], imageUrl: productImg('anta-dbt') },
  { id: 22, name: 'Adidas Air Max Up', description: "Adidas Air Max Up - lifestyle silhouette with stacked Air heel.", brand: 'Adidas', categoryId: 5, price: 37.11, retailPrice: 37.11, stock: 10, status: 'standard', colors: ['#FFFFFF', '#000000'], imageUrl: productImg('adidas-amu') },
  { id: 23, name: 'Li-Ning Air Max 270 React ENG', description: "Li-Ning Air Max 270 React ENG - tall Air heel, React foam.", brand: 'Li-Ning', categoryId: 2, price: 75.53, retailPrice: 75.53, stock: 10, status: 'standard', colors: ['#000000', '#FFFFFF'], imageUrl: productImg('lining-am270') },
];

/**
 * Orders - real Order entities with full status history, payment, shipment.
 *
 * Per the lessons-learned, the seed keeps some edge-case rows on purpose:
 *   - id=1: delivered (normal happy path)
 *   - id=2: shipping (in transit)
 *   - id=3: customs-clearance (international edge case)
 *   - id=4: cancelled (terminated state)
 *   - id=5: pending (not yet paid)
 *   - id=6..10: packing / shipping (normal mid-pipeline)
 *   - id=11: delivered but with a stale/truncated line-item (priceAtOrder
 *     doesn't match current product.price - surfaces "messy real data"
 *     in the order-detail view, matching react-crm's lesson)
 */
export const ORDERS: Order[] = [
  {
    id: 1, reference: 'order-1-1-1', userId: 1,
    items: [
      { productId: 0, productName: PRODUCTS[0].name, productImageUrl: PRODUCTS[0].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[0].price },
    ],
    status: { status: 'delivered', at: '2025-12-01', note: 'Delivered to front porch' },
    statusHistory: [
      { status: 'pending', at: '2025-11-28' },
      { status: 'paid', at: '2025-11-28' },
      { status: 'packing', at: '2025-11-29' },
      { status: 'shipping', at: '2025-11-30' },
      { status: 'delivered', at: '2025-12-01', note: 'Delivered to front porch' },
    ],
    payment: { method: 'card', status: 'captured', last4: '4242', authCode: 'AUTH-001', paidAt: '2025-11-28' },
    shipment: { carrierId: 1, trackingNumber: 'USPS-9400111202555842764213', shippedAt: '2025-11-30', deliveredAt: '2025-12-01' },
    shippingAddress: USERS[0].address,
    total: PRODUCTS[0].price,
    orderDate: '2025-11-28', shippedDate: '2025-11-30', deliveredDate: '2025-12-01',
  },
  {
    id: 2, reference: 'order-2-2-1-2', userId: 2,
    items: [
      { productId: 3, productName: PRODUCTS[3].name, productImageUrl: PRODUCTS[3].imageUrl, quantity: 2, priceAtOrder: PRODUCTS[3].price },
    ],
    status: { status: 'shipping', at: '2025-12-15' },
    statusHistory: [
      { status: 'pending', at: '2025-12-13' },
      { status: 'paid', at: '2025-12-13' },
      { status: 'packing', at: '2025-12-14' },
      { status: 'shipping', at: '2025-12-15' },
    ],
    payment: { method: 'paypal', status: 'captured', last4: null, authCode: 'PAYPAL-002', paidAt: '2025-12-13' },
    shipment: { carrierId: 2, trackingNumber: 'FX-774829100021', shippedAt: '2025-12-15', deliveredAt: null },
    shippingAddress: USERS[1].address,
    total: PRODUCTS[3].price * 2,
    orderDate: '2025-12-13', shippedDate: '2025-12-15', deliveredDate: null,
  },
  {
    id: 3, reference: 'order-3-3-1-3', userId: 9,
    items: [
      { productId: 5, productName: PRODUCTS[5].name, productImageUrl: PRODUCTS[5].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[5].price },
      { productId: 6, productName: PRODUCTS[6].name, productImageUrl: PRODUCTS[6].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[6].price },
    ],
    status: { status: 'customs-clearance', at: '2025-12-20' },
    statusHistory: [
      { status: 'pending', at: '2025-12-18' },
      { status: 'paid', at: '2025-12-18' },
      { status: 'packing', at: '2025-12-19' },
      { status: 'shipping', at: '2025-12-19' },
      { status: 'customs-clearance', at: '2025-12-20', note: 'Held at HK customs' },
    ],
    payment: { method: 'card', status: 'captured', last4: '1881', authCode: 'AUTH-003', paidAt: '2025-12-18' },
    shipment: { carrierId: 3, trackingNumber: 'UPS-1Z999AA10123456789', shippedAt: '2025-12-19', deliveredAt: null },
    shippingAddress: USERS[8].address,
    total: PRODUCTS[5].price + PRODUCTS[6].price,
    orderDate: '2025-12-18', shippedDate: '2025-12-19', deliveredDate: null,
  },
  {
    id: 4, reference: 'order-4-cancel', userId: 4,
    items: [
      { productId: 14, productName: PRODUCTS[14].name, productImageUrl: PRODUCTS[14].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[14].price },
    ],
    status: { status: 'cancelled', at: '2025-11-30', note: 'Customer requested cancellation' },
    statusHistory: [
      { status: 'pending', at: '2025-11-30' },
      { status: 'cancelled', at: '2025-11-30', note: 'Customer requested cancellation' },
    ],
    payment: { method: 'card', status: 'refunded', last4: '5500', authCode: 'AUTH-004', paidAt: '2025-11-30' },
    shipment: { carrierId: null, trackingNumber: null, shippedAt: null, deliveredAt: null },
    shippingAddress: USERS[3].address,
    total: PRODUCTS[14].price,
    orderDate: '2025-11-30', shippedDate: null, deliveredDate: null,
  },
  {
    id: 5, reference: 'order-5-pending', userId: 10,
    items: [
      { productId: 7, productName: PRODUCTS[7].name, productImageUrl: PRODUCTS[7].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[7].price },
    ],
    status: { status: 'pending', at: '2026-01-05' },
    statusHistory: [
      { status: 'pending', at: '2026-01-05' },
    ],
    payment: { method: 'card', status: 'pending', last4: '9876', authCode: 'AUTH-005', paidAt: null },
    shipment: { carrierId: null, trackingNumber: null, shippedAt: null, deliveredAt: null },
    shippingAddress: USERS[9].address,
    total: PRODUCTS[7].price,
    orderDate: '2026-01-05', shippedDate: null, deliveredDate: null,
  },
  {
    id: 6, reference: 'order-6-packing', userId: 5,
    items: [
      { productId: 10, productName: PRODUCTS[10].name, productImageUrl: PRODUCTS[10].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[10].price },
      { productId: 11, productName: PRODUCTS[11].name, productImageUrl: PRODUCTS[11].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[11].price },
    ],
    status: { status: 'packing', at: '2026-01-08' },
    statusHistory: [
      { status: 'pending', at: '2026-01-07' },
      { status: 'paid', at: '2026-01-07' },
      { status: 'packing', at: '2026-01-08' },
    ],
    payment: { method: 'bank-transfer', status: 'authorized', last4: null, authCode: 'BT-006', paidAt: '2026-01-07' },
    shipment: { carrierId: null, trackingNumber: null, shippedAt: null, deliveredAt: null },
    shippingAddress: USERS[4].address,
    total: PRODUCTS[10].price + PRODUCTS[11].price,
    orderDate: '2026-01-07', shippedDate: null, deliveredDate: null,
  },
  {
    id: 7, reference: 'order-7-shipping', userId: 6,
    items: [
      { productId: 12, productName: PRODUCTS[12].name, productImageUrl: PRODUCTS[12].imageUrl, quantity: 3, priceAtOrder: PRODUCTS[12].price },
    ],
    status: { status: 'shipping', at: '2026-01-10' },
    statusHistory: [
      { status: 'pending', at: '2026-01-09' },
      { status: 'paid', at: '2026-01-09' },
      { status: 'packing', at: '2026-01-09' },
      { status: 'shipping', at: '2026-01-10' },
    ],
    payment: { method: 'card', status: 'captured', last4: '1234', authCode: 'AUTH-007', paidAt: '2026-01-09' },
    shipment: { carrierId: 2, trackingNumber: 'FX-998877665544', shippedAt: '2026-01-10', deliveredAt: null },
    shippingAddress: USERS[5].address,
    total: PRODUCTS[12].price * 3,
    orderDate: '2026-01-09', shippedDate: '2026-01-10', deliveredDate: null,
  },
  {
    id: 8, reference: 'order-8-customs', userId: 11,
    items: [
      { productId: 15, productName: PRODUCTS[15].name, productImageUrl: PRODUCTS[15].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[15].price },
    ],
    status: { status: 'customs-clearance', at: '2026-01-12', note: 'Customs paperwork under review' },
    statusHistory: [
      { status: 'pending', at: '2026-01-10' },
      { status: 'paid', at: '2026-01-10' },
      { status: 'packing', at: '2026-01-11' },
      { status: 'shipping', at: '2026-01-11' },
      { status: 'customs-clearance', at: '2026-01-12', note: 'Customs paperwork under review' },
    ],
    payment: { method: 'card', status: 'captured', last4: '0025', authCode: 'AUTH-008', paidAt: '2026-01-10' },
    shipment: { carrierId: 3, trackingNumber: 'UPS-1Z999AA10987654321', shippedAt: '2026-01-11', deliveredAt: null },
    shippingAddress: USERS[10].address,
    total: PRODUCTS[15].price,
    orderDate: '2026-01-10', shippedDate: '2026-01-11', deliveredDate: null,
  },
  {
    id: 9, reference: 'order-9-packing', userId: 7,
    items: [
      { productId: 17, productName: PRODUCTS[17].name, productImageUrl: PRODUCTS[17].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[17].price },
    ],
    status: { status: 'packing', at: '2026-01-13' },
    statusHistory: [
      { status: 'pending', at: '2026-01-13' },
      { status: 'paid', at: '2026-01-13' },
      { status: 'packing', at: '2026-01-13' },
    ],
    payment: { method: 'paypal', status: 'captured', last4: null, authCode: 'PAYPAL-009', paidAt: '2026-01-13' },
    shipment: { carrierId: null, trackingNumber: null, shippedAt: null, deliveredAt: null },
    shippingAddress: USERS[6].address,
    total: PRODUCTS[17].price,
    orderDate: '2026-01-13', shippedDate: null, deliveredDate: null,
  },
  {
    id: 10, reference: 'order-10-shipping', userId: 12,
    items: [
      { productId: 20, productName: PRODUCTS[20].name, productImageUrl: PRODUCTS[20].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[20].price },
      { productId: 21, productName: PRODUCTS[21].name, productImageUrl: PRODUCTS[21].imageUrl, quantity: 1, priceAtOrder: PRODUCTS[21].price },
    ],
    status: { status: 'shipping', at: '2026-01-15' },
    statusHistory: [
      { status: 'pending', at: '2026-01-14' },
      { status: 'paid', at: '2026-01-14' },
      { status: 'packing', at: '2026-01-15' },
      { status: 'shipping', at: '2026-01-15' },
    ],
    payment: { method: 'card', status: 'captured', last4: '7777', authCode: 'AUTH-010', paidAt: '2026-01-14' },
    shipment: { carrierId: 1, trackingNumber: 'USPS-9400111899223344556677', shippedAt: '2026-01-15', deliveredAt: null },
    shippingAddress: USERS[11].address,
    total: PRODUCTS[20].price + PRODUCTS[21].price,
    orderDate: '2026-01-14', shippedDate: '2026-01-15', deliveredDate: null,
  },
  {
    id: 11, reference: 'order-11-stale', userId: 13,
    items: [
      { productId: 23, productName: PRODUCTS[23].name, productImageUrl: PRODUCTS[23].imageUrl, quantity: 1, priceAtOrder: 99.99 },
    ],
    status: { status: 'delivered', at: '2025-10-22' },
    statusHistory: [
      { status: 'pending', at: '2025-10-18' },
      { status: 'paid', at: '2025-10-18' },
      { status: 'packing', at: '2025-10-19' },
      { status: 'shipping', at: '2025-10-20' },
      { status: 'delivered', at: '2025-10-22' },
    ],
    payment: { method: 'card', status: 'captured', last4: '4321', authCode: 'AUTH-011', paidAt: '2025-10-18' },
    shipment: { carrierId: 2, trackingNumber: 'FX-444433332222', shippedAt: '2025-10-20', deliveredAt: '2025-10-22' },
    shippingAddress: USERS[12].address,
    total: 99.99,
    orderDate: '2025-10-18', shippedDate: '2025-10-20', deliveredDate: '2025-10-22',
  },
];