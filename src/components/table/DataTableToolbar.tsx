"use client"

import { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {getTicketsByPageApi, searchTickets} from "@/apis/ticketPage";
import {ChangeEvent, useEffect, useState} from "react";
import {useDebounce} from "@/hooks/useDebounce";
import {TicketSchemaWithoutMessages} from "@/types/apiResponseSchema";
import {Box} from "@mui/material";

interface DataTableToolbarProps<TData> {
	table: Table<TData>,
	setTableData: Function
	setCurrentPage: Function
}

export function DataTableToolbar<TData>({
	                                        table,
	                                        setTableData,
	                                        setCurrentPage
                                        }: DataTableToolbarProps<TData>) {

	const [value, setValue] = useState<string>('')
	const [clientName, setClientName] = useState<string | null>(null)
	const debouncedValue = useDebounce<string>(value, 500)


	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
	}

	useEffect(() => {
		const searchTicketsHandler = async () => {
			if (clientName) {
				setCurrentPage(1);

				if (value.length > 0) {
					const getResponse: Response = await searchTickets(value, clientName);
					if (!getResponse.ok) {
						const responsePayload: { result: string } = await getResponse.json();
						throw new Error(responsePayload.result);
					}

					const responsePayload: { result: TicketSchemaWithoutMessages[] } = await getResponse.json();
					setTableData(
						responsePayload.result
					);
				}else {
					const getResponse: Response = await getTicketsByPageApi(clientName, 1);
					if (!getResponse.ok) {
						const responsePayload: { result: string } = await getResponse.json();
						throw new Error(responsePayload.result);
					}

					const responsePayload: { result: { page_tickets: TicketSchemaWithoutMessages[]; total_pages: number } } = await getResponse.json();

					setTableData(
						responsePayload.result.page_tickets
					);
				}
			}else {
				setClientName(localStorage.getItem("client"))
			}
		}
		searchTicketsHandler()
	}, [debouncedValue])

	return (
		<Box className="flex items-center justify-between">
			<Box className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Search"
					onChange={handleChange}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</Box>
		</Box>
	)
}