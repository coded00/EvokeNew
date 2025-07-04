// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  bio?: string;
  location?: string;
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'organizer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
}

export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  image?: string;
  poster?: string;
  host: User;
  organizerId: string;
  category: string;
  vibes: string[];
  isPublic: boolean;
  isActive: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity: number;
  currentAttendees: number;
  ticketTypes: TicketType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  category: string;
  vibes: string[];
  isPublic: boolean;
  capacity: number;
  ticketTypes: CreateTicketTypeRequest[];
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  vibes?: string[];
  isPublic?: boolean;
  capacity?: number;
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
}

// Ticket Types
export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  isActive: boolean;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketTypeRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface UpdateTicketTypeRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  isActive?: boolean;
}

// Ticket Purchase Types
export interface Ticket {
  id: string;
  ticketTypeId: string;
  eventId: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  qrCode: string;
  isUsed: boolean;
  usedAt?: Date;
  isTransferable: boolean;
  transferredTo?: string;
  transferredAt?: Date;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseTicketRequest {
  ticketTypeId: string;
  quantity: number;
  attendeeName: string;
  attendeeEmail: string;
  paymentMethod: 'stripe' | 'paystack';
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paystack';
  transactionId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paystack';
  metadata: Record<string, any>;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Team Management Types
export interface TeamMember {
  id: string;
  eventId: string;
  userId: string;
  role: 'organizer' | 'manager' | 'assistant';
  permissions: Permission[];
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: 'organizer' | 'manager' | 'assistant';
  permissions: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'event' | 'payment' | 'ticket';
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationRequest {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// File Upload Types
export interface FileUpload {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

// Analytics Types
export interface EventAnalytics {
  eventId: string;
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  currency: string;
  checkIns: number;
  checkInRate: number;
  averageTicketPrice: number;
  topTicketType: string;
  salesByDay: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  vibes?: string[];
  isFree?: boolean;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'notification' | 'event_update' | 'ticket_update' | 'payment_update';
  data: any;
  timestamp: Date;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 