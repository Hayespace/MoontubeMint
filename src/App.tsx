import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NFT from "./pages/NFT";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
         {/* <Sidebar /> */}
        <main>
          <Routes>
            <Route path="/" element={<NFT />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
