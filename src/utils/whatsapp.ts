import { Order, RestaurantConfig } from '../types';

export function formatWhatsAppMessage(order: Order, restaurant: RestaurantConfig): string {
  const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [];

  lines.push(`🍔 *NOVO PEDIDO #${order.id}*`);
  lines.push(`🏢 *${restaurant.name.toUpperCase()}*`);
  lines.push(`🕒 *Data:* ${dateFormatted}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);

  lines.push(`👤 *DADOS DO CLIENTE:*`);
  lines.push(`• *Nome:* ${order.customer.name}`);
  lines.push(`• *Telefone:* ${order.customer.phone}`);

  if (order.customer.deliveryType === 'delivery') {
    const addr = order.customer.address;
    lines.push(`🛵 *ENTREGA A DOMICÍLIO (DELIVERY POR RAIO)*`);
    lines.push(`• *Endereço:* ${addr.street}, nº ${addr.number}`);
    lines.push(`• *Bairro:* ${addr.neighborhood}`);
    if (addr.complement) lines.push(`• *Complemento:* ${addr.complement}`);
    if (addr.reference) lines.push(`• *Ponto de Ref:* ${addr.reference}`);
    lines.push(`• *Raio / Distância:* ~${addr.distanceKm.toFixed(1)} km`);
    if (addr.tierName) lines.push(`• *Faixa de Entrega:* ${addr.tierName}`);
    if (addr.estimatedMinutes) lines.push(`• *Tempo Estimado:* ${addr.estimatedMinutes}`);
    if (addr.isFreeDelivery) lines.push(`• *Promoção:* Frete Grátis Ativado! 🎁`);
  } else if (order.customer.deliveryType === 'pickup') {
    lines.push(`🏪 *RETIRADA NO BALCÃO*`);
    lines.push(`• O cliente irá retirar no local: ${restaurant.address}`);
  } else {
    lines.push(`🍽️ *CONSUMO NO LOCAL*`);
    lines.push(`• *Mesa:* ${order.customer.tableNumber || 'Não informada'}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📋 *ITENS DO PEDIDO:*`);

  order.items.forEach((item, index) => {
    const itemNum = index + 1;
    const sizeLabel = item.selectedSize ? ` (${item.selectedSize.label})` : '';
    lines.push(`\n*${item.quantity}x ${item.product.name}${sizeLabel}* — R$ ${item.totalPrice.toFixed(2).replace('.', ',')}`);

    if (item.selectedAddons.length > 0) {
      item.selectedAddons.forEach((addon) => {
        lines.push(`   └ ➕ *Adicional:* ${addon.name} (+R$ ${addon.price.toFixed(2).replace('.', ',')})`);
      });
    }

    if (item.removedIngredients.length > 0) {
      lines.push(`   └ ❌ *Retirar:* ${item.removedIngredients.join(', ')}`);
    }

    if (item.notes && item.notes.trim()) {
      lines.push(`   └ 📝 *Obs:* "${item.notes.trim()}"`);
    }
  });

  lines.push(`\n━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💰 *RESUMO FINANCEIRO:*`);
  lines.push(`• *Subtotal:* R$ ${order.subtotal.toFixed(2).replace('.', ',')}`);

  if (order.customer.deliveryType === 'delivery') {
    lines.push(`• *Taxa de Entrega:* R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}`);
  } else {
    lines.push(`• *Taxa de Entrega:* GRÁTIS (Balcão / Mesa)`);
  }

  if (order.discount > 0) {
    lines.push(`• *Desconto (${order.customer.couponCode || 'Cupom'}):* -R$ ${order.discount.toFixed(2).replace('.', ',')}`);
  }

  lines.push(`• *VALOR TOTAL:* *R$ ${order.total.toFixed(2).replace('.', ',')}*`);

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💳 *FORMA DE PAGAMENTO:*`);

  if (order.customer.paymentMethod === 'pix') {
    lines.push(`⚡ *PIX Instantâneo*`);
    lines.push(`• Chave PIX: ${restaurant.pixKey}`);
    lines.push(`• Comprovante: Anexar na conversa logo abaixo!`);
  } else if (order.customer.paymentMethod === 'cash') {
    lines.push(`💵 *Dinheiro em Espécie*`);
    if (order.customer.cashChangeFor && order.customer.cashChangeFor > order.total) {
      const troco = order.customer.cashChangeFor - order.total;
      lines.push(`• Troco para: R$ ${order.customer.cashChangeFor.toFixed(2).replace('.', ',')}`);
      lines.push(`• Levar de Troco: *R$ ${troco.toFixed(2).replace('.', ',')}*`);
    } else {
      lines.push(`• Não precisa de troco (Valor exato).`);
    }
  } else if (order.customer.paymentMethod === 'credit') {
    lines.push(`💳 *Cartão de Crédito* (Levar maquininha)`);
  } else if (order.customer.paymentMethod === 'debit') {
    lines.push(`💳 *Cartão de Débito* (Levar maquininha)`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Por favor, responda com *OK* para confirmar a produção do lanche!_ 🍔🚀`);

  return lines.join('\n');
}

export function buildWhatsAppLink(order: Order, restaurant: RestaurantConfig): string {
  const text = formatWhatsAppMessage(order, restaurant);
  const cleanPhone = restaurant.whatsappFormatted.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildWebhookPayload(order: Order, restaurant: RestaurantConfig) {
  return {
    event: 'order.created',
    timestamp: new Date().toISOString(),
    restaurant: {
      id: 'gorillas-lanches-01',
      name: restaurant.name,
      whatsapp: restaurant.whatsappFormatted,
    },
    order: {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      customer: {
        name: order.customer.name,
        phone: order.customer.phone,
        type: order.customer.deliveryType,
        address: order.customer.deliveryType === 'delivery' ? order.customer.address : null,
        tableNumber: order.customer.deliveryType === 'dinein' ? order.customer.tableNumber : null,
      },
      payment: {
        method: order.customer.paymentMethod,
        cashChangeFor: order.customer.cashChangeFor || null,
        pixPayload: order.pixPayload || null,
      },
      pricing: {
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        couponCode: order.customer.couponCode || null,
        total: order.total,
      },
      items: order.items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        size: i.selectedSize?.label || null,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
        addons: i.selectedAddons,
        removed: i.removedIngredients,
        notes: i.notes || null,
      })),
      formattedWhatsAppText: formatWhatsAppMessage(order, restaurant),
    },
  };
}
