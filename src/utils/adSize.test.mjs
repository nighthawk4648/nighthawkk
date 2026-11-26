import test from "node:test";
import assert from "node:assert/strict";
import { insSizeProps } from "./adSize.js";

test("a fixed size gives exact pixels and leaves out the responsive attributes", () => {
  const props = insSizeProps({ format: "auto", fullWidthResponsive: true, fixedSize: { width: 300, height: 250 } });

  assert.deepEqual(props.style, { display: "inline-block", width: "300px", height: "250px" });
  assert.ok(!("data-ad-format" in props));
  assert.ok(!("data-full-width-responsive" in props));
});

test("without a fixed size the ad stays responsive", () => {
  assert.deepEqual(insSizeProps({ format: "auto", fullWidthResponsive: true }), {
    style: { display: "block", width: "100%", minWidth: undefined },
    "data-ad-format": "auto",
    "data-full-width-responsive": "true",
  });
  const fluid = insSizeProps({ format: "fluid", fullWidthResponsive: false });
  assert.equal(fluid.style.minWidth, "250px");
  assert.equal(fluid["data-full-width-responsive"], "false");
});
