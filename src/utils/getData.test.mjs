import test from "node:test";
import assert from "node:assert/strict";
import getData, { getOptional } from "./getData.js";

process.env.API_URL_INTERNAL = "http://backend.test";

// Runs getData with a fake fetch answer and collects what it logs as errors
async function run(response) {
  const realFetch = globalThis.fetch;
  const realError = console.error;
  const logged = [];
  globalThis.fetch = async () => response;
  console.error = (...args) => logged.push(args.join(" "));
  try {
    return { result: await getData("assets/1"), logged };
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
  }
}

test("404 returns null without logging an error", async () => {
  const { result, logged } = await run(new Response("{}", { status: 404 }));
  assert.equal(result, null);
  assert.equal(logged.length, 0);
});

test("500 throws", async () => {
  await assert.rejects(run(new Response("{}", { status: 500 })), /status: 500/);
});

test("200 returns the data", async () => {
  const { result, logged } = await run(
    new Response(JSON.stringify({ data: { id: 1 } }), { status: 200 }),
  );
  assert.deepEqual(result, { data: { id: 1 } });
  assert.equal(logged.length, 0);
});

test("getOptional turns a backend failure into null", async () => {
  const realFetch = globalThis.fetch;
  const realError = console.error;
  globalThis.fetch = async () => new Response("{}", { status: 500 });
  console.error = () => {};
  try {
    assert.equal(await getOptional("assets/1"), null);
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
  }
});
