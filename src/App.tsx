import { useEffect } from "react";
import { supabase } from "./lib/supabase";

const App = () => {

  useEffect(() => {

    const test = async () => {

      const { data, error } =
        await supabase.auth.getSession();

      console.log(data);

      console.log(error);

    };

    test();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-5xl font-bold text-green-600">
        🌱 AgroVision
      </h1>
    </div>
  );
};

export default App;