import { MenuItem, Branch } from '../types.ts';

export const BRANCHES: Branch[] = [
  {
    id: 'wapda-town',
    name: 'The Grill Spot - Wapda Town',
    area: 'Wapda Town',
    address: 'The Grill Spot - Wapda Town, Wapda Town, 13- H2 Block, Phase 1',
    isOpen: true,
    phone: '+92 42 35712345',
  },
  {
    id: 'dha-phase-5',
    name: 'The Grill Spot - DHA Phase 5',
    area: 'DHA Phase 5',
    address: 'Plaza 42, Sector CCA, Phase 5 DHA, Lahore',
    isOpen: true,
    phone: '+92 42 35789100',
  },
  {
    id: 'gulberg-3',
    name: 'The Grill Spot - Gulberg III',
    area: 'Gulberg III',
    address: 'Plot 18, Block K, Main Boulevard, Gulberg III, Lahore',
    isOpen: true,
    phone: '+92 42 35712345',
  },
  {
    id: 'johar-town',
    name: 'The Grill Spot - Johar Town',
    area: 'Johar Town',
    address: 'Civic Centre, G-1 Market, Johar Town, Lahore',
    isOpen: true,
    phone: '+92 42 35301234',
  },
];

export const CATEGORIES = [
  'Deals',
  'New Arrival',
  'Beef Burgers',
  'Skinny Beef Burgers',
  'Fried Chicken',
  'Sides & Drinks',
  'Desserts',
];

export const BANNERS = [
  {
    id: 'b1',
    tag: 'DOUBLES ARE GOOD...',
    highlight: 'RS. 925',
    original: 'RS. 1145',
    subtitle: 'Founder-Recommended Juicy Double Smash',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    bgColor: 'from-black via-zinc-900 to-red-950',
    badge: 'WEB & APP ONLY',
  },
  {
    id: 'b2',
    tag: 'MONDAY TO SUNDAY APP TO DINE IN',
    highlight: '40% OFF',
    original: 'WITH HBL CARDS',
    subtitle: 'Pay via HBL Cards or In-App checkout',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=80',
    bgColor: 'from-red-950 via-zinc-900 to-black',
    badge: 'AVAILABLE FOR DINE IN | TAKEAWAY',
  },
  {
    id: 'b3',
    tag: 'CRISPY SITUATION MINT CONDITION',
    highlight: 'RS. 745',
    original: 'RS. 990',
    subtitle: '3 Tenders + 1 Mintarita Combo',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80',
    bgColor: 'from-red-900 via-neutral-900 to-black',
    badge: 'SAVE 25%',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'crispy-situation-mint',
    name: 'Crispy Situation Mint Condition',
    category: 'Deals',
    description: '03 Pcs Turncoat Sheikh & 01 Mintarita with ComeBack & LoudMouth dipping sauces.',
    price: 745.0,
    originalPrice: 990.0,
    discountBadge: '25% Off',
    tagBadge: 'New',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'turncoat-sheikh',
        name: 'Turncoat Sheikh',
        required: true,
        options: [
          { id: 'ts-original', name: 'Turncoat Sheikh (03 Pcs)' },
          { id: 'ts-spicy', name: 'Turncoat Sheikh Spicy Glazed (03 Pcs)', priceDelta: 40 },
        ],
      },
      {
        id: 'mintarita',
        name: 'MINTARITA',
        required: true,
        options: [
          { id: 'drink-mintarita', name: 'MINTARITA' },
          { id: 'drink-coke', name: 'Classic Coca Cola' },
          { id: 'drink-coke-zero', name: 'Coke Zero Sugar' },
          { id: 'drink-sprite', name: 'Sprite Lemon Lime' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 125.0 },
      { id: 'comeback-sauce', name: 'ComeBack Sauce', price: 80.0 },
      { id: 'loudmouth-sauce', name: 'LoudMouth Sauce', price: 80.0 },
      { id: 'jalapeno', name: 'Pickled Jalapeños', price: 90.0 },
      { id: 'extra-tender', name: 'Add 1x Extra Tender', price: 190.0 },
    ],
  },
  {
    id: 'wedded-sheikh-deal',
    name: 'The Wedded Sheikh Deal',
    category: 'Deals',
    description: 'Our Best-selling, Founder-Recommended, Juicy Double Smashed Beef Patty with melted cheese, caramelized onions and special house sauce.',
    price: 925.0,
    originalPrice: 1195.0,
    discountBadge: '23% Off',
    tagBadge: 'Popular',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'patty-prep',
        name: 'Beef Patty Doneness',
        required: true,
        options: [
          { id: 'smash-classic', name: 'Crispy Smashed Edge (Classic)' },
          { id: 'smash-extra-crust', name: 'Extra Lacy Crust' },
        ],
      },
      {
        id: 'bun-type',
        name: 'Bun Preference',
        required: true,
        options: [
          { id: 'brioche-toasted', name: 'Butter Toasted Potato Brioche' },
          { id: 'lettuce-wrap', name: 'Lettuce Wrap (Keto Friendly)' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 125.0 },
      { id: 'beef-bacon', name: 'Smoked Beef Bacon Strips', price: 180.0 },
      { id: 'fried-egg', name: 'Crispy Fried Egg', price: 90.0 },
      { id: 'comeback-sauce', name: 'ComeBack Sauce', price: 80.0 },
      { id: 'animal-style-onions', name: 'Caramelized Grilled Onions', price: 75.0 },
    ],
  },
  {
    id: 'little-sheikh',
    name: 'Little Sheikh',
    category: 'Beef Burgers',
    description: 'Our Classic Single Smashed 100% prime beef patty, melted American cheddar, thinly sliced pickles & signature sauce.',
    price: 715.5,
    originalPrice: 795.0,
    discountBadge: '10% Off',
    tagBadge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'sauce-style',
        name: 'Sauce Selection',
        required: true,
        options: [
          { id: 'smash-secret', name: 'Signature Grill Spot Sauce' },
          { id: 'spicy-mayo', name: 'LoudMouth Spicy Mayo' },
          { id: 'garlic-aioli', name: 'Roasted Garlic Herb Aioli' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 125.0 },
      { id: 'extra-patty', name: 'Add Extra Smashed Patty', price: 290.0 },
      { id: 'jalapeno', name: 'Pickled Jalapeños', price: 90.0 },
    ],
  },
  {
    id: 'double-sheikh-melt',
    name: 'Double Sheikh Melt',
    category: 'Beef Burgers',
    description: 'Two pure Angus smashed patties, double Wisconsin sharp cheddar, melted provolone, and slow-cooked onion relish.',
    price: 1050.0,
    originalPrice: 1250.0,
    discountBadge: '16% Off',
    tagBadge: 'Popular',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'cheese-type',
        name: 'Cheese Style',
        required: true,
        options: [
          { id: 'cheddar-melt', name: 'Double Yellow Cheddar Melt' },
          { id: 'pepperjack-melt', name: 'Spicy Pepper Jack Melt' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 125.0 },
      { id: 'beef-bacon', name: 'Crispy Beef Bacon Jam', price: 180.0 },
      { id: 'loudmouth-sauce', name: 'LoudMouth Sauce', price: 80.0 },
    ],
  },
  {
    id: 'skinny-og-beef',
    name: 'Skinny OG Beef',
    category: 'Skinny Beef Burgers',
    description: 'Ultra thin smashed beef patty with crispy lacy caramelized edges, yellow mustard seared, diced Spanish onion.',
    price: 580.0,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'onion-style',
        name: 'Onion Style',
        required: true,
        options: [
          { id: 'diced-raw', name: 'Diced Raw Sweet Onions' },
          { id: 'pressed-grilled', name: 'Oklahoma Style Smashed Onions' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 125.0 },
      { id: 'comeback-sauce', name: 'ComeBack Sauce', price: 80.0 },
    ],
  },
  {
    id: 'turncoat-sheikh-tenders',
    name: 'Turncoat Sheikh Tenders (03 Pcs)',
    category: 'Fried Chicken',
    description: '3 tender loins double soaked in spiced buttermilk, flash-fried to golden shatter crunch. Served with Comeback sauce.',
    price: 590.0,
    originalPrice: 650.0,
    discountBadge: '9% Off',
    tagBadge: 'Crispy',
    image: 'https://images.unsplash.com/photo-1587397845856-e6cf4c5d66ad?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'dip-choice',
        name: 'Choice of Dip',
        required: true,
        options: [
          { id: 'dip-comeback', name: 'Signature ComeBack Sauce' },
          { id: 'dip-loudmouth', name: 'LoudMouth Fiery Sauce' },
          { id: 'dip-garlic', name: 'Whipped Garlic Herb' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-tender', name: 'Add 1x Extra Tender', price: 190.0 },
      { id: 'extra-dip', name: 'Extra Dip Tub', price: 80.0 },
    ],
  },
  {
    id: 'nashville-hot-crispy',
    name: 'Nashville Hot Crispy Burger',
    category: 'Fried Chicken',
    description: 'Crisp chicken fillet tossed in Nashville hot chili oil, dill pickle chips, creamy slaw, honey butter brioche.',
    price: 840.0,
    tagBadge: 'New',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    choiceGroups: [
      {
        id: 'heat-level',
        name: 'Heat Level',
        required: true,
        options: [
          { id: 'heat-mild', name: 'Mild Honey Glaze' },
          { id: 'heat-medium', name: 'Medium Nashville Heat' },
          { id: 'heat-reaper', name: 'Fiery Reaper (Warning: Extremely Hot)' },
        ],
      },
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 125.0 },
      { id: 'extra-pickles', name: 'Extra Dill Pickles', price: 50.0 },
    ],
  },
  {
    id: 'animal-style-fries',
    name: 'Animal Style Loaded Fries',
    category: 'Sides & Drinks',
    description: 'Golden crinkle fries blanketed in molten cheese sauce, smashed beef bits, grilled sweet onions, and thousand island drizzle.',
    price: 490.0,
    tagBadge: 'Popular',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    addOns: [
      { id: 'jalapeno', name: 'Add Jalapeños', price: 90.0 },
      { id: 'bacon-bits', name: 'Add Real Beef Bacon Bits', price: 120.0 },
    ],
  },
  {
    id: 'mintarita-drink',
    name: 'Mintarita',
    category: 'Sides & Drinks',
    description: 'Signature frozen crushed mint margarita made with fresh garden spearmint, Key lime juice, and sparkling soda.',
    price: 240.0,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lotus-biscoff-shake',
    name: 'Lotus Biscoff Shake',
    category: 'Desserts',
    description: 'Velvety vanilla bean ice cream spun with authentic Belgian Lotus Biscoff paste, whipped cream, and caramelized cookie crumble.',
    price: 550.0,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
  },
];
