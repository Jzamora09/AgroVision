import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface SidebarContextProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<
  SidebarContextProps | undefined
>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export function SidebarProvider({
  children,
}: ProviderProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar debe utilizarse dentro de SidebarProvider"
    );
  }

  return context;
}