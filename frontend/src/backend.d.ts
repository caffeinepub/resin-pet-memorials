import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface HeadstoneDesign {
    peninsulaFrame: ExternalBlob;
    squareFrame: ExternalBlob;
    ovalFrame: ExternalBlob;
    headstoneFrame: ExternalBlob;
    roundFrame: ExternalBlob;
}
export interface Animal {
    deathDate: bigint;
    birthDate: bigint;
    name: string;
    photo?: ExternalBlob;
}
export interface Address {
    country: string;
    city: string;
    postalCode: string;
    stateOrProvince: string;
    addressLine2?: string;
    phoneNumber: string;
    streetAddress: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AstCloudOrder {
    id: bigint;
    paymentStatus: PaymentStatus;
    contactInfo: ContactInfo;
    paymentMethod: PaymentMethod;
    owner: Principal;
    animal: Animal;
    headstoneDesign: HeadstoneDesign;
    shippingAddress: Address;
    buyerInfo: BuyerInfo;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface BuyerInfo {
    lastName: string;
    firstName: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type PaymentStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "completed";
    completed: string;
} | {
    __kind__: "failed";
    failed: string;
};
export interface ContactInfo {
    email: string;
    phoneNumber: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum PaymentMethod {
    stripe = "stripe",
    crypto = "crypto",
    paypal = "paypal"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    /**
     * / Retrieves all headstone designs.
     */
    getAllHeadstoneDesigns(): Promise<Array<HeadstoneDesign>>;
    /**
     * / Returns the current user's profile if they are a user.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrders(): Promise<Array<AstCloudOrder>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    /**
     * / Returns a specified user's profile if the caller has permission.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    /**
     * / Saves the current user's profile if they are a user.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitOrder(animalName: string, birthDate: bigint, deathDate: bigint, paymentMethod: PaymentMethod, photo: ExternalBlob, peninsulaFrame: ExternalBlob, ovalFrame: ExternalBlob, squareFrame: ExternalBlob, roundFrame: ExternalBlob, headstoneFrame: ExternalBlob, shippingAddress: Address, buyerInfo: BuyerInfo, contactInfo: ContactInfo): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
