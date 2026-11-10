import AppRouter from "./app/router/AppRouter";
import { SidebarProvider } from "./app/context/SidebarContext";
import { ThemeProvider } from "./app/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppRouter />
      </SidebarProvider>
    </ThemeProvider>
  );
}
