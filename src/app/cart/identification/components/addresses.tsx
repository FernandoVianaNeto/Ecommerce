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

const addressFormSchema = z.object({
    email: z.string().email("Email inválido"),
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    cpf: z.string().min(14, "CPF é obrigatório"),
    phone: z.string().min(15, "Celular é obrigatório"),
    zipCode: z.string().min(9, "CEP é obrigatório"),
    address: z.string().min(1, "Endereço é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório").max(2, "Estado deve ter 2 caracteres"),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

const Addresses = () => {
    const [selectedAddress, setSelectedAddress] = useState<string>();
    
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            email: "",
            fullName: "",
            cpf: "",
            phone: "",
            zipCode: "",
            address: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
        },
    });

    const onSubmit = (data: AddressFormData) => {
        console.log(data);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Identification</CardTitle>
            </CardHeader>
            <CardContent>
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
                                                <Input type="email" placeholder="seu@email.com" {...field} />
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
                                            <FormLabel>Nome completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo" {...field} />
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
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Celular</FormLabel>
                                            <FormControl>
                                                <PatternFormat
                                                    customInput={Input}
                                                    format="(##) #####-####"
                                                    placeholder="(00) 00000-0000"
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
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
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
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rua, Avenida, etc" {...field} />
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
                                            <FormLabel>Número</FormLabel>
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
                                            <FormLabel>Complemento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apartamento, bloco, etc" {...field} />
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
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Bairro" {...field} />
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
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cidade" {...field} />
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
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SP" maxLength={2} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Salvar endereço
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
}

export default Addresses;