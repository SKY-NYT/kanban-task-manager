import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Text } from "../components/atoms/Text";
import Button from "../components/atoms/Buttons";
import { Logo } from "../components/molecules/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/");
  };

  return (

    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background px-4">
      
     
      <div className="w-full max-w-120 flex flex-col items-center">
        
       
        <div className="mb-12 transform scale-150">
          <Logo />
        </div>

        
        <div className="w-full bg-background-secondary p-8 md:p-12 rounded-xl shadow-xl border border-border">
          <div className="text-center mb-10">
            <Text variant="p2" as="h1" className="text-foreground mb-3">
              Welcome Back
            </Text>
            <Text variant="p5" className="text-preset-gray-300">
              Enter the platform to manage your boards and tasks.
            </Text>
          </div>

          <div className="space-y-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              className="w-full py-4 shadow-md"
            >
              Mock Login to View Boards
            </Button>
            
            <div className="pt-2 text-center">
               <Text variant="p4" className="text-primary tracking-[2.4px] uppercase opacity-70">
                Demo Mode Active
              </Text>
            </div>
          </div>
        </div>

        
        
      </div>
    </div>
  );
}