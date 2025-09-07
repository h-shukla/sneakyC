import { useEffect, useState } from "react";
import {
    Eye,
    EyeOff,
    ArrowLeft,
    Mail,
    Lock,
    Zap,
    AlertCircle,
    X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { SiGoogle, SiX } from "@icons-pack/react-simple-icons";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { isLoggedIn, refreshAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/login`,
                { email, password, rememberMe: true },
                {
                    withCredentials: true,
                }
            );

            if (res.status !== 200) {
                setError(
                    "Login failed. Please check your credentials and try again."
                );
                console.error("Login failed: Status not 200", res);
                return;
            }

            refreshAuth();
            console.log(res.data);
            if (res.data?.userDetails?.role === "admin") {
                localStorage.setItem("role", "admin");
                navigate("/admin");
            } else {
                localStorage.setItem("role", "user");
                navigate("/");
            }
        } catch (error: unknown) {
            // Provide more specific error messages based on the error response
            let errorMessage = "Login failed. Please try again.";

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    errorMessage =
                        "Invalid email or password. Please check your credentials.";
                } else if (error.response?.status === 429) {
                    errorMessage =
                        "Too many login attempts. Please try again later.";
                } else if (
                    error.response?.status &&
                    error.response.status >= 500
                ) {
                    errorMessage = "Server error. Please try again later.";
                } else if (error.code === "NETWORK_ERROR" || !error.response) {
                    errorMessage =
                        "Network error. Please check your connection.";
                }
            } else if (error instanceof Error) {
                errorMessage = `Login failed: ${error.message}`;
            }

            setError(errorMessage);
            console.error("Login failed due to an error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgetPassword = () => {
        navigate("/forgot-password");
    };

    const dismissError = () => {
        setError("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <Link
                    to="/"
                    className="mb-8 flex items-center text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
                            <Zap className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            Sign in to your SneakyC account
                        </p>
                    </div>

                    {/* Error Message UI */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                            <button
                                onClick={dismissError}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                    placeholder="Enter your password"
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-500 text-black font-semibold py-3 px-4 rounded-xl hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgetPassword}
                                className="text-sm text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-900 text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Social Login Buttons */}
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <SiGoogle className="w-5 h-5 mr-2" />
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <SiX className="w-5 h-5 mr-2" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© 2025 SneakyC. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
