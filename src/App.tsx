import Background from "./components/ui/Background";
import Navbar from "./components/layout/navbar/Navbar";
import Hero from "./components/sections/Hero/Hero";
import Technologies from "./components/sections/Technologies/Technologies";
import Services from "./components/sections/Services/Services";
import About from "./components/sections/About/About";
import WhyChoose from "./components/sections/WhyChoose/WhyChoose";
import Process from "./components/sections/Process/Process";
import Projects from "./components/sections/Projects/Projects";
import Contact from "./components/sections/Contact/Contact";
import Footer from "./components/layout/Footer/Footer";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />

      <Navbar />

      <main>
        <Hero />
        <Technologies />
        <Services />
        <About />
        <WhyChoose />
        <Process />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;