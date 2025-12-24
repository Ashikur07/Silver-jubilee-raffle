import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar"; // ইম্পোর্ট করো
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
          <Navbar /> {/* এখানে বসালাম */}
          <div className="pt-16"> {/* Navbar-এর হাইটের সমান প্যাডিং */}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}