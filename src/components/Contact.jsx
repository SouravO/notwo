"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Brand tokens used here: Dark Azure (section bg), Paper White (the form panel
// itself — the palette's light surface, finally given a real, visible role),
// Mirage Blue (focus/underline accent on the light panel).

export default function Contact() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-[#0a1020] px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_#8fb6de_0%,_transparent_70%)] opacity-10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2
            id="contact-title"
            className="max-w-md text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl"
          >
            Talk to the team behind your formula.
          </h2>
          <p className="mt-6 max-w-sm text-white/50">
            Questions about your results, ingredients, or a partnership — we
            reply within one business day.
          </p>

          <div className="mt-12 space-y-3 text-sm text-white/55">
            <p>hello@notwo.co</p>
            <p>+1 (415) 555-0142</p>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="relative rounded-2xl bg-[#f5f4ef] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Name" name="name" type="text" />
            <Field label="Email" name="email" type="email" />
          </div>
          <div className="mt-6">
            <Field label="Message" name="message" type="textarea" />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="group relative mt-8 w-full overflow-hidden rounded-full bg-[#0a0a0c] py-4 text-sm font-semibold text-[#f5f4ef] transition-transform duration-300 hover:scale-[1.01] disabled:opacity-70"
          >
            <span className="relative z-10">
              {status === "sending" ? "Sending" : status === "sent" ? "Message sent" : "Send message"}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-[#8fb6de]/25 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, name, type }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const active = focused || value.length > 0;

  const shared = {
    id: name,
    name,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (e) => setValue(e.target.value),
    className:
      "peer w-full border-b border-[#0a0a0c]/15 bg-transparent pb-2 pt-6 text-[#0a0a0c] outline-none transition-colors focus:border-[#a9bfe3]",
  };

  return (
    <div className="relative">
      {type === "textarea" ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 transition-all duration-200 ${
          active ? "top-0 text-xs text-[#5b7bab]" : "top-6 text-sm text-[#0a0a0c]/40"
        }`}
      >
        {label}
      </label>
    </div>
  );
}