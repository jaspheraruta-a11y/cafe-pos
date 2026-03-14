import { RiderModel, Rider, DeliveryStats } from '@/models';

export class RiderController {
  private riderModel: RiderModel;

  constructor(riderModel?: RiderModel) {
    this.riderModel = riderModel || new RiderModel();
  }

  async createRider(riderData: Omit<Rider, 'id' | 'created_at' | 'updated_at'>): Promise<Rider> {
    try {
      const validationErrors = this.validateRiderData(riderData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      return await this.riderModel.createRider(riderData);
    } catch (error) {
      console.error('Error creating rider:', error);
      throw new Error('Failed to create rider');
    }
  }

  async getRiderById(id: string): Promise<Rider | null> {
    try {
      const rider = await this.riderModel.getRiderById(id);
      return rider;
    } catch (error) {
      console.error('Error fetching rider:', error);
      throw new Error('Failed to fetch rider');
    }
  }

  async getRiderByUserId(userId: string): Promise<Rider | null> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return await this.riderModel.getRiderByUserId(userId);
    } catch (error) {
      console.error('Error fetching rider by user ID:', error);
      throw new Error('Failed to fetch rider');
    }
  }

  async getAllRiders(): Promise<Rider[]> {
    try {
      return await this.riderModel.getAllRiders();
    } catch (error) {
      console.error('Error fetching all riders:', error);
      throw new Error('Failed to fetch riders');
    }
  }

  async getAvailableRiders(): Promise<Rider[]> {
    try {
      return await this.riderModel.getAvailableRiders();
    } catch (error) {
      console.error('Error fetching available riders:', error);
      throw new Error('Failed to fetch available riders');
    }
  }

  async updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
    try {
      const rider = await this.riderModel.getRiderById(id);
      if (!rider) {
        throw new Error('Rider not found');
      }

      if (status === 'available' && rider.current_order_id) {
        throw new Error('Cannot set rider to available while they have an active order');
      }

      return await this.riderModel.updateRiderStatus(id, status);
    } catch (error) {
      console.error('Error updating rider status:', error);
      throw new Error('Failed to update rider status');
    }
  }

  async updateRiderLocation(id: string, location: Rider['location']): Promise<Rider> {
    try {
      const rider = await this.riderModel.getRiderById(id);
      if (!rider) {
        throw new Error('Rider not found');
      }

      if (!location || !location.latitude || !location.longitude || !location.address) {
        throw new Error('Valid location data is required');
      }

      return await this.riderModel.updateRiderLocation(id, location);
    } catch (error) {
      console.error('Error updating rider location:', error);
      throw new Error('Failed to update rider location');
    }
  }

  async assignOrder(riderId: string, orderId: string): Promise<Rider> {
    try {
      const rider = await this.riderModel.getRiderById(riderId);
      if (!rider) {
        throw new Error('Rider not found');
      }

      if (rider.status !== 'available') {
        throw new Error('Rider is not available for assignment');
      }

      if (rider.current_order_id) {
        throw new Error('Rider already has an active order');
      }

      return await this.riderModel.assignOrder(riderId, orderId);
    } catch (error) {
      console.error('Error assigning order to rider:', error);
      throw new Error('Failed to assign order to rider');
    }
  }

  async completeOrder(riderId: string): Promise<Rider> {
    try {
      const rider = await this.riderModel.getRiderById(riderId);
      if (!rider) {
        throw new Error('Rider not found');
      }

      if (!rider.current_order_id) {
        throw new Error('Rider does not have an active order');
      }

      return await this.riderModel.completeOrder(riderId);
    } catch (error) {
      console.error('Error completing rider order:', error);
      throw new Error('Failed to complete order');
    }
  }

  async getRiderStats(riderId: string): Promise<DeliveryStats> {
    try {
      const rider = await this.riderModel.getRiderById(riderId);
      if (!rider) {
        throw new Error('Rider not found');
      }

      return await this.riderModel.getRiderStats(riderId);
    } catch (error) {
      console.error('Error fetching rider stats:', error);
      throw new Error('Failed to fetch rider stats');
    }
  }

  async getRiderWithStats(riderId: string): Promise<{
    rider: Rider;
    stats: DeliveryStats;
  } | null> {
    try {
      const rider = await this.riderModel.getRiderById(riderId);
      if (!rider) {
        return null;
      }

      const stats = await this.riderModel.getRiderStats(riderId);

      return {
        rider,
        stats
      };
    } catch (error) {
      console.error('Error fetching rider with stats:', error);
      throw new Error('Failed to fetch rider details');
    }
  }

  async getBestAvailableRider(): Promise<Rider | null> {
    try {
      const availableRiders = await this.riderModel.getAvailableRiders();
      
      if (availableRiders.length === 0) {
        return null;
      }

      return availableRiders.reduce((best, current) => 
        current.rating > best.rating ? current : best
      );
    } catch (error) {
      console.error('Error finding best available rider:', error);
      throw new Error('Failed to find available rider');
    }
  }

  validateRiderData(riderData: Partial<Rider>): string[] {
    const errors: string[] = [];

    if (!riderData.user_id) {
      errors.push('User ID is required');
    }

    if (!riderData.name || riderData.name.trim() === '') {
      errors.push('Rider name is required');
    }

    if (!riderData.phone || riderData.phone.trim() === '') {
      errors.push('Phone number is required');
    }

    if (!riderData.email || riderData.email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(riderData.email)) {
      errors.push('Valid email is required');
    }

    if (riderData.rating !== undefined && (riderData.rating < 0 || riderData.rating > 5)) {
      errors.push('Rating must be between 0 and 5');
    }

    if (riderData.total_deliveries !== undefined && riderData.total_deliveries < 0) {
      errors.push('Total deliveries cannot be negative');
    }

    if (!riderData.vehicle_type || !['motorcycle', 'bicycle', 'car'].includes(riderData.vehicle_type)) {
      errors.push('Valid vehicle type is required (motorcycle, bicycle, or car)');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async setRiderOnline(riderId: string): Promise<Rider> {
    return await this.updateRiderStatus(riderId, 'available');
  }

  async setRiderOffline(riderId: string): Promise<Rider> {
    const rider = await this.riderModel.getRiderById(riderId);
    if (!rider) {
      throw new Error('Rider not found');
    }

    if (rider.current_order_id) {
      throw new Error('Cannot set rider offline while they have an active order');
    }

    return await this.updateRiderStatus(riderId, 'offline');
  }

  async getRidersByVehicleType(vehicleType: Rider['vehicle_type']): Promise<Rider[]> {
    try {
      const allRiders = await this.riderModel.getAllRiders();
      return allRiders.filter(rider => rider.vehicle_type === vehicleType);
    } catch (error) {
      console.error('Error fetching riders by vehicle type:', error);
      throw new Error('Failed to fetch riders by vehicle type');
    }
  }
}
