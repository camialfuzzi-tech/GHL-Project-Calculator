import { useState, useRef, useEffect } from "react";
import {
  GoogleGenAI,
  Type,
  FunctionDeclaration,
  Chat as GenAIChat,
  GenerateContentResponse,
} from "@google/genai";
import Markdown from "react-markdown";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { ghlMap } from "../ghlMap";
import { QuoteItem } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatProps {
  onAddToQuote: (item: Omit<QuoteItem, "id">) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const addToQuoteDeclaration: FunctionDeclaration = {
  name: "add_to_quote",
  description: "Add an item to the client's quote based on their requirements.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description:
          'The category of the feature (e.g., "Marketing", "Workflows", "Sites")',
      },
      name: {
        type: Type.STRING,
        description: "The name of the feature or service",
      },
      description: {
        type: Type.STRING,
        description: "A brief description of what will be implemented",
      },
      price: {
        type: Type.NUMBER,
        description: "The estimated price for this item",
      },
      quantity: {
        type: Type.NUMBER,
        description: "The quantity or number of hours",
      },
    },
    required: ["category", "name", "price", "quantity", "description"],
  },
};

export default function Chat({ onAddToQuote }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hola, soy tu experto en GoHighLevel. Cuéntame qué necesita tu cliente y te ayudaré a armar la cotización.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<GenAIChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: `Eres un experto en GoHighLevel (GHL). Tu objetivo es ayudar a cotizar proyectos para clientes basados en las funcionalidades de GHL.
        
Aquí tienes el mapa completo de funcionalidades de GHL:
${ghlMap}

Instrucciones:
1. Habla en español.
2. Haz preguntas para entender qué necesita el cliente.
3. Cuando identifiques un requerimiento claro (ej. "necesito un embudo de ventas", "necesito automatizar correos"), usa la herramienta 'add_to_quote' para agregar el ítem a la cotización.
4. Asigna precios razonables basados en la complejidad (ej. un embudo simple $150, automatización compleja $300).
5. Explica al usuario qué has agregado a la cotización y por qué.`,
        tools: [{ functionDeclarations: [addToQuoteDeclaration] }],
        temperature: 0.7,
      },
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });

      let modelText = response.text || "";

      // Check for function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === "add_to_quote") {
            const args = call.args as any;
            onAddToQuote({
              category: args.category,
              name: args.name,
              description: args.description,
              price: args.price,
              quantity: args.quantity,
            });
            // We need to send the function response back to the model
            // In the current SDK, if a function is called, we should ideally send a tool response back.
            // But for simplicity, we can just append a system message or let the model continue.
            // Actually, if it calls a tool, we MUST send the tool response.
            const toolResponse = await chatRef.current.sendMessage({
              message: `Function add_to_quote called successfully for ${args.name}.`,
            });
            if (toolResponse.text) {
              modelText += (modelText ? "\\n\\n" : "") + toolResponse.text;
            }
          }
        }
      }

      if (modelText) {
        setMessages((prev) => [...prev, { role: "model", text: modelText }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Lo siento, hubo un error al procesar tu mensaje.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-gray-900" />
          GHL Expert AI
        </h2>
        <p className="text-sm text-gray-500">Asistente para cotizaciones</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === "user"
                  ? "bg-gray-900 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.role === "user" ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Bot className="w-3 h-3" />
                )}
                <span>{msg.role === "user" ? "Tú" : "AI Expert"}</span>
              </div>
              <div
                className={`prose prose-sm max-w-none ${msg.role === "user" ? "prose-invert" : ""}`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-4 rounded-tl-none flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe lo que necesita el cliente..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
