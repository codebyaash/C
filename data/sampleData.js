/* ============================================
   SAMPLE EXPENSE DATA
   Test data for the Expense Calculator app
   ============================================ */

window.sampleExpenses = [
    // May 2025 - Current Month
    {
        id: 1000,
        description: 'Grocery Shopping',
        amount: 85.50,
        category: 'Food',
        date: '2025-05-15',
        spentBy: 'User 1',
        notes: 'Weekly groceries at Whole Foods',
        createdAt: '2025-05-15T10:30:00Z'
    },
    {
        id: 1001,
        description: 'Gas Station',
        amount: 55.00,
        category: 'Travel',
        date: '2025-05-14',
        spentBy: 'User 2',
        notes: 'Fuel for the car',
        createdAt: '2025-05-14T09:15:00Z'
    },
    {
        id: 1002,
        description: 'Netflix Subscription',
        amount: 15.99,
        category: 'Entertainment',
        date: '2025-05-10',
        spentBy: 'User 1',
        notes: 'Monthly subscription',
        createdAt: '2025-05-10T12:00:00Z'
    },
    {
        id: 1003,
        description: 'Internet Bill',
        amount: 79.99,
        category: 'Bills',
        date: '2025-05-01',
        spentBy: 'User 2',
        notes: 'Monthly internet service',
        createdAt: '2025-05-01T08:00:00Z'
    },
    {
        id: 1004,
        description: 'Restaurant Dinner',
        amount: 125.50,
        category: 'Food',
        date: '2025-05-13',
        spentBy: 'User 1',
        notes: 'Dinner with friends at Italian restaurant',
        createdAt: '2025-05-13T19:30:00Z'
    },
    {
        id: 1005,
        description: 'Doctor Appointment',
        amount: 150.00,
        category: 'Health',
        date: '2025-05-12',
        spentBy: 'User 2',
        notes: 'Annual checkup',
        createdAt: '2025-05-12T14:00:00Z'
    },
    {
        id: 1006,
        description: 'Shopping - Clothes',
        amount: 200.00,
        category: 'Shopping',
        date: '2025-05-11',
        spentBy: 'User 1',
        notes: 'New summer wardrobe',
        createdAt: '2025-05-11T15:45:00Z'
    },
    {
        id: 1007,
        description: 'Flight Ticket',
        amount: 350.00,
        category: 'Travel',
        date: '2025-05-09',
        spentBy: 'User 2',
        notes: 'Round trip to LA',
        createdAt: '2025-05-09T11:20:00Z'
    },
    {
        id: 1008,
        description: 'Online Course',
        amount: 99.99,
        category: 'Education',
        date: '2025-05-08',
        spentBy: 'User 1',
        notes: 'Web Development Bootcamp',
        createdAt: '2025-05-08T10:10:00Z'
    },
    {
        id: 1009,
        description: 'Coffee at Starbucks',
        amount: 6.50,
        category: 'Food',
        date: '2025-05-16',
        spentBy: 'User 2',
        notes: 'Morning latte',
        createdAt: '2025-05-16T08:30:00Z'
    },
    {
        id: 1010,
        description: 'Electric Bill',
        amount: 125.00,
        category: 'Bills',
        date: '2025-05-05',
        spentBy: 'User 1',
        notes: 'Monthly electricity',
        createdAt: '2025-05-05T09:00:00Z'
    },
    {
        id: 1011,
        description: 'Movie Tickets',
        amount: 35.00,
        category: 'Entertainment',
        date: '2025-05-07',
        spentBy: 'User 2',
        notes: '2 tickets for latest movie',
        createdAt: '2025-05-07T18:00:00Z'
    },
    // April 2025
    {
        id: 2000,
        description: 'Grocery Shopping',
        amount: 92.30,
        category: 'Food',
        date: '2025-04-28',
        spentBy: 'User 1',
        notes: 'Weekly groceries',
        createdAt: '2025-04-28T10:30:00Z'
    },
    {
        id: 2001,
        description: 'Flight to NYC',
        amount: 450.00,
        category: 'Travel',
        date: '2025-04-20',
        spentBy: 'User 2',
        notes: 'Business trip',
        createdAt: '2025-04-20T08:00:00Z'
    },
    {
        id: 2002,
        description: 'Hotel Stay',
        amount: 300.00,
        category: 'Travel',
        date: '2025-04-21',
        spentBy: 'User 2',
        notes: '3 nights in Manhattan',
        createdAt: '2025-04-21T16:00:00Z'
    },
    {
        id: 2003,
        description: 'Smartphone Case',
        amount: 45.00,
        category: 'Shopping',
        date: '2025-04-15',
        spentBy: 'User 1',
        notes: 'Protective case for new phone',
        createdAt: '2025-04-15T14:30:00Z'
    },
    {
        id: 2004,
        description: 'Gym Membership',
        amount: 60.00,
        category: 'Health',
        date: '2025-04-01',
        spentBy: 'User 1',
        notes: 'Monthly gym subscription',
        createdAt: '2025-04-01T09:00:00Z'
    },
    {
        id: 2005,
        description: 'Restaurant Lunch',
        amount: 35.50,
        category: 'Food',
        date: '2025-04-18',
        spentBy: 'User 2',
        notes: 'Lunch with colleague',
        createdAt: '2025-04-18T12:15:00Z'
    },
    {
        id: 2006,
        description: 'Book Purchase',
        amount: 28.99,
        category: 'Education',
        date: '2025-04-10',
        spentBy: 'User 1',
        notes: 'Programming book',
        createdAt: '2025-04-10T11:00:00Z'
    },
    {
        id: 2007,
        description: 'Concert Tickets',
        amount: 120.00,
        category: 'Entertainment',
        date: '2025-04-12',
        spentBy: 'User 2',
        notes: 'Live music event',
        createdAt: '2025-04-12T16:30:00Z'
    },
    // March 2025
    {
        id: 3000,
        description: 'Grocery Shopping',
        amount: 88.75,
        category: 'Food',
        date: '2025-03-25',
        spentBy: 'User 1',
        notes: 'Weekly groceries',
        createdAt: '2025-03-25T10:30:00Z'
    },
    {
        id: 3001,
        description: 'Car Maintenance',
        amount: 280.00,
        category: 'Travel',
        date: '2025-03-20',
        spentBy: 'User 2',
        notes: 'Oil change and inspection',
        createdAt: '2025-03-20T10:00:00Z'
    },
    {
        id: 3002,
        description: 'Water Bill',
        amount: 45.00,
        category: 'Bills',
        date: '2025-03-05',
        spentBy: 'User 1',
        notes: 'Monthly water bill',
        createdAt: '2025-03-05T09:00:00Z'
    },
    {
        id: 3003,
        description: 'Fitness Class',
        amount: 50.00,
        category: 'Health',
        date: '2025-03-15',
        spentBy: 'User 2',
        notes: 'Yoga classes (monthly)',
        createdAt: '2025-03-15T17:30:00Z'
    },
    {
        id: 3004,
        description: 'Video Game',
        amount: 59.99,
        category: 'Entertainment',
        date: '2025-03-08',
        spentBy: 'User 1',
        notes: 'Latest game release',
        createdAt: '2025-03-08T15:00:00Z'
    },
    {
        id: 3005,
        description: 'Pizza Night',
        amount: 28.50,
        category: 'Food',
        date: '2025-03-22',
        spentBy: 'User 2',
        notes: 'Delivery pizza',
        createdAt: '2025-03-22T19:00:00Z'
    },
    {
        id: 3006,
        description: 'Designer Shoes',
        amount: 180.00,
        category: 'Shopping',
        date: '2025-03-18',
        spentBy: 'User 1',
        notes: 'New running shoes',
        createdAt: '2025-03-18T14:20:00Z'
    },
    {
        id: 3007,
        description: 'Train Ticket',
        amount: 75.00,
        category: 'Travel',
        date: '2025-03-10',
        spentBy: 'User 2',
        notes: 'Travel to Boston',
        createdAt: '2025-03-10T08:30:00Z'
    },
];
