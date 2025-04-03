import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  GraduationCap,
  ChevronRight,
  X,
  BookOpen,
  LineChart,
  DollarSign,
  Briefcase
} from 'lucide-react';

interface Topic {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  varsityModule?: number;
}

interface RegistrationForm {
  fullName: string;
  email: string;
  password: string;
}

interface VarsityChapter {
  chapter_id: number;
  chapter_name: string;
  chapter_url: string;
  content: string;
}

function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState<RegistrationForm>({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<RegistrationForm>>({});
  const [varsityContent, setVarsityContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const VARSITY_API_KEY = import.meta.env.VITE_VARSITY_API_KEY;
  const VARSITY_BASE_URL = import.meta.env.VITE_VARSITY_BASE_URL;

  const topics: Topic[] = [
    {
      id: 1,
      title: "Introduction to Stock Markets",
      description: "Learn the basics of stock markets and trading",
      icon: <BookOpen className="w-6 h-6" />,
      content: "Understanding the fundamentals of stock markets, including what stocks are, how they work, and basic trading concepts.",
      varsityModule: 1
    },
    {
      id: 2,
      title: "Technical Analysis",
      description: "Master chart patterns and indicators",
      icon: <LineChart className="w-6 h-6" />,
      content: "Learn how to analyze price charts, identify patterns, and use technical indicators for better trading decisions.",
      varsityModule: 2
    },
    {
      id: 3,
      title: "Fundamental Analysis",
      description: "Evaluate companies and their financials",
      icon: <DollarSign className="w-6 h-6" />,
      content: "Understand how to analyze company financials, industry trends, and economic factors for long-term investing.",
      varsityModule: 3
    },
    {
      id: 4,
      title: "Futures Trading",
      description: "Advanced derivatives trading concepts",
      icon: <Briefcase className="w-6 h-6" />,
      content: "Explore futures contracts, margin trading, and advanced trading strategies in the derivatives market.",
      varsityModule: 4
    }
  ];

  const fetchVarsityContent = async (moduleId: number) => {
    try {
      setIsLoading(true);
      setApiError(null);

      if (!VARSITY_API_KEY) {
        throw new Error('Varsity API key is not configured');
      }

      const response = await axios.get(`${VARSITY_BASE_URL}/module/${moduleId}`, {
        headers: {
          'Authorization': `Token ${VARSITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.chapters) {
        const chapters = response.data.chapters as VarsityChapter[];
        const firstChapter = chapters[0];
        setVarsityContent(firstChapter.content);
      } else {
        throw new Error('Invalid response format from Varsity API');
      }
    } catch (error) {
      console.error('Error fetching Varsity content:', error);
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.message || 'Failed to fetch content from Varsity API');
      } else {
        setApiError('An unexpected error occurred');
      }
      setVarsityContent('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTopic?.varsityModule) {
      fetchVarsityContent(selectedTopic.varsityModule);
    }
  }, [selectedTopic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof RegistrationForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<RegistrationForm> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setShowRegistration(false);
      setFormData({
        fullName: '',
        email: '',
        password: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center">
          <GraduationCap className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Financial Education Hub</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{topic.title}</h2>
                  <p className="mt-1 text-gray-600">{topic.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {selectedTopic && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                {selectedTopic.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedTopic.title}</h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : apiError ? (
              <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                {apiError}
              </div>
            ) : (
              <div>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: varsityContent || selectedTopic.content }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 bg-indigo-700 rounded-lg shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Your Financial Journey Today</h2>
          <p className="mb-6">Join thousands of others learning to master their finances and build a secure future.</p>
          <button 
            onClick={() => setShowRegistration(true)}
            className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Get Started
          </button>
        </div>

        {showRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowRegistration(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;