// Subscriptions API - Mock Implementation for Development
import { 
  Subscription, 
  SubscriptionResponse, 
  CreateSubscriptionRequest, 
  UpdateSubscriptionRequest,
  SubscriptionFilters 
} from '../types/subscription';
import { mockSubscriptions } from '../data/mockData';

// Mock API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FetchParams {
  filters: SubscriptionFilters;
  page: number;
  limit: number;
}

// Fetch subscriptions with filtering and pagination
export const fetchSubscriptions = async (params: FetchParams): Promise<SubscriptionResponse> => {
  await delay(300); // Simulate network delay
  
  const { filters, page, limit } = params;
  let filteredData = [...mockSubscriptions];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredData = filteredData.filter(sub => 
      sub.name.toLowerCase().includes(searchLower) ||
      sub.description?.toLowerCase().includes(searchLower) ||
      sub.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply category filter
  if (filters.categories.length > 0) {
    filteredData = filteredData.filter(sub => filters.categories.includes(sub.category));
  }

  // Apply status filter
  if (filters.statuses.length > 0) {
    filteredData = filteredData.filter(sub => filters.statuses.includes(sub.status));
  }

  // Apply currency filter
  if (filters.currencies.length > 0) {
    filteredData = filteredData.filter(sub => filters.currencies.includes(sub.currency));
  }

  // Apply price range filter
  filteredData = filteredData.filter(sub => 
    sub.price >= filters.priceRange.min && sub.price <= filters.priceRange.max
  );

  // Apply sorting
  filteredData.sort((a, b) => {
    const factor = filters.sortOrder === 'asc' ? 1 : -1;
    switch (filters.sortBy) {
      case 'name':
        return factor * a.name.localeCompare(b.name);
      case 'price':
        return factor * (a.price - b.price);
      case 'nextBilling':
        return factor * (new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
      case 'created':
        return factor * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'updated':
        return factor * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      default:
        return 0;
    }
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    total: filteredData.length,
    page,
    limit,
  };
};

// Create new subscription
export const createSubscription = async (data: CreateSubscriptionRequest): Promise<Subscription> => {
  await delay(500);
  
  const newSubscription: Subscription = {
    ...data,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock data (in real app, this would be handled by the backend)
  mockSubscriptions.unshift(newSubscription);
  
  return newSubscription;
};

// Update existing subscription
export const updateSubscription = async (data: UpdateSubscriptionRequest): Promise<Subscription> => {
  await delay(400);
  
  const index = mockSubscriptions.findIndex(sub => sub.id === data.id);
  if (index === -1) {
    throw new Error('Subscription not found');
  }

  const updatedSubscription: Subscription = {
    ...mockSubscriptions[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockSubscriptions[index] = updatedSubscription;
  return updatedSubscription;
};

// Delete subscription
export const deleteSubscription = async (id: string): Promise<void> => {
  await delay(300);
  
  const index = mockSubscriptions.findIndex(sub => sub.id === id);
  if (index === -1) {
    throw new Error('Subscription not found');
  }

  mockSubscriptions.splice(index, 1);
};