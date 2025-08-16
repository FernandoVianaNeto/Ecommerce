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
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";
import { useCart } from "@/hooks/queries/use-cart";
import { toast } from "sonner";
import { createShippingAddressSchema } from "@/app/actions/create-shipping-address/schema";
import { shippingAddressTable } from "@/db/schema";
import { useRouter } from "next/navigation";
import FinishOrderButton from "./finish-order-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import illustriation from '../../../../../public/illustration.svg'

type AddressFormData = z.infer<typeof createShippingAddressSchema>;

interface AddressesProps {
    shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
    defaultShippingAddressId?: string | null;
}

const Addresses = ({ shippingAddresses, defaultShippingAddressId }: AddressesProps) => {
    const [selectedAddress, setSelectedAddress] = useState<string>(defaultShippingAddressId ?? "");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const router = useRouter();
    
    const { data: addresses, isLoading: addressesLoading } = useShippingAddresses({ initialData: shippingAddresses });
    const { data: cart } = useCart({});
    
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
    const { mutate: finishOrder, isPending: isFinishingOrder } = useFinishOrder();

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
                            isUpdating={isUpdating || isFinishingOrder}
                            onClick={() => {
                                updateShippingAddress(
                                    { shippingAddressId: selectedAddress },
                                    {
                                        onSuccess: () => {
                                            toast.success("Shipping address linked to cart.");
                                            if (cart?.cartItem && cart.cartItem.length > 0) {
                                                finishOrder({
                                                    shippingAddressId: selectedAddress,
                                                    items: cart?.cartItem?.filter(item => item.productVariantId)?.map(item => ({
                                                        productVariantId: item.productVariantId!,
                                                        quantity: item.quantity
                                                    })) || []
                                                }, {
                                                    onSuccess: () => {
                                                        toast.success("Order finished successfully!");
                                                        setIsDialogOpen(true);
                                                    },
                                                    onError: (error) => {
                                                        toast.error("Failed to finish order: " + (error as Error).message);
                                                    },
                                                });
                                            } else {
                                                toast.error("No items in cart to finish order");
                                            }
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

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="text-center">
                        <Image src={illustriation} alt="order created successfully" height={300} width={300}/>
                        <DialogTitle className="mt-4 text-2xl">Order Created Successfully!</DialogTitle>

                        <DialogDescription>
                                Your order has been created and your cart has been cleared. 
                                You will be redirected to the payment page.
                        </DialogDescription>
                        <div className="flex items-center justify-center space-x-2">
                            
                        </div>
                        <DialogFooter>
                            <Button 
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        router.push("/cart/payment");
                                    }}
                                    className="rounded-full"
                                    size="lg"
                                >
                                    Go to Payment
                            </Button>
                            <Button variant="outline" className="rounded-full" size="lg">
                                Go back to store
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                
            </CardContent>
        </Card>
    )
}

export default Addresses;