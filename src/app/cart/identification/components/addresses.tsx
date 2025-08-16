"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PatternFormat } from "react-number-format";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";
import { toast } from "sonner";
import { createShippingAddressSchema } from "@/app/actions/create-shipping-address/schema";
import { shippingAddressTable } from "@/db/schema";
import { useRouter } from "next/navigation";
import FinishOrderButton from "./finish-order-button";

type AddressFormData = z.infer<typeof createShippingAddressSchema>;

interface AddressesProps {
    shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
    defaultShippingAddressId?: string | null;
}

const Addresses = ({ shippingAddresses, defaultShippingAddressId }: AddressesProps) => {
    const [selectedAddress, setSelectedAddress] = useState<string>(defaultShippingAddressId ?? "");
    const router = useRouter();
    
    const { data: addresses, isLoading: addressesLoading } = useShippingAddresses({ initialData: shippingAddresses });
    
    const form = useForm<AddressFormData>({
        resolver: zodResolver(createShippingAddressSchema),
        defaultValues: {
            email: "",
            fullName: "",
            cpf: "",
            zipCode: "",
            address: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
        },
    });

    const { mutate, isPending } = useCreateShippingAddress();
    const { mutate: updateShippingAddress, isPending: isUpdating } = useUpdateCartShippingAddress();

    const onSubmit = (data: AddressFormData) => {
        if (selectedAddress === "add_new") {
            mutate(data, {
                onSuccess: (created: typeof shippingAddressTable.$inferSelect) => {
                    toast.success("Address created successfully!");
                    updateShippingAddress(
                        { shippingAddressId: created.id },
                        {
                            onSuccess: () => {
                                toast.success("Shipping address linked to cart.");
                                form.reset();
                            },
                            onError: (error) => {
                                toast.error("Failed to link shipping address: " + (error as Error).message);
                            },
                        }
                    );
                },
                onError: (error) => {
                    toast.error("Failed to create address: " + error.message);
                },
            });
        } else if (selectedAddress && selectedAddress !== "add_new") {
            updateShippingAddress(
                { shippingAddressId: selectedAddress },
                {
                    onSuccess: () => {
                        toast.success("Shipping address linked to cart.");
                        router.push("/cart/payment");
                    },
                    onError: (error) => {
                        toast.error("Failed to link shipping address: " + (error as Error).message);
                    },
                }
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Identification</CardTitle>
            </CardHeader>
            <CardContent>
                {addressesLoading ? (
                    <div className="text-center py-4">Loading addresses...</div>
                ) : addresses && addresses.length > 0 ? (
                    <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-semibold">Saved addresses</h3>
                        <RadioGroup
                            value={selectedAddress}
                            onValueChange={setSelectedAddress}
                        >
                            {addresses.map((address) => (
                                <Card key={address.id} className="cursor-pointer hover:bg-gray-50">
                                    <CardContent>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={address.id} id={address.id} />
                                            <Label htmlFor={address.id} className="cursor-pointer">
                                                <div className="ml-2">
                                                    <p className="font-medium">{address.recipientName}</p>
                                                    <p className="text-sm  text-gray-600">
                                                        {address.street}, {address.number}
                                                        {address.complement && ` - ${address.complement}`}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {address.neighborhood} - {address.city}/{address.state}
                                                    </p>
                                                    <p className="text-sm text-gray-600">ZIP: {address.zipCode}</p>
                                                </div>
                                            </Label>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </RadioGroup>
                    </div>
                ) : null}

                <RadioGroup
                    value={selectedAddress}
                    onValueChange={setSelectedAddress}
                >
                    <Card>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="add_new" id="add_new" />
                                <Label htmlFor="add_new">Add new address</Label>
                            </div>
                        </CardContent>
                    </Card>
                </RadioGroup>

                {selectedAddress === "add_new" && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="your@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF</FormLabel>
                                            <FormControl>
                                                <PatternFormat
                                                    customInput={Input}
                                                    format="###.###.###-##"
                                                    placeholder="000.000.000-00"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.value)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    getInputRef={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ZIP code</FormLabel>
                                            <FormControl>
                                                <PatternFormat
                                                    customInput={Input}
                                                    format="#####-###"
                                                    placeholder="00000-000"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.value)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Street, Avenue, etc" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="complement"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address line 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apartment, unit, etc" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="neighborhood"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neighborhood</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Neighborhood" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="City" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SP" maxLength={2} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isPending || isUpdating}>
                                {selectedAddress === "add_new" 
                                    ? (isPending ? "Saving..." : "Save address")
                                    : "Confirm selection"
                                }
                            </Button>
                        </form>
                    </Form>
                )}

                {selectedAddress && selectedAddress !== "add_new" && (
                    <div className="mt-4">
                        <FinishOrderButton
                            isUpdating={isUpdating}
                            onClick={() => {
                                updateShippingAddress(
                                    { shippingAddressId: selectedAddress },
                                    {
                                        onSuccess: () => {
                                            toast.success("Shipping address linked to cart.");
                                            // router.push("/cart/payment");
                                        },
                                        onError: (error) => {
                                            toast.error("Failed to link shipping address: " + (error as Error).message);
                                        },
                                    }
                                );
                            }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Addresses;