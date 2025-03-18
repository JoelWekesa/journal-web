'use client';

import {type Icon} from '@tabler/icons-react';
import {usePathname} from 'next/navigation';
import {SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from '../ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	const pathname = usePathname(); // Get the current path

	return (
		<SidebarGroup>
			<SidebarGroupContent className='flex flex-col gap-2'>
				<SidebarMenu>
					{items.map((item) => {
						const isActive = pathname === item.url;

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<a
										href={item.url}
										className={`flex items-center gap-2 px-4 py-2 rounded-md ${
											isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/90 hover:text-primary-foreground'
										}`}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
