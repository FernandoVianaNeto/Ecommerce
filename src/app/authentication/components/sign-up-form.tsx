'use client';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  name: z.string().trim().min(1, 'Name is required'),
  password: z.string().min(1, 'Password is required'),
  passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => {
    return data.password !== data.passwordConfirmation, {
        message: "Passwords don't match",
    }
});

const SignUpForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: '',
            name: '',
            password: '',
            passwordConfirmation: ''
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { data, error }  = await authClient.signUp.email({
                email: values.email,
                name: values.name,
                password: values.password,
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/')
                    },
                    onError: (error) => {
                        toast.error(error.error.message || 'An error occurred during sign up.');
                    }
                }
            });
        } catch (error) {}
    }
    
    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Sign up to your account to continue.
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="******" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="******" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>

                        <CardFooter>
                            <Button type="submit">Sign Up</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    )
};

export default SignUpForm