import QRCode from 'qrcode';

export interface TicketData {
  ticketId: string;
  eventId: string;
  userId: string;
  ticketType: string;
  purchaseDate: string;
  eventName: string;
  attendeeName: string;
  price: number;
  currency: string;
  hash: string;
}

export interface QRCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export class QRCodeService {
  private static readonly DEFAULT_OPTIONS: QRCodeOptions = {
    width: 256,
    height: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  };

  /**
   * Generate a unique ticket ID
   */
  static generateTicketId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TKT-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Generate a validation hash for ticket security
   */
  static generateTicketHash(ticketData: Omit<TicketData, 'hash'>): string {
    const dataString = `${ticketData.ticketId}-${ticketData.eventId}-${ticketData.userId}-${ticketData.purchaseDate}`;
    // In a real app, you'd use a proper crypto library and secret key
    return btoa(dataString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  /**
   * Create ticket data structure
   */
  static createTicketData(
    eventId: string,
    userId: string,
    ticketType: string,
    eventName: string,
    attendeeName: string,
    price: number,
    currency: string
  ): TicketData {
    const ticketId = this.generateTicketId();
    const purchaseDate = new Date().toISOString();
    
    const ticketData: Omit<TicketData, 'hash'> = {
      ticketId,
      eventId,
      userId,
      ticketType,
      purchaseDate,
      eventName,
      attendeeName,
      price,
      currency
    };

    const hash = this.generateTicketHash(ticketData);

    return {
      ...ticketData,
      hash
    };
  }

  /**
   * Generate QR code as data URL
   */
  static async generateQRCodeDataURL(
    ticketData: TicketData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };
    
    const qrOptions = {
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel
    };

    try {
      const dataURL = await QRCode.toDataURL(
        JSON.stringify(ticketData),
        qrOptions
      );
      return dataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as SVG
   */
  static async generateQRCodeSVG(
    ticketData: TicketData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };
    
    const qrOptions = {
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel
    };

    try {
      const svg = await QRCode.toString(
        JSON.stringify(ticketData),
        {
          ...qrOptions,
          type: 'svg'
        }
      );
      return svg;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }

  /**
   * Validate ticket data from QR code
   */
  static validateTicketData(qrData: string): { isValid: boolean; ticketData?: TicketData; error?: string } {
    try {
      const ticketData: TicketData = JSON.parse(qrData);
      
      // Check if all required fields are present
      const requiredFields = ['ticketId', 'eventId', 'userId', 'hash'];
      for (const field of requiredFields) {
        if (!ticketData[field as keyof TicketData]) {
          return { isValid: false, error: `Missing required field: ${field}` };
        }
      }

      // Validate hash
      const { hash, ...dataWithoutHash } = ticketData;
      const expectedHash = this.generateTicketHash(dataWithoutHash);
      
      if (hash !== expectedHash) {
        return { isValid: false, error: 'Invalid ticket hash' };
      }

      return { isValid: true, ticketData };
    } catch (error) {
      return { isValid: false, error: 'Invalid QR code data format' };
    }
  }

  /**
   * Check if ticket is expired (optional feature)
   */
  static isTicketExpired(ticketData: TicketData, eventDate: string): boolean {
    const eventDateTime = new Date(eventDate);
    const currentDate = new Date();
    return currentDate > eventDateTime;
  }

  /**
   * Generate multiple QR codes for bulk tickets
   */
  static async generateBulkQRCodes(
    ticketsData: TicketData[],
    options: QRCodeOptions = {}
  ): Promise<{ ticketId: string; qrCodeDataURL: string }[]> {
    const qrCodes = await Promise.all(
      ticketsData.map(async (ticketData) => {
        const qrCodeDataURL = await this.generateQRCodeDataURL(ticketData, options);
        return {
          ticketId: ticketData.ticketId,
          qrCodeDataURL
        };
      })
    );

    return qrCodes;
  }
}

export default QRCodeService; 