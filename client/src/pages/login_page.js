import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card , CardContent} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const generateUID = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000); // Generate 12-digit number
  };

  const onSubmit = async (data) => {
    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Server Response:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0 bg-black text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">DocLoc</h1>
            <p className="text-gray-400 text-lg">Your Data, Your Control</p>
          </div>

          <motion.form 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
          >
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <Input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="h-12 rounded-lg focus-visible:ring-white bg-gray-800 text-white"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Unique ID</label>
              <Input
                type="number"
                {...register("uid", {
                  required: "Unique ID is required",
                  valueAsNumber: true,
                  validate: value => String(value).length === 12 || "Unique ID must be 12 digits"
                })}
                className="h-12 rounded-lg focus-visible:ring-white bg-gray-800 text-white"
                placeholder="Enter 12-digit UID"
              />
              {errors.uid && <p className="text-red-500 text-sm mt-1">{errors.uid.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input
                type="password"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 8, message: "Must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Must include uppercase, lowercase, number, and special character"
                  }
                })}
                className="h-12 rounded-lg focus-visible:ring-white bg-gray-800 text-white"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 rounded-lg bg-white text-black font-semibold text-base hover:bg-gray-300">
              {isLogin ? "Log In" : "Create Account"}
            </Button>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-300 hover:text-white font-medium">
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
              </button>
              {isLogin && <a href="#" className="text-sm text-gray-400 hover:text-white">Forgot Password?</a>}
            </div>
          </motion.form>
        </CardContent>
      </Card>
    </div>
  );
}