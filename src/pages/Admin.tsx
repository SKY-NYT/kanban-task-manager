import { Text } from "../components/atoms/Text";
import { useKanbanStore } from "../store/useKanbanStore";

export default function Admin() {
  const sidebarVisible = useKanbanStore((s) => s.sidebarVisible);

  return (
    <main
      className={`
        fixed z-30 top-0 right-0 bottom-0 overflow-y-auto bg-background
        transition-all duration-300
        pt-16 md:pt-20.25 lg:pt-24 px-4 md:px-6
        ${sidebarVisible ? "left-0 md:left-65 lg:left-75" : "left-0"}
      `}
    >
      <div className="min-h-full flex items-center justify-center py-6">
        <div className="w-full max-w-3xl">
          <div className="w-full bg-background-secondary p-6 md:p-8 rounded-xl shadow-sm border border-border">
            <Text variant="p2" as="h1" className="text-foreground mb-3">
              Admin Panel
            </Text>
            <Text variant="p5" className="text-preset-gray-300">
              This route is protected. Only logged-in users can see it.
            </Text>
          </div>
        </div>
      </div>
    </main>
  );
}
