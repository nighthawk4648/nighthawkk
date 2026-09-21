"use client";

import { useState, useEffect } from "react";

// Standard email format validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("success"); // 'success' | 'error'

  // Submit button enabled only when all fields are populated and valid
  const isFormValid =
    formData.name.trim().length > 0 &&
    isValidEmail(formData.email) &&
    formData.message.trim().length > 0;

  // Auto-dismiss feedback message after 5 seconds with cleanup
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => setSubmitMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Dynamically clear validation error as user types
    if (errors[name]) {
      if (name === "email") {
        if (value.trim() && isValidEmail(value)) {
          setErrors((prev) => ({ ...prev, [name]: false }));
        }
      } else if (value.trim()) {
        setErrors((prev) => ({ ...prev, [name]: false }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        [name]: !value.trim() || !isValidEmail(value),
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: !value.trim() }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !isValidEmail(formData.email),
      message: !formData.message.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${backendUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to send your message.");
      }

      setSubmitMessageType("success");
      setSubmitMessage("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: false, email: false, message: false });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitMessageType("error");
      setSubmitMessage(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
      {/* Name Field */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5"
        >
          Your Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Alex Morgan"
          maxLength={100}
          aria-invalid={errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`w-full bg-neutral-900 border rounded-lg px-3.5 sm:px-4 py-3 text-base text-white placeholder-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
            errors.name
              ? "border-red-500/80 focus:ring-red-400"
              : "border-neutral-700/80 hover:border-neutral-600"
          }`}
        />
        {errors.name && (
          <p
            id="name-error"
            className="text-red-400 text-xs mt-1.5"
            role="alert"
          >
            Please enter your name.
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5"
        >
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
          maxLength={254}
          aria-invalid={errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full bg-neutral-900 border rounded-lg px-3.5 sm:px-4 py-3 text-base text-white placeholder-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
            errors.email
              ? "border-red-500/80 focus:ring-red-400"
              : "border-neutral-700/80 hover:border-neutral-600"
          }`}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-red-400 text-xs mt-1.5"
            role="alert"
          >
            {!formData.email
              ? "Please enter your email."
              : "Please enter a valid email address."}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5"
        >
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell us what 3D model, custom request, or question you have..."
          rows={4}
          maxLength={5000}
          aria-invalid={errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full bg-neutral-900 border rounded-lg px-3.5 sm:px-4 py-3 text-base text-white placeholder-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-y min-h-[110px] ${
            errors.message
              ? "border-red-500/80 focus:ring-red-400"
              : "border-neutral-700/80 hover:border-neutral-600"
          }`}
        />
        {errors.message && (
          <p
            id="message-error"
            className="text-red-400 text-xs mt-1.5"
            role="alert"
          >
            Please enter a message.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`w-full py-3 sm:py-3.5 px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-150 flex items-center justify-center gap-2 ${
          isFormValid && !isSubmitting
            ? "bg-white hover:bg-neutral-200 text-neutral-950 cursor-pointer shadow-lg active:scale-[0.99]"
            : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50"
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Sending...</span>
          </>
        ) : (
          <span>Send Message</span>
        )}
      </button>

      {/* Status Feedback Toast */}
      {submitMessage && (
        <div
          role="alert"
          className={`text-xs sm:text-sm p-3 rounded-lg border text-center transition-all ${
            submitMessageType === "success"
              ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-300"
              : "bg-red-950/40 border-red-700/50 text-red-300"
          }`}
        >
          {submitMessage}
        </div>
      )}
    </form>
  );
};

export default ContactForm;
