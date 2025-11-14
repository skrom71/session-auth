import * as React from 'react'
import {  Body, Heading, Text, Link, Tailwind } from '@react-email/components'
import {  Html } from '@react-email/html'


interface ResetPasswordTemplateProps {
	domain: string
	token: string
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    return (
        <Tailwind>
            <Html>
                <Body className='text-black'>
                    <Heading>[Reset] Password</Heading>
                    <Text>
                        Hello! You have requested a password reset. Please
                        click the following link to create a new password:
                    </Text>
                    <Link href={resetLink}>Confirm Password Reset</Link>
                    <Text>
                        This link is valid for 1 hour. If you did not
                        request a password reset, please ignore this message.
                    </Text>
                </Body>
            </Html>
        </Tailwind>
    );
}