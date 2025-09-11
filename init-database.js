const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Incident = require('./models/Incident');
const Neighborhood = require('./models/Neighborhood');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neighborhood-safety')
  .then(() => console.log('Connected to MongoDB for initialization'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const sampleNeighborhoods = [
  {
    name: "Downtown Safety Zone",
    description: "A vibrant downtown neighborhood focused on community safety and awareness.",
    boundaries: {
      center: { lat: 40.7128, lng: -74.0060 },
      radius: 2.5
    },
    city: "New York",
    state: "NY",
    zipCode: "10001",
    stats: {
      totalResidents: 1250,
      activeResidents: 890,
      totalIncidents: 45,
      incidentsThisMonth: 8,
      averageResponseTime: 12,
      safetyScore: 85
    },
    settings: {
      isPublic: true,
      requireApproval: false,
      allowAnonymousReports: true,
      autoVerifyThreshold: 3,
      emergencyContacts: [
        {
          name: "Local Police Department",
          phone: "911",
          email: "police@city.gov",
          role: "Emergency Response"
        }
      ]
    },
    features: {
      hasPoliceStation: true,
      hasFireStation: true,
      hasHospital: true,
      hasSchool: false,
      hasPark: true
    }
  },
  {
    name: "Riverside Community",
    description: "Peaceful riverside neighborhood with strong community bonds.",
    boundaries: {
      center: { lat: 40.7589, lng: -73.9851 },
      radius: 1.8
    },
    city: "New York",
    state: "NY",
    zipCode: "10036",
    stats: {
      totalResidents: 850,
      activeResidents: 620,
      totalIncidents: 23,
      incidentsThisMonth: 3,
      averageResponseTime: 8,
      safetyScore: 92
    },
    settings: {
      isPublic: true,
      requireApproval: true,
      allowAnonymousReports: false,
      autoVerifyThreshold: 2,
      emergencyContacts: [
        {
          name: "Community Watch",
          phone: "555-0123",
          email: "watch@riverside.com",
          role: "Community Safety"
        }
      ]
    },
    features: {
      hasPoliceStation: false,
      hasFireStation: true,
      hasHospital: false,
      hasSchool: true,
      hasPark: true
    }
  }
];

const sampleUsers = [
  {
    email: "john.doe@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    phone: "555-0101",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    role: "resident",
    isVerified: true,
    notificationPreferences: {
      email: {
        enabled: true,
        types: ["incidents", "alerts", "updates"]
      },
      push: {
        enabled: true,
        types: ["incidents", "alerts"]
      },
      sms: {
        enabled: false,
        types: ["emergency"]
      },
      radius: 5
    },
    profile: {
      bio: "Active community member focused on neighborhood safety.",
      emergencyContacts: [
        {
          name: "Jane Doe",
          phone: "555-0102",
          relationship: "Spouse"
        }
      ]
    },
    stats: {
      reportsSubmitted: 5,
      reportsVerified: 3,
      communityScore: 85
    }
  },
  {
    email: "sarah.smith@example.com",
    password: "password123",
    firstName: "Sarah",
    lastName: "Smith",
    phone: "555-0202",
    address: {
      street: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zipCode: "10036",
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    role: "moderator",
    isVerified: true,
    notificationPreferences: {
      email: {
        enabled: true,
        types: ["incidents", "alerts", "updates", "community"]
      },
      push: {
        enabled: true,
        types: ["incidents", "alerts", "community"]
      },
      sms: {
        enabled: true,
        types: ["emergency", "critical"]
      },
      radius: 10
    },
    profile: {
      bio: "Community moderator dedicated to maintaining neighborhood safety standards.",
      emergencyContacts: [
        {
          name: "Mike Smith",
          phone: "555-0203",
          relationship: "Partner"
        }
      ]
    },
    stats: {
      reportsSubmitted: 12,
      reportsVerified: 8,
      communityScore: 95
    }
  },
  {
    email: "admin@neighborhoodsafety.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    phone: "555-0000",
    address: {
      street: "789 Admin Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    role: "admin",
    isVerified: true,
    notificationPreferences: {
      email: {
        enabled: true,
        types: ["incidents", "alerts", "updates", "community"]
      },
      push: {
        enabled: true,
        types: ["incidents", "alerts", "community"]
      },
      sms: {
        enabled: true,
        types: ["emergency", "critical"]
      },
      radius: 15
    },
    profile: {
      bio: "System administrator for the Neighborhood Safety Alert System.",
      emergencyContacts: [
        {
          name: "Emergency Contact",
          phone: "911",
          relationship: "Emergency"
        }
      ]
    },
    stats: {
      reportsSubmitted: 0,
      reportsVerified: 25,
      communityScore: 100
    }
  }
];

const sampleIncidents = [
  {
    title: "Suspicious Activity Near Park",
    description: "Saw someone loitering around the playground area late at night. They seemed to be watching the equipment.",
    type: "suspicious-activity",
    severity: "medium",
    location: {
      address: {
        street: "Central Park West",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      },
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    isAnonymous: false,
    verification: {
      status: "pending",
      verifiedSource: null
    },
    status: "active",
    tags: ["park", "suspicious", "night-time"],
    community: {
      upvotes: [],
      downvotes: [],
      comments: []
    },
    alerts: {
      pushSent: true,
      emailSent: true,
      smsSent: false,
      sentAt: new Date()
    }
  },
  {
    title: "Broken Street Light",
    description: "Street light on the corner of Main and Oak is completely out. Makes the area very dark at night.",
    type: "broken-infrastructure",
    severity: "low",
    location: {
      address: {
        street: "Main St & Oak Ave",
        city: "New York",
        state: "NY",
        zipCode: "10036"
      },
      coordinates: {
        lat: 40.7589,
        lng: -73.9851
      }
    },
    isAnonymous: true,
    verification: {
      status: "verified",
      verifiedSource: "community-moderator",
      verifiedAt: new Date()
    },
    status: "active",
    tags: ["infrastructure", "lighting", "safety"],
    community: {
      upvotes: [],
      downvotes: [],
      comments: []
    },
    alerts: {
      pushSent: false,
      emailSent: false,
      smsSent: false
    }
  },
  {
    title: "Traffic Violation - Speeding",
    description: "Multiple cars speeding through the residential area during school hours. This is a safety concern for children.",
    type: "traffic-violation",
    severity: "high",
    location: {
      address: {
        street: "School Street",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      },
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    isAnonymous: false,
    verification: {
      status: "verified",
      verifiedSource: "multiple-reports",
      verifiedAt: new Date()
    },
    status: "active",
    tags: ["traffic", "speeding", "school-zone", "children"],
    community: {
      upvotes: [],
      downvotes: [],
      comments: []
    },
    alerts: {
      pushSent: true,
      emailSent: true,
      smsSent: true,
      sentAt: new Date()
    }
  }
];

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Clear existing data
    await User.deleteMany({});
    await Incident.deleteMany({});
    await Neighborhood.deleteMany({});
    console.log('Cleared existing data');

    // Create neighborhoods first
    const createdNeighborhoods = await Neighborhood.insertMany(sampleNeighborhoods);
    console.log(`Created ${createdNeighborhoods.length} neighborhoods`);

    // Create users and link them to neighborhoods
    const usersWithNeighborhoods = sampleUsers.map((user, index) => ({
      ...user,
      neighborhood: createdNeighborhoods[index % createdNeighborhoods.length]._id
    }));

    const createdUsers = await User.insertMany(usersWithNeighborhoods);
    console.log(`Created ${createdUsers.length} users`);

    // Create incidents and link them to users and neighborhoods
    const incidentsWithReferences = sampleIncidents.map((incident, index) => ({
      ...incident,
      reporter: createdUsers[index % createdUsers.length]._id,
      location: {
        ...incident.location,
        neighborhood: createdNeighborhoods[index % createdNeighborhoods.length]._id
      }
    }));

    const createdIncidents = await Incident.insertMany(incidentsWithReferences);
    console.log(`Created ${createdIncidents.length} incidents`);

    // Update neighborhood stats
    for (const neighborhood of createdNeighborhoods) {
      const userCount = await User.countDocuments({ neighborhood: neighborhood._id });
      const incidentCount = await Incident.countDocuments({ 'location.neighborhood': neighborhood._id });
      
      await Neighborhood.findByIdAndUpdate(neighborhood._id, {
        'stats.totalResidents': userCount,
        'stats.totalIncidents': incidentCount
      });
    }

    console.log('✅ Database initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Neighborhoods: ${createdNeighborhoods.length}`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Incidents: ${createdIncidents.length}`);
    console.log('\n🌐 You can now view these collections in MongoDB Atlas!');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the initialization
initializeDatabase(); 