// Shared Layout with Sidebar for AI-BOS Command Center
import './globals.css';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex bg-[#0f0f1a] font-sans text-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-h-screen">{children}</main>
      </body>
    </html>
  );
}
