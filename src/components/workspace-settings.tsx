import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const SettingsContext = createContext({
  darkSurfaces: false,
  cloudMotion: true,
  setDarkSurfaces: (_value: boolean) => {},
  setCloudMotion: (_value: boolean) => {},
});

export function WorkspaceSettingsProvider({ children }: { children: ReactNode }) {
  const [darkSurfaces, setDarkSurfaces] = useState(false);
  const [cloudMotion, setCloudMotion] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkSurfaces);
    document.documentElement.classList.toggle("clouds-paused", !cloudMotion);
    return () => {
      document.documentElement.classList.remove("dark", "clouds-paused");
    };
  }, [darkSurfaces, cloudMotion]);

  return (
    <SettingsContext.Provider value={{ darkSurfaces, cloudMotion, setDarkSurfaces, setCloudMotion }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useWorkspaceSettings() {
  return useContext(SettingsContext);
}