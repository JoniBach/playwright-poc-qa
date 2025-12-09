/**
 * Test Data Factory
 * Generates test data for various scenarios
 */

export class TestDataFactory {
  /**
   * Generate random email
   */
  static generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}.${timestamp}@example.com`;
  }

  /**
   * Generate random UK phone number
   */
  static generatePhoneNumber(): string {
    const randomDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `077${randomDigits}`;
  }

  /**
   * Generate random UK postcode
   */
  static generatePostcode(): string {
    // Use common, definitely valid UK postcodes from major cities
    const validPostcodes = [
      'B1 1AA',   // Birmingham
      'M1 1AA',   // Manchester
      'LS1 1AA',  // Leeds
      'L1 1AA',   // Liverpool
      'S1 1AA',   // Sheffield
      'CF10 1AA', // Cardiff
      'G1 1AA',   // Glasgow
      'EH1 1AA',  // Edinburgh
      'BT1 1AA',  // Belfast
      'BS1 1AA'   // Bristol
    ];
    return validPostcodes[Math.floor(Math.random() * validPostcodes.length)];
  }

  /**
   * Generate random name
   */
  static generateName(): { firstName: string; lastName: string; fullName: string } {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`
    };
  }

  /**
   * Generate aircraft data
   */
  static generateAircraftData() {
    const manufacturers = ['Cessna', 'Piper', 'Beechcraft', 'Cirrus', 'Diamond'];
    const models = ['172', '182', 'PA-28', 'SR22', 'DA40'];
    
    return {
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      model: models[Math.floor(Math.random() * models.length)],
      serialNumber: `SN${Date.now().toString().slice(-8)}`
    };
  }

  /**
   * Generate contact details
   */
  static generateContactDetails() {
    const name = this.generateName();
    return {
      fullName: name.fullName,
      email: this.generateEmail(name.firstName.toLowerCase()),
      phone: this.generatePhoneNumber()
    };
  }

  /**
   * Generate address
   */
  static generateAddress() {
    const streetNumbers = Math.floor(Math.random() * 200) + 1;
    const streets = ['High Street', 'Station Road', 'Church Lane', 'Main Street', 'Park Avenue'];
    const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool'];
    
    return {
      line1: `${streetNumbers} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      postcode: this.generatePostcode()
    };
  }

  /**
   * Generate company details
   */
  static generateCompanyDetails() {
    const companyTypes = ['Ltd', 'PLC', 'LLP'];
    const companyNames = ['Aviation', 'Aerospace', 'Flight', 'Airways', 'Air Services'];
    
    const name = companyNames[Math.floor(Math.random() * companyNames.length)];
    const type = companyTypes[Math.floor(Math.random() * companyTypes.length)];
    
    return {
      name: `${name} ${type}`,
      registrationNumber: `${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`
    };
  }
}
