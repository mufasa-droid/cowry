import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cowry-hairline bg-cowry-footer mt-auto">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between text-xs text-cowry-muted">
        <p>Unofficial prototype. Sample data. Times are estimates.</p>
        <p className="mt-2 sm:mt-0">
          <Link
            href="/about"
            className="text-cowry-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary rounded-sm p-1"
          >
            About this demo
          </Link>
        </p>
      </div>
    </footer>
  );
}

