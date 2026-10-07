export type TripType = 'domestic' | 'international';

export type BudgetLevel = 'budget' | 'moderate' | 'luxury';

export interface TravelPlanRequest {
  tripType: TripType;
  destination: string;
  departureCity?: string;
  startDate?: string;
  endDate?: string;
  totalDays: number;
  budgetLevel: BudgetLevel;
  budgetAmount?: number;
  currency: 'TRY' | 'USD' | 'EUR';
  travelersCount: number;
  travelStyle: string[];
  specialRequests?: string;
}

export interface BudgetOverview {
  level: string;
  estimatedTotalCost: string;
  dailyPerPersonCost: string;
  costBreakdown: {
    accommodation: string;
    foodAndDrink: string;
    activitiesAndMuseums: string;
    localTransport: string;
  };
  savingTips: string[];
}

export interface MustSeePlace {
  id: string;
  name: string;
  category: 'historic' | 'nature' | 'food' | 'viewpoint' | 'museum' | 'shopping' | string;
  shortDescription: string;
  whyVisit: string;
  estimatedDuration: string;
  costCategory: 'free' | 'low' | 'medium' | 'high' | string;
  ticketPriceEstimated: string;
  bestTimeToVisit: string;
  insiderTip: string;
  googleMapsQuery?: string;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme: string;
  morning: {
    title: string;
    description: string;
    location: string;
    costEstimate?: string;
  };
  afternoon: {
    title: string;
    description: string;
    location: string;
    lunchRecommendation: string;
    costEstimate?: string;
  };
  evening: {
    title: string;
    description: string;
    dinnerRecommendation: string;
    costEstimate?: string;
  };
  dayTips: string;
  estimatedDayBudget: string;
}

export interface LocalDish {
  dishName: string;
  description: string;
  whereToEat: string;
  budgetFriendly: boolean;
}

export interface EmergencyInfo {
  localEmergencyNumbers: string;
  currencyAndPaymentTips: string;
  visaOrEntryNote: string;
}

export interface TravelPlan {
  id?: string;
  createdAt?: string;
  requestParams?: TravelPlanRequest;
  summary: {
    title: string;
    tagline: string;
    destination: string;
    tripType: string;
    durationDays: number;
    datesFormatted: string;
    seasonAdvice: string;
    budgetOverview: BudgetOverview;
  };
  mustSeePlaces: MustSeePlace[];
  itinerary: DayItinerary[];
  localCuisine: LocalDish[];
  packingChecklist: string[];
  transportAdvice: string;
  emergencyAndPracticalInfo: EmergencyInfo;
}
