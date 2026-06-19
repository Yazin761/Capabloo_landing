"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

type Product = {
  num: string;
  title: string;
  tag: string;
  image: string;
  imageAlt: string;
  detail: readonly string[];
  mediaClass: string;
};

type ProductInquiryProps = {
  products: readonly Product[];
};

const OWNER_EMAIL = "contact@capabloo.com";

export function ProductInquiry({ products }: ProductInquiryProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const closeModal = () => {
    setSelectedProduct(null);
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) return;

    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("Product", selectedProduct.title);
    formData.set("_subject", `Product enquiry: ${selectedProduct.title}`);
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Unable to send enquiry");

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="browser-grid browser-grid--products">
        {products.map(({ num, title, tag, image, imageAlt, detail, mediaClass }, i) => (
          <AnimatedSection
            key={num}
            className="product-card-wrap"
            direction="up"
            delay={i * 80}
          >
            <button
              type="button"
              className="product-card product-card--button"
              onClick={() =>
                setSelectedProduct({ num, title, tag, image, imageAlt, detail, mediaClass })
              }
            >
              <span className={`product-card__media ${mediaClass}`.trim()}>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="product-card__img"
                  priority={i === 0}
                />
              </span>
              <span className="product-card__body product-card__body--minimal">
                <span className="browser-card-num">PRODUCT — {num}</span>
                <span className="product-card__title">{title}</span>
                <span className="product-card__detail">
                  {detail.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
                <span className="card-tag">{tag}</span>
              </span>
            </button>
          </AnimatedSection>
        ))}
      </div>

      {selectedProduct && (
        <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <button
            type="button"
            className="product-modal__backdrop"
            aria-label="Close enquiry form"
            onClick={closeModal}
          />
          <div className="product-modal__panel">
            <button
              type="button"
              className="product-modal__close"
              aria-label="Close enquiry form"
              onClick={closeModal}
            >
              ×
            </button>

            <p className="product-modal__eyebrow">Product enquiry</p>
            <h3 id="product-modal-title">{selectedProduct.title}</h3>
            <p className="product-modal__copy">
              Share your details and the Capabloo team will contact you.
            </p>

            <form className="product-form" onSubmit={handleSubmit}>
              <input type="hidden" name="Product" value={selectedProduct.title} />

              <label>
                Name
                <input name="Name" type="text" autoComplete="name" required />
              </label>

              <label>
                Phone number
                <input name="Phone" type="tel" autoComplete="tel" required />
              </label>

              <label>
                Email
                <input name="Email" type="email" autoComplete="email" />
              </label>

              <label>
                City
                <input name="City" type="text" autoComplete="address-level2" />
              </label>

              <label>
                Requirement
                <textarea
                  name="Requirement"
                  rows={3}
                  placeholder="Tell us what support you are looking for."
                />
              </label>

              <button className="product-form__submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send enquiry"}
              </button>

              {status === "sent" && (
                <p className="product-form__status success">
                  Enquiry sent. We will contact you shortly.
                </p>
              )}
              {status === "error" && (
                <p className="product-form__status error">
                  Could not send right now. Please email {OWNER_EMAIL}.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
