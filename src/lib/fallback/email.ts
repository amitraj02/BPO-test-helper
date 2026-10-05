import { EmailScenario } from '@/types/question';

export const fallbackEmailScenarios: EmailScenario[] = [
  {
    id: 'email-01',
    scenarioTitle: 'Delayed Birthday Gift Delivery Complaint',
    customerName: 'Marcus Vance',
    orderNumber: 'ORD-984210-US',
    urgency: 'High',
    issueCategory: 'Delayed Order',
    customerEmailBody: `To Customer Support,

I ordered a personalized leather watch (Order #ORD-984210-US) nine days ago specifically for my son's 18th birthday party, which is tomorrow afternoon. I paid an extra $24.99 for 2-day express shipping!

According to your tracking portal, the package hasn't even left the warehouse in Ohio. Nobody notified me of any delay. This is completely unacceptable. If this does not arrive by tomorrow by 1:00 PM, my son won't have his birthday present.

What are you going to do about this? I want an immediate explanation, a refund on my express shipping, and a realistic delivery time right now!

- Marcus Vance`,
    candidateInstructions: [
      'Acknowledge the customer’s frustration and validate the importance of the son’s 18th birthday event.',
      'Explain that the warehouse experienced an unexpected delay and provide a concrete action step (e.g. shipping refund + status check).',
      'Refund the $24.99 express shipping charge explicitly.',
      'Maintain a calm, professional, and empathetic tone throughout.',
      'Include a proper professional salutation, structured body, and sign-off with your name and support team info.'
    ],
    evaluationCriteria: {
      grammarSpelling: 25,
      professionalTone: 20,
      clarityReadability: 20,
      completeness: 20,
      customerEmpathy: 15
    }
  },
  {
    id: 'email-02',
    scenarioTitle: 'Unauthorized Subscription Renewal & Billing Dispute',
    customerName: 'Sarah Jenkins',
    orderNumber: 'INV-441029',
    urgency: 'Critical',
    issueCategory: 'Billing Dispute',
    customerEmailBody: `Hi,

I just checked my bank statement and noticed an unauthorized charge of $119.99 from your company dated yesterday for "Annual Cloud Backup Pro".

I cancelled this subscription over two weeks ago through my account settings! I have rent due in two days and I cannot afford to have $120 locked up because of a system bug on your end.

I need this reversed to my checking account immediately. If this isn't resolved today, I will file a fraud dispute with Chase Bank.

Sarah Jenkins`,
    candidateInstructions: [
      'Acknowledge the urgent financial distress regarding the unexpected charge and bank overdraft concern.',
      'Assure the customer you are investigating the cancellation logs.',
      'Process or initiate the full $119.99 refund and outline the exact processing timeline (e.g. 3-5 business days).',
      'Provide cancellation confirmation so they are assured they won’t be billed again.',
      'Ensure a reassuring, professional tone without being defensive about the potential bank dispute.'
    ],
    evaluationCriteria: {
      grammarSpelling: 25,
      professionalTone: 20,
      clarityReadability: 20,
      completeness: 20,
      customerEmpathy: 15
    }
  },
  {
    id: 'email-03',
    scenarioTitle: 'Incorrect Item Received for Work Conference',
    customerName: 'David Chen',
    orderNumber: 'ORD-773120-NY',
    urgency: 'High',
    issueCategory: 'Defective Item',
    customerEmailBody: `Customer Service,

I placed an order for 5 units of the ErgoWireless Presenter Mouse for our national corporate seminar this Friday.

The delivery box arrived today, but when I opened it, it contained 5 packs of basic HDMI cables instead! The packing slip clearly lists the Presenter Mice, but the warehouse shipped the completely wrong SKU.

I need the correct items delivered overnight before Thursday evening, otherwise our speakers cannot present. Please tell me how to get the right items sent immediately.

David Chen
Operations Director`,
    candidateInstructions: [
      'Apologize sincerely for the warehouse fulfillment mix-up.',
      'Confirm the urgent timeline for the corporate seminar on Friday.',
      'Offer to dispatch the 5 ErgoWireless Presenter Mice via complimentary priority overnight delivery.',
      'Provide simple, effortless return instructions for the HDMI cables (prepaid label, no penalty if returned after seminar).',
      'Provide the replacement tracking number or an exact follow-up window.'
    ],
    evaluationCriteria: {
      grammarSpelling: 25,
      professionalTone: 20,
      clarityReadability: 20,
      completeness: 20,
      customerEmpathy: 15
    }
  }
];
