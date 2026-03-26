import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import React from 'react';
import Avatar from './Avatar';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Login = ({ onShowUserProperties }: { onShowUserProperties: (email: string) => void }) => {
    const { data: session } = useSession();
    const router = useRouter(); 

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="dropdown hover:drop-shadow-xl">
                    {session && session.user ? (
                        <Image
                            src={session.user.image}
                            alt='login-user-image'
                            width={32}
                            height={32}
                        />
                    ) : (
                        <Avatar />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {session ? (
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}>
                        Sign Out
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}>
                        Login
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/Post-your-property')}>
                    Post Your Property
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {session && session.user?.email && (
                    <DropdownMenuItem onClick={() => onShowUserProperties(session.user.email)}>
                        Your Properties
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Login;
