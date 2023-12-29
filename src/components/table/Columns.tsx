"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { z } from "zod"
import {
	CheckCircledIcon,
	CircleIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon,
	CrossCircledIcon,
} from "@radix-ui/react-icons"
import Image from "next/image";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
	username: z.string(),
	request: z.string(),
	status: z.string(),
	id: z.string(),
	source: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export const labels = [
	{
		value: "bug",
		label: "Bug",
	},
	{
		value: "feature",
		label: "Feature",
	},
	{
		value: "documentation",
		label: "Documentation",
	},
]

export const statuses = [
	{
		value: "open",
		label: "Open",
		icon: CircleIcon,
	},
	{
		value: "closed",
		label: "Closed",
		icon: CrossCircledIcon,
	},
	{
		value: "in progress",
		label: "In Progress",
		icon: StopwatchIcon,
	},
	{
		value: "knowledge added",
		label: "Added to KB",
		icon: CheckCircledIcon,
	},
	{
		value: "other",
		label: "Other",
		icon: CircleIcon,
	},
]

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "username",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => {
			return(
				<div className="w-[90px] flex justify-between items-center">
					{
						row.original.source === 'discord'
						? <Image src={'/logos/discord.svg'} alt={'discord'} width={16} height={12} className={'mr-2'} />
						: <Image src={'/logos/telegram.svg'} alt={'telegram'} width={16} height={12} className={'mr-2'} />
					}
					{row.getValue("username")}
				</div>
			)
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "request",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Task" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[400px] font-medium">
            {row.getValue("request")}
          </span>
				</div>
			)
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = statuses.find(
				(status) => status.value === row.getValue("status")
			)

			if (!status) {
				return null
			}

			return (
				<div className="flex w-[110px] items-center whitespace-nowrap">
					{status.icon && (
						<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{status.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
		enableSorting: false,
		enableHiding: false,
	},
]