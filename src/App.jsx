import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import SectionPage from "./pages/SectionPage";
import PartnerBoard from "./pages/partners/PartnerBoard";
import { sections } from "./pages/sections";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import TopJobs from "./components/home/TopJobs";
import Collaboration from "./components/home/Collaboration";
import BusinessMatchRoute from "./components/home/BusinessMatchRoute";
import NetworkPeople from "./components/home/NetworkPeople";
import ProductsServices from "./components/home/ProductsServices";

const sectionContent = {
  career: <TopJobs />,
  partners: <><PartnerBoard /><Collaboration /><BusinessMatchRoute /></>,
  people: <NetworkPeople />,
  market: <ProductsServices />,
};

function Site() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const section = sections.find((item) => item.path === pathname);
    document.title = section ? `${section.title} | BusinessNavigator` : "BusinessNavigator";

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {sections.map((section) => (
            <Route key={section.id} path={section.path} element={
              <SectionPage section={section}>{sectionContent[section.id]}</SectionPage>
            } />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}