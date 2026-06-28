import { useState, useEffect } from "react";

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Example: Mobile if width <= 768px
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile); // Listen for window resize

    return () => {
      window.removeEventListener("resize", checkMobile); // Cleanup on unmount
    };
  }, []);

  return isMobile;
}

export default useMobile;