import test from "node:test";
import assert from "node:assert/strict";
import { adBlockReason, adBoxState, isPlainSiteLink, rememberWall, sawWall, shouldShowWall } from "./adBlock.js";

const blockedVisitor = { enabled: true, adsOn: true, loading: false, user: null, pathname: "/", userAgent: "Mozilla/5.0 Chrome/130", blocked: true };

test("a blocked ad script or uBlock's fake one counts as blocking", () => {
  assert.equal(adBlockReason({ scriptLoaded: false, googleReady: false }), "network");
  assert.equal(adBlockReason({ scriptLoaded: true, googleReady: false }), "fake");
  assert.equal(adBlockReason({ scriptLoaded: true, googleReady: true }), null);
});

test("a visitor who can't reach this site either is offline, not blocking", () => {
  assert.equal(adBlockReason({ scriptLoaded: false, googleReady: false, siteReachable: false }), null);
  assert.equal(adBlockReason({ scriptLoaded: false, googleReady: false, siteReachable: true }), "network");
});

// Frame addresses and marks as seen in Firefox tests: real Google vs uBlock's stand-in
const GOOGLE_FRAME = "https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-5557791257949251";

test("a box Google answered counts as working, filled or not", () => {
  assert.equal(adBoxState({ adStatus: "filled", frameSrc: GOOGLE_FRAME }), null);
  assert.equal(adBoxState({ adStatus: "unfilled", frameSrc: GOOGLE_FRAME }), null);
});

test("a box marked filled whose frame has no web address is uBlock's stand-in", () => {
  assert.equal(adBoxState({ adStatus: "filled", frameSrc: null }), "fake");
  assert.equal(adBoxState({ adStatus: "filled", frameSrc: "about:blank" }), "fake");
});

test("a box Google started but never answered is waiting", () => {
  assert.equal(adBoxState({ adStatus: null, frameSrc: GOOGLE_FRAME }), "waiting");
  assert.equal(adBoxState({ adStatus: "loading", frameSrc: GOOGLE_FRAME }), "waiting");
});

test("a box Google has not started (not yet scrolled into view) is left alone", () => {
  assert.equal(adBoxState({ adStatus: null, frameSrc: undefined }), null);
  assert.equal(adBoxState({ adStatus: "loading", frameSrc: null }), null);
});

test("a signed-out visitor who blocks ads gets the wall", () => {
  assert.equal(shouldShowWall(blockedVisitor), true);
});

test("no wall when ads are not blocked", () => {
  assert.equal(shouldShowWall({ ...blockedVisitor, blocked: false }), false);
});

test("PRO members never get the wall; free and paused members do", () => {
  assert.equal(shouldShowWall({ ...blockedVisitor, user: { isPro: true } }), false);
  assert.equal(shouldShowWall({ ...blockedVisitor, user: { isPro: false } }), true);
  assert.equal(shouldShowWall({ ...blockedVisitor, user: { isPro: false, proSource: "blocked" } }), true);
});

test("no wall while the server has not said who is signed in", () => {
  assert.equal(shouldShowWall({ ...blockedVisitor, loading: true }), false);
});

test("sign-in pages and their sub-pages stay open", () => {
  for (const pathname of ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/extension/connect", "/reset-password/abc"]) {
    assert.equal(shouldShowWall({ ...blockedVisitor, pathname }), false, pathname);
  }
  assert.equal(shouldShowWall({ ...blockedVisitor, pathname: "/extension" }), true);
  assert.equal(shouldShowWall({ ...blockedVisitor, pathname: "/login-help" }), true);
});

test("crawlers never get the wall", () => {
  assert.equal(shouldShowWall({ ...blockedVisitor, userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1)" }), false);
  assert.equal(shouldShowWall({ ...blockedVisitor, userAgent: "Mediapartners-Google" }), false);
});

test("the kill switch and ads-off builds turn the wall off", () => {
  assert.equal(shouldShowWall({ ...blockedVisitor, enabled: false }), false);
  assert.equal(shouldShowWall({ ...blockedVisitor, adsOn: false }), false);
});

// Same in-memory storage stand-in as authNote.test.mjs
const memory = () => {
  const items = new Map();
  return { getItem: (k) => items.get(k) ?? null, setItem: (k, v) => items.set(k, v) };
};
const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };

test("the browser remembers a visitor who has seen the wall; blocked storage never throws", () => {
  const storage = memory();
  assert.equal(sawWall(storage), false);
  rememberWall(storage);
  assert.equal(sawWall(storage), true);
  assert.doesNotThrow(() => rememberWall(blocked));
  assert.equal(sawWall(blocked), false);
});

const PAGE = "https://www.sketchshaper.com/blog";
const click = (over) => ({ button: 0, modified: false, target: "", download: false, href: "/sketchup-3d-models-3", pageUrl: PAGE, ...over });

test("a plain click on a link to another page of the site becomes a real page load", () => {
  assert.equal(isPlainSiteLink(click()), true);
  assert.equal(isPlainSiteLink(click({ href: "https://www.sketchshaper.com/blog/some-post" })), true);
  assert.equal(isPlainSiteLink(click({ href: "/blog/some-post#comments" })), true);
  assert.equal(isPlainSiteLink(click({ target: "_self" })), true);
});

test("new tabs, other buttons and modifier keys are left to the browser", () => {
  assert.equal(isPlainSiteLink(click({ target: "_blank" })), false);
  assert.equal(isPlainSiteLink(click({ button: 1 })), false);
  assert.equal(isPlainSiteLink(click({ modified: true })), false);
});

test("downloads, other sites, mail links and jumps within the page are left alone", () => {
  assert.equal(isPlainSiteLink(click({ download: true, href: "https://api.sketchshaper.com/api/assets/1/download" })), false);
  assert.equal(isPlainSiteLink(click({ href: "https://www.patreon.com/sketchshaper/join" })), false);
  assert.equal(isPlainSiteLink(click({ href: "mailto:hello@example.com" })), false);
  assert.equal(isPlainSiteLink(click({ href: "#top" })), false);
  assert.equal(isPlainSiteLink(click({ href: "/blog#top" })), false);
  assert.equal(isPlainSiteLink(click({ href: "" })), false);
});

test("links to the sign-in pages keep opening the sign-in popup", () => {
  assert.equal(isPlainSiteLink(click({ href: "/login" })), false);
  assert.equal(isPlainSiteLink(click({ href: "/extension/connect?code=1" })), false);
  assert.equal(isPlainSiteLink(click({ href: "/extension" })), true);
});
