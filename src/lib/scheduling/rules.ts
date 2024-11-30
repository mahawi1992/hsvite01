export const SHIFT_TYPES = {
  DAY: 'Day Shift',
  EVENING: 'Evening Shift',
  NIGHT: 'Night Shift',
  ON_CALL: 'On Call',
  FLOAT: 'Float',
  RECOVERY: 'Recovery',
} as const;

export const SCHEDULING_RULES = {
  // Maximum consecutive hours by role
  MAX_CONSECUTIVE_HOURS: {
    MD: 24,
    DO: 24,
    PA: 16,
    NP: 16,
    RN: 16,
    LPN: 12,
    CNA: 12,
    PT: 12,
    OT: 12,
    RT: 12,
    PCT: 12,
    MA: 12,
  },

  // Minimum rest hours between shifts
  MIN_REST_HOURS: {
    MD: 10,
    DO: 10,
    PA: 8,
    NP: 8,
    RN: 8,
    LPN: 8,
    CNA: 8,
    PT: 8,
    OT: 8,
    RT: 8,
    PCT: 8,
    MA: 8,
  },

  // Maximum shifts per week
  MAX_SHIFTS_PER_WEEK: {
    FULL_TIME: 5,
    PART_TIME: 3,
    PRN: 2,
  },

  // Required staff ratios by department
  STAFF_RATIOS: {
    ICU: {
      RN: 2,
      MD: 1,
      PCT: 1,
    },
    EMERGENCY: {
      RN: 4,
      MD: 2,
      PA: 1,
      PCT: 2,
    },
    MEDICAL_SURGICAL: {
      RN: 6,
      LPN: 2,
      CNA: 3,
    },
  },

  // Shift overlap requirements (in minutes)
  SHIFT_OVERLAP: {
    NURSING: 30,
    MEDICAL: 45,
    SUPPORT: 15,
  },

  // Points system
  POINTS: {
    NO_SHOW: 3,
    LATE: 1,
    EARLY_LEAVE: 1,
    SICK_CALL: 0.5,
    APPROVED_ABSENCE: 0,
    HOLIDAY_BONUS: -1,
  },

  // Recovery shift rules
  RECOVERY: {
    POINTS_THRESHOLD: 5,
    RECOVERY_SHIFT_VALUE: -2,
    MAX_RECOVERY_PER_MONTH: 2,
  },

  // Swap rules
  SWAP: {
    MIN_NOTICE_HOURS: 24,
    MAX_SWAPS_PER_MONTH: 4,
    AUTO_APPROVE_WINDOW_HOURS: 72,
  },
} as const;
