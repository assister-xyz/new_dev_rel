"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import {statuses} from "@/components/table/Columns";
import {getTicketApi, getTicketsByPageApi, searchTickets} from "@/apis/ticketPage";
import {ChangeEvent, useEffect, useState} from "react";
import {useDebounce} from "@/hooks/useDebounce";
import {TicketSchemaWithoutMessages} from "@/types/apiResponseSchema";

interface DataTableToolbarProps<TData> {
	table: Table<TData>,
	setTableData: Function
}

export function DataTableToolbar<TData>({
	                                        table,
	                                        setTableData
                                        }: DataTableToolbarProps<TData>) {

	const [value, setValue] = useState<string>('')
	const debouncedValue = useDebounce<string>(value, 500)
	const clientName: string | null = localStorage.getItem("client");

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
	}

	useEffect(() => {
		const searchTicketsHandler = async () => {
			if (clientName) {
				console.log('value', value)
				if (value.length > 0) {
					const result =  searchTickets(value, clientName)
					setTableData(result)
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
			}
		}
		searchTicketsHandler()
	}, [debouncedValue])

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Search"
					onChange={handleChange}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
		</div>
	)
}