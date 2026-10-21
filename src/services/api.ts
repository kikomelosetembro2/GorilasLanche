/**
 * API e Serviços de Integração - Gorilla's Lanches
 * Telefone Oficial: +55 68 8102-1682
 * WhatsApp Oficial: 556881021682
 * Chave PIX Oficial: +55 68 8102-1682
 */

import { RESTAURANT_INFO, ENRICHED_MENU_ITEMS, COMMON_ADDONS } from '../data/menuData';
import { MenuItem, Order, RestaurantConfig } from '../types';
import { buildWhatsAppLink, formatWhatsAppMessage, buildWebhookPayload } from '../utils/whatsapp';
import { calculateDeliveryFeeDetails } from '../utils/deliveryTiers';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export const RestaurantAPI = {
  /**
   * Retorna os dados oficiais do restaurante, incluindo telefone e chave PIX atualizados
   */
  getRestaurantInfo(): ApiResponse<RestaurantConfig> {
    return {
      success: true,
      data: {
        ...RESTAURANT_INFO,
        phone: '+55 68 8102-1682',
        whatsappFormatted: '556881021682',
        pixKey: '+55 68 8102-1682',
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Retorna a lista de itens do cardápio com suporte a busca e filtros
   */
  getMenuItems(filters?: { category?: string; query?: string }): ApiResponse<MenuItem[]> {
    let items = [...ENRICHED_MENU_ITEMS];

    if (filters?.category && filters.category !== 'todos') {
      items = items.filter((item) => item.category === filters.category);
    }

    if (filters?.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: items,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Retorna a lista de adicionais disponíveis na chapa e cozinha
   */
  getAddons(): ApiResponse<typeof COMMON_ADDONS> {
    return {
      success: true,
      data: COMMON_ADDONS,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Calcula taxa de entrega oficial baseada em raio (km) a partir da Rua Santo André, 199
   */
  calculateDelivery(distanceKm: number, subtotal: number = 0): ApiResponse<ReturnType<typeof calculateDeliveryFeeDetails>> {
    const quote = calculateDeliveryFeeDetails(
      distanceKm,
      subtotal,
      RESTAURANT_INFO.freeDeliveryThreshold
    );

    return {
      success: true,
      data: quote,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Gera a URL formatada para envio oficial ao WhatsApp +55 68 8102-1682
   */
  generateWhatsAppLink(order: Order): string {
    return buildWhatsAppLink(order, RESTAURANT_INFO);
  },

  /**
   * Gera o texto da comanda formatado para o WhatsApp
   */
  generateWhatsAppMessage(order: Order): string {
    return formatWhatsAppMessage(order, RESTAURANT_INFO);
  },

  /**
   * Gera o payload JSON padrão para webhooks (Evolution API, Typebot, Zapier, Make, n8n)
   */
  generateWebhookPayload(order: Order) {
    return buildWebhookPayload(order, RESTAURANT_INFO);
  },

  /**
   * Dispara webhook assíncrono para integração com sistemas externos de caixa ou PDV
   */
  async sendOrderWebhook(order: Order, webhookUrl?: string): Promise<ApiResponse<{ dispatched: boolean }>> {
    const payload = this.generateWebhookPayload(order);
    const targetUrl = webhookUrl || (typeof window !== 'undefined' ? window.location.origin + '/api/orders' : '');

    try {
      if (targetUrl) {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      return {
        success: true,
        data: { dispatched: true },
        timestamp: new Date().toISOString(),
        message: 'Pedido enviado com sucesso para a API do Gorilla\'s Lanches.',
      };
    } catch {
      // Fallback gracioso caso endpoint não esteja configurado
      return {
        success: false,
        data: { dispatched: false },
        timestamp: new Date().toISOString(),
        message: 'Disparo via wa.me oficial permanece ativo para +55 68 8102-1682.',
      };
    }
  },
};
