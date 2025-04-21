import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 px-4 pt-16 pb-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">StyleAI</h3>
            <p className="text-gray-400 mb-4">
              AI-powered fashion recommendations and virtual try-on for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a8.94 8.94 0 01-2.54.7 4.48 4.48 0 001.96-2.48 8.94 8.94 0 01-2.83 1.08 4.48 4.48 0 00-7.64 4.08A12.72 12.72 0 013 4.9a4.48 4.48 0 001.39 5.98A4.42 4.42 0 012.8 10v.05a4.48 4.48 0 003.6 4.39 4.52 4.52 0 01-2.02.08 4.48 4.48 0 004.19 3.12A9 9 0 012 19.54a12.72 12.72 0 006.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.18 9.18 0 0024 4.59a8.94 8.94 0 01-2.46.68z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.07 8.27 8.93.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.36.73-4.07-1.62-4.07-1.62-.54-1.37-1.33-1.74-1.33-1.74-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.68-.3-5.49-1.34-5.49-5.96 0-1.32.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.16 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.64.24 2.86.12 3.16.77.84 1.23 1.91 1.23 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58C18.36 20.07 22 16.41 22 12c0-5.5-4.46-9.96-9.96-9.96z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M21.54 7.2c-.13-.5-.52-.89-1.02-1.02C18.88 5.8 12 5.8 12 5.8s-6.88 0-8.52.38c-.5.13-.89.52-1.02 1.02C2 8.88 2 12 2 12s0 3.12.38 4.8c.13.5.52.89 1.02 1.02C5.12 18.2 12 18.2 12 18.2s6.88 0 8.52-.38c.5-.13.89-.52 1.02-1.02C22 15.12 22 12 22 12s0-3.12-.46-4.8zM10 15.5V8.5l6 3.5-6 3.5z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Features</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Pricing</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">API</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Integrations</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Guides</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Support</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Blog</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Terms</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p> 2025 StyleAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
