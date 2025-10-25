module.exports = {
  URLS: {
    BASE: "https://in.bookmyshow.com",
    LOGIN: "https://in.bookmyshow.com/explore/signin",
    HYDERABAD: "https://in.bookmyshow.com/explore/home/hyderabad",
    MOVIES: "https://in.bookmyshow.com/explore/movies-hyderabad"
  },
  
  SELECTORS: {
    // Login page
    EMAIL_INPUT: 'input[type="email"]',
    CONTINUE_BUTTON: 'button[type="submit"]',
    PASSWORD_INPUT: 'input[type="password"]',
    
    // Movie search
    SEARCH_BAR: '.search-input',
    MOVIE_CARD: '.movie-card',
    
    // Theater selection
    THEATER_LIST: '.venue-list',
    SHOW_TIME_BUTTON: '.showtime-pill',
    SCREEN_TYPE: '.screen-type-label',
    
    // Seat selection
    SEAT_LAYOUT: '.seat-layout-container',
    AVAILABLE_SEAT: '.seat.available',
    SELECTED_SEAT: '.seat.selected',
    PROCEED_BUTTON: '.proceed-to-pay'
  },
  
  DELAYS: {
    PAGE_LOAD: 3000,        // Wait 3s after page load
    BETWEEN_ACTIONS: 1500,  // 1.5s between clicks
    POLL_INTERVAL: 45000    // Check every 45 seconds
  },
  
  SEAT_MAP: {
    ROWS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
    SECTIONS: {
      LEFT: { start: 1, end: 5 },
      MIDDLE: { start: 6, end: 15 },
      RIGHT: { start: 16, end: 20 }
    }
  }
};
