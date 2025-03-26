'use client';

import * as React from 'react';
import {IconBrightness, type Icon} from '@tabler/icons-react';
import {useTheme} from 'next-themes';

import {SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from '../ui/sidebar';
import {Skeleton} from '../ui/skeleton';
import {Switch} from '../ui/switch';
import {usePathname} from 'next/navigation';

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const {resolvedTheme, setTheme} = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const pathname = usePathname();

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
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
					<SidebarMenuItem className='group-data-[collapsible=icon]:hidden'>
						<SidebarMenuButton asChild>
							<label>
								<IconBrightness />
								<span>Dark Mode</span>
								{mounted ? (
									<Switch
										className='ml-auto'
										checked={resolvedTheme !== 'light'}
										onCheckedChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
									/>
								) : (
									<Skeleton className='ml-auto h-4 w-8 rounded-full' />
								)}
							</label>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
