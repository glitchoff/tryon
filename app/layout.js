import './globals.css';
import { ProfileProvider } from '@/components/ProfileContext';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <Navbar />
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}