import Navbar from "./Navbar";

function PageLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container page-shell">{children}</main>
    </div>
  );
}

export default PageLayout;
