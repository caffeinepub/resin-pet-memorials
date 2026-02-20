import Header from './components/marketing/Header';
import Hero from './components/marketing/Sections/Hero';
import AboutResin from './components/marketing/Sections/AboutResin';
import ShapeShowcases from './components/marketing/Sections/ShapeShowcases';
import PetPhotoUpload from './components/marketing/Sections/PetPhotoUpload';
import ProcessSteps from './components/marketing/Sections/ProcessSteps';
import Footer from './components/marketing/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AboutResin />
        <ShapeShowcases />
        <PetPhotoUpload />
        <ProcessSteps />
      </main>
      <Footer />
    </div>
  );
}
