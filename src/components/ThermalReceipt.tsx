import React from 'react';
import { Printer, Send, Clock, Bike, Star, AlertCircle } from 'lucide-react';
import { Order, RestaurantConfig } from '../types';

interface ThermalReceiptProps {
  order: Order | null;
  restaurant: RestaurantConfig;
  onUpdateStatus: (newStatus: Order['status']) => void;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ order, restaurant, onUpdateStatus }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center bg-[#FFFFFF]">
        <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-stone-200/80 shadow-xs text-stone-800">
          <div className="w-14 h-14 rounded-2xl bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200/60 flex items-center justify-center text-2xl mx-auto mb-3 font-semibold">
            🧾
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            Nenhum pedido recente registrado
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-4">
            Faça um pedido no <strong>Cardápio Digital</strong> para visualizar a comanda térmica de 80mm formatada para a impressora da cozinha em tempo real.
          </p>
        </div>
      </div>
    );
  }

  const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Status message template to notify customer
  const statusMessages = {
    recebido: `Olá ${order.customer.name}! Seu pedido #${order.id} foi recebido no Gorilla's Lanches e está na fila da chapa. 🍔`,
    preparando: `Aviso Gorilla's: Seu pedido #${order.id} já está na chapa sendo preparado no capricho! 🔥`,
    em_rota: `Boa notícia, ${order.customer.name}! Seu lanche saiu para entrega com o nosso motoboy. Fique atento ao interfone/campainha! 🛵💨`,
    entregue: `Pedido #${order.id} entregue! Muito obrigado pela preferência no Gorilla's Lanches. Tenha um excelente apetite! ⭐`,
  };

  const handleNotifyCustomer = () => {
    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = statusMessages[order.status];
    window.location.href = `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 bg-[#FFFFFF]">
      {/* Control Action Bar (Hidden on print) */}
      <div className="print:hidden mb-6 bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-stone-900">
              Comanda da Cozinha & Impressão ESC/POS 80mm
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Formato pronto para impressora térmica de 80mm com discriminação de frete por raio e itens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] text-white font-medium text-xs transition-colors shadow-xs active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comanda</span>
          </button>

          <button
            type="button"
            onClick={handleNotifyCustomer}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-xs active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Notificar no WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Order Status Stepper (Hidden on print) */}
      <div className="print:hidden mb-6 bg-[#FFFFFF] rounded-2xl p-4 border border-stone-200/70 shadow-xs">
        <span className="block text-xs font-semibold text-stone-800 mb-2.5">
          Status Operacional do Pedido:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['recebido', 'preparando', 'em_rota', 'entregue'] as const).map((st) => {
            const isCurrent = order.status === st;
            const labels = {
              recebido: '1. Recebido',
              preparando: '2. Na Chapa',
              em_rota: '3. Em Rota',
              entregue: '4. Entregue',
            };
            return (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateStatus(st)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  isCurrent
                    ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>
      </div>

      {/* The Thermal Paper Receipt Card - Fundo #FFFFFF */}
      <div className="max-w-md mx-auto bg-[#FFFFFF] text-stone-900 p-6 sm:p-7 rounded-2xl shadow-sm font-mono text-xs border border-stone-300 relative print:m-0 print:p-2 print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Receipt Header */}
        <div className="text-center pb-3 border-b border-dashed border-stone-300 space-y-1">
          <h2 className="text-lg font-bold tracking-wide uppercase font-sans text-stone-900">
            {restaurant.name}
          </h2>
          <p className="text-[11px] text-stone-600">{restaurant.tagline}</p>
          <p className="text-[11px] text-stone-500">{restaurant.address} - Rio Branco, AC</p>
          <p className="text-[11px] text-stone-700 font-semibold">Atendimento: {restaurant.phone}</p>
          <div className="pt-1.5 text-xs font-bold uppercase text-stone-800">
            === COMANDA DE COZINHA ===
          </div>
          <div className="text-sm font-bold bg-[#F5EBE1] text-[#7A3E1D] py-1 rounded-lg border border-orange-200">
            PEDIDO: #{order.id}
          </div>
          <p className="text-[10px] text-stone-400">Impresso em: {dateFormatted}</p>
        </div>

        {/* Customer & Delivery Section */}
        <div className="py-3 border-b border-dashed border-stone-300 space-y-1 text-xs">
          <p><strong>CLIENTE:</strong> {order.customer.name}</p>
          <p><strong>FONE:</strong> {order.customer.phone}</p>
          <p className="text-xs font-semibold bg-stone-100 px-2 py-0.5 rounded text-stone-800 inline-block">
            {order.customer.deliveryType === 'delivery'
              ? '🛵 DELIVERY'
              : order.customer.deliveryType === 'pickup'
              ? '🏪 RETIRADA'
              : `🍽️ MESA: ${order.customer.tableNumber}`}
          </p>
          {order.customer.deliveryType === 'delivery' && (
            <div className="pl-2 pt-1 border-l border-stone-300 space-y-0.5 text-stone-700">
              <p><strong>ENDEREÇO:</strong> {order.customer.address.street}, {order.customer.address.number}</p>
              <p><strong>BAIRRO:</strong> {order.customer.address.neighborhood}</p>
              {order.customer.address.complement && <p><strong>COMPL:</strong> {order.customer.address.complement}</p>}
              {order.customer.address.reference && <p><strong>REF:</strong> {order.customer.address.reference}</p>}
              <p className="text-xs font-medium text-stone-900">
                RAIO: ~{order.customer.address.distanceKm.toFixed(1)} km ({order.customer.address.tierName || 'Faixa Padrão'})
              </p>
              {order.customer.address.estimatedMinutes && (
                <p className="text-[11px] text-stone-500">TEMPO EST.: {order.customer.address.estimatedMinutes}</p>
              )}
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="py-3 border-b border-dashed border-stone-300 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wide pb-1 border-b border-stone-200 flex justify-between text-stone-700">
            <span>QTD ITEM</span>
            <span>TOTAL</span>
          </div>

          {order.items.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between items-start font-semibold text-xs text-stone-900">
                <span>
                  {item.quantity}x {item.product.name}
                  {item.selectedSize && ` (${item.selectedSize.label})`}
                </span>
                <span>R$ {item.totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>

              {/* Addons */}
              {item.selectedAddons.length > 0 && (
                <div className="pl-2 text-[11px] text-stone-600">
                  {item.selectedAddons.map((addon, aIdx) => (
                    <p key={aIdx}>
                      + {addon.name} (+R$ {addon.price.toFixed(2).replace('.', ',')})
                    </p>
                  ))}
                </div>
              )}

              {/* Removals - Secundária #EF4444 */}
              {item.removedIngredients.length > 0 && (
                <div className="pl-2 text-[11px] text-[#EF4444]">
                  ✕ Retirar: {item.removedIngredients.join(', ')}
                </div>
              )}

              {/* Observation - Destaque #F59E0B */}
              {item.notes && (
                <div className="pl-2 text-[11px] italic text-[#F59E0B] bg-amber-50/70 p-1 rounded border border-amber-200/50">
                  Obs: &quot;{item.notes}&quot;
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Financial Section */}
        <div className="py-2.5 border-b border-dashed border-stone-300 space-y-1 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>SUBTOTAL:</span>
            <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>TAXA FRETE:</span>
            <span>{order.deliveryFee === 0 ? 'GRÁTIS' : `R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>DESCONTO:</span>
              <span>- R$ {order.discount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-1 border-t border-stone-200 text-stone-900">
            <span>TOTAL GERAL:</span>
            <span className="text-[#7A3E1D]">R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="py-2.5 border-b border-dashed border-stone-300 text-xs space-y-0.5">
          <p><strong>PAGAMENTO:</strong> {order.customer.paymentMethod.toUpperCase()}</p>
          {order.customer.paymentMethod === 'cash' && order.customer.cashChangeFor && (
            <p className="text-stone-700">
              Troco para R$ {order.customer.cashChangeFor.toFixed(2).replace('.', ',')} (Levar: R$ {(order.customer.cashChangeFor - order.total).toFixed(2).replace('.', ',')})
            </p>
          )}
          {order.customer.paymentMethod === 'pix' && (
            <p className="text-emerald-700">PIX (Chave {restaurant.phone})</p>
          )}
        </div>

        {/* Footer Barcode / Receipt end */}
        <div className="pt-3 text-center space-y-1.5">
          <p className="text-[10px] text-stone-500">
            Obrigado pela preferência no Gorilla&apos;s Lanches!
          </p>
          <div className="font-mono text-center tracking-widest text-[11px] text-stone-400">
            ||| | ||||| || |||||| |||| | |||||
          </div>
        </div>
      </div>
    </div>
  );
};
