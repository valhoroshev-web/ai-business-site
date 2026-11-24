// Smoke-test the real Next.js route with synthetic contact details only.
// Runs after `next build` in GitHub Actions; never needs production secrets.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 43819;
const origin = "http://127.0.0.1:" + port;
const expected = {
  telegram: "https://t.me/example_user",
  email: "mailto:demo@example.com?subject=" + encodeURIComponent("Запрос с сайта AI PROFI"),
  yandex: "https://yandex.ru/chat/p/00000000-0000-4000-8000-000000000001?utm_source=invite",
};
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"], {
  env: {
    ...process.env,
    CONTACT_TELEGRAM_USERNAME: "example_user",
    CONTACT_EMAIL: "demo@example.com",
    CONTACT_YANDEX_URL: expected.yandex,
    CONTACT_CAPTCHA_SECRET: "smoke-test-only-32-chars-do-not-use-production",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
for (const stream of [child.stdout, child.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    serverOutput += chunk;
    if (serverOutput.length > 4000) serverOutput = serverOutput.slice(-4000);
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const post = (payload, headers = {}) =>
  fetch(origin + "/api/contact-reveal", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, ...headers },
    body: JSON.stringify(payload),
  });

try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error("Next.js exited before smoke test");
    try {
      const response = await fetch(origin + "/api/contact-reveal?channel=telegram");
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // Startup in progress.
    }
    await wait(250);
  }
  assert(ready, "Next.js did not start");

  for (const channel of ["telegram", "email", "yandex"]) {
    const challengeResponse = await fetch(origin + "/api/contact-reveal?channel=" + channel, { cache: "no-store" });
    assert.equal(challengeResponse.status, 200, "Challenge should be available: " + channel);
    assert.match(challengeResponse.headers.get("cache-control") || "", /no-store/);

    const challengeText = await challengeResponse.text();
    for (const privateValue of ["example_user", "demo@example.com", expected.yandex]) {
      assert(!challengeText.includes(privateValue), "Contact leaked into CAPTCHA GET response");
    }

    const { question, token } = JSON.parse(challengeText);
    const match = /^Сколько будет (\d+) \+ (\d+)\?$/.exec(question);
    assert(match, "Unexpected CAPTCHA question");
    assert.match(token, /^[a-f0-9]{32}\.[0-9]{13}\.[a-f0-9]{64}$/);

    const wrong = await post({ channel, answer: "0", token });
    assert.equal(wrong.status, 400, "Wrong answer must not reveal contact");
    const wrongBody = await wrong.text();
    assert(!wrongBody.includes(expected[channel]), "Wrong answer leaked contact");

    const answer = String(Number(match[1]) + Number(match[2]));
    const verified = await post({ channel, answer, token });
    assert.equal(verified.status, 200, "Correct answer rejected: " + channel);
    const result = await verified.json();
    assert.equal(result.url, expected[channel], "Unexpected destination: " + channel);

    console.log("PASS: " + channel + " CAPTCHA and gated destination");
  }

  const invalid = await fetch(origin + "/api/contact-reveal?channel=invalid");
  assert.equal(invalid.status, 400, "Unknown channel should be rejected");

  const crossOrigin = await post({ channel: "email", answer: "1", token: "not-a-token" }, { Origin: "https://malicious.example" });
  assert.equal(crossOrigin.status, 403, "Cross-origin request must be rejected");

  console.log("PASS: malformed channel and cross-origin requests");
} catch (error) {
  console.error("Contact route smoke test failed:", error.message);
  if (child.exitCode !== null) console.error(serverOutput.slice(-800));
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
}
