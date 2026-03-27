export type OnboardingAnswers = {
  productType: string
  productSubtype: string
  launchMarket: string
  targetCustomer: string
  launchBudget: string
  manufacturing: string
  stage: string
  brandVision: string
}

export const PRODUCT_SUBTYPES: Record<string, string[]> = {
  Beverage: ['Energy Drink', 'Sparkling Water', 'Juice', 'Coffee / Tea', 'Sports Drink', 'Kombucha', 'Smoothie', 'Other'],
  Snack: ['Protein Bar', 'Granola Bar', 'Chips / Crisps', 'Trail Mix', 'Jerky', 'Cookies / Baked Goods', 'Popcorn', 'Other'],
  Supplement: ['Protein Powder', 'Vitamins / Minerals', 'Greens Powder', 'Collagen', 'Pre-workout', 'Probiotics', 'Other'],
  'Beauty & Personal Care': ['Skincare', 'Hair Care', 'Body Care', 'Lip Care', 'Deodorant', 'Sunscreen', 'Other'],
  Other: ['Food', 'Pet Food', 'Baby / Kids', 'Household', 'Other'],
}

export type QuestionType = 'choice' | 'text' | 'textarea'

export type Question = {
  id: keyof OnboardingAnswers
  text: string
  type: QuestionType
  options?: string[]
}

const BASE_QUESTIONS: Question[] = [
  {
    id: 'productType',
    text: 'What type of CPG product are you launching?',
    type: 'choice',
    options: ['Beverage', 'Snack', 'Supplement', 'Beauty & Personal Care', 'Other'],
  },
  {
    id: 'launchMarket',
    text: 'Where are you launching?',
    type: 'choice',
    options: ['United States', 'Canada', 'United Kingdom', 'Europe', 'Other'],
  },
  {
    id: 'targetCustomer',
    text: 'Who is your target customer?',
    type: 'text',
  },
  {
    id: 'launchBudget',
    text: 'What is your launch budget?',
    type: 'choice',
    options: ['Under $10K', '$10K–$50K', '$50K–$150K', '$150K+'],
  },
  {
    id: 'manufacturing',
    text: 'How do you plan to manufacture?',
    type: 'choice',
    options: ['Outsource to co-packer', 'In-house', 'Not sure yet'],
  },
  {
    id: 'stage',
    text: 'What stage are you at?',
    type: 'choice',
    options: ['Just an idea', 'Done some research', 'Ready to launch', 'Already have a prototype'],
  },
  {
    id: 'brandVision',
    text: 'Describe your brand vision.',
    type: 'textarea',
  },
]

export function getQuestions(answers: Partial<OnboardingAnswers>): Question[] {
  const subtypeOptions = answers.productType ? PRODUCT_SUBTYPES[answers.productType] : undefined
  if (!subtypeOptions) return BASE_QUESTIONS

  const isOther = answers.productType === 'Other'
  const subtypeQuestion: Question = isOther
    ? {
        id: 'productSubtype',
        text: 'What product are you launching?',
        type: 'text',
      }
    : {
        id: 'productSubtype',
        text: `What kind of ${answers.productType!.toLowerCase()} specifically?`,
        type: 'choice',
        options: subtypeOptions,
      }

  return [BASE_QUESTIONS[0], subtypeQuestion, ...BASE_QUESTIONS.slice(1)]
}

export type RoadmapPhase = {
  title: string
  timeline: string
  milestones: string[]
}

export type Supplier = {
  name: string
  type: string
  location: string
  minOrder: string
  source?: string
}

export type MarginData = {
  cogs: string
  price: string
  margin: string
  breakeven: string
}

export type BrandData = {
  names: string[]
  tone: string[]
  tagline: string
}

export type WorkspaceContent = {
  roadmap: RoadmapPhase[]
  suppliers: Supplier[]
  margins: MarginData
  brand: BrandData
}

export const LOADING_MESSAGES = [
  'Analyzing your market...',
  'Finding your suppliers...',
  'Building your roadmap...',
  'Modeling your margins...',
  'Crafting your brand identity...',
]
