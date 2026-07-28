import AppRouter from "./app/router/AppRouter";
import { SidebarProvider } from "./app/context/SidebarContext";

export default function App() {
  return (
    <SidebarProvider>
      <AppRouter />
    </SidebarProvider>
  );
}