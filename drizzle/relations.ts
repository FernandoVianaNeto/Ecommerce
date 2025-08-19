import { relations } from "drizzle-orm/relations";
import { user, session, category, product, account, productVariant, shippingAddress, cart, cartItem, order, orderItem } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	shippingAddresses: many(shippingAddress),
	carts: many(cart),
	orders: many(order),
}));

export const productRelations = relations(product, ({one, many}) => ({
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id]
	}),
	productVariants: many(productVariant),
}));

export const categoryRelations = relations(category, ({many}) => ({
	products: many(product),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const productVariantRelations = relations(productVariant, ({one}) => ({
	product: one(product, {
		fields: [productVariant.productId],
		references: [product.id]
	}),
}));

export const shippingAddressRelations = relations(shippingAddress, ({one, many}) => ({
	user: one(user, {
		fields: [shippingAddress.userId],
		references: [user.id]
	}),
	carts: many(cart),
	orders: many(order),
}));

export const cartRelations = relations(cart, ({one, many}) => ({
	user: one(user, {
		fields: [cart.userId],
		references: [user.id]
	}),
	shippingAddress: one(shippingAddress, {
		fields: [cart.shippingAddressId],
		references: [shippingAddress.id]
	}),
	cartItems: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({one}) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id]
	}),
}));

export const orderRelations = relations(order, ({one, many}) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id]
	}),
	shippingAddress: one(shippingAddress, {
		fields: [order.shippingAddressId],
		references: [shippingAddress.id]
	}),
	orderItems: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({one}) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id]
	}),
}));