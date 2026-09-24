import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | SketchShaper",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 text-white">
      <div className="text-center max-w-2xl mx-auto py-12">
        <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-4 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-3">
          Page Not Found
        </h2>
        <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist, was moved, or has
          been removed.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium shadow-lg shadow-blue-500/20"
          >
            Go to Homepage
          </Link>
          <Link
            href="/gallery"
            className="px-6 py-3 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors font-medium"
          >
            Browse Gallery
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact support or browse our 3D library.</p>
        </div>
      </div>
    </div>
  );
}
