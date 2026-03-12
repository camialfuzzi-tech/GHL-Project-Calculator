import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calculator as CalcIcon,
  ArrowRight,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2
} from "lucide-react";

type ClientType = "none" | "business" | "agency" | null;

interface CalculatorState {
  clientType: ClientType;
  projectDescription: string;
  quantities: Record<string, number>;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const INITIAL_STATE: CalculatorState = {
  clientType: null,
  projectDescription: "",
  quantities: {},
  contactInfo: {
    name: "",
    email: "",
    phone: "",
  },
};

const PRICING_DATA: Record<
  string,
  { id: string; name: string; price: number }[]
> = {
  "CRM & Sales": [
    { id: "crm_pipeline", name: "Pipelines", price: 130 },
    { id: "crm_stage", name: "Pipeline stages", price: 20 },
  ],
  "Lead Capture": [
    { id: "lead_funnel", name: "Funnels", price: 340 },
    { id: "lead_landing", name: "Landing page", price: 260 },
    { id: "lead_form", name: "Forms", price: 130 },
    { id: "lead_survey", name: "Surveys / quizzes", price: 170 },
    { id: "lead_chat", name: "Chat widget", price: 90 },
  ],
  "Booking & Communication": [
    { id: "book_cal", name: "Calendars", price: 130 },
    { id: "book_sms", name: "SMS automation", price: 260 },
    { id: "book_email", name: "Email automation", price: 260 },
  ],
  "Sales & Payments": [
    { id: "sales_prod", name: "Products", price: 130 },
    { id: "sales_check", name: "Checkout pages", price: 260 },
    { id: "sales_sub", name: "Subscriptions", price: 170 },
  ],
  Marketing: [
    { id: "mkt_email", name: "Email campaigns", price: 170 },
    { id: "mkt_sms", name: "SMS campaigns", price: 170 },
  ],
  AI: [
    { id: "ai_chat", name: "AI chatbot", price: 430 },
    { id: "ai_book", name: "AI booking agent", price: 430 },
    { id: "ai_voice", name: "Voice AI", price: 340 },
  ],
  Integrations: [
    { id: "int_base", name: "Integrations", price: 170 },
    { id: "int_api", name: "API", price: 340 },
    { id: "int_webhook", name: "Webhooks", price: 170 },
  ],
};

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(
    Object.keys(PRICING_DATA)[0],
  );

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleAnalyzeDescription = async () => {
    if (!state.projectDescription.trim()) {
      handleNext();
      return;
    }

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are an expert GoHighLevel (GHL) architect. Analyze the following project description and determine the quantities needed for each item in our catalog.
        
        Catalog:
        ${JSON.stringify(PRICING_DATA, null, 2)}
        
        Project Description:
        ${state.projectDescription}
        
        Return a JSON array of objects with 'id' and 'quantity' for the items needed. Only include items with quantity > 0.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                quantity: { type: Type.INTEGER }
              },
              required: ["id", "quantity"]
            }
          }
        }
      });

      const result = JSON.parse(response.text || "[]");
      const newQuantities: Record<string, number> = { ...state.quantities };
      
      result.forEach((item: any) => {
        if (item.id && item.quantity > 0) {
          newQuantities[item.id] = item.quantity;
        }
      });
      
      setState(s => ({ ...s, quantities: newQuantities }));
      handleNext();
    } catch (error) {
      console.error("Error analyzing description:", error);
      handleNext(); // Proceed anyway so they can manually enter
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setState((prev) => {
      const current = prev.quantities[id] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        quantities: {
          ...prev.quantities,
          [id]: next,
        },
      };
    });
  };

  const calculateTotal = () => {
    let total = 0;

    // Setup base
    if (state.clientType === "none") {
      total += 500;
    }

    // Add all selected quantities
    Object.entries(PRICING_DATA).forEach(([category, items]) => {
      items.forEach((item) => {
        const qty = state.quantities[item.id] || 0;
        total += qty * item.price;
      });
    });

    // Agency Multiplier
    if (state.clientType === "agency") {
      total *= 1.5;
    }

    return total;
  };

  const total = calculateTotal();
  const maxTotal = Math.round(total * 1.25); // Add 25% buffer for the range
  const multiplier = state.clientType === "agency" ? 1.5 : 1;

  const handleSubmitToGHL = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const webhookUrl = import.meta.env.VITE_GHL_WEBHOOK_URL;

      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact: state.contactInfo,
            projectDetails: {
              clientType: state.clientType,
              projectDescription: state.projectDescription,
              quantities: state.quantities,
              estimatedTotal: total,
              estimatedMaxTotal: maxTotal,
            },
          }),
        });
      } else {
        console.warn("No GHL Webhook URL configured. Data not sent.");
      }
    } catch (error) {
      console.error("Error sending data to GHL:", error);
    } finally {
      setIsSubmitting(false);
      setStep(5); // Go to final results
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <CalcIcon className="w-5 h-5" />
          <span>Quote Calculator</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === step ? "bg-gray-900 w-4" : i < step ? "bg-gray-400" : "bg-gray-200"} transition-all duration-300`}
            />
          ))}
        </div>
      </div>

      <div className="p-8 min-h-[500px] relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                What is your situation with GoHighLevel?
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "none",
                    label: "I don't have a GHL account",
                  },
                  { id: "business", label: "I use GHL for my business" },
                  {
                    id: "agency",
                    label: "I have an agency that uses GHL for clients",
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        clientType: option.id as ClientType,
                      }))
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      state.clientType === option.id
                        ? "border-gray-900 bg-gray-100"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                      {state.clientType === option.id && (
                        <Check className="w-5 h-5 text-gray-900" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  What do you need?
                </h2>
                <p className="text-gray-500">
                  Describe your project in detail. The more details you provide, the more accurate the quote will be. Our AI will analyze your request and pre-fill the next step.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 min-h-[150px] resize-y"
                  placeholder="e.g. I need a funnel with 3 steps, a calendar for bookings, and 2 automated email workflows..."
                  value={state.projectDescription}
                  onChange={(e) =>
                    setState((s) => ({ ...s, projectDescription: e.target.value }))
                  }
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  What do you need to build?
                </h2>
                <p className="text-gray-500">
                  Select the quantity of each element you need for your project.
                </p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-10">
                {Object.entries(PRICING_DATA).map(([category, items]) => {
                  const isOpen = openCategory === category;
                  const categoryTotal = items.reduce(
                    (sum, item) => sum + (state.quantities[item.id] || 0),
                    0,
                  );

                  return (
                    <div
                      key={category}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenCategory(isOpen ? null : category)
                        }
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">
                            {category}
                          </span>
                          {categoryTotal > 0 && (
                            <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {categoryTotal} items
                            </span>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white border-t border-gray-200"
                          >
                            <div className="p-4 space-y-4">
                              {items.map((item) => {
                                const qty = state.quantities[item.id] || 0;
                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between"
                                  >
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {item.name}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(item.id, -1)
                                        }
                                        disabled={qty === 0}
                                        className={`p-1 rounded-md transition-colors ${qty > 0 ? "text-gray-700 hover:bg-white hover:shadow-sm" : "text-gray-300 cursor-not-allowed"}`}
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="w-6 text-center font-semibold text-gray-900">
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(item.id, 1)
                                        }
                                        className="p-1 rounded-md text-gray-700 hover:bg-white hover:shadow-sm transition-colors"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Almost done!
                </h2>
                <p className="text-gray-500">
                  Enter your details to see your detailed quote.
                </p>
              </div>

              <form
                id="lead-form"
                onSubmit={handleSubmitToGHL}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    value={state.contactInfo.name}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        contactInfo: { ...s.contactInfo, name: e.target.value },
                      }))
                    }
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    value={state.contactInfo.email}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        contactInfo: {
                          ...s.contactInfo,
                          email: e.target.value,
                        },
                      }))
                    }
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    value={state.contactInfo.phone}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        contactInfo: {
                          ...s.contactInfo,
                          phone: e.target.value,
                        },
                      }))
                    }
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </form>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 space-y-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Estimated Project Cost
                </h2>
                <p className="text-gray-500">
                  Based on your requirements and project complexity.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-8 w-full max-w-md">
                <div className="text-5xl font-black text-gray-900 tracking-tight">
                  ${total.toLocaleString()}{" "}
                  <span className="text-2xl text-gray-400 font-medium">
                    - ${maxTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 text-left space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Quote Summary</h3>
                <div className="space-y-3 text-sm">
                  {state.clientType === "none" && (
                    <div className="flex justify-between text-gray-600">
                      <span>GHL Base Setup</span>
                      <span className="font-medium text-gray-900">$500</span>
                    </div>
                  )}
                  {Object.entries(PRICING_DATA).flatMap(([category, items]) => 
                    items.filter(item => (state.quantities[item.id] || 0) > 0).map(item => (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span>{state.quantities[item.id]}x {item.name}</span>
                        <span className="font-medium text-gray-900">${(state.quantities[item.id] * item.price * multiplier).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <a 
                href="https://api.leadconnectorhq.com/widget/bookings/octoplus-demo-call"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-gray-300 transition-all flex items-center gap-2 hover:scale-105"
              >
                Book Strategy Call
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {step < 5 && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || isSubmitting || isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              step === 1 || isSubmitting || isAnalyzing
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step === 4 ? (
            <button
              type="submit"
              form="lead-form"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white shadow-md"
              }`}
            >
              {isSubmitting ? "Calculating..." : "View Quote"}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </button>
          ) : step === 2 ? (
            <button
              onClick={handleAnalyzeDescription}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isAnalyzing
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white shadow-md"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Request
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={step === 1 && !state.clientType}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                step === 1 && !state.clientType
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white shadow-md"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
