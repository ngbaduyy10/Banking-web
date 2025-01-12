"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {authFormSchema} from "@/lib/utils";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {useState} from "react";
import { Loader2 } from 'lucide-react';
import { signUp, signIn } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import PlaidLink from "@/components/PlaidLink";

const AuthForm = ({ type } : AuthFormProps) => {
    const formSchema = authFormSchema(type);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        try {
            if (type === 'sign-up') {
                const userData = {
                    email: values.email!,
                    password: values.password!,
                    firstName: values.firstName!,
                    lastName: values.lastName!,
                    address1: values.address1!,
                    city: values.city!,
                    state: values.state!,
                    postalCode: values.postalCode!,
                    dateOfBirth: values.dateOfBirth!,
                    ssn: values.ssn!,
                }

                const response = await signUp(userData);
                if (response !== undefined) {
                    setUser(response);
                }
            } else {
                const userData = {
                    email: values.email!,
                    password: values.password!,
                }

                const response = await signIn(userData);
                if (response) {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="auth-form">
            <header className='flex flex-col gap-5 md:gap-8'>
                <div className="text-26 font-ibm-plex-serif font-bold text-black-1">Bright</div>

                <div className="flex flex-col gap-1 md:gap-3">
                    <div className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user ? 'Link account' : type === 'sign-up' ? 'Create an account' : 'Sign in'}
                    </div>
                    <div className="text-16 font-normal text-gray-600">
                        {user ? 'Link your account to get started' : 'Please enter your details'}
                    </div>
                </div>
            </header>

            {user ? (
                <PlaidLink user={user} />
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {type === 'sign-up' && (
                            <>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='firstName' label="First Name"
                                                 placeholder='Enter your first name'/>
                                    <CustomInput control={form.control} name='lastName' label="Last Name"
                                                 placeholder='Enter your first name'/>
                                </div>
                                <CustomInput control={form.control} name='address1' label="Address"
                                             placeholder='Enter your specific address'/>
                                <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city'/>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='state' label="State"
                                                 placeholder='Example: NY'/>
                                    <CustomInput control={form.control} name='postalCode' label="Postal Code"
                                                 placeholder='Example: 11101'/>
                                </div>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth"
                                                 placeholder='YYYY-MM-DD'/>
                                    <CustomInput control={form.control} name='ssn' label="SSN" placeholder='Example: 1234'/>
                                </div>
                            </>
                        )}
                        <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email'/>
                        <CustomInput control={form.control} name='password' label="Password"
                                     placeholder='Enter your password'/>

                        <Button type="submit" disabled={loading} className="form-btn">
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin"/>
                                    Loading...
                                </>
                            ) : type === 'sign-up' ? 'Sign up' : 'Sign in'}
                        </Button>

                        <footer className="flex justify-center gap-1">
                            <p className="text-14 font-normal text-gray-600">
                                {type === 'sign-in'
                                    ? "Don't have an account?"
                                    : "Already have an account?"}
                            </p>
                            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                                {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </footer>
                    </form>
                </Form>
            )}
        </section>
    )
}

export default AuthForm;