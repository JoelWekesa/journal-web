'use client';

import {
	IconCamera,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconHelp,
	IconListDetails,
	IconNotebook,
	IconNotes,
	IconReport,
	IconSearch,
	IconSettings,
} from '@tabler/icons-react';
import * as React from 'react';

import {useSession} from 'next-auth/react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '../ui/sidebar';
import {NavDocuments} from './nav-documents';
import {NavMain} from './nav-main';
import {NavSecondary} from './nav-secondary';
import {NavUser} from './nav-user';

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Journals',
			url: '/journals',
			icon: IconNotes,
		},
		{
			title: 'Categories',
			url: '/journals/categories',
			icon: IconListDetails,
		},
	],
	navClouds: [
		{
			title: 'Capture',
			icon: IconCamera,
			isActive: true,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
		{
			title: 'Proposal',
			icon: IconFileDescription,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
		{
			title: 'Prompts',
			icon: IconFileAi,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Analytics',
			url: '/analytics',
			icon: IconReport,
		},
		{
			title: 'Settings',
			url: '#',
			icon: IconSettings,
		},
		{
			title: 'Get Help',
			url: '#',
			icon: IconHelp,
		},
		{
			title: 'Search',
			url: '#',
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: 'Data Library',
			url: '#',
			icon: IconDatabase,
		},
		{
			name: 'Reports',
			url: '#',
			icon: IconReport,
		},
		{
			name: 'Word Assistant',
			url: '#',
			icon: IconFileWord,
		},
	],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
	const {data: session} = useSession();

	const user = session?.user;

	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
							<a href='#'>
								<IconNotebook className='!size-5' />
								<span className='text-base font-semibold'>Journal App</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className='mt-auto' />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: user?.name || '',
						email: user?.email || '',
						avatar: user?.image || '',
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
