import { useEffect, useState } from "react";

export default function useSaveCollapse(COLLAPSE_STATE_KEY) {
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    const savedState = localStorage.getItem(COLLAPSE_STATE_KEY);
    if (savedState) {
      setActiveKeys(JSON.parse(savedState));
    }
  }, []);

  const handleCollapseChange = (keys) => {
    setActiveKeys(keys);
    localStorage.setItem(COLLAPSE_STATE_KEY, JSON.stringify(keys));
  };

  return [activeKeys, handleCollapseChange];
}
