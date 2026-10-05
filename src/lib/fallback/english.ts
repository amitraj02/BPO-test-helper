import { MCQQuestion } from '@/types/question';

export const fallbackEnglishQuestions: MCQQuestion[] = [
  {
    id: 'eng-01',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Subject-Verb Agreement',
    question: 'Neither the customer service representative nor the supervisors ________ able to resolve the billing glitch yesterday.',
    options: ['was', 'were', 'is', 'are'],
    correctAnswer: 1,
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the subject closest to it. Here, "supervisors" is plural and the event took place in the past ("yesterday"), so "were" is correct.'
  },
  {
    id: 'eng-02',
    category: 'english',
    difficulty: 'easy',
    topic: 'Tenses',
    question: 'The customer ________ for a refund since last Monday, but the finance department hasn\'t approved it yet.',
    options: ['is asking', 'has been asking', 'was asking', 'asked'],
    correctAnswer: 1,
    explanation: 'Action that started in the past and continues into the present with the preposition "since" requires the present perfect continuous tense ("has been asking").'
  },
  {
    id: 'eng-03',
    category: 'english',
    difficulty: 'easy',
    topic: 'Prepositions',
    question: 'Our customer support team is committed ________ providing assistance within 24 hours.',
    options: ['to', 'for', 'with', 'in'],
    correctAnswer: 0,
    explanation: 'The adjective "committed" is followed by the preposition "to" + gerund (providing).'
  },
  {
    id: 'eng-04',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Sentence Correction',
    question: 'Select the grammatically correct sentence:',
    options: [
      'Please send the document to John and I before noon.',
      'Please send the document to John and myself before noon.',
      'Please send the document to John and me before noon.',
      'Please send the document to John and mine before noon.'
    ],
    correctAnswer: 2,
    explanation: '"To" is a preposition, which requires the objective pronoun "me" (send to me), not the subjective "I" or reflexive "myself".'
  },
  {
    id: 'eng-05',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Vocabulary in Context',
    question: 'In customer support, to "escalate" an issue means to:',
    options: [
      'Close the ticket permanently',
      'Transfer the matter to a higher tier or supervisor for resolution',
      'Offer a full monetary refund immediately',
      'Ignore the customer\'s message until they write again'
    ],
    correctAnswer: 1,
    explanation: 'Escalation in non-voice BPO operations means transferring an unresolved or complex case to higher-level support or management.'
  },
  {
    id: 'eng-06',
    category: 'english',
    difficulty: 'easy',
    topic: 'Articles',
    question: 'The supervisor handled ________ unique situation with extreme tact and diplomacy.',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 0,
    explanation: '"Unique" starts with a consonant \'y\' sound (/juːˈniːk/), so the indefinite article "a" is used instead of "an".'
  },
  {
    id: 'eng-07',
    category: 'english',
    difficulty: 'advanced',
    topic: 'Professional English',
    question: 'Which of the following phrases is the most professional way to acknowledge a delayed email reply?',
    options: [
      'Sorry for the late reply, I was very busy.',
      'Thank you for your patience while we investigated your account details.',
      'Apologies, our team forgot about your ticket.',
      'I am replying now because I finally got time.'
    ],
    correctAnswer: 1,
    explanation: 'US non-voice customer support emphasizes positive phrasing ("Thank you for your patience") rather than defensive or negative apologies.'
  },
  {
    id: 'eng-08',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Synonyms',
    question: 'Choose the word most similar in meaning to "EMPATHY":',
    options: ['Apathy', 'Understanding', 'Indifference', 'Hostility'],
    correctAnswer: 1,
    explanation: '"Empathy" is the ability to understand and share the feelings of another individual.'
  },
  {
    id: 'eng-09',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Sentence Correction',
    question: 'Identify the sentence with correct punctuation:',
    options: [
      'Although the package arrived on time the item inside was damaged.',
      'Although the package arrived on time, the item inside was damaged.',
      'Although the package arrived on time; the item inside was damaged.',
      'Although the package arrived on time the item inside, was damaged.'
    ],
    correctAnswer: 1,
    explanation: 'When a dependent adverb clause ("Although the package arrived on time") precedes the independent clause, it must be separated by a comma.'
  },
  {
    id: 'eng-10',
    category: 'english',
    difficulty: 'easy',
    topic: 'Subject-Verb Agreement',
    question: 'Every ticket received by our email desk ________ logged in the tracking database.',
    options: ['are', 'is', 'were', 'have been'],
    correctAnswer: 1,
    explanation: '"Every ticket" is a singular distributive subject, which requires the singular verb "is".'
  },
  {
    id: 'eng-11',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Vocabulary',
    question: 'Choose the correct word: "The agent gave clear and ________ instructions to reset the password."',
    options: ['concise', 'lengthy', 'vague', 'hesitant'],
    correctAnswer: 0,
    explanation: '"Concise" means giving a lot of information clearly and in few words, which is a gold standard in written customer communication.'
  },
  {
    id: 'eng-12',
    category: 'english',
    difficulty: 'advanced',
    topic: 'Conditionals',
    question: 'If the tracking information ________ updated earlier, we could have redirected the courier.',
    options: ['had been', 'was', 'has been', 'would have been'],
    correctAnswer: 0,
    explanation: 'In third conditional sentences expressing a past unreal situation, the "if" clause takes the past perfect ("had been").'
  },
  {
    id: 'eng-13',
    category: 'english',
    difficulty: 'easy',
    topic: 'Antonyms',
    question: 'Choose the word OPPOSITE in meaning to "DISPUTE":',
    options: ['Contest', 'Agreement', 'Argument', 'Conflict'],
    correctAnswer: 1,
    explanation: '"Dispute" means a disagreement or argument. Its opposite is "Agreement".'
  },
  {
    id: 'eng-14',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Prepositions',
    question: 'We apologize ________ any inconvenience caused by this unscheduled server maintenance.',
    options: ['with', 'about', 'for', 'of'],
    correctAnswer: 2,
    explanation: 'The standard business idiom is "apologize for [something]".'
  },
  {
    id: 'eng-15',
    category: 'english',
    difficulty: 'intermediate',
    topic: 'Professional Tone',
    question: 'A customer says: "Your app crashed and I lost my data!" Which response is most appropriate?',
    options: [
      'That happens sometimes, you should have backed it up.',
      'I completely understand how frustrating that is. Let me check your account backup right away.',
      'Calm down, our servers never crash.',
      'You must have clicked the wrong button.'
    ],
    correctAnswer: 1,
    explanation: 'The second option validates the customer\'s feelings empathetically and immediately takes proactive ownership of finding a solution.'
  }
];
