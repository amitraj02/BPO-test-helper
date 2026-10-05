import { MCQQuestion } from '@/types/question';

export const fallbackCustomerServiceQuestions: MCQQuestion[] = [
  {
    id: 'cs-01',
    category: 'customer-service',
    difficulty: 'intermediate',
    topic: 'Handling Angry Customers',
    question: 'A customer sends an email using ALL CAPS, saying: "I WANT MY REFUND RIGHT NOW! YOU PEOPLE ARE THIEVES!" Which is the most effective first response sentence?',
    options: [
      '"Please do not use all caps, as it is considered shouting in email etiquette."',
      '"I completely understand how alarming unexpected billing delays can be, and I am stepping in personally to resolve your refund."',
      '"We are not thieves; our terms of service clearly state 7-10 business days for refunds."',
      '"Your refund was already submitted, so you need to contact your bank instead of emailing us."'
    ],
    correctAnswer: 1,
    explanation: 'De-escalation requires acknowledging the customer’s emotional intensity with calm validation, avoiding defensive retorts or lecturing about text capitalization.'
  },
  {
    id: 'cs-02',
    category: 'customer-service',
    difficulty: 'easy',
    topic: 'Incomplete Information',
    question: 'A customer writes: "My parcel has not arrived, please help me." The email contains no order number, name, or phone number. What is the best course of action?',
    options: [
      'Close the ticket as invalid due to insufficient customer data.',
      'Reply politely requesting their full order number, shipping zip code, and registered email address to locate their purchase.',
      'Guess which order belongs to them by searching the sender email address in third-party search engines.',
      'Forward the email to the police department for suspicious activity.'
    ],
    correctAnswer: 1,
    explanation: 'When information is incomplete, provide clear, easy-to-follow bullet points requesting the specific credentials needed to locate the record.'
  },
  {
    id: 'cs-03',
    category: 'customer-service',
    difficulty: 'intermediate',
    topic: 'Pending Information Updates',
    question: 'A customer repeatedly requests an update on a backordered item that the manufacturer has not yet shipped. What is the best non-voice practice?',
    options: [
      'Make up an estimated date so the customer stops emailing.',
      'Ignore subsequent messages until the carrier tracking number actually generates.',
      'Send a courteous update explaining the current verification status, apologize for the lack of fresh news, and set a specific expectation for the next status check.',
      'Tell the customer to call the manufacturer directly.'
    ],
    correctAnswer: 2,
    explanation: 'Transparent communication combined with setting realistic expectations and proactively establishing a follow-up timeframe maintains trust even when news is delayed.'
  },
  {
    id: 'cs-04',
    category: 'customer-service',
    difficulty: 'advanced',
    topic: 'Policy Boundaries & Empathy',
    question: 'A customer asks for an exception to return an item purchased 75 days ago (return window is 30 days), stating they had a personal emergency. What is the most balanced response?',
    options: [
      '"Company rules are strict. Your request is denied with zero exceptions."',
      '"I am very sorry to hear about your difficult circumstances. While our system cannot authorize a direct card refund past 30 days, let me check if we can issue a one-time store credit or replacement exception for you."',
      '"Sure, I can break company rules anytime for nice people."',
      '"You should have returned it earlier regardless of your emergency."'
    ],
    correctAnswer: 1,
    explanation: 'Balancing company policy with compassion entails expressing genuine empathy, explaining system boundaries honestly, and exploring alternate goodwill options (like store credit) where possible.'
  },
  {
    id: 'cs-05',
    category: 'customer-service',
    difficulty: 'intermediate',
    topic: 'First Contact Resolution (FCR)',
    question: 'Why is First Contact Resolution (FCR) a key metric in US non-voice BPO operations?',
    options: [
      'It reduces the amount of work managers have to do.',
      'It resolves the customer’s inquiry completely in the initial interaction, reducing customer effort and repeat contact volume.',
      'It allows representatives to end chats quickly without answering questions.',
      'It eliminates the need for email quality audits.'
    ],
    correctAnswer: 1,
    explanation: 'FCR measures an agent’s capability to resolve an issue thoroughly on the first try, leading to higher customer satisfaction (CSAT) and operational efficiency.'
  }
];
