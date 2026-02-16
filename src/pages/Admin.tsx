import { Text } from "../components/atoms/Text";

export default function Admin() {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6 bg-background">
      <div className="mx-auto w-full max-w-3xl">
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
  );
}
