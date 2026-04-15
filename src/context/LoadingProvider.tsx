import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";
import { isDesktop } from "../lib/device";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);

  // On mobile, no 3D model loads so setProgress is never called.
  // Auto-complete loading after a brief delay for fonts/CSS.
  useEffect(() => {
    if (!isDesktop) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += Math.round(Math.random() * 8 + 3);
        if (percent >= 100) {
          percent = 100;
          clearInterval(interval);
        }
        setLoading(percent);
      }, 60);
      return () => clearInterval(interval);
    }
  }, []);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body" aria-busy={isLoading}>
        {children}
      </main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
