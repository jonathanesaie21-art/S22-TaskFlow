import Link from "next/link";

// Logo TaskFlow : carré violet arrondi, trois barres blanches, texte Manrope.
export default function TaskflowBrand({ href = "/", className = "" }) {
  return (
    <Link href={href} className={`tf-logo ${className}`.trim()} aria-label="TaskFlow, accueil">
      <span className="tf-logo-mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff">
          <rect x="2.5" y="5" width="3" height="8" rx="1.5" />
          <rect x="7.5" y="2.5" width="3" height="13" rx="1.5" />
          <rect x="12.5" y="6.5" width="3" height="6" rx="1.5" />
        </svg>
      </span>
      <span className="tf-logo-text">TaskFlow</span>
    </Link>
  );
}
