import axios from "axios";
import { useEffect, useState } from "react";

const Calculator = () => {
  const [data, setData] = useState({
    values: null,
    indexs: [],
    number: "",
  });

  const getValues = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/values/current`
      );
      setData((prev) => ({ ...prev, values: response.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const getIndexes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/values/all`
      );
      setData((prev) => ({ ...prev, indexs: response.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/values`, {
        index: data.number,
      });
      setData((prev) => ({ ...prev, number: "" }));
      getValues();
      getIndexes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getValues();
    getIndexes();
  }, []);

  return (
    <section>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Enter your index man</label>
            <input
              type="text"
              value={data.number}
              onChange={(e) =>
                setData((prev) => ({ ...prev, number: e.target.value }))
              }
            />
          </div>

          <button type="submit">Submit</button>
        </form>

        <div>
          <h3>Indexes I have seen:</h3>
          {data.indexs?.map(({ number }) => number).join(", ")}
        </div>

        <div>
          <h3>Calculated Values:</h3>
          {Object.keys(data.values || {})?.map((key) => (
            <div key={key}>
              For index {key} I calculated {data.values[key]}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calculator;
