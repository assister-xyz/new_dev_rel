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

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
	user: z.string(),
	task: z.string(),
	status: z.string(),
	id: z.string(),
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
		value: "backlog",
		label: "Backlog",
		icon: QuestionMarkCircledIcon,
	},
	{
		value: "todo",
		label: "Todo",
		icon: CircleIcon,
	},
	{
		value: "open",
		label: "Open",
		icon: CircleIcon,
	},
	{
		value: "in progress",
		label: "In Progress",
		icon: StopwatchIcon,
	},
	{
		value: "done",
		label: "Done",
		icon: CheckCircledIcon,

	},
	{
		value: "canceled",
		label: "Canceled",
		icon: CrossCircledIcon,
	},
	{
		value: "added to KB",
		label: "Added to KB",
		icon: CheckCircledIcon,
	},
]

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "user",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => <div className="w-[80px]">{row.getValue("user")}</div>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "task",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Task" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[400px] truncate font-medium">
            {row.getValue("task")}
          </span>
				</div>
			)
		},
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
				<div className="flex w-[120px] items-center whitespace-nowrap">
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
	},
]