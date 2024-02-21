import "./styles/globals.css";

export const metadata = {
  title: "XKCD App",
  description: "See some xkcd comics, courtesy of xkcd.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
