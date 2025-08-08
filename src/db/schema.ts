import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid, foreignKey, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
});

export const categoryTable = pgTable("category", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, (params) => {
    return {
        products: params.many(productTable),
    }
});

export const productTable = pgTable("product_variant", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text().notNull(),
    categoryId: uuid("category_id").references(() => categoryTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantTable = pgTable("product", {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    imageUrl: text().notNull(),
    color: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    priceInCents: integer("price_in_cents").notNull(), // price in cents
});

export const productRelations = relations(productTable, (params) => {
    return {
        categoryId: params.one(categoryTable, {
            fields: [productTable.categoryId],
            references: [categoryTable.id],
        }),
        variants: params.many(productVariantTable)
    }
});

export const productVariantRelations = relations(productVariantTable, (params) => {
    return {
        productId: params.one(productTable, {
            fields: [productVariantTable.productId],
            references: [productTable.id],
        }),
    }
});