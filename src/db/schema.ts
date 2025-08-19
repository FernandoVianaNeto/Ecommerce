import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const sessionTable = pgTable("session", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' })
});

export const accountTable = pgTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verificationTable = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const categoryTable = pgTable("category", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productTable = pgTable("product", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text().notNull(),
    categoryId: uuid("category_id").references(() => categoryTable.id, { onDelete: 'set null' }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantTable = pgTable("product_variant", {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => productTable.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    imageUrl: text().notNull(),
    color: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    priceInCents: integer("price_in_cents").notNull(),
});

export const shippingAddressTable = pgTable("shipping_address", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    recipientName: text("recipient_name").notNull(),
    street: text().notNull(),
    number: text().notNull(),
    complement: text(),
    neighborhood: text().notNull(),
    zipCode: text("zip_code").notNull(),
    email: text().notNull(),
    cpfOrCnpj: text("cpf_or_cnpj").notNull(),
    city: text().notNull(),
    state: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartTable = pgTable("cart", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    shippingAddressId: uuid("shipping_address_id").references(() => shippingAddressTable.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartItemTable = pgTable("cart_item", {
    id: uuid().primaryKey().defaultRandom(),
    cartId: uuid("cart_id").notNull().references(() => cartTable.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id").references(() => productVariantTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
});

export const orderStatus = pgEnum("order_status", ["pending", "paid", "canceled"]);

export const orderTable = pgTable("order", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    shippingAddressId: uuid("shipping_address_id").references(() => shippingAddressTable.id, { onDelete: "set null" }),
    recipientName: text("recipient_name").notNull(),
    street: text().notNull(),
    number: text().notNull(),
    complement: text(),
    neighborhood: text().notNull(),
    zipCode: text("zip_code").notNull(),
    email: text().notNull(),
    cpfOrCnpj: text("cpf_or_cnpj").notNull(),
    city: text().notNull(),
    state: text().notNull(),
    totalPriceInCents: integer("total_price_in_cents").notNull(),
    status: orderStatus().notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItemTable = pgTable("order_item", {
    id: uuid().primaryKey().defaultRandom(),
    productVariantId: uuid("product_variant_id").references(() => productVariantTable.id, { onDelete: "restrict" }),
    orderId: uuid("order_id").references(() => orderTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    priceInCents: integer("price_in_cents").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const productRelations = relations(productTable, (params) => ({
    category: params.one(categoryTable, {
        fields: [productTable.categoryId],
        references: [categoryTable.id],
    }),
    variants: params.many(productVariantTable)
}));

export const productVariantRelations = relations(productVariantTable, (params) => ({
    product: params.one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id],
    }),
    orderItems: params.many(orderItemTable),
    cartItems: params.many(cartItemTable),
}));

export const categoryRelations = relations(categoryTable, (params) => ({
    products: params.many(productTable),
}));

export const cartRelations = relations(cartTable, (params) => ({
    user: params.one(userTable, {
        fields: [cartTable.userId],
        references: [userTable.id],
    }),
    shippingAddress: params.one(shippingAddressTable, {
        fields: [cartTable.shippingAddressId],
        references: [shippingAddressTable.id],
    }),
    cartItems: params.many(cartItemTable)
}));

export const cartItemRelations = relations(cartItemTable, (params) => ({
    cart: params.one(cartTable, {
        fields: [cartItemTable.cartId],
        references: [cartTable.id],
    }),
    productVariant: params.one(productVariantTable, {
        fields: [cartItemTable.productVariantId],
        references: [productVariantTable.id],
    }),
}));

export const orderRelations = relations(orderTable, (params) => ({
    user: params.one(userTable, {
        fields: [orderTable.userId],
        references: [userTable.id],
    }),
    shippingAddress: params.one(shippingAddressTable, {
        fields: [orderTable.shippingAddressId],
        references: [shippingAddressTable.id],
    }),
    orderItems: params.many(orderItemTable)
}));

export const orderItemRelations = relations(orderItemTable, (params) => ({
    order: params.one(orderTable, {
        fields: [orderItemTable.orderId],
        references: [orderTable.id],
    }),
    productVariant: params.one(productVariantTable, {
        fields: [orderItemTable.productVariantId],
        references: [productVariantTable.id],
    }),
}));

export const shippingAddressRelations = relations(shippingAddressTable, (params) => ({
    user: params.one(userTable, {
        fields: [shippingAddressTable.userId],
        references: [userTable.id],
    }),
    carts: params.many(cartTable),
    orders: params.many(orderTable),
}));

export const userRelations = relations(userTable, (params) => ({
    shippingAddresses: params.many(shippingAddressTable),
    cart: params.one(cartTable, {
        fields: [userTable.id],
        references: [cartTable.userId]
    }),
    orders: params.many(orderTable),
}));