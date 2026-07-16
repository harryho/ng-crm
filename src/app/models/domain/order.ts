/**
 * Order - a placed, paid (or pending) customer order.
 *
 * Distinct from Cart: Order has frozen totals, real FK to User, an immutable
 * status history, and payment + shipment records. New Orders originate only
 * from checkout - per the lessons-learned scope decisions, manual "create
 * order from scratch" admin forms were removed in react-crm for the same
 * reason: fabricating an order outside checkout doesn't make sense once
 * there's a real checkout path.
 */
import { OrderItem } from './order-item';
import { OrderStatusEntry } from './order-status';
import { Payment } from './payment';
import { Shipment } from './shipment';
import { Address } from './address';

export interface Order {
  id: number;
  reference: string;
  userId: number;
  items: OrderItem[];
  status: OrderStatusEntry;
  statusHistory: OrderStatusEntry[];
  payment: Payment;
  shipment: Shipment;
  shippingAddress: Address;
  total: number;
  orderDate: string;
  /** ISO date; nullable for orders not yet shipped. */
  shippedDate: string | null;
  /** ISO date; nullable for orders not yet delivered. */
  deliveredDate: string | null;
}