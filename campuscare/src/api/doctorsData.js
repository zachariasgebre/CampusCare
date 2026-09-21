export const mockDoctors = [
  {
    id: "doc-1",
    name: "Dr. Aster Lemma",
    department: "General Medicine",
    availability: ["09:00 AM", "11:00 AM", "02:00 PM"],
    bio: "General Practitioner with 8+ years experience in student healthcare."
  },
  {
    id: "doc-2",
    name: "Dr. Samuel Tadesse",
    department: "Dermatology",
    availability: ["10:00 AM", "01:30 PM", "04:00 PM"],
    bio: "Specialist in skin care and allergy management."
  },
  {
    id: "doc-3",
    name: "Dr. Hana Girma",
    department: "Psychiatry",
    availability: ["08:30 AM", "11:30 AM", "03:00 PM"],
    bio: "Focuses on mental health support and counseling for students."
  },
  {
    id: "doc-4",
    name: "Dr. Yared Assefa",
    department: "General Medicine",
    availability: ["01:00 PM", "02:30 PM", "04:30 PM"],
    bio: "Primary caregiver specialized in acute seasonal illnesses."
  }
];

export const fetchDoctors = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful fetch
      resolve(mockDoctors);
    }, 600);
  });
};