import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Zap } from "lucide-react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/register`,
                { name, email, password },
                { withCredentials: true }
            );

            if (res.status !== 200) {
                toast.error("Registration failed");
                console.error(
                    "Registration failed: Status not 200",
                    res.data.message
                );
                return;
            }

            toast.success("Registration successful!");

            // not using navigate to trigger reload
            setTimeout(() => {
                window.location.href = "/";
            }, 1000); // Give user time to see the toast
        } catch (error: any) {
            console.log(error);
            toast.error(
                error?.response?.data?.message
                    ? `Error: ${error.response.data.message}`
                    : error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-md">
                {/* Back Button */}
                <Link
                    to="/"
                    className="mb-8 flex items-center text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                {/* Sign Up Card */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
                            <Zap className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-400">
                            Sign up for SneakyC to get started
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-300 block"
                            >
                                Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-300 block"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-300 block"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Create a password"
                                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms & Privacy */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-600 bg-white/10 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                required
                            />
                            <span className="ml-2 text-sm text-gray-400">
                                I agree to the{" "}
                                <a
                                    href="#"
                                    className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
                                >
                                    Terms & Privacy
                                </a>
                            </span>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={!agreed || isLoading}
                            className="w-full bg-yellow-500 text-black font-semibold py-3 px-4 rounded-xl hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        {/* ...rest of code (divider, social buttons, footer) ... */}
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200"
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© 2024 SneakyC. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
