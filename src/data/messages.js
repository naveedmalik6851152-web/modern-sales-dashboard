export const conversations = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    role: 'Lotus Analytics',
    status: 'online',
    unread: 2,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Hi Naveed, thanks for the quick turnaround on the last shipment.',
        minutesAgo: 190,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Happy to help, Priya. Did everything arrive in good shape?',
        minutesAgo: 184,
      },
      {
        id: 'm3',
        from: 'them',
        text: 'All good. Could you reissue the enterprise invoice with our new billing address?',
        minutesAgo: 41,
      },
      {
        id: 'm4',
        from: 'them',
        text: 'We need it before Friday for our finance close.',
        minutesAgo: 40,
      },
    ],
  },
  {
    id: 'c2',
    name: 'Marcus Bell',
    role: 'Foundry 42',
    status: 'online',
    unread: 1,
    messages: [
      {
        id: 'm1',
        from: 'me',
        text: 'Marcus, the Slate Standing Desk is back in stock next week.',
        minutesAgo: 320,
      },
      { id: 'm2', from: 'them', text: 'Great news. Can you hold 6 units for us?', minutesAgo: 75 },
    ],
  },
  {
    id: 'c3',
    name: 'Sofia Rossi',
    role: 'Studio Lume',
    status: 'away',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'The Halo Soundbar sounds incredible. We’re ordering two more for the Milan studio.',
        minutesAgo: 60 * 20,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'That’s great to hear! I’ll apply the VIP discount to the new order.',
        minutesAgo: 60 * 19,
      },
      { id: 'm3', from: 'them', text: 'Perfect, grazie!', minutesAgo: 60 * 19 },
    ],
  },
  {
    id: 'c4',
    name: 'Omar Farouk',
    role: 'Nile & Stone',
    status: 'offline',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Is the Atlas Ergonomic Chair available in graphite?',
        minutesAgo: 60 * 30,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Yes — graphite ships in 3–5 days. I can send a quote if helpful.',
        minutesAgo: 60 * 29,
      },
    ],
  },
  {
    id: 'c5',
    name: 'Emma Wilson',
    role: 'Harbour Goods',
    status: 'offline',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'me',
        text: 'Your refund for ORD-4498 has been processed.',
        minutesAgo: 60 * 52,
      },
      {
        id: 'm2',
        from: 'them',
        text: 'Received, thank you for sorting that out so quickly.',
        minutesAgo: 60 * 51,
      },
    ],
  },
  {
    id: 'c6',
    name: 'Daniel Lee',
    role: 'Pinecone',
    status: 'online',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Do you offer volume pricing on the Pulse Fitness Band?',
        minutesAgo: 60 * 70,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'We do, from 50 units. I’ll send the tiers over.',
        minutesAgo: 60 * 69,
      },
      {
        id: 'm3',
        from: 'them',
        text: 'Thanks. We’re planning a 200-unit order in October.',
        minutesAgo: 60 * 68,
      },
    ],
  },
  {
    id: 'c7',
    name: 'Grace Adeyemi',
    role: 'Kora Living',
    status: 'away',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'The tracking link for ORD-4540 isn’t updating.',
        minutesAgo: 60 * 96,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Looking into it now. The carrier had a scan delay in Lagos.',
        minutesAgo: 60 * 95,
      },
    ],
  },
  {
    id: 'c8',
    name: 'Ayesha Raza',
    role: 'Indus Traders',
    status: 'online',
    unread: 1,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Assalam-o-alaikum Naveed, our Lahore shipment cleared customs this morning.',
        minutesAgo: 52,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Wa alaikum assalam Ayesha, great news — I’ll update the order status now.',
        minutesAgo: 49,
      },
      {
        id: 'm3',
        from: 'them',
        text: 'Perfect. Also, can we get a quote for 100 units of the Nimbus Keyboard?',
        minutesAgo: 12,
      },
    ],
  },
  {
    id: 'c9',
    name: 'Hamza Sheikh',
    role: 'Kohistan Retail',
    status: 'away',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'The Atlas Ergonomic Chair order for our Rawalpindi office looks great.',
        minutesAgo: 60 * 40,
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Glad to hear it! Let me know if you need more for the new branch.',
        minutesAgo: 60 * 39,
      },
    ],
  },
];

export const CANNED_REPLIES = [
  'Thanks, that works for me.',
  'Got it. I’ll check and get back to you shortly.',
  'Perfect, appreciate the quick response!',
  'Sounds good. Let’s do that.',
];
