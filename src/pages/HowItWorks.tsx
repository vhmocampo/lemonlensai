import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, BarChart4, Brain, CheckCircle, MapPin, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  const goBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How LemonLens.ai Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced system transforms millions of data points into actionable vehicle insights through a multi-stage analysis process.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Data Aggregation */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Database className="mr-3 h-6 w-6 text-blue-600" />
                1. Data Aggregation from Trusted Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                We collect comprehensive vehicle data from multiple reputable sources to ensure accuracy and completeness:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Official Sources</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• NHTSA complaint database</li>
                    <li>• RepairPal repair data</li>
                    <li>• Manufacturer service bulletins</li>
                    <li>• Recall databases</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Community Sources</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Automotive forums</li>
                    <li>• Reddit user discussions</li>
                    <li>• Public repair records</li>
                    <li>• User-submitted experiences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Analysis and Grouping */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <BarChart4 className="mr-3 h-6 w-6 text-orange-600" />
                2. Pattern Analysis and Issue Grouping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                Our algorithms analyze the aggregated data to identify meaningful patterns and separate genuine issues from isolated incidents:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-orange-800 mb-2">Recurring Issues</h4>
                  <p className="text-orange-700 text-sm">Problems reported multiple times across different sources</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-yellow-800 mb-2">Statistical Analysis</h4>
                  <p className="text-yellow-700 text-sm">Frequency, severity, and mileage correlation studies</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-red-800 mb-2">Outlier Filtering</h4>
                  <p className="text-red-700 text-sm">Removing isolated incidents and unreliable reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Machine Learning Matching */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Brain className="mr-3 h-6 w-6 text-purple-600" />
                3. AI-Powered Repair Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                Using machine learning and AI, we match identified issues to specific repair procedures and cost estimates:
              </p>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">Machine Learning Models</h4>
                    <ul className="space-y-2 text-purple-700">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Symptom-to-repair correlation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Cost prediction algorithms</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Confidence scoring systems</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">AI Analysis</h4>
                    <ul className="space-y-2 text-purple-700">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Natural language processing of complaints</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Repair procedure identification</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Risk assessment and prioritization</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Standard Reports */}
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="mr-3 h-6 w-6 text-green-600" />
                4. Standard Report Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                For standard reports, we present the most reliable and well-documented findings:
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">What's Included</h4>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>High-confidence repair predictions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>General cost estimates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Common issue identification</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Basic reliability scoring</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">Best Practices</h4>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Conservative estimates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Widely documented issues only</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Focus on safety-critical items</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Clear confidence indicators</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 5: Premium Analysis */}
          <Card className="border-2 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <MapPin className="mr-3 h-6 w-6 text-yellow-600" />
                5. Premium AI Enhancement & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                Premium reports undergo additional AI analysis with real-time data integration and location-specific insights:
              </p>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-3">Advanced AI Analysis</h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Live data integration</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Real-time source validation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Enhanced likelihood calculations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Inspection recommendations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-3">Localized Insights</h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Zip code-based repair pricing</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Climate-related issue analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Regional service quality data</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Local parts availability</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 6: Vehicle-Specific Tailoring */}
          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="mr-3 h-6 w-6 text-indigo-600" />
                6. Vehicle-Specific Report Tailoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">Every Car is Different</h3>
                  <p className="text-indigo-700">
                    Premium reports analyze specific details about your vehicle's history and location to provide the most accurate assessment possible.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">Vehicle History Integration</h4>
                    <ul className="space-y-1 text-indigo-700 text-sm">
                      <li>• Carfax report analysis</li>
                      <li>• Service record validation</li>
                      <li>• Previous owner history</li>
                      <li>• Accident impact assessment</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">Location-Based Factors</h4>
                    <ul className="space-y-1 text-indigo-700 text-sm">
                      <li>• Climate impact analysis</li>
                      <li>• Salt/corrosion exposure</li>
                      <li>• Regional driving patterns</li>
                      <li>• Local repair shop quality</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">Dealer Data Enhancement</h4>
                    <ul className="space-y-1 text-indigo-700 text-sm">
                      <li>• Maintenance record analysis</li>
                      <li>• Warranty status verification</li>
                      <li>• Service campaign updates</li>
                      <li>• Options package implications</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
                  <p className="text-indigo-800 text-center font-medium">
                    Premium reports can be updated with additional information as you receive it from dealers, allowing for increasingly accurate assessments throughout your car buying process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Your Vehicle Report?</h2>
          <p className="text-gray-700 mb-6">
            Experience our comprehensive analysis process with your next vehicle purchase or current car assessment.
          </p>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3"
            onClick={goBack}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}