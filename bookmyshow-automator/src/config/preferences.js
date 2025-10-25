module.exports = {
  city: "Hyderabad",
  movieName: "Bahubali Epic",
  date: "24",  // Just the date number
  
  theaters: [
    { name: "Prasads Multiplex", priority: 1 },
    { name: "AMB Cinemas", priority: 2 },
    { name: "ART Cinemas", priority: 3 }
  ],
  
  screenTypes: [
    { type: "IMAX", priority: 1 },
    { type: "PCX", priority: 2 },
    { type: "Epiq", priority: 3 }
  ],
  
  timeSlots: [
    { start: "17:00", end: "22:00", priority: 1 },  // 5 PM - 10 PM
    { start: "11:00", end: "16:00", priority: 2 }   // 11 AM - 4 PM
  ],
  
  seatPreferences: {
    numberOfTickets: 4,
    minRowsFromScreen: 4,  // At least 4 rows from screen
    preferredRows: ["H", "I", "J", "K"],  // Specific rows
    sectionPreference: "middle",  // left, middle, right
    consecutiveSeats: true  // Keep group together
  }
};
