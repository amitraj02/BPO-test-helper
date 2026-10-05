import { TypingPassage } from '@/types/question';

export const fallbackTypingPassages: TypingPassage[] = [
  {
    id: 'type-01',
    title: 'Customer Order Resolution & Empathy',
    category: 'Customer Service Communications',
    durationMinutes: 1,
    text: `Thank you for contacting our customer care department. I completely understand your concern regarding the delivery delay of your recent order. Please be assured that our logistics team is actively coordinating with the regional courier hub to accelerate dispatch. We sincerely appreciate your patience and look forward to resolving this matter promptly.`
  },
  {
    id: 'type-02',
    title: 'Subscription Billing & Account Security',
    category: 'Billing & Account Services',
    durationMinutes: 2,
    text: `Maintaining the security and confidentiality of your user account is our topmost operational priority. When reviewing your monthly invoice, please verify that all billing details correspond with your subscribed service tier. Should you observe any unrecognized line items or pending authorization holds, contact our non-voice assistance desk immediately. Our verification specialists will inspect the transaction logs and reverse any unauthorized charges in accordance with company policy.`
  },
  {
    id: 'type-03',
    title: 'E-Commerce Return Merchandise Authorization',
    category: 'Returns & Replacements',
    durationMinutes: 3,
    text: `Dear valued patron, thank you for writing back to us with the serial numbers and order receipt. We have generated your Return Merchandise Authorization label, which is valid for fourteen calendar days from today. To ensure rapid processing of your full refund, kindly place the item inside its protective carton with all original cables and manual booklets included. Affix the printable barcode firmly to the exterior of the parcel, taking care not to obscure the tracking digits with packing tape. Once dropped off at an authorized carrier drop box, your refund status will update automatically.`
  },
  {
    id: 'type-05',
    title: 'Concentrix Operational Excellence & Service Standards',
    category: 'BPO Best Practices',
    durationMinutes: 5,
    text: `In modern business process operations, high-performing non-voice associates combine rapid technical literacy with genuine customer empathy. Communicating effectively over email and live chat requires clarity of thought, grammatical precision, and an unwavering commitment to first-contact resolution. When addressing complex customer escalations, skilled representatives listen attentively to understand the root cause of dissatisfaction before offering tailored solutions. Rather than relying solely on repetitive canned templates, exceptional professionals personalize their correspondence, acknowledging the customer's frustration with sincerity and respect. Furthermore, maintaining accurate documentation within the customer relationship management database ensures that downstream departments have complete visibility into every interaction. By balancing typing agility, analytical reasoning, and empathetic problem-solving, customer experience professionals elevate client loyalty and drive organizational success in competitive global markets.`
  }
];
