import Providers from './Providers';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "LNA",
  description: "LNA the articles and news aggregation platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}