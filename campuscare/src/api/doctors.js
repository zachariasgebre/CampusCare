const DEPARTMENTS = [
  "All",
  "General Practice",
  "Mental Health",
  "Dermatology",
  "Orthopedics",
  "Women's Health",
];

const ETHIOPIAN_PHONE = /^(?:\+251|0)9\d{8}$/;

/** Simulated network delay so loading states are visible. */
const DELAY_MS = 700;

/**
 * Toggle to practice the error UI:
 * set `?fail=1` on /doctors or call fetchDoctors({ fail: true })
 */
export async function fetchDoctors(opts = {}) {
  const signal = opts instanceof AbortSignal ? opts : opts?.signal;
  const fail = opts?.fail || false;
  await wait(DELAY_MS, signal);

  if (fail) {
    throw new Error("Could not reach the campus clinic API. Try again.");
  }

  const res = await fetch("/doctors.json", { signal });

  if (!res.ok) {
    throw new Error(`Doctors request failed (${res.status})`);
  }

  return res.json();
}

export async function fetchDoctorById(id, { fail = false, signal } = {}) {
  const doctors = await fetchDoctors({ fail, signal });
  const doctor = doctors.find((d) => d.id === Number(id));
  return doctor ?? null;
}

export function getDepartments() {
  return DEPARTMENTS;
}

export function isValidEthiopianPhone(phone) {
  return ETHIOPIAN_PHONE.test(String(phone || "").trim());
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}
