import { useState } from "react";
import { QuoteItem } from "../types";
import { Trash2, Plus, FileText, Download } from "lucide-react";

interface QuoteBuilderProps {
  items: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

export default function QuoteBuilder({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onUpdatePrice,
}: QuoteBuilderProps) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-900" />
              Cotización GHL
            </h1>
            <p className="text-sm text-gray-500 mt-1">Generada por AI Expert</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Estimado
            </p>
            <p className="text-3xl font-bold text-gray-900">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg">La cotización está vacía</p>
            <p className="text-sm text-center max-w-sm">
              Habla con el experto en GHL a la izquierda para agregar servicios
              automáticamente, o agrégalos manualmente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-900 text-xs font-medium rounded-md mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Precio ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            onUpdatePrice(
                              item.id,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-24 pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          min="0"
                          step="10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.id,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Subtotal
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      $
                      {(item.price * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-white">
          <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Cotización (PDF)
          </button>
        </div>
      )}
    </div>
  );
}
