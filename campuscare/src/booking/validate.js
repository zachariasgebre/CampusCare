import { isValidEthiopianPhone } from "../api/doctors";

export function validateBooking(form) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Please enter your full name";
  }

  if (!form.studentId.trim()) {
    errors.studentId = "Student ID is required";
  } else if (!/^[A-Za-z0-9-]{4,20}$/.test(form.studentId.trim())) {
    errors.studentId = "Use 4–20 letters, numbers, or hyphens";
  }

  if (!isValidEthiopianPhone(form.phone)) {
    errors.phone = "Use 09xxxxxxxx or +2519xxxxxxxx";
  }

  if (!form.slot) {
    errors.slot = "Choose an appointment slot";
  }

  if (!form.reason.trim()) {
    errors.reason = "Tell us briefly why you need to visit";
  } else if (form.reason.trim().length < 8) {
    errors.reason = "Please add a bit more detail (8+ characters)";
  }

  return errors;
}
