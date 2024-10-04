import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddUser from "./Camponets/AddUser";
import AllBlog from "./Camponets/AllBlog";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AllBlog />} />
        <Route path="/adduser" element={<AddUser />} />
      </Routes>
    </div>
  );
}

export default App;
