import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full py-16 flex flex-col justify-center items-center text-center">
      <h1 className="font-serif text-3xl font-bold text-cowry-ink mb-2">
        Page not found
      </h1>
      <p className="text-sm text-cowry-muted mb-6 max-w-sm">
        The stop, route, or page you are looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center min-h-touch px-6 py-2.5 bg-cowry-primary text-white rounded-sm text-sm font-semibold hover:bg-cowry-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary transition-colors"
      >
        Return to Nearby
      </Link>
    </div>
  );
}
