export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  states: string[];
  popularSchools: string[];
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    currencyName: 'Nigerian Naira (₦)',
    states: [
      'Lagos',
      'Abuja (FCT)',
      'Oyo',
      'Ogun',
      'Rivers',
      'Kaduna',
      'Edo',
      'Enugu',
      'Anambra',
      'Kano',
      'Kwara',
      'Osun',
      'Ondo',
      'Delta',
      'Plateau',
      'Imo',
      'Akwa Ibom',
      'Cross River',
      'Benue',
      'Abia'
    ],
    popularSchools: [
      'University of Lagos (UNILAG)',
      'Obafemi Awolowo University (OAU)',
      'University of Ibadan (UI)',
      'Covenant University',
      'University of Nigeria, Nsukka (UNN)',
      'Ahmadu Bello University (ABU)',
      'Federal University of Technology, Akure (FUTA)',
      'Lagos State University (LASU)',
      'University of Benin (UNIBEN)',
      'University of Ilorin (UNILORIN)',
      'Babcock University',
      'Landmark University',
      'Bowen University',
      'Pan-Atlantic University (PAU)'
    ]
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar ($)',
    states: [
      'California',
      'New York',
      'Texas',
      'Massachusetts',
      'Washington',
      'Illinois',
      'Pennsylvania',
      'Florida',
      'Georgia',
      'Michigan',
      'North Carolina',
      'Virginia',
      'Ohio',
      'Colorado',
      'Arizona'
    ],
    popularSchools: [
      'Stanford University',
      'UC Berkeley',
      'MIT',
      'Harvard University',
      'NYU',
      'UCLA',
      'UT Austin',
      'Columbia University',
      'University of Michigan',
      'Georgia Tech',
      'Cornell University',
      'Carnegie Mellon University'
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    currencyName: 'British Pound (£)',
    states: [
      'England (Greater London)',
      'England (West Midlands)',
      'England (Greater Manchester)',
      'England (Yorkshire)',
      'Scotland',
      'Wales',
      'Northern Ireland'
    ],
    popularSchools: [
      'University of Oxford',
      'University of Cambridge',
      'Imperial College London',
      'University College London (UCL)',
      'London School of Economics (LSE)',
      'University of Edinburgh',
      'King\'s College London',
      'University of Manchester'
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'CA$',
    currencyName: 'Canadian Dollar (CA$)',
    states: [
      'Ontario',
      'British Columbia',
      'Quebec',
      'Alberta',
      'Manitoba',
      'Nova Scotia',
      'Saskatchewan'
    ],
    popularSchools: [
      'University of Toronto',
      'University of British Columbia (UBC)',
      'McGill University',
      'University of Waterloo',
      'McMaster University',
      'University of Alberta',
      'Western University'
    ]
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currencyCode: 'GHS',
    currencySymbol: 'GH₵',
    currencyName: 'Ghanaian Cedi (GH₵)',
    states: [
      'Greater Accra',
      'Ashanti',
      'Central',
      'Eastern',
      'Western',
      'Northern',
      'Volta'
    ],
    popularSchools: [
      'University of Ghana (Legon)',
      'Kwame Nkrumah University of Science and Tech (KNUST)',
      'Ashesi University',
      'University of Cape Coast (UCC)',
      'Ghana Institute of Management and Public Admin (GIMPA)'
    ]
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    currencyName: 'Kenyan Shilling (KSh)',
    states: [
      'Nairobi',
      'Mombasa',
      'Kiambu',
      'Kisumu',
      'Nakuru',
      'Uasin Gishu',
      'Machakos'
    ],
    popularSchools: [
      'University of Nairobi',
      'Strathmore University',
      'Kenyatta University',
      'Jomo Kenyatta University (JKUAT)',
      'United States International University Africa (USIU)'
    ]
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currencyCode: 'ZAR',
    currencySymbol: 'R',
    currencyName: 'South African Rand (R)',
    states: [
      'Gauteng',
      'Western Cape',
      'KwaZulu-Natal',
      'Eastern Cape',
      'Free State'
    ],
    popularSchools: [
      'University of Cape Town (UCT)',
      'University of the Witwatersrand (Wits)',
      'Stellenbosch University',
      'University of Pretoria',
      'University of Johannesburg'
    ]
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    currencyName: 'Indian Rupee (₹)',
    states: [
      'Delhi / NCR',
      'Maharashtra',
      'Karnataka',
      'Tamil Nadu',
      'Telangana',
      'Uttar Pradesh',
      'West Bengal'
    ],
    popularSchools: [
      'IIT Bombay',
      'IIT Delhi',
      'IIT Madras',
      'IISc Bangalore',
      'BITS Pilani',
      'Delhi University (DU)',
      'IIT Kharagpur'
    ]
  },
  {
    code: 'EU',
    name: 'Europe (Eurozone)',
    flag: '🇪🇺',
    currencyCode: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro (€)',
    states: [
      'Germany (Bavaria)',
      'Germany (Berlin)',
      'France (Île-de-France)',
      'Netherlands (North Holland)',
      'Ireland (Leinster)',
      'Spain (Madrid)'
    ],
    popularSchools: [
      'Technical University of Munich (TUM)',
      'Sorbonne University',
      'Delft University of Technology (TU Delft)',
      'Trinity College Dublin',
      'KU Leuven'
    ]
  }
];

export function getCountryByCode(code: string): CountryConfig {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code) || SUPPORTED_COUNTRIES[0];
}

export function getCountryByName(name: string): CountryConfig {
  return SUPPORTED_COUNTRIES.find((c) => c.name.toLowerCase() === name.toLowerCase()) || SUPPORTED_COUNTRIES[0];
}
