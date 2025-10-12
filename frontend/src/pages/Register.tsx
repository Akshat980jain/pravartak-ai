import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Shield, Mail, User, Lock, Phone, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

// Validation schema
const schema = yup.object({
  fullName: yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  mobile: yup.string().required("Mobile number is required").matches(/^[6-9]\d{9}$/, "Invalid mobile number"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string().required("Please confirm your password").oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup.string().required("Please select a role"),
  department: yup.string(),
  agreeToTerms: yup.boolean().oneOf([true], "You must agree to the terms and conditions"),
});

type FormData = yup.InferType<typeof schema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return { text: "Very Weak", color: "text-red-500" };
    if (strength < 50) return { text: "Weak", color: "text-orange-500" };
    if (strength < 75) return { text: "Good", color: "text-yellow-500" };
    return { text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here:
      // const response = await axios.post('/api/auth/register', data);
      
      toast.success("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "administrator", label: "Administrator" },
    { value: "scheme_officer", label: "Scheme Officer" },
    { value: "field_officer", label: "Field Officer" },
    { value: "auditor", label: "Auditor" },
    { value: "beneficiary", label: "Beneficiary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center pt-8 pb-4"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-blue-600" strokeWidth={2} />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">DBT Implementation Portal</h1>
            <p className="text-sm text-gray-600">Ministry of Social Justice and Empowerment</p>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center p-4 lg:p-8"
          >
            <div className="text-center space-y-4 lg:space-y-6">
              <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                <div className="text-center space-y-2 lg:space-y-4">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-12 h-12 lg:w-16 lg:h-16 text-blue-600" />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                      <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-full mx-auto"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <h2 className="text-xl lg:text-3xl font-bold text-gray-900">
                  Empowering Transparent Direct Benefit Transfer
                </h2>
                <p className="text-sm lg:text-lg text-gray-600 max-w-md mx-auto px-4">
                  Join our secure platform to manage and monitor DBT schemes efficiently across India.
                </p>
                <div className="flex justify-center space-x-4 lg:space-x-8 text-xs lg:text-sm text-gray-500">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">100%</div>
                    <div>Transparent</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">Secure</div>
                    <div>Processing</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">24/7</div>
                    <div>Support</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md shadow-xl lg:shadow-2xl border-0 bg-white/90 lg:bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Register to access the DBT Implementation Portal
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        placeholder="Enter your full name"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="mobile"
                        {...register("mobile")}
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role *
                    </Label>
                    <Select onValueChange={(value) => register("role").onChange({ target: { value } })}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department/Organization
                    </Label>
                    <Input
                      id="department"
                      {...register("department")}
                      placeholder="Enter department (optional)"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-2">
                        <Progress value={passwordStrength} className="h-2" />
                        <p className={`text-xs ${strengthInfo.color}`}>
                          Password strength: {strengthInfo.text}
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Passwords do not match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        {...register("agreeToTerms")}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Account...
                        </div>
                      ) : (
                        "Register Account"
                      )}
                    </Button>
                  </motion.div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already registered?{" "}
                      <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center py-6 text-sm text-gray-500 border-t border-gray-200 mt-12"
      >
        © 2025 DBT Implementation Portal | Ministry of Social Justice and Empowerment
      </motion.footer>
    </div>
  );
};

export default Register;
