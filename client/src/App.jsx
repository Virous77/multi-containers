import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import Calculator from "./components/Calculator";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <section>
          <div>
            <h1>Hello World</h1>
            <Link to="/calculator">About Us</Link>
          </div>
        </section>
      ),
    },
    {
      path: "calculator",
      element: <Calculator />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
