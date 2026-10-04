import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.RACE_API_URL || "http://localhost:5000";
const TEST_EMAIL = process.env.RACE_TEST_EMAIL;
const TEST_PASSWORD = process.env.RACE_TEST_PASSWORD;
const PROJECT_ID = process.env.RACE_PROJECT_ID;

async function run() {
  if (!TEST_EMAIL || !TEST_PASSWORD || !PROJECT_ID) {
    console.error(
      "Missing RACE_TEST_EMAIL, RACE_TEST_PASSWORD, or RACE_PROJECT_ID in .env"
    );
    process.exit(1);
  }

  // Log in once to get a real token for a real user — the race test
  // needs to simulate one genuine user firing many requests, not ten
  // different users (which wouldn't test the same-user duplicate-like
  // guard at all).
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  if (!loginRes.ok) {
    console.error("Login failed — check RACE_TEST_EMAIL/RACE_TEST_PASSWORD in .env");
    process.exit(1);
  }

  const { token } = await loginRes.json();

  console.log(`Firing 10 simultaneous like requests against project ${PROJECT_ID}...`);

  // Promise.all fires all 10 requests essentially at once, rather than
  // one after another — this is what actually creates the race
  // condition the atomic $inc + $addToSet update is meant to survive.
  const requests = Array.from({ length: 10 }, () =>
    fetch(`${API_URL}/api/projects/${PROJECT_ID}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  const responses = await Promise.all(requests);
  const statusCounts = {};

  for (const res of responses) {
    statusCounts[res.status] = (statusCounts[res.status] || 0) + 1;
  }

  console.log("Status code counts:", statusCounts);

  // Confirm the project's actual like count only went up by exactly 1,
  // not 10 — this is the real proof the race condition was prevented,
  // not just that the status codes looked right.
  const projectRes = await fetch(`${API_URL}/api/projects/${PROJECT_ID}`);
  const project = await projectRes.json();
  console.log(`Project's current like count: ${project.likes}`);

  const passed = statusCounts["200"] === 1 && statusCounts["409"] === 9;
  console.log(passed ? "\n✅ PASSED: exactly one 200, nine 409s." : "\n❌ FAILED — check counts above.");
}

run().catch((err) => {
  console.error("Race test failed to run:", err);
  process.exit(1);
});