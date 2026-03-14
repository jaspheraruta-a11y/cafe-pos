import { UserModel, User, UserProfile } from '@/models';

export class UserController {
  private userModel: UserModel;

  constructor(userModel?: UserModel) {
    this.userModel = userModel || new UserModel();
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      const validationErrors = this.validateUserData(userData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      const existingUser = await this.userModel.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      return await this.userModel.createUser(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.getUserById(id);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || email.trim() === '') {
        throw new Error('Email is required');
      }
      return await this.userModel.getUserByEmail(email);
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.userModel.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      if (updates.email && updates.email !== existingUser.email) {
        const emailExists = await this.userModel.getUserByEmail(updates.email);
        if (emailExists) {
          throw new Error('Email already in use by another user');
        }
      }

      const validationErrors = this.validateUserData(updates);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      return await this.userModel.updateUser(id, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      return await this.userModel.getUsersByRole(role);
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new Error('Failed to fetch users by role');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.getAllUsers();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async createUserProfile(profileData: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    try {
      if (!profileData.user_id) {
        throw new Error('User ID is required');
      }

      const user = await this.userModel.getUserById(profileData.user_id);
      if (!user) {
        throw new Error('User not found');
      }

      return await this.userModel.createUserProfile(profileData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return await this.userModel.getUserProfile(userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const existingProfile = await this.userModel.getUserProfile(userId);
      if (!existingProfile) {
        throw new Error('User profile not found');
      }

      return await this.userModel.updateUserProfile(userId, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async getUserWithProfile(userId: string): Promise<{
    user: User;
    profile: UserProfile | null;
  } | null> {
    try {
      const user = await this.userModel.getUserById(userId);
      if (!user) {
        return null;
      }

      const profile = await this.userModel.getUserProfile(userId);

      return {
        user,
        profile
      };
    } catch (error) {
      console.error('Error fetching user with profile:', error);
      throw new Error('Failed to fetch user details');
    }
  }

  async getCustomers(): Promise<User[]> {
    try {
      return await this.userModel.getUsersByRole('customer');
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  async getAdmins(): Promise<User[]> {
    try {
      return await this.userModel.getUsersByRole('admin');
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Failed to fetch admins');
    }
  }

  async getRiders(): Promise<User[]> {
    try {
      return await this.userModel.getUsersByRole('rider');
    } catch (error) {
      console.error('Error fetching riders:', error);
      throw new Error('Failed to fetch riders');
    }
  }

  validateUserData(userData: Partial<User>): string[] {
    const errors: string[] = [];

    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (userData.name && userData.name.trim() === '') {
      errors.push('Name is required');
    }

    if (userData.phone && userData.phone.trim() === '') {
      errors.push('Phone number is required');
    }

    if (userData.role && !['customer', 'admin', 'rider'].includes(userData.role)) {
      errors.push('Valid role is required (customer, admin, or rider)');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
