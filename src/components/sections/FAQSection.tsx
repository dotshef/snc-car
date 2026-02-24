'use client';

import { useState, useRef, useEffect } from 'react';
import FadeInUp from '@/components/animation/FadeInUp';
import {faqs} from "@/data/faqs";

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[number]; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-5 text-left rounded-lg transition-colors duration-300 ${
          isOpen
            ? 'bg-accent text-white'
            : 'bg-primary text-white hover:bg-primary-light'
        }`}
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-white/70' : 'text-secondary-light'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef} className="px-5 py-4">
          <p className="text-secondary-light leading-relaxed whitespace-pre-line">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-primary-dark">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-8 text-center">
          자주 묻는 질문
        </h2>

        <FadeInUp delay={150}>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggleFAQ(faq.id)}
              />
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
