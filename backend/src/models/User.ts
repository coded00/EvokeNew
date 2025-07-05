import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';

// Types
export interface CreateUserData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  role?: UserRole;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  isVerified?: boolean;
  isActive?: boolean;
  role?: UserRole;
}

export interface UserFilters {
  isActive?: boolean;
  isVerified?: boolean;
  role?: UserRole;
  search?: string;
}

// User Model Class
class User {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Create a new user
  async create(data: CreateUserData): Promise<PrismaUser> {
    return this.prisma.user.create({
      data,
    });
  }

  // Find user by ID
  async findById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        events: true,
        tickets: {
          include: {
            event: true,
            ticketType: true,
          },
        },
        orders: {
          include: {
            event: true,
            payments: true,
          },
        },
        userEvents: {
          include: {
            event: true,
          },
        },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Find user by username
  async findByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  // Update user
  async update(id: string, data: UpdateUserData): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete user (soft delete by setting isActive to false)
  async delete(id: string): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Find all users with filters
  async findAll(filters: UserFilters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }
    
    if (filters.role) {
      where.role = filters.role;
    }
    
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { username: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          events: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          tickets: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              event: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get user statistics
  async getStats(userId: string) {
    const [
      totalEvents,
      totalTickets,
      totalOrders,
      totalPayments,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.event.count({
        where: { organizerId: userId },
      }),
      this.prisma.ticket.count({
        where: { userId },
      }),
      this.prisma.order.count({
        where: { userId },
      }),
      this.prisma.payment.count({
        where: { userId },
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return {
      totalEvents,
      totalTickets,
      totalOrders,
      totalPayments,
      unreadNotifications,
    };
  }

  // Verify user email
  async verifyEmail(id: string): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  // Change user password
  async changePassword(id: string, passwordHash: string): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  // Get user's events
  async getUserEvents(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [userEvents, total] = await Promise.all([
      this.prisma.userEvent.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            include: {
              venue: true,
              categories: {
                include: {
                  category: true,
                },
              },
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      }),
      this.prisma.userEvent.count({
        where: { userId },
      }),
    ]);

    return {
      userEvents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default User; 