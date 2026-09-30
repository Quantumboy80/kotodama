// Academic Configuration System
// This file defines the hierarchical relationships between university, degree, year, and semester

export interface AcademicOption {
  value: string;
  label: string;
  prismaValue: string;
  sanityValue: string;
}

export interface UniversityConfig {
  info: AcademicOption;
  degrees: Record<string, DegreeConfig>;
}

export interface DegreeConfig {
  info: AcademicOption;
  years: Record<string, YearConfig>;
}

export interface YearConfig {
  info: AcademicOption;
  semesters: Record<string, AcademicOption>;
}

const standardFourYearSemesters: Record<string, AcademicOption> = {
  FIRST_SEMESTER: {
    value: "FIRST_SEMESTER",
    label: "1st Semester",
    prismaValue: "FIRST_SEMESTER",
    sanityValue: "1st-semester",
  },
  SECOND_SEMESTER: {
    value: "SECOND_SEMESTER",
    label: "2nd Semester",
    prismaValue: "SECOND_SEMESTER",
    sanityValue: "2nd-semester",
  },
};

const standardYears = (): Record<string, YearConfig> => ({
  FIRST_YEAR: {
    info: {
      value: "FIRST_YEAR",
      label: "1st Year",
      prismaValue: "FIRST_YEAR",
      sanityValue: "1st-year",
    },
    semesters: standardFourYearSemesters,
  },
  SECOND_YEAR: {
    info: {
      value: "SECOND_YEAR",
      label: "2nd Year",
      prismaValue: "SECOND_YEAR",
      sanityValue: "2nd-year",
    },
    semesters: {
      THIRD_SEMESTER: {
        value: "THIRD_SEMESTER",
        label: "3rd Semester",
        prismaValue: "THIRD_SEMESTER",
        sanityValue: "3rd-semester",
      },
      FOURTH_SEMESTER: {
        value: "FOURTH_SEMESTER",
        label: "4th Semester",
        prismaValue: "FOURTH_SEMESTER",
        sanityValue: "4th-semester",
      },
    },
  },
  THIRD_YEAR: {
    info: {
      value: "THIRD_YEAR",
      label: "3rd Year",
      prismaValue: "THIRD_YEAR",
      sanityValue: "3rd-year",
    },
    semesters: {
      FIFTH_SEMESTER: {
        value: "FIFTH_SEMESTER",
        label: "5th Semester",
        prismaValue: "FIFTH_SEMESTER",
        sanityValue: "5th-semester",
      },
      SIXTH_SEMESTER: {
        value: "SIXTH_SEMESTER",
        label: "6th Semester",
        prismaValue: "SIXTH_SEMESTER",
        sanityValue: "6th-semester",
      },
    },
  },
  FOURTH_YEAR: {
    info: {
      value: "FOURTH_YEAR",
      label: "4th Year",
      prismaValue: "FOURTH_YEAR",
      sanityValue: "4th-year",
    },
    semesters: {
      SEVENTH_SEMESTER: {
        value: "SEVENTH_SEMESTER",
        label: "7th Semester",
        prismaValue: "SEVENTH_SEMESTER",
        sanityValue: "7th-semester",
      },
      EIGHTH_SEMESTER: {
        value: "EIGHTH_SEMESTER",
        label: "8th Semester",
        prismaValue: "EIGHTH_SEMESTER",
        sanityValue: "8th-semester",
      },
    },
  },
});

export const getStandardDegrees = (): Record<string, DegreeConfig> => ({
  BTECH_CSE: {
    info: {
      value: "BTECH_CSE",
      label: "B.Tech CSE",
      prismaValue: "BTECH_CSE",
      sanityValue: "btech-cse",
    },
    years: standardYears(),
  },
  BTECH_IT: {
    info: {
      value: "BTECH_IT",
      label: "B.Tech IT",
      prismaValue: "BTECH_IT",
      sanityValue: "btech-it",
    },
    years: standardYears(),
  },
});

export const ACADEMIC_CONFIG: Record<string, UniversityConfig> = {
  MEDICAPS: {
    info: {
      value: "MEDICAPS",
      label: "Medicaps University, Indore",
      prismaValue: "MEDICAPS",
      sanityValue: "medicaps",
    },
    degrees: getStandardDegrees(),
  },
  IPS: {
    info: {
      value: "IPS",
      label: "IPS Academy, Indore",
      prismaValue: "IPS",
      sanityValue: "ips",
    },
    degrees: getStandardDegrees(),
  },
  IIT_BOMBAY: {
    info: {
      value: "IIT_BOMBAY",
      label: "IIT Bombay (Indian Institute of Technology)",
      prismaValue: "IIT_BOMBAY",
      sanityValue: "iit-bombay",
    },
    degrees: getStandardDegrees(),
  },
  IIT_DELHI: {
    info: {
      value: "IIT_DELHI",
      label: "IIT Delhi (Indian Institute of Technology)",
      prismaValue: "IIT_DELHI",
      sanityValue: "iit-delhi",
    },
    degrees: getStandardDegrees(),
  },
  IIT_MADRAS: {
    info: {
      value: "IIT_MADRAS",
      label: "IIT Madras (Indian Institute of Technology)",
      prismaValue: "IIT_MADRAS",
      sanityValue: "iit-madras",
    },
    degrees: getStandardDegrees(),
  },
  IIT_KHARAGPUR: {
    info: {
      value: "IIT_KHARAGPUR",
      label: "IIT Kharagpur (Indian Institute of Technology)",
      prismaValue: "IIT_KHARAGPUR",
      sanityValue: "iit-kharagpur",
    },
    degrees: getStandardDegrees(),
  },
  NIT_TRICHY: {
    info: {
      value: "NIT_TRICHY",
      label: "NIT Trichy (National Institute of Technology)",
      prismaValue: "NIT_TRICHY",
      sanityValue: "nit-trichy",
    },
    degrees: getStandardDegrees(),
  },
  NIT_SURATHKAL: {
    info: {
      value: "NIT_SURATHKAL",
      label: "NIT Surathkal (National Institute of Technology Karnataka)",
      prismaValue: "NIT_SURATHKAL",
      sanityValue: "nit-surathkal",
    },
    degrees: getStandardDegrees(),
  },
  BITS_PILANI: {
    info: {
      value: "BITS_PILANI",
      label: "BITS Pilani (Birla Institute of Technology and Science)",
      prismaValue: "BITS_PILANI",
      sanityValue: "bits-pilani",
    },
    degrees: getStandardDegrees(),
  },
  DELHI_UNIVERSITY: {
    info: {
      value: "DELHI_UNIVERSITY",
      label: "Delhi University (DU)",
      prismaValue: "DELHI_UNIVERSITY",
      sanityValue: "delhi-university",
    },
    degrees: getStandardDegrees(),
  },
  SPPU: {
    info: {
      value: "SPPU",
      label: "Savitribai Phule Pune University (SPPU)",
      prismaValue: "SPPU",
      sanityValue: "sppu",
    },
    degrees: getStandardDegrees(),
  },
  MUMBAI_UNIVERSITY: {
    info: {
      value: "MUMBAI_UNIVERSITY",
      label: "University of Mumbai",
      prismaValue: "MUMBAI_UNIVERSITY",
      sanityValue: "mumbai-university",
    },
    degrees: getStandardDegrees(),
  },
  VTU: {
    info: {
      value: "VTU",
      label: "Visvesvaraya Technological University (VTU Karnataka)",
      prismaValue: "VTU",
      sanityValue: "vtu",
    },
    degrees: getStandardDegrees(),
  },
  ANNA_UNIVERSITY: {
    info: {
      value: "ANNA_UNIVERSITY",
      label: "Anna University, Chennai",
      prismaValue: "ANNA_UNIVERSITY",
      sanityValue: "anna-university",
    },
    degrees: getStandardDegrees(),
  },
  AKTU: {
    info: {
      value: "AKTU",
      label: "Dr. A.P.J. Abdul Kalam Technical University (AKTU UP)",
      prismaValue: "AKTU",
      sanityValue: "aktu",
    },
    degrees: getStandardDegrees(),
  },
  RGPV: {
    info: {
      value: "RGPV",
      label: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV Bhopal)",
      prismaValue: "RGPV",
      sanityValue: "rgpv",
    },
    degrees: getStandardDegrees(),
  },
  JADAVPUR_UNIVERSITY: {
    info: {
      value: "JADAVPUR_UNIVERSITY",
      label: "Jadavpur University, Kolkata",
      prismaValue: "JADAVPUR_UNIVERSITY",
      sanityValue: "jadavpur-university",
    },
    degrees: getStandardDegrees(),
  },
  CALCUTTA_UNIVERSITY: {
    info: {
      value: "CALCUTTA_UNIVERSITY",
      label: "University of Calcutta",
      prismaValue: "CALCUTTA_UNIVERSITY",
      sanityValue: "calcutta-university",
    },
    degrees: getStandardDegrees(),
  },
  MAKAUT: {
    info: {
      value: "MAKAUT",
      label: "Maulana Abul Kalam Azad University of Technology (MAKAUT WB)",
      prismaValue: "MAKAUT",
      sanityValue: "makaut",
    },
    degrees: getStandardDegrees(),
  },
  SRM_UNIVERSITY: {
    info: {
      value: "SRM_UNIVERSITY",
      label: "SRM Institute of Science and Technology",
      prismaValue: "SRM_UNIVERSITY",
      sanityValue: "srm-university",
    },
    degrees: getStandardDegrees(),
  },
  VIT_VELLORE: {
    info: {
      value: "VIT_VELLORE",
      label: "Vellore Institute of Technology (VIT Vellore)",
      prismaValue: "VIT_VELLORE",
      sanityValue: "vit-vellore",
    },
    degrees: getStandardDegrees(),
  },
  MANIPAL_UNIVERSITY: {
    info: {
      value: "MANIPAL_UNIVERSITY",
      label: "Manipal Academy of Higher Education (MAHE)",
      prismaValue: "MANIPAL_UNIVERSITY",
      sanityValue: "manipal-university",
    },
    degrees: getStandardDegrees(),
  },
  AMITY_UNIVERSITY: {
    info: {
      value: "AMITY_UNIVERSITY",
      label: "Amity University",
      prismaValue: "AMITY_UNIVERSITY",
      sanityValue: "amity-university",
    },
    degrees: getStandardDegrees(),
  },
  THAPAR_UNIVERSITY: {
    info: {
      value: "THAPAR_UNIVERSITY",
      label: "Thapar Institute of Engineering and Technology, Patiala",
      prismaValue: "THAPAR_UNIVERSITY",
      sanityValue: "thapar-university",
    },
    degrees: getStandardDegrees(),
  },
  CHANDIGARH_UNIVERSITY: {
    info: {
      value: "CHANDIGARH_UNIVERSITY",
      label: "Chandigarh University (CU)",
      prismaValue: "CHANDIGARH_UNIVERSITY",
      sanityValue: "chandigarh-university",
    },
    degrees: getStandardDegrees(),
  },
};

// Helper Functions

/**
 * Get all available universities
 */
export function getUniversities(): AcademicOption[] {
  return Object.values(ACADEMIC_CONFIG).map((university) => university.info);
}

/**
 * Get available degrees for a specific university
 */
export function getDegreesByUniversity(
  universityValue: string,
): AcademicOption[] {
  const university = ACADEMIC_CONFIG[universityValue];
  if (university) {
    return Object.values(university.degrees).map((degree) => degree.info);
  }

  // Graceful fallback for dynamic / user-registered universities
  return Object.values(getStandardDegrees()).map((degree) => degree.info);
}

/**
 * Get available years for a specific university and degree
 */
export function getYearsByUniversityAndDegree(
  universityValue: string,
  degreeValue: string,
): AcademicOption[] {
  const university = ACADEMIC_CONFIG[universityValue];
  const degrees = university ? university.degrees : getStandardDegrees();
  const degree = degrees[degreeValue] || Object.values(degrees)[0];
  if (!degree) return [];

  return Object.values(degree.years).map((year) => year.info);
}

/**
 * Get available semesters for a specific university, degree, and year
 */
export function getSemestersByUniversityDegreeAndYear(
  universityValue: string,
  degreeValue: string,
  yearValue: string,
): AcademicOption[] {
  const university = ACADEMIC_CONFIG[universityValue];
  const degrees = university ? university.degrees : getStandardDegrees();
  const degree = degrees[degreeValue] || Object.values(degrees)[0];
  if (!degree) return [];

  const year = degree.years[yearValue] || Object.values(degree.years)[0];
  if (!year) return [];

  return Object.values(year.semesters);
}

/**
 * Get all options for filter dropdowns (includes "all" option)
 */
export function getFilterOptions() {
  return {
    universities: [
      { value: "all", label: "All Universities" },
      ...getUniversities().map((option) => ({
        value: option.sanityValue,
        label: option.label,
      })),
    ],
    degrees: [
      { value: "all", label: "All Degrees" },
      ...getAllDegrees().map((option) => ({
        value: option.sanityValue,
        label: option.label,
      })),
    ],
    years: [
      { value: "all", label: "All Years" },
      ...getAllYears().map((option) => ({
        value: option.sanityValue,
        label: option.label,
      })),
    ],
    semesters: [
      { value: "all", label: "All Semesters" },
      ...getAllSemesters().map((option) => ({
        value: option.sanityValue,
        label: option.label,
      })),
    ],
  };
}

/**
 * Get all unique degrees across all universities
 */
function getAllDegrees(): AcademicOption[] {
  const degrees = new Map<string, AcademicOption>();

  Object.values(ACADEMIC_CONFIG).forEach((university) => {
    Object.values(university.degrees).forEach((degree) => {
      degrees.set(degree.info.value, degree.info);
    });
  });

  return Array.from(degrees.values());
}

/**
 * Get all unique years across all universities and degrees
 */
function getAllYears(): AcademicOption[] {
  const years = new Map<string, AcademicOption>();

  Object.values(ACADEMIC_CONFIG).forEach((university) => {
    Object.values(university.degrees).forEach((degree) => {
      Object.values(degree.years).forEach((year) => {
        years.set(year.info.value, year.info);
      });
    });
  });

  return Array.from(years.values());
}

/**
 * Get all unique semesters across all universities, degrees, and years
 */
function getAllSemesters(): AcademicOption[] {
  const semesters = new Map<string, AcademicOption>();

  Object.values(ACADEMIC_CONFIG).forEach((university) => {
    Object.values(university.degrees).forEach((degree) => {
      Object.values(degree.years).forEach((year) => {
        Object.values(year.semesters).forEach((semester) => {
          semesters.set(semester.value, semester);
        });
      });
    });
  });

  return Array.from(semesters.values());
}

/**
 * Convert prisma values to sanity values
 */
export function prismaToSanityValue(
  type: "university" | "degree" | "year" | "semester",
  prismaValue: string,
): string | undefined {
  switch (type) {
    case "university":
      return Object.values(ACADEMIC_CONFIG).find(
        (university) => university.info.prismaValue === prismaValue,
      )?.info.sanityValue || prismaValue.toLowerCase();
    case "degree":
      return getAllDegrees().find(
        (degree) => degree.prismaValue === prismaValue,
      )?.sanityValue || prismaValue.toLowerCase().replace(/_/g, "-");
    case "year":
      return getAllYears().find((year) => year.prismaValue === prismaValue)
        ?.sanityValue || prismaValue;
    case "semester":
      return getAllSemesters().find(
        (semester) => semester.prismaValue === prismaValue,
      )?.sanityValue || prismaValue;
    default:
      return prismaValue;
  }
}

/**
 * Convert sanity values to prisma values
 */
export function sanityToPrismaValue(
  type: "university" | "degree" | "year" | "semester",
  sanityValue: string,
): string | undefined {
  switch (type) {
    case "university":
      return Object.values(ACADEMIC_CONFIG).find(
        (university) => university.info.sanityValue === sanityValue,
      )?.info.prismaValue || sanityValue.toUpperCase();
    case "degree":
      return getAllDegrees().find(
        (degree) => degree.sanityValue === sanityValue,
      )?.prismaValue || sanityValue.toUpperCase().replace(/-/g, "_");
    case "year":
      return getAllYears().find((year) => year.sanityValue === sanityValue)
        ?.prismaValue || sanityValue;
    case "semester":
      return getAllSemesters().find(
        (semester) => semester.sanityValue === sanityValue,
      )?.prismaValue || sanityValue;
    default:
      return sanityValue;
  }
}

/**
 * Get display name from sanity value
 */
export function getDisplayNameFromSanityValue(
  type: "university" | "degree" | "year" | "semester",
  sanityValue: string,
): string {
  switch (type) {
    case "university":
      return (
        Object.values(ACADEMIC_CONFIG).find(
          (university) => university.info.sanityValue === sanityValue,
        )?.info.label || sanityValue
      );
    case "degree":
      return (
        getAllDegrees().find((degree) => degree.sanityValue === sanityValue)
          ?.label || sanityValue
      );
    case "year":
      return (
        getAllYears().find((year) => year.sanityValue === sanityValue)?.label ||
        sanityValue
      );
    case "semester":
      return (
        getAllSemesters().find(
          (semester) => semester.sanityValue === sanityValue,
        )?.label || sanityValue
      );
    default:
      return sanityValue;
  }
}

export function getDisplayNameFromPrismaValue(
  type: "university" | "degree" | "year" | "semester",
  prismaValue: string,
): string {
  switch (type) {
    case "university":
      return (
        Object.values(ACADEMIC_CONFIG).find(
          (university) => university.info.prismaValue === prismaValue,
        )?.info.label || prismaValue
      );
    case "degree":
      return (
        getAllDegrees().find((degree) => degree.prismaValue === prismaValue)
          ?.label || prismaValue
      );
    case "year":
      return (
        getAllYears().find((year) => year.prismaValue === prismaValue)?.label ||
        prismaValue
      );
    case "semester":
      return (
        getAllSemesters().find(
          (semester) => semester.prismaValue === prismaValue,
        )?.label || prismaValue
      );
    default:
      return prismaValue;
  }
}

/**
 * Get default filter values (all options for each category)
 */
export function getDefaultFilterValues() {
  return {
    university: "all",
    degree: "all",
    year: "all",
    semester: "all",
  };
}

/**
 * Get type display name based on type value
 */
export const getTypeDisplayName = (type: string) => {
  switch (type) {
    case "NOTES":
      return "Notes";
    case "MST":
      return "MST";
    case "PYQ":
      return "PYQ";
    case "ONE-SHOT":
      return "One-Shot";
    case "VIDEO-MATERIAL":
      return "Video Material";
    case "HANDWRITTEN-NOTES":
      return "Handwritten Notes";
    default:
      return "Notes";
  }
};

/**
 * Convert user profile to sanity filter values
 */
export function userProfileToFilterValues(profile: {
  university?: string;
  degree?: string;
  year?: string;
  semester?: string;
}) {
  return {
    university: profile.university
      ? prismaToSanityValue("university", profile.university) || "all"
      : "all",
    degree: profile.degree
      ? prismaToSanityValue("degree", profile.degree) || "all"
      : "all",
    year: profile.year
      ? prismaToSanityValue("year", profile.year) || "all"
      : "all",
    semester: profile.semester
      ? prismaToSanityValue("semester", profile.semester) || "all"
      : "all",
  };
}

export const normalizedTierValues = () => {
  return {
    TIER_1: "TIER 1",
    TIER_2: "TIER 2",
    TIER_3: "TIER 3",
  };
};

export const getTierDisplayName = (tier: string): string => {
  switch (tier) {
    case "TIER_1":
      return "TIER 1";
    case "TIER_2":
      return "TIER 2";
    case "TIER_3":
      return "TIER 3";
    default:
      return "Unknown Tier";
  }
};

/**
 * Normalize subject casing to title case for consistent display
 * This function converts subjects to proper title case (first letter of each word capitalized)
 */
export function normalizeSubjectCasing(subject: string): string {
  if (!subject) return subject;

  const normalized = subject.toLowerCase();

  const words = normalized.split(/[\s\-_]+/);

  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
}
