'use client';

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Image from 'next/image';

import { Box, Typography } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {
	DotsHorizontalIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@radix-ui/react-icons';

import {
	TicketMessagesSchema,
	TicketResponseMessagesSchema,
	TicketSchema,
	TicketSchemaWithoutMessages,
} from '@/types/apiResponseSchema';
import {
	addTicketResponseMessageApi,
	getTicketsByPageApi,
	getTicketApi,
	updateTicketStatusApi,
	addTicketToKnowledgeBaseApi,
} from '@/apis/ticketPage';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/table/DataTable';
import { columns } from '@/components/table/Columns';
import MessageCard from '@/components/MessageCard';
import CustomTextField from '@/components/CustomTextField';

export default function TicketsPage(): ReactElement {
	const { toast } = useToast();
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [code, setCode] = useState(`
    import os
    import openai
    
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    response = openai.Completion.create(
      model="davinci",
      prompt="",
      temperature=0.9,
      max_tokens=5,
      top_p=1,  
      frequency_penalty=0,
      presence_penalty=0,
    )               
  `);
	const [docName, setDocName] = useState<string>('');

	const [selectedTicket, setSelectedTicket] =
		useState<TicketSchemaWithoutMessages | null>(null);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPage, setTotalPage] = useState<number>(1);

	const [targetTicketMessages, setTargetTicketMessages] = useState<
		TicketMessagesSchema[]
	>([]);
	const [tableData, setTableData] = useState<TicketSchemaWithoutMessages[]>([]);

	// ----------------------------------------------------------------------------------------------------------------------------

	function goToNextPageHandler(): void {
		if (currentPage < totalPage) {
			setCurrentPage(prevPage => prevPage + 1);
		}
	}

	function goToPreviousPageHandler(): void {
		if (currentPage > 1) {
			setCurrentPage(prevPage => prevPage - 1);
		}
	}

	function scrollToBottom(): void {
		messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
	}

	const addTicketToKnowledgeBase = async () => {
		if (selectedTicket) {
			try {
				const getResponse: Response = await addTicketToKnowledgeBaseApi(
					selectedTicket.id,
					code,
					docName
				);

				if (!getResponse.ok) {
					const responsePayload: { result: string } = await getResponse.json();
					throw new Error(responsePayload.result);
				}

				setIsModalOpen(false);
				toast({
					title: 'Success!',
					description: 'Your submission to the Knowledge Base was successful.',
				});
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'Uh oh! Something went wrong.',
						description: error.message,
					});
				}
			}
		}
	};

	async function addTicketResponseMessageApiHandler(
		ticketId: string | undefined,
		messageContent: string
	): Promise<void> {
		if (ticketId) {
			// senderType is always "admin" from dev rel app
			const adminResponse: TicketResponseMessagesSchema = {
				senderType: 'admin',
				message: messageContent,
				ticketId: ticketId,
			};

			try {
				// add response message to the target ticket
				const putResponse: Response = await addTicketResponseMessageApi(
					ticketId,
					adminResponse
				);
				// response.ok is a shorthand property that returns a boolean indicating whether the response was successful (true, 200-299 it indicates a successful response | false is not successful)
				if (!putResponse.ok) {
					const responsePayload: { result: string } = await putResponse.json();
					throw new Error(responsePayload.result);
				}

				// ---------------------------------------------------------------------------------------------
				// when no error, we will fetch the updated target ticket object again and set new ticket messages state
				const getResponse: Response = await getTicketApi(ticketId);

				if (!getResponse.ok) {
					const responsePayload: { result: string } = await getResponse.json();
					throw new Error(responsePayload.result);
				}

				const responsePayload: { result: TicketSchema } =
					await getResponse.json();
				setTargetTicketMessages(responsePayload.result.messages);
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'Uh oh! Something went wrong.',
						description: error.message,
					});
				}
			}
		}
	}

	async function updateTicketStatusApiHandler(
		ticketId: string,
		status: string,
		page: number
	): Promise<void> {
		try {
			const putResponse: Response = await updateTicketStatusApi(
				ticketId,
				status
			);
			if (!putResponse.ok) {
				const responsePayload: { result: string } = await putResponse.json();
				throw new Error(responsePayload.result);
			}

			setTargetTicketMessages([]);

			const clientName: string | null = localStorage.getItem('client');
			if (clientName) {
				const getResponse: Response = await getTicketsByPageApi(
					clientName,
					page
				);
				if (getResponse.ok === false) {
					const responsePayload: { result: string } = await getResponse.json();
					throw new Error(responsePayload.result);
				}

				const responsePayload: {
					result: {
						page_tickets: TicketSchemaWithoutMessages[];
						total_pages: number;
					};
				} = await getResponse.json();

				setTotalPage(responsePayload.result.total_pages);
				setTableData(responsePayload.result.page_tickets);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'Uh oh! Something went wrong.',
					description: error.message,
				});
			}
		}
	}

	async function getTicketApiHandler(ticketId: string): Promise<void> {
		try {
			const getResponse: Response = await getTicketApi(ticketId);

			if (!getResponse.ok) {
				const responsePayload: { result: string } = await getResponse.json();
				throw new Error(responsePayload.result);
			}
			// when no error, we process response payload then parse it to update the target ticket messages state
			const responsePayload: { result: TicketSchema } =
				await getResponse.json();
			setTargetTicketMessages(responsePayload.result.messages);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'Uh oh! Something went wrong.',
					description: error.message,
				});
			}
		}
	}

	useEffect(() => {
		async function getOpenTicketsByPageApiHandler(
			clientName: string,
			page: number
		): Promise<void> {
			try {
				const getResponse: Response = await getTicketsByPageApi(
					clientName,
					page
				);

				if (!getResponse.ok) {
					const responsePayload: { result: string } = await getResponse.json();
					throw new Error(responsePayload.result);
				}

				const responsePayload: {
					result: {
						page_tickets: TicketSchemaWithoutMessages[];
						total_pages: number;
					};
				} = await getResponse.json();

				setTotalPage(responsePayload.result.total_pages);
				setTableData(responsePayload.result.page_tickets);
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'Uh oh! Something went wrong.',
						description: error.message,
					});
				}
			}
		}

		const clientName: string | null = localStorage.getItem('client');
		if (clientName) {
			getOpenTicketsByPageApiHandler(clientName, currentPage);
		}
	}, [currentPage]);

	useEffect(() => {
		scrollToBottom();
	}, [targetTicketMessages]);

	return (
		<Box className='flex-1 space-y-4 p-8 pt-6'>
			<Box className='flex items-center justify-between space-y-2'>
				<h2 className='text-3xl font-bold tracking-tight'>Tickets</h2>
			</Box>
			<Box className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
				<Box className='col-span-2 order-last lg:order-first'>
					{/* tickets */}
					<DataTable
						data={tableData}
						columns={columns}
						getTicketApiHandler={getTicketApiHandler}
						setSelectedTicket={setSelectedTicket}
						setTableData={setTableData}
						setCurrentPage={setCurrentPage}
					/>
					<Box className='flex flex-row-reverse items-center justify-between mt-2'>
						<Box className='flex items-center space-x-6 lg:space-x-8'>
							<Box className='flex w-[100px] items-center justify-center text-sm font-medium'>
								Page {currentPage} of {totalPage}
							</Box>
							<Box className='flex items-center space-x-2'>
								<Button
									variant='outline'
									className='h-8 w-8 p-0'
									onClick={goToPreviousPageHandler}
								>
									<span className='sr-only'>Go to previous page</span>
									<ChevronLeftIcon className='h-4 w-4' />
								</Button>
								<Button
									variant='outline'
									className='h-8 w-8 p-0'
									onClick={goToNextPageHandler}
								>
									<span className='sr-only'>Go to next page</span>
									<ChevronRightIcon className='h-4 w-4' />
								</Button>
							</Box>
						</Box>
					</Box>
				</Box>
				{/* Ticket response containers */}
				<Box
					width={'100%'}
					className='col-span-2 mt-[48px]'
				>
					<Box
						className={`rounded-t-md border border-input`}
						display={'flex'}
						justifyContent={'space-between'}
						alignItems={'center'}
						padding={'13px'}
					>
						<Box display={'flex'}>
							{selectedTicket ? (
								<Image
									src={selectedTicket.avatar}
									alt={'avatar'}
									width={24}
									height={24}
									className={'rounded-full'}
								/>
							) : (
								<AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
							)}
							<Typography marginLeft={'10px'}>
								{selectedTicket?.username}
							</Typography>
						</Box>

						{targetTicketMessages.length !== 0 && (
							<Box className='flex items-center'>
								<Dialog
									open={isModalOpen}
									onOpenChange={setIsModalOpen}
								>
									<DialogTrigger asChild>
										<Button
											size='xs'
											className='mr-2'
										>
											Add to Knowledge Base
										</Button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[625px]'>
										<DialogHeader>
											<DialogTitle>Add to Knowledge Base</DialogTitle>
											<DialogDescription>
												Please check content before adding to Knowledge Base.
												New data source will be in added as separated txt file.
											</DialogDescription>
										</DialogHeader>
										<Box className='grid gap-4 py-4'>
											<CodeEditor
												value={code}
												language='js'
												placeholder='Please enter code.'
												onChange={evn => setCode(evn.target.value)}
												padding={15}
												style={{
													borderRadius: '6px',
													backgroundColor: '#000000',
													fontFamily:
														'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
													overflowY: 'scroll',
													height: 280,
												}}
											/>
											<Box>
												<Label
													htmlFor='taskName'
													className='text-right'
												>
													Doc Name
												</Label>
												<Input
													id='taskName'
													placeholder={'ticket #12412'}
													value={docName}
													onChange={e => setDocName(e.target.value)}
												/>
											</Box>
										</Box>
										<DialogFooter className='sm:justify-start'>
											<Button
												type='submit'
												disabled={!docName || !code}
												onClick={addTicketToKnowledgeBase}
											>
												Save
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
										>
											<DotsHorizontalIcon className='h-4 w-4' />
											<span className='sr-only'>Open menu</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align='end'
										className='w-[160px]'
									>
										<DropdownMenuItem
											onClick={() =>
												updateTicketStatusApiHandler(
													targetTicketMessages[0]?.ticketId,
													'open',
													currentPage
												)
											}
										>
											Open
											{selectedTicket?.status === 'open' && <CheckIcon />}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateTicketStatusApiHandler(
													targetTicketMessages[0]?.ticketId,
													'in progress',
													currentPage
												)
											}
										>
											In Progress
											{selectedTicket?.status === 'in progress' && (
												<CheckIcon />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateTicketStatusApiHandler(
													targetTicketMessages[0]?.ticketId,
													'closed',
													currentPage
												)
											}
										>
											Closed
											{selectedTicket?.status === 'closed' && <CheckIcon />}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateTicketStatusApiHandler(
													targetTicketMessages[0]?.ticketId,
													'other',
													currentPage
												)
											}
										>
											Other
											{selectedTicket?.status === 'other' && <CheckIcon />}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</Box>
						)}
					</Box>
					<Box
						className={`rounded-b-md border border-input border-t-0`}
						display={'flex'}
						flexDirection={'column'}
						sx={{
							height: 'calc(100vh - 490px)',
						}}
					>
						<Box
							height={'calc(100vh - 540px)'}
							padding={'15px'}
							sx={{
								overflowY: 'auto',
								'&::-webkit-scrollbar': {
									width: '5px',
								},
								'&::-webkit-scrollbar-track': {
									background: '#f1f1f1',
								},
								'&::-webkit-scrollbar-thumb': {
									background: '#888',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: '#555',
								},
							}}
						>
							{/* all message boxes */}
							{targetTicketMessages.map(
								(message: TicketMessagesSchema, index: number) => {
									return (
										<MessageCard
											key={index}
											message={message}
										/>
									);
								}
							)}
							<Box ref={messagesContainerRef} />
						</Box>
						<Box
							flexGrow={1}
							padding={'10px'}
							width={'100%'}
						>
							<CustomTextField
								addTicketResponseMessageApiHandler={
									addTicketResponseMessageApiHandler
								}
								ticketId={targetTicketMessages[0]?.ticketId}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
