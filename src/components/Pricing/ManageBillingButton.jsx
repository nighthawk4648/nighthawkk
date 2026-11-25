"use client";

import React, { useState } from "react";
import { openBilling } from "@/utils/authApi";

// Sends the member to Polar's billing page (change card, cancel, invoices)
export default function ManageBillingButton({ className, children = "Manage billing" }) {
  const [state, setState] = useState({ busy: false, error: "" });

  const go = async () => {
    setState({ busy: true, error: "" });
    const res = await openBilling();
    if (res.ok && res.data?.url) return window.location.assign(res.data.url);
    setState({ busy: false, error: res.message || "Could not open billing. Please try again." });
  };

  return (
    <>
      <button type="button" onClick={go} disabled={state.busy} className={className}>
        {state.busy ? "Opening…" : children}
      </button>
      {state.error && (
        <p role="alert" className="px-3 pt-1 text-[11px] text-danger">
          {state.error}
        </p>
      )}
    </>
  );
}
