import {  useNavigate } from "react-router-dom";
import { Text } from "../components/atoms/Text";
import Button from "../components/atoms/Buttons";
import { Logo } from "../components/molecules/Logo";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    /* fixed inset-0 + bg-background ensures we hide the broken app state behind us */
    <div className="fixed inset-0 z-9999 w-screen h-screen bg-background flex items-center justify-center overflow-hidden">
      
      {/* Centered Content Card */}
      <div className="w-full max-w-125 px-8 flex flex-col items-center text-center">
        
        <div className="mb-12 scale-125">
          <Logo />
        </div>

        {/* Big Stylized 404 */}
        <h1 className="text-[120px] font-bold text-primary opacity-10 leading-none select-none">
          404
        </h1>
        
        <div className="-mt-10 mb-8">
          <Text variant="p1" className="text-foreground mb-4">
            Lost in Space?
          </Text>
          <Text variant="p5" className="text-foreground-secondary">
            We can’t find the board or page you’re looking for. It might have been deleted or moved to another workspace.
          </Text>
        </div>

        <div className="flex flex-col gap-4 w-full items-center">
          
          <div className="w-full max-w-63.75">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate("/")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}