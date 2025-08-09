'use client';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});


const SignInForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: '',
            password: ''
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        // Handle sign-in logic here
    }
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue.
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
                        </CardContent>
                        <CardFooter>
                            <Button className="" type="submit">Sign In</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    )
}

export default SignInForm