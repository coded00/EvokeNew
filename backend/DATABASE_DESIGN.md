# EVOKE Database Design Documentation

## Overview

The EVOKE platform uses a PostgreSQL database with Prisma ORM for type-safe database operations. The database is designed to handle event management, ticketing, user management, payments, and analytics.

## Database Schema

### Core Entities

#### 1. User Management
**Table: `users`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `email` | String | Unique email address |
| `username` | String | Unique username |
| `firstName` | String | User's first name |
| `lastName` | String | User's last name |
| `passwordHash` | String | Hashed password |
| `avatar` | String? | Profile picture URL |
| `phone` | String? | Phone number |
| `dateOfBirth` | DateTime? | Birth date |
| `isVerified` | Boolean | Email verification status |
| `isActive` | Boolean | Account status |
| `role` | UserRole | User role (USER, ORGANIZER, ADMIN, MODERATOR) |
| `createdAt` | DateTime | Account creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `email` (unique)
- `username` (unique)
- `isActive`
- `role`

#### 2. Event Management
**Table: `events`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `title` | String | Event title |
| `description` | String | Full description |
| `shortDescription` | String? | Brief description |
| `slug` | String | URL-friendly identifier |
| `startDate` | DateTime | Event start time |
| `endDate` | DateTime | Event end time |
| `timezone` | String | Event timezone |
| `isPublished` | Boolean | Publication status |
| `isCancelled` | Boolean | Cancellation status |
| `maxAttendees` | Int? | Maximum attendees |
| `currentAttendees` | Int | Current attendee count |
| `price` | Decimal | Base price |
| `currency` | String | Price currency |
| `organizerId` | String | Event organizer |
| `venueId` | String? | Event venue |
| `featured` | Boolean | Featured event flag |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `organizerId`
- `startDate`
- `isPublished`
- `featured`
- `slug` (unique)

#### 3. Venue Management
**Table: `venues`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Venue name |
| `address` | String | Street address |
| `city` | String | City |
| `state` | String? | State/Province |
| `country` | String | Country |
| `postalCode` | String? | Postal code |
| `latitude` | Float? | GPS latitude |
| `longitude` | Float? | GPS longitude |
| `capacity` | Int? | Venue capacity |
| `description` | String? | Venue description |
| `website` | String? | Venue website |
| `phone` | String? | Contact phone |
| `email` | String? | Contact email |
| `isActive` | Boolean | Venue status |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

#### 4. Category Management
**Table: `categories`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Category name |
| `description` | String? | Category description |
| `icon` | String? | Category icon |
| `color` | String? | Category color |
| `isActive` | Boolean | Category status |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `name` (unique)

### Ticketing System

#### 5. Ticket Type Management
**Table: `ticket_types`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Ticket type name |
| `description` | String? | Description |
| `price` | Decimal | Ticket price |
| `currency` | String | Price currency |
| `quantity` | Int | Available quantity |
| `sold` | Int | Sold quantity |
| `isActive` | Boolean | Active status |
| `eventId` | String | Associated event |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

#### 6. Ticket Management
**Table: `tickets`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `ticketNumber` | String | Unique ticket number |
| `status` | TicketStatus | Ticket status |
| `purchaseDate` | DateTime | Purchase date |
| `userId` | String | Ticket owner |
| `eventId` | String | Associated event |
| `ticketTypeId` | String | Ticket type |
| `orderId` | String? | Associated order |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `userId`
- `eventId`
- `status`
- `ticketNumber` (unique)

**TicketStatus Enum:**
- `ACTIVE` - Valid ticket
- `USED` - Ticket has been used
- `CANCELLED` - Ticket cancelled
- `EXPIRED` - Ticket expired
- `REFUNDED` - Ticket refunded

### Payment System

#### 7. Order Management
**Table: `orders`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `orderNumber` | String | Unique order number |
| `status` | OrderStatus | Order status |
| `totalAmount` | Decimal | Total order amount |
| `currency` | String | Order currency |
| `userId` | String | Order owner |
| `eventId` | String? | Associated event |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `userId`
- `status`
- `orderNumber` (unique)

**OrderStatus Enum:**
- `PENDING` - Order pending
- `CONFIRMED` - Order confirmed
- `CANCELLED` - Order cancelled
- `REFUNDED` - Order refunded
- `COMPLETED` - Order completed

#### 8. Payment Management
**Table: `payments`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `amount` | Decimal | Payment amount |
| `currency` | String | Payment currency |
| `status` | PaymentStatus | Payment status |
| `paymentMethod` | PaymentMethod | Payment method |
| `transactionId` | String? | External transaction ID |
| `userId` | String | Payment owner |
| `orderId` | String | Associated order |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `userId`
- `orderId`
- `status`
- `transactionId` (unique)

**PaymentStatus Enum:**
- `PENDING` - Payment pending
- `PROCESSING` - Payment processing
- `COMPLETED` - Payment completed
- `FAILED` - Payment failed
- `CANCELLED` - Payment cancelled
- `REFUNDED` - Payment refunded

**PaymentMethod Enum:**
- `CREDIT_CARD` - Credit card
- `DEBIT_CARD` - Debit card
- `PAYPAL` - PayPal
- `STRIPE` - Stripe
- `BANK_TRANSFER` - Bank transfer
- `CRYPTO` - Cryptocurrency

### User Engagement

#### 9. User-Event Junction
**Table: `user_events`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String | User ID |
| `eventId` | String | Event ID |
| `status` | UserEventStatus | User's event status |
| `createdAt` | DateTime | Creation date |
| `updatedAt` | DateTime | Last update date |

**Indexes:**
- `userId`
- `eventId`
- Unique constraint on `[userId, eventId]`

**UserEventStatus Enum:**
- `INTERESTED` - User interested
- `GOING` - User attending
- `NOT_GOING` - User not attending
- `MAYBE` - User maybe attending

#### 10. Messaging System
**Table: `messages`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `content` | String | Message content |
| `isRead` | Boolean | Read status |
| `senderId` | String | Message sender |
| `receiverId` | String | Message receiver |
| `eventId` | String? | Associated event |
| `createdAt` | DateTime | Creation date |

**Indexes:**
- `senderId`
- `receiverId`
- `isRead`

#### 11. Notifications
**Table: `notifications`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `title` | String | Notification title |
| `message` | String | Notification message |
| `type` | NotificationType | Notification type |
| `isRead` | Boolean | Read status |
| `userId` | String | Notification recipient |
| `eventId` | String? | Associated event |
| `createdAt` | DateTime | Creation date |

**Indexes:**
- `userId`
- `isRead`
- `type`

**NotificationType Enum:**
- `EVENT_REMINDER` - Event reminder
- `TICKET_PURCHASE` - Ticket purchase notification
- `EVENT_UPDATE` - Event update notification
- `MESSAGE` - New message notification
- `SYSTEM` - System notification

### Media and Content

#### 12. Event Images
**Table: `event_images`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `url` | String | Image URL |
| `alt` | String? | Alt text |
| `isPrimary` | Boolean | Primary image flag |
| `eventId` | String | Associated event |
| `createdAt` | DateTime | Creation date |

#### 13. Event-Category Junction
**Table: `event_categories`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `eventId` | String | Event ID |
| `categoryId` | String | Category ID |
| `createdAt` | DateTime | Creation date |

**Indexes:**
- Unique constraint on `[eventId, categoryId]`

### QR Code System

#### 14. QR Code Management
**Table: `qr_codes`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `code` | String | QR code data |
| `isUsed` | Boolean | Usage status |
| `usedAt` | DateTime? | Usage timestamp |
| `userId` | String | QR code owner |
| `eventId` | String | Associated event |
| `ticketId` | String? | Associated ticket |
| `createdAt` | DateTime | Creation date |

**Indexes:**
- `code` (unique)
- `eventId`
- `isUsed`

### Analytics

#### 15. Event Analytics
**Table: `event_analytics`**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `eventId` | String | Associated event |
| `userId` | String? | Associated user |
| `action` | String | Analytics action |
| `metadata` | Json? | Additional data |
| `ipAddress` | String? | User IP address |
| `userAgent` | String? | User agent string |
| `createdAt` | DateTime | Creation date |

**Indexes:**
- `eventId`
- `action`
- `createdAt`

## Relationships

### One-to-Many Relationships
- **User → Events** (User can organize multiple events)
- **User → Tickets** (User can have multiple tickets)
- **User → Orders** (User can have multiple orders)
- **User → Payments** (User can have multiple payments)
- **Event → Ticket Types** (Event can have multiple ticket types)
- **Event → Tickets** (Event can have multiple tickets)
- **Event → Orders** (Event can have multiple orders)
- **Event → Images** (Event can have multiple images)
- **Event → QR Codes** (Event can have multiple QR codes)
- **Venue → Events** (Venue can host multiple events)
- **Category → Event Categories** (Category can be used by multiple events)

### Many-to-Many Relationships
- **Users ↔ Events** (via `user_events` table)
- **Events ↔ Categories** (via `event_categories` table)

### One-to-One Relationships
- **Ticket → QR Code** (Each ticket can have one QR code)

## Design Decisions

### 1. Soft Deletes
- Users are soft-deleted by setting `isActive = false`
- Events are soft-deleted by setting `isCancelled = true`
- This preserves data integrity and allows for recovery

### 2. CUID Primary Keys
- Using CUID (Collision-resistant Unique IDentifier) for all primary keys
- Provides better performance than UUIDs
- Ensures uniqueness across distributed systems

### 3. Decimal for Money
- Using `Decimal` type for all monetary values
- Prevents floating-point precision issues
- Ensures accurate financial calculations

### 4. Comprehensive Indexing
- Strategic indexes on frequently queried fields
- Composite indexes for complex queries
- Unique constraints where appropriate

### 5. Audit Trail
- `createdAt` and `updatedAt` timestamps on all tables
- Tracks when records are created and modified
- Essential for debugging and compliance

### 6. Flexible Status Management
- Enum-based status fields for better type safety
- Clear status transitions for business logic
- Easy to extend with new statuses

### 7. JSON Metadata
- Using JSON fields for flexible metadata storage
- Allows for extensible data without schema changes
- Useful for analytics and feature flags

## Performance Considerations

### 1. Indexing Strategy
- Primary keys are automatically indexed
- Foreign keys are indexed for join performance
- Composite indexes for multi-column queries
- Partial indexes for filtered queries

### 2. Query Optimization
- Eager loading for related data
- Pagination for large result sets
- Efficient filtering and sorting
- Caching strategies for frequently accessed data

### 3. Scalability
- Horizontal scaling with read replicas
- Partitioning strategies for large tables
- Connection pooling for database connections
- Query optimization and monitoring

## Security Considerations

### 1. Data Protection
- Encrypted sensitive data (passwords, payment info)
- Secure communication with TLS
- Input validation and sanitization
- SQL injection prevention with parameterized queries

### 2. Access Control
- Role-based access control (RBAC)
- Row-level security where appropriate
- Audit logging for sensitive operations
- Rate limiting for API endpoints

### 3. Privacy Compliance
- GDPR compliance considerations
- Data retention policies
- User data export capabilities
- Right to be forgotten implementation

## Migration Strategy

### 1. Schema Evolution
- Backward-compatible schema changes
- Migration scripts for data transformation
- Rollback strategies for failed migrations
- Testing migrations in staging environment

### 2. Data Integrity
- Foreign key constraints for referential integrity
- Check constraints for data validation
- Triggers for complex business rules
- Transaction management for data consistency

## Future Enhancements

### 1. Advanced Features
- Multi-language support
- Advanced search with full-text indexing
- Real-time notifications with WebSockets
- File upload and CDN integration

### 2. Analytics and Reporting
- Advanced analytics dashboard
- Custom reporting capabilities
- Data export functionality
- Business intelligence integration

### 3. Scalability Improvements
- Database sharding strategies
- Microservices architecture
- Event sourcing for audit trails
- CQRS pattern for complex queries

---

This database design provides a solid foundation for the EVOKE platform, supporting all current features while remaining flexible for future enhancements. 