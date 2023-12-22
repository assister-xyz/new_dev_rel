"use client"

import * as React from "react"
import { useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"

import { loginApi } from "@/apis/authPage";
import { navigationHandler } from "@/utils/nav";
import SpinnerLoading from "@/components/SpinnerLoading";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Box } from "@mui/material";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const router: AppRouterInstance = useRouter();
	const [clientCredentials, setClientCredentials] = useState<{ clientName: string; passcode: string }>({ clientName: "", passcode: "" });
	const { toast } = useToast()
	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const postResponse = await loginApi(clientCredentials);
			if (!postResponse.ok) {
				const responsePayload: { result: string } = await postResponse.json();
				throw new Error(responsePayload.result);
			}
			// if login is successful we will store the client name in localStorage (value come from server) + navigate to dashboard after 500ms
			const responsePayload: { result: string } = await postResponse.json();
			if (responsePayload.result === "particle network") {
				localStorage.setItem("client", "particle");
			} else {
				localStorage.setItem("client", responsePayload.result);
			}

			// we then navigate to dashboard after 500ms
			setTimeout(() => {
				navigationHandler("/console/dashboard", router);
			}, 500);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast({
					variant: "destructive",
					title: "Uh oh! Something went wrong.",
					description: error.message,
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	function setClientCredentialsHandler(event: React.ChangeEvent<HTMLInputElement>): void {
		setClientCredentials((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	}

	return (
		<Box className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<Box className="grid gap-2">
					<Box className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
							Email
						</Label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="login"
							autoCapitalize="none"
							autoCorrect="off"
							disabled={isLoading}
							onChange={setClientCredentialsHandler}
							name='clientName'
						/>
					</Box>
					<Box className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							placeholder="*******"
							type="password"
							autoCapitalize="none"
							autoCorrect="off"
							disabled={isLoading}
							onChange={setClientCredentialsHandler}
							name='passcode'
						/>
					</Box>
					<Button disabled={isLoading}>
						{isLoading && (
							<Box className='mr-2'>
								<SpinnerLoading width={'24px'} height={'24px'} border={2} />
							</Box>
						)}
						Sign In
					</Button>
				</Box>
			</form>
		</Box>
	)
}