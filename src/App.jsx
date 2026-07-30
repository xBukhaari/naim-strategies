import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import Events from './pages/Events';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import WhatsApp from './components/WhatsApp';
import PageTransition from './components/PageTransition';
import Article from './pages/Article';

export default function App() {
  return (
    <BrowserRouter>
    <Nav />
      <PageTransition>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/events" element={<Events />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/insights/:slug" element={<Article />} />
        </Routes>
        </PageTransition>
        <Footer />
        <ScrollToTop />
      <WhatsApp />
    </BrowserRouter>
  );
}