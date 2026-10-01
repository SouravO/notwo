"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#EFEDDE] px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36 lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/4 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(253,73,42,0.08)_0%,transparent_68%)] blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="max-w-xl">
          <div className="mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#16336F]/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FD492A]" />
            <span>Contact · No Two</span>
          </div>
          <h2 id="contact-title" className="max-w-lg font-serif text-4xl font-medium leading-[1.08] tracking-[-0.035em] text-[#1C1C1A] sm:text-5xl lg:text-6xl">
            A better routine begins with a conversation.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-[#1C1C1A]/70 sm:text-lg sm:leading-8">
            Questions about your results, ingredients, or a partnership? We’re here to help, and usually reply within one business day.
          </p>

          <div className="mt-10 max-w-md border-t border-[#1C1C1A]/15">
            <a href="mailto:hello@notwo.co" className="group flex items-center justify-between gap-4 border-b border-[#1C1C1A]/15 py-5 text-[#1C1C1A] transition-colors hover:text-[#16336F]">
              <span>
                <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-[#1C1C1A]/45">Email</span>
                <span className="text-sm sm:text-base">hello@notwo.co</span>
              </span>
              <span aria-hidden="true" className="text-lg text-[#16336F] transition-transform group-hover:translate-x-1">↗</span>
            </a>
            <a href="tel:+14155550142" className="group flex items-center justify-between gap-4 border-b border-[#1C1C1A]/15 py-5 text-[#1C1C1A] transition-colors hover:text-[#16336F]">
              <span>
                <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-[#1C1C1A]/45">Call</span>
                <span className="text-sm sm:text-base">+1 (415) 555-0142</span>
              </span>
              <span aria-hidden="true" className="text-lg text-[#16336F] transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[1.75rem] border border-[#1C1C1A]/10 bg-[#1C1C1A] p-7 text-[#EFEDDE] shadow-[0_32px_90px_-32px_rgba(0,0,0,0.35)] sm:p-10 lg:p-12"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#16336F]" />
          <div className="mb-8 flex items-start justify-between gap-4 border-b border-[#EFEDDE]/15 pb-6 sm:mb-10">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#EFEDDE]/50">Start a conversation</p>
              <h3 className="font-serif text-2xl font-medium tracking-tight text-[#EFEDDE] sm:text-3xl">Send us a note.</h3>
            </div>
            <span className="rounded-full border border-[#EFEDDE]/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-[#EFEDDE]/60">01 / 01</span>
          </div>
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
            className="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#16336F] py-4 text-sm font-semibold text-[#EFEDDE] transition-transform duration-300 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16336F] disabled:opacity-70"
          >
            <span className="relative z-10">
              {status === "sending" ? "Sending" : status === "sent" ? "Message sent" : "Send message"}
            </span>
            {status === "idle" && <span aria-hidden="true" className="relative z-10 transition-transform group-hover:translate-x-1">→</span>}
            <span className="absolute inset-0 -translate-x-full bg-[#FD492A]/20 transition-transform duration-500 group-hover:translate-x-0" />
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
      "peer w-full border-b border-[#EFEDDE]/25 bg-transparent pb-2 pt-6 text-[#EFEDDE] outline-none transition-colors focus:border-[#B0BEE1]",
  };

  return (
    <div className="relative">
      {type === "textarea" ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 transition-all duration-200 ${
          active ? "top-0 text-xs text-[#B0BEE1]" : "top-6 text-sm text-[#EFEDDE]/45"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
