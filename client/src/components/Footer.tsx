export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Privacy Policy</span>
              <span className="text-sm">Privacy Policy</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Terms of Service</span>
              <span className="text-sm">Terms of Service</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Contact</span>
              <span className="text-sm">Contact</span>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">&copy; {new Date().getFullYear()} LemonLens.ai. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
