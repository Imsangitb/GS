import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="pt-28 pb-16 min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Category Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We couldn't find the category you were looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link 
            href="/categories"
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Browse All Categories
          </Link>
          <Link 
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}