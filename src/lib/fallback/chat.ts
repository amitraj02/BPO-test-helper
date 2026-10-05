import { ChatScenario } from '@/types/question';

export const fallbackChatScenarios: ChatScenario[] = [
  {
    id: 'chat-01',
    scenarioTitle: 'Frustrated Customer: Stolen or Missing Package Marked Delivered',
    customerName: 'Jennifer Miller',
    customerSentiment: 'Frustrated',
    accountDetails: {
      orderId: 'US-90314',
      productName: 'SonicPro Wireless Noise Cancelling Headphones ($199.99)',
      purchaseDate: '3 days ago',
      accountEmail: 'jmiller.designer@gmail.com'
    },
    scenarioContext: 'Carrier tracking claims the package was handed directly to resident on the porch, but the customer was at work all day and security doorbell shows no drop-off.',
    initialMessage: `Hello? I need someone to help me right now. Your tracking app says my order #US-90314 was delivered to my porch 2 hours ago. I have been home for the last 30 minutes, checked the entire porch, driveway, and lobby, and there is absolutely nothing here. I have doorbell camera footage showing no delivery van even came down my street! Where is my $200 headset?`,
    systemGoal: 'Validate customer frustration, verify details politely, check shipping address without being accusatory, offer to file a carrier trace or issue immediate replacement if address is confirmed.'
  },
  {
    id: 'chat-02',
    scenarioTitle: 'Account Lockout During Flash Sale',
    customerName: 'Brian O\'Connor',
    customerSentiment: 'Urgent',
    accountDetails: {
      orderId: 'Pending Cart',
      productName: 'Limited Edition Gaming Keyboard Bundle ($149.00)',
      purchaseDate: 'Today',
      accountEmail: 'boconnor88@outlook.com'
    },
    scenarioContext: 'Customer tried entering password multiple times, triggered security lockout, and the 50% discount flash sale ends in 35 minutes.',
    initialMessage: `Hi there! I am trying to checkout with the flash sale keyboard deal before it expires in half an hour, but your system just locked my account saying "Too many failed attempts". I know my password! Can you unlock it immediately before the cart empties out?`,
    systemGoal: 'Calm the customer down, verify their email/phone for rapid 2-step verification, assist with unlocking or offer to preserve the flash sale promotional pricing if checkout expires.'
  },
  {
    id: 'chat-03',
    scenarioTitle: 'Damaged Cosmetic Gift Set Received',
    customerName: 'Chloe Bennett',
    customerSentiment: 'Mildly Frustrated',
    accountDetails: {
      orderId: 'ORD-55419',
      productName: 'Luxe Glow Skincare Gift Box ($85.00)',
      purchaseDate: '5 days ago',
      accountEmail: 'chloe.bennett@yahoo.com'
    },
    scenarioContext: 'Glass bottles shattered inside the shipping box during transit, lotion leaked all over the gift packaging. Customer bought this for a bridal shower this weekend.',
    initialMessage: `Hi, I just opened the parcel for my order #ORD-55419. The skincare box is soaked in oil and liquid because two of the serum glass bottles broke completely during shipping. Glass shards are everywhere inside the package. I cannot gift this! What can be done?`,
    systemGoal: 'Show immediate empathy, express concern about sharp glass safety, advise customer not to touch the broken glass, immediately process a replacement with expedited delivery or instant store credit.'
  }
];
