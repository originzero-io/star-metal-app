import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:6333";

const useAxios = ({ url }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios
      .get(url)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // custom hook returns value
  return { response, error, loading };
};

export default useAxios;
