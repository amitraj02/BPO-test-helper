import { ReadingTestItem } from '@/types/question';

export const fallbackReadingPassages: ReadingTestItem[] = [
  {
    id: 'read-01',
    passageTitle: 'Standard Return & Exchange Policy Guidelines',
    category: 'reading',
    difficulty: 'intermediate',
    passageText: `OmniRetail US provides a 30-day return policy for most merchandise purchased through its online portal. To be eligible for a full refund back to the original form of payment, items must be in unused, unwashed condition and returned in their original packaging with all security tags attached.

However, certain exceptions apply. Electronic devices—including laptops, tablets, and smart home appliances—must be initiated for return within 14 calendar days of confirmed delivery. In addition, opened software, personalized items, and perishable goods are strictly non-refundable unless verified to have arrived defective or damaged due to courier transit.

For standard returns, return shipping costs are deducted from the refunded amount at a flat rate of $6.99 per parcel, unless the return is precipitated by a company fulfillment error (such as shipping the wrong SKU or size). In instances where a company fulfillment error occurred, a pre-paid prepaid return label is provided at zero cost to the patron, along with an optional expedited replacement or complete store credit with an additional 10% courtesy credit bonus.

Processing refunds typically requires 3 to 5 business days after the warehouse facility conducts an intake inspection of the returned parcel. Once approved, the funds reflect on the customer’s financial institution balance within 2 to 7 banking business days, depending on their card issuer's policy.`,
    questions: [
      {
        id: 'read-01-q1',
        topic: 'Specific Details',
        question: 'What is the return window for electronic items such as laptops and tablets?',
        options: [
          '30 calendar days from delivery',
          '14 calendar days from delivery',
          '7 business days from dispatch',
          '21 calendar days from delivery'
        ],
        correctAnswer: 1,
        explanation: 'The passage explicitly states: "Electronic devices—including laptops, tablets, and smart home appliances—must be initiated for return within 14 calendar days of confirmed delivery."'
      },
      {
        id: 'read-01-q2',
        topic: 'Inference',
        question: 'Under what circumstance will OmniRetail waive the $6.99 return shipping fee?',
        options: [
          'If the customer returns the item within 3 days',
          'If the customer holds a premier loyalty membership',
          'If the return is caused by a company fulfillment mistake (e.g. wrong item sent)',
          'If the order total exceeds $100'
        ],
        correctAnswer: 2,
        explanation: 'The policy states that return shipping is deducted "unless the return is precipitated by a company fulfillment error (such as shipping the wrong SKU or size)."'
      },
      {
        id: 'read-01-q3',
        topic: 'Main Idea',
        question: 'What is the primary purpose of this passage?',
        options: [
          'To convince shoppers to buy extended warranties',
          'To outline the conditions, timelines, and fees governing customer product returns',
          'To explain the warehouse logistics procedure for staff members',
          'To promote newly launched electronic gadgets'
        ],
        correctAnswer: 1,
        explanation: 'The text provides customers and agents with the rules, timeframes, exclusions, and fee structures for merchandise returns.'
      },
      {
        id: 'read-01-q4',
        topic: 'Understanding Instructions',
        question: 'After the warehouse receives and inspects a return, how long does the internal refund processing take?',
        options: [
          'Instantly within 1 hour',
          '3 to 5 business days',
          '10 to 14 business days',
          '24 hours on weekends'
        ],
        correctAnswer: 1,
        explanation: 'The passage mentions: "Processing refunds typically requires 3 to 5 business days after the warehouse facility conducts an intake inspection."'
      },
      {
        id: 'read-01-q5',
        topic: 'Vocabulary in Context',
        question: 'In the passage, the word "precipitated" most closely means:',
        options: [
          'Delayed by weather',
          'Caused or brought about by',
          'Ignored completely',
          'Formally denied'
        ],
        correctAnswer: 1,
        explanation: 'In this context, "precipitated by a company fulfillment error" means caused or triggered by that error.'
      }
    ]
  },
  {
    id: 'read-02',
    passageTitle: 'Tier-1 Email Support Escalation Protocol',
    category: 'reading',
    difficulty: 'advanced',
    passageText: `Frontline Tier-1 Customer Care representatives are empowered to resolve first-contact inquiries including order tracking updates, basic troubleshooting, address modifications prior to dispatch, and standard goodwill concessions up to $25 in promotional credits.

However, strict escalation boundaries exist to protect customer privacy and regulatory adherence. When a customer alleges potential unauthorized account access or data compromise, the representative must immediately apply an administrative lock on the user profile, refrain from discussing past transaction histories over plain text, and escalate the case directly to the Fraud & Security Taskforce within 15 minutes.

Similarly, legal disputes, chargeback notices from merchant acquirers, or threats of regulatory filing (such as the Federal Trade Commission or Better Business Bureau) must never be debated or refuted by Tier-1 agents. The correct course of action is to summarize the customer's grievance neutrally in internal notes, select the priority queue tag 'ESCALATION_LEGAL', and issue the approved holding macro informing the client that a Senior Case Manager will reach out within 24 business hours.`,
    questions: [
      {
        id: 'read-02-q1',
        topic: 'Specific Details',
        question: 'What is the maximum monetary goodwill concession a Tier-1 representative can issue independently?',
        options: ['$10', '$25', '$50', '$100'],
        correctAnswer: 1,
        explanation: 'The text notes representatives are empowered to provide "standard goodwill concessions up to $25 in promotional credits."'
      },
      {
        id: 'read-02-q2',
        topic: 'Understanding Instructions',
        question: 'If a customer reports that someone broke into their account, what should the representative do?',
        options: [
          'Send them their complete previous purchase and credit card history',
          'Lock the profile, avoid discussing transaction details in text, and escalate to Fraud within 15 minutes',
          'Tell the customer to create a new account with a new email',
          'Wait 48 hours to confirm if another login occurs'
        ],
        correctAnswer: 1,
        explanation: 'The representative must apply an administrative lock, refrain from discussing past transaction histories over plain text, and escalate to Fraud & Security within 15 minutes.'
      },
      {
        id: 'read-02-q3',
        topic: 'Inference',
        question: 'How should a Tier-1 agent handle a customer threatening legal action?',
        options: [
          'Argue with the customer that their claim has no merit',
          'Offer a $500 cash payment to settle the dispute',
          'Neutrally log the notes, assign the ESCALATION_LEGAL tag, and send the approved holding statement',
          'Delete the customer ticket from the CRM'
        ],
        correctAnswer: 2,
        explanation: 'The protocol requires agents to neutrally summarize the grievance, apply the "ESCALATION_LEGAL" tag, and send the approved holding macro without debating.'
      }
    ]
  }
];
