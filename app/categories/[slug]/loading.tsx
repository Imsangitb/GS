export default function Loading() {
    return (
      <div className="pt-24 pb-16">
        {/* Skeleton for banner */}
        <div className="relative h-[300px] md:h-[400px] mb-12 bg-gray-200 animate-pulse"></div>
        
        {/* Skeleton for filters */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Skeleton for products */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow border border-gray-100">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }