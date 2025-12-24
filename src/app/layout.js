import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: 'IU ICT Silver Jubilee',
  description: 'Raffle Draw Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}