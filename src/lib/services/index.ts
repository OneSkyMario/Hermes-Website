/**
 * Barrel export — import any service from "@/lib/services".
 *
 *   import { orderService, otpService, deliveryService } from "@/lib/services";
 */
export { authService, otpService } from "./auth";
export type { AuthTokens, RegistrationResponse, VerifyEmailResponse, MeResponse } from "./auth";

export { customerService, addressService } from "./customers";
export type { Customer, DeliveryAddress, CreateAddressPayload } from "./customers";

export { orderService } from "./orders";
export type { Order, OrderItem, OrderStatus, PlaceOrderPayload } from "./orders";

export { deliveryService, robotService } from "./deliveries";
export type { Delivery, DeliveryStatus, Robot, ETABreakdown } from "./deliveries";
